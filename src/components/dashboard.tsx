import type { ReactNode } from "react"
import type { RiskLevel } from "../types"
import { RISK_LABEL } from "../data/doctorMock"
import { Sparkline, DeltaBadge } from "./ui"

export function StatCard({ icon, label, value, sub, tone = "primary", trend, delta }: { icon: string; label: string; value: string | number; sub?: string; tone?: "primary" | "secondary" | "accent" | "danger"; trend?: number[]; delta?: number }) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary-deep",
    accent: "bg-accent-soft text-accent-deep",
    danger: "bg-danger-soft text-danger-deep",
  }
  const trendPositive = trend ? trend[trend.length - 1] >= trend[0] : true
  return (
    <div className="bg-surface border border-line rounded-3xl card-shadow p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tones[tone]}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
            <path d={icon === "chart" ? "M3 3v18h18M8 17v-6m4 6V7m4 10v-3" : icon === "user" ? "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-7 9a7 7 0 0 1 14 0H5Z" : icon === "warning" ? "M12 3 1.5 20h21L12 3Zm0 6v5m0 3v.5" : icon === "clock" ? "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v5l3.5 2" : icon === "bell" ? "M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2.5 6.5h17C19.5 14.5 18 13 18 9a6 6 0 0 0-6-6Z" : "M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2.5 6.5h17C19.5 14.5 18 13 18 9a6 6 0 0 0-6-6Z"} />
          </svg>
        </div>
        {delta !== undefined && <DeltaBadge value={delta} />}
      </div>
      <p className="text-[13px] text-muted font-medium mt-3">{label}</p>
      <p className="text-[28px] font-extrabold text-ink leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-[12px] text-faint mt-1">{sub}</p>}
      {trend && trend.length > 0 && <Sparkline data={trend} positive={trendPositive} className="mt-3 w-full h-8" />}
    </div>
  )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const tones: Record<RiskLevel, string> = {
    low: "bg-secondary-soft text-secondary-deep",
    medium: "bg-accent-soft text-accent-deep",
    high: "bg-danger-soft text-danger-deep",
  }
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${tones[level]}`}>{RISK_LABEL[level]}</span>
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="text-[14px] text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm8 15-4-4" /></svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Cari nama atau NIK..."}
        className="h-12 w-full rounded-2xl border border-line bg-surface pl-12 pr-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
      />
    </div>
  )
}

export function FilterChips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`h-9 px-4 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${value === o ? "bg-primary text-white" : "bg-surface-2 text-muted hover:text-primary"}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center text-[40px] mb-5">{icon}</div>
      <h3 className="text-[18px] font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-[14px] text-muted max-w-[300px] leading-relaxed">{desc}</p>
    </div>
  )
}
