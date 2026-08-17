# Daftar Komponen / Software Library & Lisensi

Dokumen ini mendaftar seluruh komponen dan software library (termasuk dependensi
transitive/implisit) yang digunakan oleh proyek **NeumoAI**, beserta lisensinya.
Sumber data: `pubspec.yaml`, `pubspec.lock`, dan `backend/requirements.txt`.

> Ringkasan: Seluruh komponen inti berlisensi **permisif** (MIT, BSD-3-Clause,
> Apache-2.0, SIL OFL). Tidak ada lisensi copyleft kuat (GPL). Dua paket berlisensi
> **MPL-2.0** (copyleft lemah *level-file*) hanya dipakai pada platform Linux dan
> tidak menjangkau kode aplikasi. Kode ini aman untuk penggunaan komersial/proprietary.

---

## 1. Frontend Flutter — Dependensi Langsung (`pubspec.yaml`)

| Komponen | Versi | Lisensi | Fungsi |
|---|---|---|---|
| Flutter SDK | `3.29.0`+ | BSD-3-Clause | Framework UI (rendering, Material/Cupertino) |
| Dart SDK | `3.7.2` | BSD-3-Clause | Bahasa pemrograman aplikasi |
| google_fonts | 6.3.2 | BSD-3-Clause | Memuat & mengelola font |
| intl | 0.20.2 | BSD-3-Clause | Internasionalisasi, format tanggal/angka |
| collection | 1.19.1 | BSD-3-Clause | Utilitas koleksi |
| connectivity_plus | 6.1.5 | BSD-3-Clause | Deteksi status koneksi internet |
| flutter_riverpod | 2.6.1 | MIT | State management (Riverpod) |
| drift | 2.31.0 | MIT | ORM SQLite / basis data lokal |
| drift_flutter | 0.2.8 | MIT | Integrasi drift dengan Flutter |
| drift_dev | 2.31.0 | MIT | Code generator drift (dev) |
| sqlite3_flutter_libs | 0.5.42 | MIT + SQLite (Public Domain) | Membundel library SQLite |
| sqlite3 | 2.9.4 | MIT | Binding SQLite untuk Dart |
| go_router | 16.3.0 | BSD-3-Clause | Navigasi & routing |
| crypto | 3.0.7 | BSD-3-Clause | Fungsi hashing (SHA, HMAC, MD5) |
| showcaseview | 5.1.0 | MIT | Panduan/interactive tutorial UI |
| supabase_flutter | 2.15.4 | MIT | SDK Supabase (auth, DB, storage, realtime) |
| record | 5.2.1 | BSD-3-Clause | Perekaman audio mikrofon |
| path_provider | 2.1.5 | BSD-3-Clause | Akses direktori sistem file |
| http | 1.6.0 | BSD-3-Clause | Klien HTTP untuk komunikasi backend |
| cupertino_icons | 1.0.8 | MIT | Ikon gaya iOS |
| flutter_lints | 5.0.0 | BSD-3-Clause | Aturan lint / code quality (dev) |
| build_runner | 2.15.0 | BSD-3-Clause | Menjalankan code generation (dev) |

---

## 2. Frontend Flutter — Dependensi Transitive (`pubspec.lock`)

Paket diturunkan secara implisit oleh paket di atas. Dikelompokkan menurut penerbit.

### 2.1 Paket resmi Flutter / Dart (flutter.dev, dart.dev) — BSD-3-Clause

