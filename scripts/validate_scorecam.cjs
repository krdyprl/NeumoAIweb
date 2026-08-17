// Validasi logika Score-CAM (tanpa model, langsung hitung dari feature map sintetis).
// Meniru `runInferenceWithGradCam` dari src/lib/model.ts untuk memastikan algoritma benar.

function scoreCamFromFeatureMap(fm, h, w, c) {
  const weights = new Array(c).fill(0)
  for (let k = 0; k < c; k++) {
    let sum = 0
    for (let i = 0; i < h * w; i++) {
      const v = fm[i * c + k]
      if (v > 0) sum += v
    }
    weights[k] = sum / (h * w)
  }
  const cam = new Array(h * w).fill(0)
  for (let k = 0; k < c; k++) {
    const wk = weights[k]
    for (let i = 0; i < h * w; i++) {
      const v = fm[i * c + k]
      if (v > 0) cam[i] += wk * v
    }
  }
  let camMin = Infinity, camMax = -Infinity
  for (let i = 0; i < cam.length; i++) {
    cam[i] = Math.max(0, cam[i])
    if (cam[i] < camMin) camMin = cam[i]
    if (cam[i] > camMax) camMax = cam[i]
  }
  if (!isFinite(camMin)) camMin = 0
  if (!isFinite(camMax) || camMax === camMin) camMax = camMin + 1
  const grid = []
  for (let r = 0; r < h; r++) {
    const row = []
    for (let col = 0; col < w; col++) row.push((cam[r * w + col] - camMin) / (camMax - camMin || 1))
    grid.push(row)
  }
  return grid
}

// Feature map sintetis: 2x2x2. Channel 0 punya aktivasi kuat di kiri-atas, channel 1 lemah.
// Harus menghasilkan heatmap dengan nilai tertinggi di lokasi aktivasi channel kuat.
const h = 2, w = 2, c = 2
const fm = new Float32Array([
  // posisi (0,0): ch0=2.0, ch1=0.1
  2.0, 0.1,
  // (0,1): ch0=0.5, ch1=0.1
  0.5, 0.1,
  // (1,0): ch0=0.3, ch1=0.1
  0.3, 0.1,
  // (1,1): ch0=0.1, ch1=0.1
  0.1, 0.1,
])

const grid = scoreCamFromFeatureMap(fm, h, w, c)
console.log("Heatmap:")
grid.forEach((row) => console.log(" ", row.map((v) => v.toFixed(2)).join("  ")))
console.log("Channel 0 (kuat) terkonsentrasi di kiri-atas -> heatmap kiri-atas harus paling tinggi.")
const topLeft = grid[0][0]
const bottomRight = grid[1][1]
if (topLeft > bottomRight) {
  console.log("PASS: heatmap menonjol di lokasi aktivasi channel kuat.")
} else {
  console.log("FAIL: heatmap tidak sesuai ekspektasi.")
  process.exit(1)
}
