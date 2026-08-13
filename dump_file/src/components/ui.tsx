import type { ButtonHTMLAttributes, ReactNode } from "react"
import { useApp } from "../state/AppContext"

// ─── Button ───────────────────────────────────────────────────────────────────

type BtnVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "soft"

const btnStyles: Record<BtnVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-deep shadow-[0_8px_20px_rgba(29,122,252,0.3)]",
  secondary:
    "bg-secondary text-[#06301f] hover:bg-secondary-deep shadow-[0_8px_20px_rgba(62,207,142,0.3)]",
  accent:
    "bg-accent text-white hover:bg-accent-deep shadow-[0_8px_20px_rgba(255,138,0,0.3)]",
  outline: "border border-line bg-transparent text-ink hover:bg-surface-2",
  ghost: "bg-transparent text-primary hover:bg-primary-soft",
  danger:
    "bg-danger text-white hover:bg-danger-deep shadow-[0_8px_20px_rgba(239,68,68,0.3)]",
  soft: "bg-primary-soft text-primary hover:bg-primary/15",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: "h-9 px-4 text-[13px] rounded-xl gap-1.5",
    md: "h-12 px-6 text-[15px] rounded-2xl gap-2",
    lg: "h-14 px-8 text-[16px] rounded-2xl gap-2",
  }
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none ${btnStyles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  className = "",
  children,
  onClick,
  interactive = false,
}: {
  className?: string
  children: ReactNode
  onClick?: () => void
  interactive?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-line rounded-3xl card-shadow transition-all duration-200 ${
        interactive
          ? "hover:shadow-float hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Chip / Badge ─────────────────────────────────────────────────────────────

export function Chip({
  tone = "primary",
  children,
  className = "",
}: {
  tone?: "primary" | "secondary" | "accent" | "danger" | "neutral" | "warning"
  children: ReactNode
  className?: string
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary-deep",
    accent: "bg-accent-soft text-accent-deep",
    danger: "bg-danger-soft text-danger-deep",
    warning:
      "bg-[#fef3c7] text-[#b45309] dark:bg-[rgba(245,158,11,0.16)] dark:text-[#fbbf24]",
    neutral: "bg-surface-2 text-muted",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  hint,
}: {
  label?: string
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  icon?: ReactNode
  hint?: string
}) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block mb-1.5 text-[13px] font-semibold text-ink">
          {label}
        </span>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            icon ? "pl-12" : ""
          }`}
        />
      </div>
      {hint && (
        <span className="mt-1 block text-[12px] text-muted">{hint}</span>
      )}
    </label>
  )
}

// ─── Segmented Control ────────────────────────────────────────────────────────

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-2xl bg-surface-2 p-1 gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 h-9 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            value === o.value
              ? "bg-surface text-primary shadow-card"
              : "text-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  color = "var(--color-primary)",
  className = "",
}: {
  value: number
  color?: string
  className?: string
}) {
  return (
    <div
      className={`h-2.5 w-full rounded-full bg-surface-2 overflow-hidden ${className}`}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color,
        }}
      />
    </div>
  )
}

// ─── Ring Progress ────────────────────────────────────────────────────────────

export function Ring({
  value,
  size = 88,
  stroke = 8,
  color = "var(--color-primary)",
  label,
  sublabel,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  label?: ReactNode
  sublabel?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-extrabold text-ink leading-none">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] text-muted mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({
  emoji,
  size = 48,
  className = "",
}: {
  emoji: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/10 shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      <span>{emoji}</span>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: string
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 anim-fade-up">
      <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center text-[40px] mb-5 anim-float">
        {icon}
      </div>
      <h3 className="text-[18px] font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-[14px] text-muted max-w-[260px] leading-relaxed mb-6">
        {desc}
      </p>
      {action}
    </div>
  )
}

// ─── Icons (inline SVG, minimal style) ────────────────────────────────────────

export function Icon({
  name,
  className = "",
}: {
  name: string
  className?: string
}) {
  const paths: Record<string, string> = {
    home: "M3 10.5 12 3l9 7.5V21h-6v-6h-6v6H3v-10.5Z",
    mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12h-2Z",
    book: "M4 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3Zm4 4h6M8 11h6M8 15h3",
    user: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-7 9a7 7 0 0 1 14 0H5Z",
    bell: "M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2.5 6.5h17C19.5 14.5 18 13 18 9a6 6 0 0 0-6-6Zm-2 14a2 2 0 0 0 4 0h-4Z",
    back: "M15 5l-7 7 7 7",
    chevron: "M9 6l6 6-6 6",
    plus: "M12 5v14M5 12h14",
    check: "M5 13l4 4L19 7",
    close: "M6 6l12 12M18 6L6 18",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm8 15-4-4",
    wave: "M2 12h2l2-6 3 12 3-16 3 14 2-6h5",
    share: "M14 5l7 7-7 7M3 12h16",
    download: "M12 3v12m0 0 4-4m-4 4-4-4M4 19h16",
    shield: "M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-3Z",
    calendar:
      "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 6h14M8 3v4M16 3v4",
    clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v5l3.5 2",
    chart: "M3 3v18h18M8 17v-6m4 6V7m4 10v-3",
    moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
    sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4m12.8-12.8 1.4-1.4",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9",
    edit: "M4 20h4L19 9l-4-4L4 16v4ZM13 6l4 4",
    heart: "M12 21s-8-5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-10 11-10 11Z",
    cloud:
      "M7 19a5 5 0 0 1-.5-10A7 7 0 0 1 20 9a4 4 0 0 1-1 7.9M7 19h12M7 19v2",
    upload: "M12 16V4m0 0 4 4m-4-4-4 4M4 16v4h16v-4",
    location:
      "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    warning: "M12 3 1.5 20h21L12 3Zm0 6v5m0 3v.5",
    refresh: "M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6",
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden
    >
      <path
        d={paths[name]}
        fill={name === "back" || name === "chevron" ? "none" : "currentColor"}
        stroke={name === "back" || name === "chevron" ? "currentColor" : "none"}
        strokeWidth={name === "back" || name === "chevron" ? 2 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useApp()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`w-10 h-10 rounded-xl bg-surface-2 text-muted hover:text-primary hover:bg-primary-soft flex items-center justify-center transition-colors cursor-pointer ${className}`}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} className="w-5 h-5" />
    </button>
  )
}
