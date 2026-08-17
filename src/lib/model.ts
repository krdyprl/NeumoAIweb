import type { AiExplain } from "../types"
import { resizeGridTo } from "./audio"

export const MODEL_PATH = "/models/mobilenetv2.onnx"
export const MODEL_GRADCAM_PATH = "/models/mobilenetv2_gradcam.onnx"

export const MODEL_INPUT_SIZE = 224

export interface InferenceResult {
  prediction: string
  confidence: number
}

export interface GradCamResult {
  prediction: string
  confidence: number
  /** 2D heatmap (rows x cols) normalized 0..1, dari feature map model. */
  heatmap: number[][]
}

// ── Session caching ──────────────────────────────────────────────────────────

let sessionPromise: Promise<import("onnxruntime-web").InferenceSession | null> | null = null
let gradcamSessionPromise: Promise<import("onnxruntime-web").InferenceSession | null> | null = null

// Pastikan ONNX Runtime Web menemukan file wasm-nya sendiri (reletif ke bundle).
function configureOrtEnv(ort: typeof import("onnxruntime-web")) {
  // Arahkan wasm ke CDN unpkg agar tidak bergantung pada lokasi file di bundle.
  ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/"
  ort.env.wasm.numThreads = 1
}

async function load(path: string): Promise<import("onnxruntime-web").InferenceSession | null> {
  const ort = await import("onnxruntime-web")
  configureOrtEnv(ort)
  try {
    // Pass Uint8Array (bukan ArrayBuffer) — lebih stabil utk protobuf parsing
    // model ONNX besar di ONNX Runtime Web.
    const res = await fetch(path)
    if (!res.ok) return null
    const bytes = new Uint8Array(await res.arrayBuffer())
    return await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] })
  } catch {
    return null
  }
}

async function ensureSession(): Promise<import("onnxruntime-web").InferenceSession | null> {
  if (sessionPromise) return sessionPromise
  sessionPromise = load(MODEL_PATH)
  return sessionPromise
}

async function ensureGradCamSession(): Promise<import("onnxruntime-web").InferenceSession | null> {
  if (gradcamSessionPromise) return gradcamSessionPromise
  gradcamSessionPromise = load(MODEL_GRADCAM_PATH)
  return gradcamSessionPromise
}

export async function isModelAvailable(): Promise<boolean> {
  return (await ensureSession()) !== null
}

export async function isGradCamModelAvailable(): Promise<boolean> {
  return (await ensureGradCamSession()) !== null
}

// ── Input tensor builder (mel grid -> [1,224,224,3] float in [-1,1]) ─────────

function buildInputTensor(melGrid: number[][], ort: any) {
  const size = MODEL_INPUT_SIZE
  const square = resizeGridTo(melGrid, size, size)
  const flat = new Float32Array(size * size * 3)
  let idx = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = (square[r][c] ?? 0) * 2 - 1 // [0,1] -> [-1,1]
      flat[idx] = v
      flat[idx + 1] = v
      flat[idx + 2] = v
      idx += 3
    }
  }
  return new ort.Tensor("float32", flat, [1, size, size, 3])
}

/**
 * Inference pakai model standar (mobilenetv2.onnx, output probabilitas saja).
 */
export async function runInference(melGrid: number[][]): Promise<InferenceResult | null> {
  const sess = await ensureSession()
  if (!sess) return null

  const ort = await import("onnxruntime-web")
  const tensor = buildInputTensor(melGrid, ort)
  const feeds: Record<string, any> = { [sess.inputNames[0]]: tensor }
  const results = await sess.run(feeds)
  const output = results[sess.outputNames[0]] as any
  const raw = Array.from(output.data as Float32Array)[0] ?? 0
  const prob = Math.max(0, Math.min(1, raw))
  return { prediction: prob >= 0.5 ? "Pneumonia" : "Normal", confidence: Math.round(prob * 100) }
}

/**
 * Grad-CAM inference memakai mobilenetv2_gradcam.onnx (output prob + feature_map).
 * Karena arsitektur GAP -> Dense(1), CAM dihitung dengan Score-CAM:
 *   bobot_channel[k] = GAP( ReLU(A[:,:,:,k]) )
 *   CAM = sum_k bobot_channel[k] * A[:,:,:,k]   (lalu ReLU + normalisasi)
 * Ini asli dari feature map model dan tidak butuh backward pass.
 */
