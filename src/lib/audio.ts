export interface MelSpectrogramResult {
  /** Grid dB (ref=max) untuk input model — persis seperti `logmel_224` training. */
  grid: number[][]
  sampleRate: number
  durationSec: number
}

const TARGET_SR = 16000

// Parameter STFT mengikuti default librosa `melspectrogram` di notebook training:
const N_FFT = 2048
const HOP_LENGTH = 512
const N_MELS = 64
const FMIN = 100
const FMAX = 8000
const BANDPASS_LOW = 100
const BANDPASS_HIGH = 5000
const COUGH_DUR_S = 1.5

// ── Mel filterbank (librosa-style) ──────────────────────────────────────────

function hzToMel(hz: number): number {
  return 2595 * Math.log10(1 + hz / 700)
}

function melToHz(mel: number): number {
  return 700 * (Math.pow(10, mel / 2595) - 1)
}

function buildMelFilterbank(nMels: number, nFft: number, sr: number, fmin: number, fmax: number): number[][] {
  const fftBins = nFft / 2 + 1
  const melMax = hzToMel(fmax)
  const melMin = hzToMel(fmin)
  const melPoints = Array.from({ length: nMels + 2 }, (_, i) =>
    melToHz(melMin + ((melMax - melMin) / (nMels + 1)) * i),
  )
  const binFreqs = Array.from({ length: fftBins }, (_, i) => (i * sr) / nFft)
  const filterbank: number[][] = []
  for (let m = 0; m < nMels; m++) {
    const row: number[] = []
    for (let k = 0; k < fftBins; k++) {
      const f = binFreqs[k]
      const low = melPoints[m]
      const center = melPoints[m + 1]
      const high = melPoints[m + 2]
      let weight = 0
      if (f >= low && f <= center) weight = (f - low) / (center - low || 1)
      else if (f >= center && f <= high) weight = (high - f) / (high - center || 1)
      row.push(Math.max(0, weight))
    }
    filterbank.push(row)
  }
  return filterbank
}

// ── STFT (hann window, default librosa) ─────────────────────────────────────

function hannWindow(size: number): Float32Array {
  const w = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)))
  }
  return w
}

function fftReal(samples: Float32Array): Float32Array {
  const n = samples.length
  const real = Array.from(samples)
  const imag = new Array<number>(n).fill(0)
  for (let i = 1; i < n; i *= 2) {
    for (let j = 0; j < n; j += i * 2) {
      for (let k = 0; k < i; k++) {
        const angle = (-2 * Math.PI * k) / (i * 2)
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const realPart = real[j + i + k]
        const imagPart = imag[j + i + k]
        real[j + i + k] = real[j + k] * c - imag[j + k] * s + realPart
        imag[j + i + k] = real[j + k] * s + imag[j + k] * c + imagPart
        real[j + k] = real[j + k] + realPart
        imag[j + k] = imag[j + k] + imagPart
      }
    }
  }
  return new Float32Array(real)
}

// ── Audio loading & DSP (mirror of notebook preprocessing) ──────────────────

export async function decodeAudioNative(file: File): Promise<{ samples: Float32Array; sampleRate: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const ctx = new AudioContext()
  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer)
    return { samples: decoded.getChannelData(0), sampleRate: decoded.sampleRate }
  } finally {
    void ctx.close()
  }
}

function resample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input
  const ratio = toRate / fromRate
  const outLen = Math.max(1, Math.floor(input.length * ratio))
  const out = new Float32Array(outLen)
  for (let i = 0; i < outLen; i++) {
    const pos = i / ratio
    const idx = Math.floor(pos)
    const frac = pos - idx
    const a = input[idx] ?? 0
    const b = input[Math.min(idx + 1, input.length - 1)] ?? 0
    out[i] = a + (b - a) * frac
  }
  return out
}

function butterBandpass(input: Float32Array, sampleRate: number, low: number, high: number): Float32Array {
  const n = 2 // 4th order → 2 biquad sections
  const w1 = 2 * Math.PI * low / sampleRate
  const w2 = 2 * Math.PI * high / sampleRate
  const wc2 = (w2 - w1) / 2
  const alpha = Math.sin(wc2) / Math.sinh((1 / n) * Math.asinh(1))
  const out = new Float32Array(input.length)
  out.set(input)
  const y = new Float32Array(input.length)
  for (let section = 0; section < 2; section++) {
    const a0 = 1 + alpha
    const a1 = -2 * Math.cos(wc2)
    const a2 = 1 - alpha
    const b0 = alpha
    const b2 = -alpha
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0
    for (let i = 0; i < out.length; i++) {
      const xn = out[i]
      const yn = (b0 / a0) * xn + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2
      x2 = x1; x1 = xn; y2 = y1; y1 = yn
      y[i] = yn
    }
    out.set(y)
  }
  return out
}

function normalizeAmplitude(input: Float32Array): Float32Array {
  let peak = 0
  for (let i = 0; i < input.length; i++) {
    const a = Math.abs(input[i])
    if (a > peak) peak = a
  }
  peak += 1e-9
  const out = new Float32Array(input.length)
  for (let i = 0; i < input.length; i++) out[i] = input[i] / peak
  return out
}

