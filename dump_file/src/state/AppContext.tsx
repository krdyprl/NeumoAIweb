import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type {
  AppNotification,
  Child,
  Lang,
  NavParams,
  Profile,
  Route,
  Screening,
  ThemeMode,
} from "../types"
import {
  MOCK_CHILDREN,
  MOCK_NOTIFICATIONS,
  MOCK_PROFILE,
  MOCK_SCREENINGS,
} from "../data/mock"

interface AppState {
  route: Route
  params: NavParams
  theme: ThemeMode
  lang: Lang
  profile: Profile
  children: Child[]
  screenings: Screening[]
  notifications: AppNotification[]
  currentChildId: string
  pendingSync: number
  navigate: (route: Route, params?: NavParams) => void
  back: () => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  setLang: (lang: Lang) => void
  setProfile: (p: Profile) => void
  addChild: (c: Child) => void
  updateChild: (c: Child) => void
  deleteChild: (id: string) => void
  setCurrentChild: (id: string) => void
  addScreening: (s: Screening) => void
  markNotificationRead: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({
  children: appChildren,
}: {
  children: ReactNode
}) {
  const historyRef = useRef<{ route: Route; params?: NavParams }[]>([])
  const [route, setRoute] = useState<Route>("splash")
  const [params, setParams] = useState<NavParams>({})
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("neumoai-theme")
    if (saved === "dark" || saved === "light") return saved
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })
  const [lang, setLangState] = useState<Lang>("id")
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE)
  const [children, setChildren] = useState<Child[]>(MOCK_CHILDREN)
  const [screenings, setScreenings] = useState<Screening[]>(MOCK_SCREENINGS)
  const [notifications, setNotifications] =
    useState<AppNotification[]>(MOCK_NOTIFICATIONS)
  const [currentChildId, setCurrentChildId] = useState<string>("c1")
  const [pendingSync, setPendingSync] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("neumoai-theme", theme)
  }, [theme])

  const navigate = useCallback(
    (next: Route, nextParams?: NavParams) => {
      historyRef.current.push({ route, params })
      setRoute(next)
      setParams(nextParams ?? {})
    },
    [route, params],
  )

  const back = useCallback(() => {
    const prev = historyRef.current.pop()
    if (prev) {
      setRoute(prev.route)
      setParams(prev.params ?? {})
    }
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const value = useMemo<AppState>(
    () => ({
      route,
      params,
      theme,
      lang,
      profile,
      children,
      screenings,
      notifications,
      currentChildId,
      pendingSync,
      navigate,
      back,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      setTheme,
      setLang: setLangState,
      setProfile,
      addChild: (c) => {
        setChildren((prev) => [...prev, c])
        setPendingSync((p) => p + 1)
      },
      updateChild: (c) =>
        setChildren((prev) => prev.map((x) => (x.id === c.id ? c : x))),
      deleteChild: (id) => {
        setChildren((prev) => {
          const next = prev.filter((x) => x.id !== id)
          if (currentChildId === id) {
            setCurrentChildId(next[0]?.id ?? "")
          }
          return next
        })
        setPendingSync((p) => p + 1)
      },
      setCurrentChild: (id) => {
        setCurrentChildId(id)
        setPendingSync((p) => p + 1)
      },
      addScreening: (s) => {
        setScreenings((prev) => [s, ...prev])
        setPendingSync((p) => p + 1)
      },
      markNotificationRead,
    }),
    [
      route,
      params,
      theme,
      lang,
      profile,
      children,
      screenings,
      notifications,
      currentChildId,
      pendingSync,
      navigate,
      back,
      markNotificationRead,
    ],
  )

  return <AppContext.Provider value={value}>{appChildren}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
