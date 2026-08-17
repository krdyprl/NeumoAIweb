import { supabase, SUPABASE_CONFIGURED } from "./supabase"
import type { DoctorProfile } from "../types"

export interface SessionData {
  email: string
  role: string
  supabase?: boolean
  user?: { id: string; email: string }
}

const SESSION_KEY = "neumod_session"

export function getSession(): SessionData | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionData
  } catch {
    return null
  }
}

export function setSession(data: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) {
    setSession({ email, role: "dokter" })
    return { error: null }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  if (data.user) {
    setSession({
      email: data.user.email ?? email,
      role: "dokter",
      supabase: true,
      user: { id: data.user.id, email: data.user.email ?? email },
    })
  }
  return { error: null }
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut()
  clearSession()
}

export function currentUserId(): string | null {
  return getSession()?.user?.id ?? null
}

export async function fetchDoctorProfile(userId: string): Promise<Partial<DoctorProfile> | null> {
  if (!SUPABASE_CONFIGURED || !supabase) return null
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, specialization, str, facility, phone, emoji")
    .eq("id", userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    name: data.full_name ?? undefined,
    specialization: data.specialization ?? undefined,
    str: data.str ?? undefined,
    facility: data.facility ?? undefined,
    phone: data.phone ?? undefined,
    emoji: data.emoji ?? undefined,
  }
}
