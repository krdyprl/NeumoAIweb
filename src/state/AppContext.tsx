import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { DoctorProfile, Lang, Screening, ThemeMode } from "../types"
import { SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { fetchScreenings, updateScreeningStatus, subscribeToScreenings } from "../lib/screeningApi"
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabase"
import { fetchDoctorProfile, getSession } from "../lib/auth"

interface AppState {
  theme: ThemeMode
  lang: Lang
  doctor: DoctorProfile
  decisionCases: Screening[]
  pendingCases: number
  liveScreenings: Screening[]
  screeningsByPatient: Record<string, Screening[]>
  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  setLang: (l: Lang) => void
  setDoctor: (d: DoctorProfile) => void
  decideCase: (id: string, action: "accept" | "reject") => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({
  children,
  doctor,
}: {
  children: ReactNode
  doctor: DoctorProfile
}) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("neumod-theme")
    if (saved === "dark" || saved === "light") return saved
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })
  const [lang, setLang] = useState<Lang>("id")
  const [doctorState, setDoctor] = useState<DoctorProfile>(doctor)
  const [liveScreenings, setLiveScreenings] = useState<Screening[]>([])
  const [decisionCases, setDecisionCases] = useState<Screening[]>(() =>
    Object.values(SCREENINGS_BY_PATIENT)
      .flat()
      .filter((s) => s.status === "awaiting"),
  )

  const loadLive = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) return
    const rows = await fetchScreenings()
    setLiveScreenings(rows)
    setDecisionCases(rows.filter((s) => s.status === "awaiting"))
  }, [])

  useEffect(() => {
    loadLive()
    let unsub: (() => void) | undefined
    subscribeToScreenings(loadLive).then((fn) => {
      unsub = fn
    })
    return () => unsub?.()
  }, [loadLive])

  const decideCase = useCallback(
    async (id: string, action: "accept" | "reject") => {
      const newStatus: Screening["status"] =
        action === "accept" ? "accepted" : "rejected"
      setDecisionCases((prev) =>
        prev
          .map((s) => (s.id === id ? { ...s, status: newStatus } : s))
          .filter((s) => s.id !== id),
      )
      setLiveScreenings((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      )
      if (SUPABASE_CONFIGURED) {
        await updateScreeningStatus(id, action)
      }
    },
    [],
  )

  const screeningsByPatient = useMemo(() => {
    const result: Record<string, Screening[]> = { ...SCREENINGS_BY_PATIENT }
    for (const s of liveScreenings) {
      if (!result[s.patientId]) result[s.patientId] = []
      result[s.patientId] = [s, ...result[s.patientId].filter((x) => x.id !== s.id)]
    }
    return result
  }, [liveScreenings])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("neumod-theme", theme)
  }, [theme])

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    let cancelled = false
    const applyProfile = async (userId: string) => {
      const profile = await fetchDoctorProfile(userId)
      if (cancelled || !profile) return
      setDoctor((prev) => ({
        ...prev,
        ...profile,
        email: getSession()?.email ?? prev.email,
      }))
    }
    const initialUserId = getSession()?.user?.id
    if (initialUserId) void applyProfile(initialUserId)
    if (supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (cancelled) return
        if (session?.user?.id) {
          void applyProfile(session.user.id)
        }
      })
      return () => {
        cancelled = true
        sub.subscription.unsubscribe()
      }
    }
    return () => {
      cancelled = true
    }
  }, [])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  )

  const value = useMemo<AppState>(
    () => ({
      theme,
      lang,
      doctor: doctorState,
      decisionCases,
      pendingCases: decisionCases.length,
      liveScreenings,
      screeningsByPatient,
      setTheme,
      toggleTheme,
      setLang,
      setDoctor,
      decideCase,
    }),
    [theme, lang, doctorState, decisionCases, liveScreenings, screeningsByPatient, toggleTheme, decideCase],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