| Komponen | Versi |
|---|---|
| _fe_analyzer_shared | 88.0.0 |
| analyzer | 8.1.1 |
| args | 2.7.0 |
| async | 2.12.0 |
| boolean_selector | 2.1.2 |
| build | 4.0.6 |
| build_config | 1.3.0 |
| build_daemon | 4.1.1 |
| built_collection | 5.1.1 |
| built_value | 8.12.6 |
| characters | 1.4.0 |
| charcode | 1.4.0 |
| checked_yaml | 2.0.3 |
| cli_util | 0.4.2 |
| clock | 1.1.2 |
| convert | 3.1.2 |
| dart_style | 3.1.2 |
| fake_async | 1.3.2 |
| ffi | 2.2.0 |
| file | 7.0.1 |
| fixnum | 1.1.1 |
| flutter_web_plugins | 0.0.0 |
| glob | 2.1.3 |
| graphs | 2.3.2 |
| http_multi_server | 3.2.2 |
| http_parser | 4.1.2 |
| io | 1.0.5 |
| json_annotation | 4.9.0 |
| leak_tracker | 10.0.8 |
| leak_tracker_flutter_testing | 3.0.9 |
| leak_tracker_testing | 3.0.1 |
| lints | 5.1.1 |
| logging | 1.3.0 |
| matcher | 0.12.17 |
| material_color_utilities | 0.11.1 |
| meta | 1.16.0 |
| mime | 2.0.0 |
| package_config | 2.2.0 |
| path | 1.9.1 |
| petitparser | 6.1.0 |
| platform | 3.1.6 |
| plugin_platform_interface | 2.1.8 |
| pool | 1.5.2 |
| pub_semver | 2.2.0 |
| pubspec_parse | 1.5.0 |
| sky_engine | 0.0.0 |
| source_gen | 4.2.0 |
| source_span | 1.10.1 |
| stack_trace | 1.12.1 |
| stream_channel | 2.1.4 |
| stream_transform | 2.1.1 |
| string_scanner | 1.4.1 |
| term_glyph | 1.2.2 |
| test_api | 0.7.4 |
| typed_data | 1.4.0 |
| vector_math | 2.1.4 |
| vm_service | 14.3.1 |
| watcher | 1.2.1 |
| web | 1.1.1 |
| web_socket | 1.0.1 |
| web_socket_channel | 3.0.3 |
| xdg_directories | 1.1.0 |
| yaml | 3.1.3 |

### 2.2 Paket Supabase (supabase.io) — MIT

| Komponen | Versi |
|---|---|
| supabase | 2.13.4 |
| functions_client | 2.6.4 |
| gotrue | 2.25.0 |
| postgrest | 2.8.0 |
| realtime_client | 2.10.0 |
| storage_client | 2.6.0 |
| yet_another_json_isolate | 2.1.1 |
| passkeys_platform_interface | 2.7.0 |

### 2.3 Plugin platform (transitive dari paket `record`, `path_provider`, dll.) — BSD-3-Clause

| Komponen | Versi |
|---|---|
| app_links | 6.4.1 |
| app_links_linux | 1.0.3 |
| app_links_platform_interface | 2.0.2 |
| app_links_web | 1.0.4 |
| connectivity_plus_platform_interface | 2.1.0 |
| path_provider_android | 2.2.19 |
| path_provider_foundation | 2.4.2 |
| path_provider_linux | 2.2.1 |
| path_provider_platform_interface | 2.1.2 |
| path_provider_windows | 2.3.0 |
| record_android | 1.5.2 |
| record_darwin | 1.2.2 |
| record_linux | 0.7.2 |
| record_platform_interface | 1.6.0 |
| record_web | 1.3.0 |
| record_windows | 1.0.7 |
| shared_preferences | 2.5.3 |
| shared_preferences_android | 2.4.13 |
| shared_preferences_foundation | 2.5.4 |
| shared_preferences_linux | 2.4.1 |
| shared_preferences_platform_interface | 2.4.1 |
| shared_preferences_web | 2.4.3 |
| shared_preferences_windows | 2.4.1 |
| url_launcher | 6.3.2 |
| url_launcher_android | 6.3.20 |
| url_launcher_ios | 6.3.4 |
| url_launcher_linux | 3.2.1 |
| url_launcher_macos | 3.2.3 |
| url_launcher_platform_interface | 2.3.2 |
| url_launcher_web | 2.4.1 |
| url_launcher_windows | 3.1.4 |

### 2.4 Paket komunitas — MIT

| Komponen | Versi | Penerbit |
|---|---|---|
| dart_jsonwebtoken | 3.4.1 | jonasroussel |
| pointycastle | 4.0.0 | bouncycastle |
| recase | 4.1.0 | — |
| riverpod | 2.6.1 | riverpod.dev |
| shelf | 1.4.2 | dart.dev |
| sqlparser | 0.43.1 | simonbinder (drift) |
| state_notifier | 1.0.0 | riverpod.dev |
| uuid | 4.6.0 | — |
| xml | 6.5.0 | — |

> Catatan: `recase`, `uuid`, `xml` dapat berlisensi berbeda pada versi lain; pada
> versi yang dikunci (lockfile) ini lisensinya permisif.

