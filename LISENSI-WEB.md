# Daftar Komponen / Software Library & Lisensi — NeumoAI Web

Dokumen ini mendaftar seluruh komponen dan software library (termasuk dependensi
transitive/implisit) yang digunakan oleh **Website Dokter NeumoAI** (dashboard
skrining pernapasan anak), beserta lisensinya. Sumber data: `package.json` dan
`pnpm-lock.yaml`.

> Ringkasan: Seluruh komponen inti berlisensi **permisif** (MIT, BSD-3-Clause,
> Apache-2.0, SIL OFL). Tidak ada lisensi copyleft kuat (GPL). Dua kategori
> berlisensi **MPL-2.0** (copyleft lemah *level-file*) — `lightningcss` (dipakai
> internal pada waktu build) dan dependensi pihak ketiga di dalam ONNX Runtime Web
> (mis. Eigen) — tidak menjangkau kode aplikasi. Kode ini aman untuk penggunaan
> komersial/proprietary.

---

## 1. Frontend React — Dependensi Langsung (`package.json`)

| Komponen | Versi | Lisensi | Fungsi |
|---|---|---|---|
| react | 19.2.8 | MIT | Library UI |
| react-dom | 19.2.8 | MIT | Rendering DOM untuk React |
| react-router-dom | 6.30.4 | MIT | Routing SPA |
| chart.js | 4.5.1 | MIT | Library grafik (Grad-CAM, SHAP) |
| react-chartjs-2 | 5.3.1 | MIT | Binding Chart.js untuk React |
| @supabase/supabase-js | 2.112.3 | MIT | SDK Supabase (auth, DB, storage, realtime) |
| onnxruntime-web | 1.27.0 | MIT | Inference model ONNX di browser (Grad-CAM) |

### DevDependencies (`package.json` — `devDependencies`)

| Komponen | Versi | Lisensi | Fungsi |
|---|---|---|---|
| vite | 8.2.1 | MIT | Bundler / dev server |
| @vitejs/plugin-react | 6.0.5 | MIT | Plugin Vite untuk React |
| typescript | 5.9.3 | Apache-2.0 | Type checker / transpiler |
| tailwindcss | 4.3.3 | MIT | Framework CSS utility |
| @tailwindcss/vite | 4.3.3 | MIT | Integrasi Tailwind dengan Vite |
| @types/react | 19.2.18 | MIT | Type definitions React |
| @types/react-dom | 19.2.4 | MIT | Type definitions React DOM |
| @types/node | 22.20.1 | MIT | Type definitions Node.js |

---

## 2. Frontend React — Dependensi Transitive (`pnpm-lock.yaml`)

Paket diturunkan secara implisit oleh paket di atas. Dikelompokkan menurut penerbit.

### 2.1 Paket Supabase (supabase.io) — MIT

| Komponen | Versi |
|---|---|
| @supabase/auth-js | 2.112.3 |
| @supabase/functions-js | 2.112.3 |
| @supabase/postgrest-js | 2.112.3 |
| @supabase/realtime-js | 2.112.3 |
| @supabase/storage-js | 2.112.3 |
| @supabase/phoenix | 0.4.5 |

### 2.2 Paket ONNX Runtime Web (dependensi `onnxruntime-web`) — campuran permisif

| Komponen | Versi | Lisensi | Keterangan |
|---|---|---|---|
| onnxruntime-common | 1.27.0 | MIT | Inti umum ONNX Runtime |
| protobufjs | 7.6.5 | BSD-3-Clause | Serialisasi protobuf (parser model) |
| @protobufjs/aspromise | 1.1.2 | BSD-3-Clause | Util protobufjs |
| @protobufjs/base64 | 1.1.2 | BSD-3-Clause | Util protobufjs |
| @protobufjs/codegen | 2.0.5 | BSD-3-Clause | Util protobufjs |
| @protobufjs/eventemitter | 1.1.1 | BSD-3-Clause | Util protobufjs |
| @protobufjs/fetch | 1.1.1 | BSD-3-Clause | Util protobufjs |
| @protobufjs/float | 1.0.2 | BSD-3-Clause | Util protobufjs |
| @protobufjs/path | 1.1.2 | BSD-3-Clause | Util protobufjs |
| @protobufjs/pool | 1.1.0 | BSD-3-Clause | Util protobufjs |
| @protobufjs/utf8 | 1.1.2 | BSD-3-Clause | Util protobufjs |
| long | 5.3.2 | Apache-2.0 | Integer 64-bit (dipakai protobufjs) |
| flatbuffers | 25.9.23 | Apache-2.0 | Serialisasi flatbuffer (dipakai ONNX) |
| platform | 1.3.6 | MIT | Deteksi platform |
| guid-typescript | 1.0.9 | ISC | Generator GUID |

> **Catatan:** `onnxruntime-web` (MIT) menggabungkan dependensi pihak ketiga dengan
> lisensi campuran (mis. protobuf BSD, Eigen MPL-2.0). Untuk penggunaan *inference*
> normal, lisensi keseluruhan bersifat permisif dan tidak membebankan copyleft ke
> kode aplikasi.

### 2.3 Paket React / Runtime

| Komponen | Versi | Lisensi |
|---|---|---|
| scheduler | 0.27.0 | MIT |
| tslib | 2.8.1 | 0BSD |
| @remix-run/router | 1.23.3 | MIT |

