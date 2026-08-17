import { supabase, STORAGE_BUCKET } from "./supabase"

export interface AudioObject {
  name: string
  url: string
}

export function audioPath(childId: string, fileName: string): string {
  return `${childId}/${fileName}`
}

export async function uploadAudio(
  childId: string,
  file: File,
  _onProgress?: (percent: number) => void,
): Promise<{ path: string; url: string; error: string | null }> {
  if (!supabase) return { path: "", url: "", error: "Supabase tidak dikonfigurasi." }

  const path = audioPath(childId, file.name)
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false })

  if (error) return { path: "", url: "", error: error.message }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl, error: null }
}

export async function getAudioUrl(path: string, expiresIn = 3600): Promise<string | null> {
  if (!supabase) return null
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn)
  if (error || !data) return null
  return data.signedUrl
}

export async function getAudioUrlOrPublic(
  pathOrUrl: string,
  expiresIn = 3600,
): Promise<string | null> {
  if (!pathOrUrl) return null
  if (pathOrUrl.startsWith("http")) return pathOrUrl
  return getAudioUrl(pathOrUrl, expiresIn)
}
