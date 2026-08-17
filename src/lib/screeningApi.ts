import { supabase, SUPABASE_CONFIGURED } from "./supabase"
import type { RiskLevel, Screening, Vitals } from "../types"

export interface ScreeningRow {
  id: string
  child_id: string
  user_id: string
  date: string
  symptoms: string[] | null
  audio_duration: number | null
  risk_level: RiskLevel | null
  disease: string | null
  confidence: number | null
  audio_url: string | null
  status: string | null
  outcome: string | null
  model_version: string | null
  trend: number[] | null
  vitals: Vitals | null
  child_name: string | null
  created_at: string
}

const DEFAULT_VITALS: Vitals = {
  heartRate: 0,
  respiratoryRate: 0,
  spo2: 0,
  temperature: 0,
  weight: 0,
}

function mapRow(row: ScreeningRow): Screening {
  const status = (["awaiting", "accepted", "rejected", "done"] as const).includes(
    row.status as Screening["status"],
  )
    ? (row.status as Screening["status"])
    : "awaiting"

  return {
    id: row.id,
    patientId: row.child_id,
    date: row.date ?? row.created_at,
    symptoms: row.symptoms ?? [],
    audioDuration: row.audio_duration ?? 5,
    riskLevel: row.risk_level ?? "low",
    disease: row.disease ?? "Pneumonia",
    confidence: row.confidence ?? 0,
    status,
    outcome: row.outcome ?? "",
    vitals: row.vitals ?? DEFAULT_VITALS,
    modelVersion: row.model_version ?? "v2.4",
    trend: row.trend ?? [],
    audioUrl: row.audio_url ?? undefined,
    patientName: row.child_name ?? undefined,
  }
}

export async function fetchScreenings(): Promise<Screening[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return []

  const { data, error } = await supabase
    .from("screenings")
    .select("*")
    .order("date", { ascending: false })

  if (error) {
    console.error("fetchScreenings error:", error.message)
    return []
  }

  return (data as ScreeningRow[]).map(mapRow)
}

export async function updateScreeningStatus(
  id: string,
  action: "accept" | "reject",
  outcome = "",
): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null }

  const status = action === "accept" ? "accepted" : "rejected"
  const { error } = await supabase
    .from("screenings")
    .update({ status, outcome: outcome || undefined })
    .eq("id", id)

  return { error: error?.message ?? null }
}

export async function subscribeToScreenings(onChange: () => void): Promise<() => void> {
  const client = supabase
  if (!SUPABASE_CONFIGURED || !client) return () => {}

  const channel = client
    .channel("screenings-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "screenings" },
      () => onChange(),
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}
