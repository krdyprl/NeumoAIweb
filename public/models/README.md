# Model ONNX untuk Grad-CAM di browser

Dua model yang dikenali website:

## 1. `mobilenetv2.onnx` — prediksi (wajib)
- Input : `[1, 224, 224, 3]` float32 (NHWC), berisi **Log-Mel dB mentah**
  (`power_to_db(ref=np.max)`, maksimum = 0 dB, sisanya negatif).
- Output: `[1, 1]` sigmoid = probabilitas pneumonia.
- Dipakai untuk confidence/prediksi. Sudah tersedia.

> Input **bukan** `[-1,1]` dan **bukan** `[0,1]` — `preprocess_input` Keras sudah
> ada **di dalam** graph model. Kirim nilai dB mentah apa adanya (website melakukannya
> otomatis di `src/lib/audio.ts` → `model.ts`).

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
Untuk memeriksa input/output model ONNX secara lokal, gunakan `onnxruntime-node`
(di-install manual bila perlu, bukan dependency proyek):
```bash
pnpm add -D onnxruntime-node   # opsional, utk inspeksi lokal
node -e "const fs=require('fs');const ort=require('onnxruntime-node');ort.InferenceSession.create(fs.readFileSync('public/models/mobilenetv2.onnx'),{executionProviders:['cpu']}).then(s=>{console.log('inputs',s.inputNames,'outputs',s.outputNames)})"
```
Harus menampilkan input `[1,224,224,3]` dan output probabilitas.

## Preprocessing yang benar (selaras dengan notebook training `logmel_224`)
Pipeline audio-ke-input dijalankan otomatis oleh website (`src/lib/audio.ts`):

1. Decode audio (native rate) → mono.
2. Band-pass 100–5000 Hz.
3. Resample ke 16 kHz + peak normalization.
4. Cough segmentation (window 1,5 detik, energi tertinggi).
5. Log-Mel: `n_mels=64`, `fmin=100`, `fmax=8000`, `n_fft=2048`, `hop=512`.
6. `power_to_db(ref=np.max)` → dB mentah (max = 0 dB).
7. Resize bilinear ke 224×224 + duplikasi 3 channel (`src/lib/model.ts`).

Jika hasil prediksi tampak tidak akurat, periksa bahwa preprocessing di atas
konsisten dengan pipeline yang dipakai saat training model.
