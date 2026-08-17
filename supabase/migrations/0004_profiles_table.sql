-- ============================================================================
-- Buat tabel profiles (untuk website dokter [NeumoAIweb])
--
-- Schema Flutter (supabase_schema.sql) TIDAK membuat tabel `profiles`.
-- Tabel ini dipakai website untuk menampilkan profil dokter di sidebar
-- setelah login. Jalankan SQL ini di Supabase SQL Editor SEKALI.
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  specialization text,
  str text,
  facility text,
  phone text,
  emoji text default '👩‍⚕️',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Dokter hanya bisa membaca/mengubah profilnya sendiri.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
