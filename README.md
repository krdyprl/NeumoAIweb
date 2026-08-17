# NeumoAI-D — Website Dokter

Dashboard skrining pernapasan anak untuk dokter. Bagian dari ekosistem [NeumoAIweb] yang menampilkan hasil skrining pasien, memutar audio batuk, dan menghitung **Grad-CAM di browser** (ONNX Runtime Web).

## Arsitektur
```
[HP Flutter — pasien]  →  rekam audio → Supabase (Storage `audio/` + tabel `screenings`)
[Supabase]             →  Auth + Postgres + Storage + Realtime
[Website Dokter]       →  React 19 SPA: login → daftar skrining → play audio → Grad-CAM (ONNX)
```

## Stack
- React 19 + React Router 6 + TypeScript 5.7
- Vite 8 + Tailwind CSS 4 + Chart.js 4
- Supabase (`@supabase/supabase-js`)
- ONNX Runtime Web (`onnxruntime-web`)
- pnpm

## Menjalankan
```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # produksi ke dist/
pnpm typecheck  # cek tipe
```

## Konfigurasi Supabase
1. Buat proyek Supabase, ambil URL + anon key.
2. Salin `.env.example` ke `.env` dan isi:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
3. Jalankan migration di `supabase/migrations/` (tabel `screenings`, `profiles`, bucket `audio`).

> Tanpa `.env` (atau saat env kosong), aplikasi berjalan dalam **mode demo** memakai data mock sehingga tetap bisa dikembangkan.

## Alur data
- Login dokter via Supabase Auth (`src/lib/auth.ts`).
- Daftar skrining diambil dari tabel `screenings` (`src/lib/screeningApi.ts`) + realtime subscription.
- Audio batuk diputar dari Storage bucket `audio/` (restricted, signed URL) — `src/lib/storage.ts`.
- Grad-CAM dihitung di browser: audio → mel-spectrogram → model ONNX → heatmap (`src/lib/explain.ts`).

## Model Grad-CAM
- Taruh `mobilenetv2.onnx` di `public/models/` (lihat `public/models/README.md`).
- Jika model belum tersedia, aplikasi memakai **fallback placeholder** sehingga tetap berfungsi.

## Deploy
Build static (`pnpm build`) → deploy `dist/` ke Vercel / Netlify. Arahkan ke Supabase via env vars.