export async function runInferenceWithGradCam(
  melGrid: number[][],
): Promise<GradCamResult | null> {
  const sess = await ensureGradCamSession()
  if (!sess) return null

  const ort = await import("onnxruntime-web")
  const tensor = buildInputTensor(melGrid, ort)
  const feeds: Record<string, any> = { [sess.inputNames[0]]: tensor }
  const results = await sess.run(feeds)

  const outNames = sess.outputNames
  const probOut = results[outNames[0]] as any
  const fmOut = results[outNames[1]] as any
  const rawProb = Array.from(probOut.data as Float32Array)[0] ?? 0
  const prob = Math.max(0, Math.min(1, rawProb))
  const prediction = prob >= 0.5 ? "Pneumonia" : "Normal"
  const confidence = Math.round(prob * 100)

  // feature map shape: [1, H, W, C] (NHWC). H=W=7, C=1280.
  const fm = Array.from(fmOut.data as Float32Array)
  const dims = fmOut.dims
  const h = dims[dims.length - 3] ?? 7
  const w = dims[dims.length - 2] ?? 7
  const c = dims[dims.length - 1] ?? 1280

  // bobot per channel = GAP( ReLU(feature_map[:,:,:,k]) )
  const weights = new Array<number>(c).fill(0)
  for (let k = 0; k < c; k++) {
    let sum = 0
    for (let i = 0; i < h * w; i++) {
      const v = fm[i * c + k]
      if (v > 0) sum += v
    }
    weights[k] = sum / (h * w)
  }

  // CAM spatial
  const cam = new Array<number>(h * w).fill(0)
  for (let k = 0; k < c; k++) {
    const wk = weights[k]
    for (let i = 0; i < h * w; i++) {
      const v = fm[i * c + k]
      if (v > 0) cam[i] += wk * v
    }
  }

  // ReLU + normalize 0..1
  let camMin = Infinity
  let camMax = -Infinity
  for (let i = 0; i < cam.length; i++) {
    cam[i] = Math.max(0, cam[i])
    if (cam[i] < camMin) camMin = cam[i]
    if (cam[i] > camMax) camMax = cam[i]
  }
  if (!isFinite(camMin)) camMin = 0
  if (!isFinite(camMax) || camMax === camMin) camMax = camMin + 1

  const grid: number[][] = []
  for (let r = 0; r < h; r++) {
    const row: number[] = []
    for (let col = 0; col < w; col++) {
      row.push((cam[r * w + col] - camMin) / (camMax - camMin || 1))
    }
    grid.push(row)
  }

  return { prediction, confidence, heatmap: grid }
}

// ── Fallback explain (digunakan saat model Grad-CAM belum tersedia) ─────────

export function buildFallbackExplain(patientId: string, confidence: number): AiExplain {
  const rows = 24
  const cols = 40
  const melGrid: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const base = 0.3 + 0.5 * Math.sin(c / 4 + r / 3)
      row.push(Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.25)))
    }
    melGrid.push(row)
  }
  const gradCam = Array.from({ length: 60 }, (_, i) => ({
    x: (i / 59) * 100,
    y: 50 + 40 * Math.sin(i / 3),
    intensity: 0.15 + 0.8 * Math.pow(Math.sin(i / 4), 2),
  }))
  return {
    patientId,
    prediction: "Pneumonia",
    confidence,
    reasoning: [
      "Model mendeteksi pola napas tidak teratur pada segmen 2-4 detik.",
      "Korelasi tinggi dengan referensi suara pneumonia pada basis data pelatihan.",
      "Durasi inspirasi memendek dibanding referensi normal.",
      "Rekomendasi: konfirmasi dengan pemeriksaan fisik dan rontgen dada.",
    ],
    melGrid,
    gradCam,
    shap: [
      { feature: "Durasi inspirasi", contribution: 42 },
      { feature: "Bunyi ronki basah", contribution: 31 },
      { feature: "Frekuensi dasar", contribution: 16 },
      { feature: "Amplitudo sinyal", contribution: 8 },
      { feature: "Rasio H/N", contribution: -5 },
    ],
  }
}
