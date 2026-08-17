-- Bucket audio untuk website dokter [NeumoAIweb]
-- Akses: RESTRICTED (khusus dokter login / authenticated-read).
-- Jalankan di Supabase Dashboard > Storage, atau via SQL berikut.

-- Buat bucket (jika belum ada). public: false = private/restricted.
insert into storage.buckets (id, name, public)
values ('audio', 'audio', false)
on conflict (id) do nothing;

-- Kebijakan: pengguna terautentikasi (dokter) boleh membaca/mendengarkan audio.
create policy "audio_read_authenticated"
  on storage.objects for select
  using (bucket_id = 'audio' and auth.role() = 'authenticated');

-- Kebijakan: pemilik/pasien boleh mengunggah audio.
create policy "audio_insert_authenticated"
  on storage.objects for insert
  with check (bucket_id = 'audio' and auth.role() = 'authenticated');

-- Catatan: karena website dokter membaca lewat signed URL (client-side),
-- kebijakan select di atas sudah cukup. Signed URL tetap menghasilkan
-- token akses yang sah untuk pengguna terautentikasi.
