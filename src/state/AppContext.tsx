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

interface AppState {
  theme: ThemeMode
  lang: Lang
  doctor: DoctorProfile
  decisionCases: Screening[]
  pendingCases: number
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
  const [decisionCases, setDecisionCases] = useState<Screening[]>(() =>
    Object.values(SCREENINGS_BY_PATIENT)
      .flat()
      .filter((s) => s.status === "awaiting"),
  )

  const decideCase = useCallback(
    (id: string, action: "accept" | "reject") => {
      const newStatus: Screening["status"] =
        action === "accept" ? "accepted" : "rejected"
      setDecisionCases((prev) =>
        prev
          .map((s) => (s.id === id ? { ...s, status: newStatus } : s))
          .filter((s) => s.id !== id),
      )
    },
    [],
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("neumod-theme", theme)
  }, [theme])

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
      setTheme,
      toggleTheme,
      setLang,
      setDoctor,
      decideCase,
    }),
    [theme, lang, doctorState, decisionCases, toggleTheme, decideCase],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
