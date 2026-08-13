import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { DoctorProfile, Lang, ThemeMode } from "../types"

interface AppState {
  theme: ThemeMode
  lang: Lang
  doctor: DoctorProfile
  pendingCases: number
  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  setLang: (l: Lang) => void
  setDoctor: (d: DoctorProfile) => void
  setPendingCases: (n: number | ((p: number) => number)) => void
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
  const [pendingCases, setPendingCases] = useState(0)

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
      pendingCases,
      setTheme,
      toggleTheme,
      setLang,
      setDoctor,
      setPendingCases,
    }),
    [theme, lang, doctorState, pendingCases, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
