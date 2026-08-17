# Panduan Instalasi Source Code — NeumoAI Web

Panduan ini menjelaskan cara menjalankan **NeumoAI-D** (Website Dokter) langsung
dari source code di komputer Anda. Website ini adalah dashboard skrining pernapasan
anak yang menampilkan hasil skrining pasien, memutar audio batuk, dan menghitung
Grad-CAM di browser menggunakan ONNX Runtime Web.

> Target pembaca: pengembang / admin yang ingin menjalankan, mengembangkan, atau
> men-deploy aplikasi dari kode sumber. Asumsi: Anda terbiasa dengan terminal dan
> Git.

---

## 1. Pendahuluan

NeumoAI-D adalah aplikasi web (SPA) berbasis **React 19** yang berinteraksi dengan
**Supabase** (Auth, PostgreSQL, Storage, Realtime) dan menjalankan inferensi model
AI (Grad-CAM) **di browser** melalui **ONNX Runtime Web**.

Arsitektur singkat:

```
[HP Flutter - pasien]  ->  rekam audio -> Supabase (Storage audio/ + tabel screenings)
[Supabase]            ->  Auth + Postgres + Storage + Realtime
[Website Dokter]      ->  React 19 SPA: login -> daftar skrining -> play audio -> Grad-CAM (ONNX)
```

Aplikasi dapat berjalan dalam **dua mode**:

| Mode | Kondisi | Perilaku |
|---|---|---|
| Normal (terhubung Supabase) | `.env` terisi | Data nyata dari Supabase |
| Demo (data mock) | `.env` kosong / tidak ada | Menggunakan data contoh agar tetap bisa dikembangkan |

---

## 2. Prasyarat

Sebelum mulai, pastikan lingkungan pengembangan Anda sudah siap.

### 2.1 Persyaratan Perangkat Lunak

| Perangkat Lunak | Versi Minimum | Keterangan |
|---|---|---|
| Node.js | 22 LTS ke atas | Diperlukan karena paket `@supabase/*` menuntut `node >= 22.0.0` |
| pnpm | 9 ke atas | Package manager yang dipakai proyek (jangan npm/yarn) |
| Git | terbaru | Untuk clone repositori |
| Browser modern | terbaru | Chrome / Edge / Firefox / Safari untuk ONNX Runtime Web |

### 2.2 Cara Instal Node.js

Unduh installer LTS dari situs resmi nodejs.org, lalu ikuti wizard. Verifikasi:

```bash
node --version
```

### 2.3 Cara Instal pnpm

pnpm dapat diinstal secara global dengan npm, atau diaktifkan melalui Corepack
(bundled bersama Node.js):

```bash
npm install -g pnpm
```

atau dengan Corepack:

```bash
corepack enable
```

Verifikasi:

```bash
pnpm --version
```

### 2.4 Akun Supabase

Buat akun (gratis) di supabase.com. Anda akan memerlukannya pada **Bab 5** dan
**Bab 6** untuk mendapatkan URL project, anon key, dan menjalankan migration.

---

## 3. Clone Repositori

Salin repositori ke komputer lokal, lalu masuk ke direktori project.

```bash
git clone <url-repositori> neumoai-web
cd neumoai-web
```

> Jika Anda tidak menggunakan Git, unduh arsip ZIP dari halaman repositori dan
> ekstrak ke folder lokal.

Periksa isi direktori:

```bash
ls
```

---

## 4. Instalasi Dependensi

Install seluruh dependensi yang tertera pada `package.json` dan terkunci pada
`pnpm-lock.yaml`.

```bash
pnpm install
```

Proses ini mengunduh dan memasang:

- Runtime: React 19, React Router 6, Chart.js 4, `@supabase/supabase-js`,
  `onnxruntime-web`
- Build tooling: Vite 8, Tailwind CSS 4, TypeScript 5.9

### Troubleshooting Umum

| Gejala | Solusi |
|---|---|
| `pnpm: command not found` | pnpm belum terinstall — lihat Bab 2.3 |
| Error versi Node tidak kompatibel | Upgrade Node.js ke 22 LTS atau lebih baru |
| Lockfile mismatch / konflik | Hapus `node_modules` lalu jalankan ulang `pnpm install` |

---

## 5. Konfigurasi Environment (`.env`)

Aplikasi membaca konfigurasi Supabase dari variabel environment yang diawali `VITE_`.

### 5.1 Buat File `.env`

Salin file contoh menjadi file aktual:

```bash
cp .env.example .env
```

### 5.2 Isi Variabel