function coughSegment(input: Float32Array, sampleRate: number): Float32Array {
  const targetLen = COUGH_DUR_S * sampleRate
  if (input.length <= targetLen) {
    const out = new Float32Array(targetLen)
    out.set(input)
    return out
  }
  const frameLen = Math.floor(0.02 * sampleRate)
  const hop = Math.max(1, Math.floor(frameLen / 2))
  let bestStart = 0
  let bestEnergy = -1
  for (let start = 0; start + targetLen <= input.length; start += hop) {
    let e = 0
    for (let i = 0; i < targetLen; i += frameLen) {
      const s = start + i
      let sum = 0
      for (let j = 0; j < frameLen && s + j < start + targetLen; j++) sum += input[s + j] * input[s + j]
      e += sum
    }
    if (e > bestEnergy) {
      bestEnergy = e
      bestStart = start
    }
  }
  return input.slice(bestStart, bestStart + targetLen)
}

// ── Log-Mel spectrogram (mirror `logmel_224` training) ──────────────────────
//
// Mencerminkan persis notebook:
//   mel = librosa.melspectrogram(y, sr, n_mels=64, fmin=100, fmax=8000, power=2.0)
//   logmel = librosa.power_to_db(mel, ref=np.max)     // 0 dB = max, sisanya negatif
//   img = resize(logmel[...,None], (224,224), bilinear)  // dilakukan di model.ts
//   img3 = repeat(img, 3, axis=-1)                    // dilakukan di model.ts
//
// Fungsi ini mengembalikan grid dB (ref=max) MENTAH (bukan dinormalisasi ke [0,1]).
// Normalisasi untuk tampilan dilakukan terpisah lewat normalizeGridForDisplay().

export function computeMelSpectrogram(samples: Float32Array, sampleRate: number = TARGET_SR): MelSpectrogramResult {
  const window = hannWindow(N_FFT)
  const filterbank = buildMelFilterbank(N_MELS, N_FFT, sampleRate, FMIN, Math.min(FMAX, sampleRate / 2))
  const numFrames = Math.max(1, Math.floor((samples.length - N_FFT) / HOP_LENGTH) + 1)

  // Hitung power per frame, lalu bangun grid [frekuensi][waktu] = [mel][frame].
  // Ini MENYAMAKAN orientasi `librosa.melspectrogram` (n_mels, n_frames) di notebook,
  // sehingga di input model: height=frekuensi, width=waktu (tidak terbalik).
  const framePower: Float32Array[] = []
  for (let f = 0; f < numFrames; f++) {
    const frameStart = f * HOP_LENGTH
    const frame = new Float32Array(N_FFT)
    for (let i = 0; i < N_FFT; i++) {
      frame[i] = (samples[frameStart + i] ?? 0) * window[i]
    }
    const spectrum = fftReal(frame)
    const power = new Float32Array(N_FFT / 2 + 1)
    for (let k = 0; k < N_FFT / 2 + 1; k++) {
      power[k] = spectrum[k] * spectrum[k]
    }
    framePower.push(power)
  }

  // grid[mel][frame] — baris = frekuensi (mel), kolom = waktu (frame).
  const grid: number[][] = []
  for (let m = 0; m < N_MELS; m++) {
    const row = new Array<number>(numFrames).fill(0)
    for (let f = 0; f < numFrames; f++) {
      const power = framePower[f]
      let sum = 0
      for (let k = 0; k < N_FFT / 2 + 1; k++) {
        sum += filterbank[m][k] * power[k]
      }
      row[f] = sum
    }
    grid.push(row)
  }

  // power_to_db(ref=np.max): 10*log10(mel) - 10*log10(max)  → max = 0 dB
  let maxMel = 0
  for (const row of grid) {
    for (const v of row) {
      if (v > maxMel) maxMel = v
    }
  }
  const ref = maxMel || 1e-12
  const dbGrid: number[][] = grid.map((row) =>
    row.map((v) => 10 * Math.log10((v + 1e-10) / ref)),
  )

  return {
    grid: dbGrid,
    sampleRate: TARGET_SR,
    durationSec: samples.length / sampleRate,
  }
}

// Normalisasi grid dB ke [0,1] untuk keperluan tampilan (chart).
export function normalizeGridForDisplay(dbGrid: number[][]): number[][] {
  let minVal = Infinity
  let maxVal = -Infinity
  for (const row of dbGrid) {
    for (const v of row) {
      if (isFinite(v)) {
        if (v < minVal) minVal = v
        if (v > maxVal) maxVal = v
      }
    }
  }
  if (!isFinite(minVal)) minVal = 0
  if (!isFinite(maxVal) || maxVal === minVal) maxVal = minVal + 1
  return dbGrid.map((row) =>
    row.map((v) => {
      const n = (v - minVal) / (maxVal - minVal || 1)
      return Math.max(0, Math.min(1, n))
    }),
  )
}

// Full pipeline mirroring the training notebook:
// band-pass → 16k → peak normalize → cough segment → log-mel (dB ref=max).
export async function audioToMel(file: File): Promise<MelSpectrogramResult> {
  const { samples, sampleRate } = await decodeAudioNative(file)
  let y = butterBandpass(samples, sampleRate, BANDPASS_LOW, BANDPASS_HIGH)
  y = resample(y, sampleRate, TARGET_SR)
  y = normalizeAmplitude(y)
  y = coughSegment(y, TARGET_SR)
  return computeMelSpectrogram(y, TARGET_SR)
}

export function resizeGridTo(grid: number[][], rows: number, cols: number): number[][] {
  const out: number[][] = []
  const srcRows = grid.length
  const srcCols = grid[0]?.length ?? 1
  for (let r = 0; r < rows; r++) {
    const srcR = Math.min(srcRows - 1, Math.floor((r / rows) * srcRows))
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const srcC = Math.min(srcCols - 1, Math.floor((c / cols) * srcCols))
      row.push(grid[srcR][srcC] ?? 0)
    }
    out.push(row)
  }
  return out
}
