-- Schema untuk website dokter [NeumoAIweb]
-- Skema ini mengikuti rencana arsitektur: Supabase (Auth + Postgres + Storage).
-- id screening = UUID (default gen_random_uuid()).

-- 1. Profil dokter (dihubungkan ke auth.users)
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
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 2. Tabel screenings (dari aplikasi pasien/ortu Flutter)
create table if not exists public.screenings (
  id uuid primary key default gen_random_uuid(),
  child_id text not null,
  child_name text,
  user_id uuid not null references auth.users (id) on delete cascade,
  date timestamptz not null default now(),
  symptoms text[] default '{}',
  audio_duration numeric default 5,
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  disease text,
  confidence numeric,
  audio_url text,
  status text not null default 'awaiting'
    check (status in ('awaiting', 'accepted', 'rejected', 'done')),
  outcome text,
  model_version text default 'v2.4',
  trend numeric[] default '{}',
  vitals jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.screenings enable row level security;

-- Dokter bisa membaca semua skrining yang dikirim pasien.
create policy "screenings_read_all" on public.screenings
  for select using (true);

-- Pasien (pemilik akun) bisa membuat skrining sendiri.
create policy "screenings_insert_own" on public.screenings
  for insert with check (auth.uid() = user_id);

-- Dokter bisa memperbarui status/outcome skrining.
create policy "screenings_update_status" on public.screenings
  for update using (true);

-- Index untuk pencarian per child
create index if not exists screenings_child_id_idx on public.screenings (child_id);
create index if not exists screenings_date_idx on public.screenings (date desc);
