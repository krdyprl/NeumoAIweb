-- ============================================================================
-- Panduan pembuatan akun dokter + profil untuk website [NeumoAIweb]
--
-- LANGKAH 1 — Buat akun login (Auth) via DASHBOARD (wajib manual):
--   Supabase Dashboard → Authentication → Users → Add user
--   • Email     : (isi email dokter, mis. dr.ayu@neumod.id)
--   • Password  : (isi password aman)   ← ini untuk login di website
--   • Auto Confirm User: ON
--   → Create user
--   Catat email + password ini; dipakai untuk login di http://localhost:5173
--
-- LANGKAH 2 — Jalankan SQL di bawah SETELAH akun dibuat, untuk mengisi profil
--   dokter (nama, spesialisasi, STR, faskes) yang tampil di sidebar website.
--   Ganti nilai pada VALUES sesuai akun & dokter Anda.
-- ============================================================================

insert into public.profiles (
  id, full_name, specialization, str, facility, phone, emoji
) values (
  -- User ID akun dokter demoneumoaid@gmail.com
  'b6e59204-8259-486d-9028-b7fc10a9df52'::uuid,
  'dr. Ayu Lestari',
  'Spesialis Anak',
  'STR-2026-0012345',
  'Puskesmas Sehat Sejahtera',
  '+62 811-2233-4455',
  '👩‍⚕️'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  specialization = excluded.specialization,
  str = excluded.str,
  facility = excluded.facility,
  phone = excluded.phone,
  emoji = excluded.emoji;