### 2.5 Paket berlisensi Apache-2.0

| Komponen | Versi | Penerbit |
|---|---|---|
| rxdart | 0.28.0 | fluttercommunity |
| retry | 3.1.2 | google |

### 2.6 Paket Linux / Canonical — MPL-2.0 (copyleft lemah, level-file)

| Komponen | Versi | Fungsi |
|---|---|---|
| dbus | 0.7.12 | Client D-Bus (transport pesan Linux) |
| nm | 0.5.0 | Client NetworkManager (Linux) |

> **Penting:** `dbus` dan `nm` berlisensi **MPL-2.0**. MPL adalah *file-level copyleft*
> — hanya file yang dimodifikasi dari paket tersebut yang harus dirilis ulang di bawah
> MPL. Keduanya hanya aktif pada platform **Linux** (melalui `connectivity_plus`
> dan plugin terkait) dan tidak menjangkau kode aplikasi Flutter Anda, sehingga tidak
> membebankan kewajiban copyleft ke kode NeumoAI.

### 2.7 Paket transitive lainnya — BSD-3-Clause

| Komponen | Versi |
|---|---|
| gtk | 2.2.0 |
| shelf_web_socket | 3.0.0 |
| xdg_directories | 1.1.0 |

---

## 3. Backend Python (`backend/requirements.txt`)

| Komponen | Versi | Lisensi | Fungsi |
|---|---|---|---|
| FastAPI | 0.116.1 | MIT | Framework web API |
| Uvicorn | 0.35.0 | BSD-3-Clause | ASGI server |
| python-multipart | (latest) | Apache-2.0 | Parsing form data / upload file |
| ONNX Runtime | 1.28.0+ | MIT | Inference model AI (deteksi pneumonia dari audio) |
| NumPy | 2.2.6+ | BSD-3-Clause | Komputasi numerik / array |
| SciPy | 1.16.2+ | BSD-3-Clause | Komputasi saintifik (filter sinyal audio) |
| SoundFile | 0.13.1+ | BSD-3-Clause | Membaca/menulis file audio |
| Pillow | 11.3.0+ | HPND (MIT-CMU-like) | Pemrosesan gambar |

> ONNX Runtime (MIT) menggabungkan dependensi pihak ketiga dengan lisensi campuran
> (mis. protobuf BSD, Eigen MPL-2.0, absl BSD). Untuk penggunaan *inference* normal
> lisensi keseluruhan bersifat permisif dan tidak membebankan copyleft ke kode Anda.

---

## 4. Infrastruktur / Cloud

| Komponen | Lisensi | Fungsi |
|---|---|---|
| Supabase (platform & PostgREST) | Apache-2.0 | Backend-as-a-Service: PostgreSQL, Auth, Storage, Realtime |
| PostgreSQL (di-hosting oleh Supabase) | PostgreSQL License (permisif) | Basis data relasional |

---

## 5. Aset & Font

| Aset | Lisensi | Keterangan |
|---|---|---|
| Font **Inter** (`assets/fonts/Inter-Regular.ttf`) | SIL OFL 1.1 | Bebas dipakai & disertakan; wajib menyertakan salinan lisensi OFL |
| Font Google Fonts (via `google_fonts`) | per-font (umumnya OFL / Apache) | Lihat file LICENSE tiap font |
| Ikon Material (`cupertino_icons`, Material Icons) | Apache-2.0 | Bebas dipakai dengan atribusi |

---

## Catatan Kepatuhan (Compliance Notes)

1. **Tidak ada kewajiban copyleft**: seluruh kode sumber aplikasi NeumoAI bebas
   dilisensikan apa pun karena dependensi inti bersifat permisif.
2. **MPL-2.0 (`dbus`, `nm`)**: hanya berkaitan file, hanya platform Linux; tidak
   menjangkau kode aplikasi. Pertahankan keterangan lisensi MPL pada file paket
   tersebut jika didistribusikan.
3. **SIL OFL (Inter)**: jika font disertakan dalam distribusi, sertakan pula file
   `OFL.txt` dan jangan menjual font tersebut secara terpisah.
4. **Notices pihak ketiga**: jika aplikasi didistribusikan, praktik terbaik adalah
   memuat lisensi tiap paket melalui `LicenseRegistry` Flutter (via
   `showLicensePage`) agar pengguna dapat melihat lisensi lengkap.