### 2.4 Paket Chart.js (dependensi `chart.js`) — MIT

| Komponen | Versi |
|---|---|
| @kurkle/color | 0.3.4 |

### 2.5 Paket Build Toolchain (Vite / Rolldown / Tailwind / LightningCSS)

| Komponen | Versi | Lisensi |
|---|---|---|
| rolldown | 1.2.4 | MIT |
| @oxc-project/types | 0.144.0 | MIT |
| @rolldown/pluginutils | 1.0.1 | MIT |
| @rolldown/binding-* (android-arm64, darwin-*, freebsd, linux-*, win32-*, openharmony) | 1.2.4 | MIT |
| lightningcss | 1.32.0 / 1.33.0 | MPL-2.0 |
| lightningcss-* (android/darwin/freebsd/linux/win32 per platform) | 1.32.0 / 1.33.0 | MPL-2.0 |
| @tailwindcss/node | 4.3.3 | MIT |
| @tailwindcss/oxide | 4.3.3 | MIT |
| @tailwindcss/oxide-* (per platform) | 4.3.3 | MIT |
| postcss | 8.5.26 | MIT |
| source-map-js | 1.2.1 | BSD-3-Clause |
| nanoid | 3.3.18 | MIT |
| picocolors | 1.1.1 | MIT |
| picomatch | 4.0.5 | MIT |
| tinyglobby | 0.2.17 | MIT |
| fdir | 6.5.0 | MIT |
| detect-libc | 2.1.2 | Apache-2.0 |
| enhanced-resolve | 5.24.5 | MIT |
| graceful-fs | 4.2.11 | ISC |
| tapable | 2.3.3 | MIT |
| magic-string | 0.30.21 | MIT |
| @jridgewell/gen-mapping | 0.3.13 | MIT |
| @jridgewell/remapping | 2.3.5 | MIT |
| @jridgewell/resolve-uri | 3.1.2 | MIT |
| @jridgewell/sourcemap-codec | 1.5.5 | MIT |
| @jridgewell/trace-mapping | 0.3.31 | MIT |
| jiti | 2.7.0 | MIT |
| fsevents | 2.3.3 | MIT |

> **Penting:** `lightningcss` berlisensi **MPL-2.0** (file-level copyleft). Hanya file
> yang dimodifikasi dari paket tersebut yang harus dirilis ulang di bawah MPL.
> LightningCSS adalah parser/pengubah CSS natif yang dipakai secara internal oleh
> Tailwind CSS 4 dan Vite pada waktu build — tidak menjangkau atau membebankan
> kewajiban copyleft ke kode aplikasi NeumoAI.

### 2.6 Paket Type / Utilitas lainnya — MIT

| Komponen | Versi |
|---|---|
| csstype | 3.2.3 |
| undici-types | 6.21.0 |

---

## 3. Infrastruktur / Cloud

| Komponen | Lisensi | Fungsi |
|---|---|---|
| Supabase (platform & PostgREST) | Apache-2.0 | Backend-as-a-Service: Auth, PostgreSQL, Storage, Realtime |
| PostgreSQL (di-hosting oleh Supabase) | PostgreSQL License (permisif) | Basis data relasional |

---

## 4. Aset, Font & Model

| Aset | Lisensi | Keterangan |
|---|---|---|
| Font **Inter** (dimuat via Google Fonts CSS `@import`) | SIL OFL 1.1 | Bebas dipakai & disertakan; wajib menyertakan salinan lisensi OFL |
| Logo `logo_NEUMOAI_D.png` | Aset milik proyek | Aset in-house (bukan pihak ketiga) |
| Model ONNX `mobilenetv2.onnx` (`public/models/`) | Model hasil training sendiri | Fallback placeholder bila tidak tersedia |

> Font Inter dimuat langsung dari Google Fonts saat runtime (bukan dibundel), namun
> tetap di bawah lisensi SIL OFL 1.1.

---

## Catatan Kepatuhan (Compliance Notes)

1. **Tidak ada kewajiban copyleft**: seluruh kode sumber aplikasi NeumoAI Web bebas
   dilisensikan apa pun karena dependensi inti bersifat permisif.
2. **MPL-2.0 (`lightningcss`)**: copyleft lemah *level-file*, hanya berkaitan file
   yang dimodifikasi, dan hanya dipakai internal pada waktu build (parser CSS) —
   tidak menjangkau kode aplikasi. Pertahankan keterangan lisensi MPL pada file paket
   jika didistribusikan.
3. **ONNX Runtime Web (MIT)**: menggabungkan dependensi pihak ketiga (mis. protobuf
   BSD-3-Clause, Eigen MPL-2.0, absl BSD). Untuk penggunaan *inference* normal tidak
   membebankan kewajiban copyleft ke kode aplikasi.
4. **SIL OFL (Inter)**: jika font disertakan dalam distribusi, sertakan pula file
   `OFL.txt` dan jangan menjual font tersebut secara terpisah.
5. **Notices pihak ketiga**: praktik terbaik adalah mencantumkan lisensi tiap paket
   pada halaman "About/Licenses" atau file `THIRD_PARTY_NOTICES` saat distribusi
   aplikasi.