Buka `.env` dan isi kedua variabel:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` didapat dari **Supabase
Dashboard > Project Settings > API**.

> File `.env` bersifat privat dan sudah masuk dalam `.gitignore`, sehingga tidak
> akan ikut ter-commit. Jangan pernah membagikan `anon key` Anda secara publik.

> Tanpa `.env` (atau saat env kosong), aplikasi berjalan dalam mode demo memakai
> data mock sehingga tetap bisa dikembangkan (lihat Bab 1).

---

## 6. Setup Database Supabase

Project Supabase harus memiliki tabel dan storage bucket yang dibutuhkan aplikasi.
Migration SQL sudah disediakan di `supabase/migrations/`.

### 6.1 Buat Project Supabase

1. Buka supabase.com, login, lalu buat **New Project**.
2. Catat URL project dan anon key (Bab 5.2).

### 6.2 Jalankan Migration Awal

Buka **Supabase Dashboard > SQL Editor**, lalu jalankan skema berikut (urutan
penting — lihat catatan di bawah):

- Jika **tabel `screenings` belum ada**, buat dari schema aplikasi Flutter
  (`D:\NeumoAI-D\backend\supabase_schema.sql`) — skema ini menyediakan tabel
  `screenings` + bucket `audio` public + RLS.
- Jika tabel `screenings` **sudah ada**, jangan jalankan ulang `0001_init.sql`
  (itu akan menimpa policy yang dipakai app Flutter).

> `0001_init.sql` hanya menjadi referensi; dalam praktik schema yang dipakai
> berasal dari aplikasi Flutter. Gunakan `0004_profiles_table.sql` untuk membuat
> tabel `profiles` (yang tidak ada di schema Flutter) — lihat Bab 6.4.

### 6.3 Jalankan Migration Storage

Ulangi langkah yang sama untuk `supabase/migrations/0002_bucket.sql`. Migration ini
membuat bucket `audio` beserta kebijakan RLS.

> **Catatan bucket:** skema yang dijalankan dari aplikasi Flutter (`supabase_schema.sql`)
> membuat bucket `audio` sebagai **public** agar app pasien bisa meng-upload anon dan
> dokter bisa memutar langsung. Kode website (`src/lib/storage.ts`) sudah mendukung
> **signed URL** (restricted). Untuk pengetatan nanti, ubah bucket jadi private dan
> pakai policy authenticated — lihat `supabase/README.md`.

### 6.4 Membuat Akun Dokter (Auth) + Profil

Dokter login melalui Supabase Auth. Buat akun di **Supabase Dashboard >
Authentication > Users > Add user** (Auto Confirm: ON), lalu jalankan:

1. `supabase/migrations/0004_profiles_table.sql` — membuat tabel `profiles` (jika
   belum ada; schema Flutter tidak menyertakannya).
2. `supabase/migrations/0003_doctor_profile.sql` — mengisi profil dokter
   (ganti `<USER_ID>` dengan UUID akun dokter yang baru dibuat).

---

## 7. (Opsional) Setup Model ONNX untuk Grad-CAM

Grad-CAM dihitung di browser dengan model MobileNetV2 yang diekspor ke ONNX.

1. Letakkan file `mobilenetv2.onnx` pada folder `public/models/`.
2. Pastikan namanya persis `mobilenetv2.onnx`.
3. Deploy ulang agar file ikut dalam build (file berada di `public/` sehingga
   otomatis tersalin ke `dist/`).

### Spesifikasi model yang benar

Model **bukan** menerima input 1D. Ia menerima **Log-Mel Spectrogram** yang sudah
diselaraskan dengan pipeline training (`logmel_224`):

- **Input tensor** : `[1, 224, 224, 3]` float32 (NHWC), 3 channel identik.
- **Isi input**    : nilai **dB mentah** dengan `power_to_db(ref=np.max)`
  (maksimum = 0 dB, sisanya negatif). Bukan dinormalisasi ke `[0,1]` dan bukan
  di-ubah ke `[-1,1]` manual — `preprocess_input` ada di dalam graph model.
- **Preprocessing** (dilakukan otomatis oleh `src/lib/audio.ts`):
  1. Decode audio (native rate) → mono.
  2. Band-pass 100–5000 Hz.
  3. Resample ke 16 kHz + peak normalization.
  4. Cough segmentation (window 1,5 detik, energi tertinggi).
  5. Log-Mel: `n_mels=64`, `fmin=100`, `fmax=8000`, `n_fft=2048`, `hop=512`.
  6. Resize bilinear ke 224×224 + duplikasi 3 channel (dilakukan `model.ts`).
- **Output**       : `[1, 1]` sigmoid = probabilitas pneumonia (bukan 2 kelas).

> Jika model belum tersedia, aplikasi memakai fallback placeholder sehingga tetap
> berfungsi. Detail lebih lanjut ada di `public/models/README.md`.

---

## 8. Menjalankan Development Server

Jalankan server pengembangan Vite:

```bash
pnpm dev
```

Server berjalan di `http://localhost:5173` (port dapat diubah via variabel `PORT`).

Fitur yang aktif saat mode development:

