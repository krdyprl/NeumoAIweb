import { useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { useT } from "../i18n"
import { Icon, Avatar } from "./ui"

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { doctor, pendingCases } = useApp()
  const t = useT()
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-line bg-surface shrink-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-line">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">
          N
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold text-ink">{t("app")}</p>
          <p className="text-[11px] text-muted">{t("app_subtitle")}</p>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {[
          { path: "/dashboard", label: t("nav.dashboard"), icon: "home" },
          { path: "/patients", label: t("nav.patients"), icon: "user" },
          { path: "/decisions", label: t("nav.decisions"), icon: "check" },
          { path: "/notifications", label: t("nav.notifications"), icon: "bell" },
          { path: "/reports", label: t("nav.reports"), icon: "chart" },
          { path: "/settings", label: t("nav.settings"), icon: "edit" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-[0_6px_16px_rgba(29,122,252,0.3)]"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`
            }
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.path === "/decisions" && pendingCases > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center">
                {pendingCases}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-line flex items-center gap-3">
        <Avatar emoji={doctor.emoji} size={40} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[13px] font-bold text-ink truncate">{doctor.name}</p>
          <p className="text-[11px] text-muted truncate">{doctor.role}</p>
        </div>
      </div>
    </aside>
  )
}

export function TopBar() {
  const { doctor, pendingCases, toggleTheme, theme } = useApp()
  const t = useT()
  const navigate = useNavigate()
  return (
    <header className="flex items-center gap-4 px-6 h-16 border-b border-line bg-bg/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex-1" />
      <button
        onClick={toggleTheme}
        aria-label={t("aria.theme")}
        className="w-10 h-10 rounded-xl bg-surface-2 text-muted hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} className="w-5 h-5" />
      </button>
      <button
        onClick={() => navigate("/notifications")}
        aria-label={t("aria.notifications")}
        className="relative w-10 h-10 rounded-xl bg-surface-2 text-muted hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
      >
        <Icon name="bell" className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
          {pendingCases}
        </span>
      </button>
      <div className="flex items-center gap-2.5 pl-2 border-l border-line">
        <Avatar emoji={doctor.emoji} size={38} />
        <div className="hidden md:block leading-tight">
          <p className="text-[13px] font-bold text-ink">{doctor.name}</p>
          <p className="text-[11px] text-muted">{doctor.facility}</p>
        </div>
      </div>
    </header>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useT()
  return (
    <div className="min-h-screen bg-bg text-ink flex">
      <Sidebar />
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-line">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-line">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label={t("aria.open_menu")}
            className="w-10 h-10 rounded-xl bg-surface-2 text-muted flex items-center justify-center cursor-pointer"
          >
            <Icon name="back" className="w-5 h-5 rotate-180" />
          </button>
          <p className="text-[15px] font-bold text-ink">{t("app")}</p>
          <span className="w-10" />
        </div>
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
