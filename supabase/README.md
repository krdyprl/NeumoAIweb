# Setup Supabase untuk NeumoAI-D

Setup aktif memakai kredensial nyata (proyek `nminszdmovdhlhuolaai`). Skema yang berjalan diambil dari `D:\NeumoAI-D\backend\supabase_schema.sql` dan sudah konsisten dengan kode website.

## Kredensial (di `.env` website, jangan commit)
```
VITE_SUPABASE_URL=https://nminszdmovdhlhuolaai.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taW5zemRtb3ZkaGxodW9sYWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTk4NzMsImV4cCI6MjEwMjUzNTg3M30.h2Jg1aGAi7FX2o7sCQLQWSdambOUA17O2J3Mmqu_-WI
```

## 1. Skema yang sudah dijalankan
Schema dijalankan dari `D:\NeumoAI-D\backend\supabase_schema.sql`:
- Tabel `public.screenings` (id UUID, child_id, child_name, user_id, date, symptoms, audio_duration, risk_level, disease, confidence, audio_url, status, outcome, model_version, trend, vitals, created_at).
- RLS: insert anon (untuk app Flutter demo), select semua, update semua.
- Bucket Storage `audio` **`public=true`** (agar app Flutter bisa upload & dokter bisa putar langsung).

> Migration di `supabase/migrations/` adalah versi cadangan; skema di DB sudah disesuaikan (bucket public). `0001` & `0002` masih berguna sebagai referensi.

## 2. Buat akun dokter (login website)
1. **Supabase Dashboard → Authentication → Users → Add user**
2. Isi email + password dokter → **Auto Confirm User: ON** → Create user.
   Catat email + password ini (dipakai login di http://localhost:5173).
3. Buat tabel `profiles` (schema Flutter tidak menyertakannya). Jalankan `0004_profiles_table.sql` di SQL Editor.
4. Isi profil dokter. Jalankan `0003_doctor_profile.sql` (ganti `<USER_ID>` dengan UUID pengguna dari Langkah 2).

## 3. Jalankan website
```bash
pnpm install
pnpm dev       # buka http://localhost:5173
pnpm build     # produksi ke dist/
```

## Catatan bucket `audio/`
- Saat ini **public** untuk demo (app Flutter upload anon + dokter putar langsung).
- Kode website (`src/lib/storage.ts` → `getAudioUrlOrPublic`) sudah mendukung **signed URL**.
- **Untuk pengetatan nanti (restricted):**
  1. Ubah bucket jadi private (`public=false`).
  2. Drop policy `audio_read_public` / `audio_insert_public`.
  3. App Flutter harus memakai Supabase Auth (bukan anon insert).
  4. Website tetap jalan karena `getAudioUrlOrPublic` otomatis fallback ke signed URL bila `audio_url` bukan URL penuh.

## Tabel `screenings`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid | PK (gen_random_uuid) |
| `child_id` | text | ID anak dari app Flutter |
| `child_name` | text | nama anak (ditampilkan di website) |
| `user_id` | uuid → auth.users | pemilik (orang tua/pasien) |
| `date` | timestamptz | waktu skrining |
| `symptoms` | text[] | gejala |
| `audio_duration` | numeric | detik |
| `risk_level` | low/medium/high | hasil AI |
| `disease` | text | label penyakit |
| `confidence` | numeric | confidence AI |
| `audio_url` | text | path/URL di Storage bucket `audio` |
| `status` | awaiting/accepted/rejected/done | keputusan dokter |
| `outcome` | text | tindak lanjut |
| `model_version` | text | versi model |
| `trend` | numeric[] | timeline confidence |
| `vitals` | jsonb | tanda vital |
| `created_at` | timestamptz | |
