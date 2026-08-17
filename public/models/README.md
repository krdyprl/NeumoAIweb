# Model ONNX untuk Grad-CAM di browser

Dua model yang dikenali website:

## 1. `mobilenetv2.onnx` — prediksi (wajib)
- Input : `[1, 224, 224, 3]` float (NHWC), nilai dalam `[-1, 1]` (Keras `preprocess_input`).
- Output: `[1, 1]` sigmoid = probabilitas pneumonia.
- Dipakai untuk confidence/prediksi. Sudah tersedia.

## 2. `mobilenetv2_gradcam.onnx` — Grad-CAM asli (opsional)
- Input : sama seperti di atas.
- Output:
  - `[1, 1]` probabilitas pneumonia
  - `[1, 7, 7, 1280]` feature map lapisan konvolusi terakhir (`out_relu`)
- Dipakai untuk menghitung Grad-CAM asli di browser. Jika file ini tidak ada,
  website tetap berjalan (prediksi dari `mobilenetv2.onnx` + heatmap placeholder).

## Cara menghasilkan `mobilenetv2_gradcam.onnx`
Model Grad-CAM harus memakai bobot training final (bukan ImageNet). Jalankan:
```bash
python scripts/export_gradcam_model.py \
    --savedmodel <path-ke-model_savedmodel-hasil-training> \
    --out public/models/mobilenetv2_gradcam.onnx
```
Jika `--savedmodel` tidak diberikan, skrip membangun model dengan bobot ImageNet
(hanya uji pipeline, bukan model pneumonia final).

## Verifikasi format
```bash
pnpm add -D onnxruntime-node   # sekali, utk inspeksi lokal
node scripts/inspect_model.cjs
```
Harus menampilkan input `[1,224,224,3]` dan output probabilitas.
