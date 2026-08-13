import type { ReactNode } from "react"
import { useApp } from "../state/AppContext"
import { Icon } from "./ui"

// ─── Screen container ─────────────────────────────────────────────────────────

export function Screen({
  children,
  className = "",
  maxWidth = "max-w-md",
}: {
  children: ReactNode
  className?: string
  maxWidth?: string
}) {
  return (
    <div className="min-h-full w-full flex justify-center">
      <div className={`w-full ${maxWidth} ${className}`}>{children}</div>
    </div>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

export function TopBar({
  title,
  onBack,
  right,
  transparent = false,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
  transparent?: boolean
}) {
  const { back } = useApp()
  return (
    <header
      className={`sticky top-0 z-30 flex items-center gap-3 px-5 py-4 ${
        transparent ? "bg-transparent" : "bg-bg/80 backdrop-blur-xl"
      }`}
    >
      {onBack !== null && (
        <button
          onClick={onBack ?? back}
          aria-label="Kembali"
          className="w-10 h-10 rounded-xl bg-surface border border-line text-ink flex items-center justify-center hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
        >
          <Icon name="back" className="w-5 h-5" />
        </button>
      )}
      <h1 className="flex-1 text-[18px] font-bold text-ink truncate">
        {title}
      </h1>
      {right}
    </header>
  )
}

// ─── Bottom Navigation (mobile) / Sidebar (desktop) ──────────────────────────

export function AppNav() {
  const { route, navigate, pendingSync } = useApp()
  const tabs = [
    { key: "home", label: "Beranda", icon: "home" },
    { key: "history", label: "Riwayat", icon: "chart" },
    { key: "education", label: "Edukasi", icon: "book" },
    { key: "profile", label: "Profil", icon: "user" },
  ] as const
  const active = tabs.some((t) => t.key === route) ? route : "home"

  return (
    <>
      {/* Bottom bar — mobile & tablet portrait */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        <div className="mx-auto max-w-md px-4 pb-3">
          <div className="glass rounded-3xl px-2 py-1.5 flex items-center justify-around card-shadow">
            {tabs.map((t) => {
              const isActive = active === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => navigate(t.key as "home")}
                  className="relative flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-2xl transition-colors cursor-pointer"
                >
                  <span
                    className={`transition-colors ${
                      isActive ? "text-primary" : "text-faint"
                    }`}
                  >
                    <Icon name={t.icon} className="w-[22px] h-[22px]" />
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      isActive ? "text-primary" : "text-faint"
                    }`}
                  >
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Sidebar — desktop & tablet landscape */}
      <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="glass rounded-3xl px-2 py-4 flex flex-col items-center gap-1 card-shadow">
          {tabs.map((t) => {
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                onClick={() => navigate(t.key as "home")}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-[0_6px_16px_rgba(29,122,252,0.4)]"
                    : "text-faint hover:bg-surface-2"
                }`}
              >
                <Icon name={t.icon} className="w-[22px] h-[22px]" />
                <span className="text-[9px] font-semibold">{t.label}</span>
              </button>
            )
          })}
          {pendingSync > 0 && (
            <span
              className="mt-1 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
              title={`${pendingSync} perubahan menunggu sinkronisasi`}
            />
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Sync status pill ─────────────────────────────────────────────────────────

export function SyncStatus({ className = "" }: { className?: string }) {
  const { pendingSync } = useApp()
  const synced = pendingSync === 0
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${className} ${
        synced
          ? "bg-secondary-soft text-secondary-deep"
          : "bg-accent-soft text-accent-deep"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          synced ? "bg-secondary" : "bg-accent animate-pulse"
        }`}
      />
      {synced ? "Tersinkronisasi" : `Menyinkronkan (${pendingSync})`}
    </div>
  )
}

// ─── Notification bell ────────────────────────────────────────────────────────

export function NotifBell() {
  const { notifications, navigate } = useApp()
  const unread = notifications.filter((n) => !n.read).length
  return (
    <button
      onClick={() => navigate("notifications")}
      aria-label="Notifikasi"
      className="relative w-10 h-10 rounded-xl bg-surface border border-line text-ink flex items-center justify-center hover:bg-surface-2 transition-colors cursor-pointer"
    >
      <Icon name="bell" className="w-5 h-5" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
          {unread}
        </span>
      )}
    </button>
  )
}