- Hot-reload otomatis setiap perubahan kode
- Buka `http://localhost:5173` di browser untuk melihat aplikasi
- Login dengan akun dokter yang dibuat di Supabase Auth (Bab 6.4)

> Aplikasi juga dapat diakses dari perangkat lain di jaringan lokal karena Vite
> dikonfigurasi dengan host `0.0.0.0` (lihat `vite.config.ts`).

---

## 9. Perintah Tersedia

Perintah-perintah yang didefinisikan di `package.json`:

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Menjalankan development server (hot-reload) |
| `pnpm build` | Build produksi ke folder `dist/` |
| `pnpm preview` | Menjalankan preview hasil build produksi |
| `pnpm typecheck` | Memeriksa tipe TypeScript tanpa emit |

Contoh membangun build produksi lalu meninjaunya:

```bash
pnpm build
pnpm preview
```

---

## 10. Struktur Direktori

```
├── src/
│   ├── components/      # Komponen UI (charts, layout, audio analyzer, dsb.)
│   ├── screens/         # Halaman: auth, dashboard, patients, patientDetail,
│   │                    #          decisions, reports, settings, notifications
│   ├── lib/             # Supabase, auth, storage, screeningApi, model, explain, audio
│   ├── state/           # AppContext (state global)
│   ├── data/            # Data mock untuk mode demo
│   ├── utils/           # Helper formatting
│   ├── i18n.ts          # Multi-bahasa
│   ├── App.tsx          # Root component & routing
│   └── main.tsx         # Entry point
├── supabase/
│   └── migrations/      # 0001_init.sql, 0002_bucket.sql
├── public/
│   ├── models/          # Letakkan model ONNX di sini
│   └── logo_NEUMOAI_D.png
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
└── tsconfig.json
```

---

## 11. Deploy ke Netlify

Deploy hasil build produksi ke Netlify dengan menghubungkan repositori.

### 11.1 Hubungkan Repositori ke Netlify

1. Login ke app.netlify.com.
2. Pilih **Add new site > Import an existing project**.
3. Pilih provider Git (GitHub/GitLab/Bitbucket) dan pilih repositori NeumoAI.

### 11.2 Atur Konfigurasi Build

Pada halaman konfigurasi, isi:

| Field | Nilai |
|---|---|
| Build command | `pnpm build` |
| Publish directory | `dist` |

### 11.3 Set Environment Variables

Tambahkan kedua variabel pada tab **Environment variables**:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

> Nilai `VITE_` harus di-embed saat build. Pastikan variabel di-set sebelum build
> berjalan, lalu pilih **Deploy**.

### 11.4 Selesai

Netlify otomatis mem-build dan menyediakan URL (mis. `https://neumoai.netlify.app`).
Setiap push ke cabang produksi akan memicu deploy baru.

---

## 12. Menjalankan di Localhost (Build Produksi Lokal)

Selain mode development, Anda dapat menjalankan hasil build produksi di localhost.

### 12.1 Preview Build

Build lalu preview hasilnya:

```bash
pnpm build
pnpm preview
```

`pnpm preview` menyajikan `dist/` di `http://localhost:5173` (port dapat diubah
via variabel `PORT`).

### 12.2 Sajikan `dist/` dengan Server Statis

Atau sajikan `dist/` dengan server statis apa pun, misalnya `serve`:

```bash
pnpm build
npx serve dist
```

---

## 13. Troubleshooting / FAQ

| Masalah | Penyebab & Solusi |
|---|---|
| `VITE_SUPABASE_URL is undefined` | File `.env` tidak ada/berisi kosong. Salin `.env.example` ke `.env` dan isi nilai Supabase. Pastikan nama variabel berawalan `VITE_`. |
| Login gagal / redirect loop | Cek konfigurasi Supabase Auth: `Site URL` dan `Redirect URLs` di Dashboard harus cocok dengan `http://localhost:5173`. |
| Audio tidak bisa diputar | Pastikan migration `0002_bucket.sql` sudah dijalankan dan policy `audio_read_authenticated` aktif. |
| Grad-CAM tidak muncul / error model | Pastikan `public/models/mobilenetv2.onnx` ada dan utuh (≈8,9 MB, tidak terpotong). Jika muncul `Failed to load model because protobuf parsing failed`, lakukan hard-refresh (Ctrl+Shift+R); kode sudah memuat model sebagai Uint8Array/URL + wasm via CDN. Tanpa model, app memakai fallback. |
| Port 5173 sudah terpakai | Ganti port: `PORT=3000 pnpm dev` |
| `pnpm: command not found` | Install pnpm terlebih dahulu (Bab 2.3). |

---

## 14. Referensi

- `README.md` — ringkasan project dan alur data
- `LISENSI-WEB.md` — daftar lisensi seluruh library web
- `LISENSI.md` — daftar lisensi versi lama (Flutter)
- `vite.config.ts` — konfigurasi build & dev server
- `supabase/migrations/` — skema database & storage
