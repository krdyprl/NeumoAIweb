import { useEffect, useMemo, useState } from "react"

// ─── Waveform (animated recording) ───────────────────────────────────────────

export function Waveform({
  active = true,
  barCount = 42,
  color = "var(--color-primary)",
  className = "",
}: {
  active?: boolean
  barCount?: number
  color?: string
  className?: string
}) {
  const [seed, setSeed] = useState(() =>
    Array.from({ length: barCount }, () => 0.5),
  )

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setSeed((s) => s.map(() => 0.15 + Math.random() * 0.85))
    }, 90)
    return () => clearInterval(id)
  }, [active])

  return (
    <div
      className={`flex items-center justify-center gap-[3px] h-24 ${className}`}
    >
      {seed.map((v, i) => (
        <div
          key={i}
          className="w-[5px] rounded-full"
          style={{
            height: `${Math.max(8, v * 100)}%`,
            background: color,
            transformOrigin: "center",
            animation: active
              ? `wave-bar ${0.5 + (i % 5) * 0.12}s ease-in-out infinite`
              : "none",
            transition: "height 0.12s ease",
            opacity: 0.55 + (i % 7) * 0.06,
          }}
        />
      ))}
    </div>
  )
}

// ─── Spectrogram (explainable AI) ─────────────────────────────────────────────

export function Spectrogram({ className = "" }: { className?: string }) {
  const rows = useMemo(() => {
    return Array.from({ length: 14 }, () =>
      Array.from({ length: 40 }, () => Math.random()),
    )
  }, [])

  const freq = (r: number) =>
    (r < 3 ? 0.15 : r < 7 ? 0.3 : r < 11 ? 0.5 : 0.75) + (r % 2) * 0.1

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <div className="flex flex-col gap-[2px]">
        {rows.map((row, r) => (
          <div key={r} className="flex gap-[2px]">
            {row.map((v, c) => {
              const heat = Math.min(
                1,
                v * freq(r) * (c > 18 && c < 30 ? 1.3 : 1),
              )
              const alpha = heat
              const color =
                heat < 0.25
                  ? `rgba(29,122,252,${0.08 + alpha * 0.2})`
                  : heat < 0.55
                    ? `rgba(62,207,142,${alpha * 0.7})`
                    : heat < 0.8
                      ? `rgba(255,138,0,${alpha * 0.8})`
                      : `rgba(239,68,68,${alpha})`
              return (
                <div
                  key={c}
                  className="flex-1 rounded-[1px]"
                  style={{ height: 5, background: color }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Grad-CAM heatmap overlay ─────────────────────────────────────────────────

export function GradCAM({ className = "" }: { className?: string }) {
  const cells = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        Array.from({ length: 12 }, (_, j) => {
          const dist = Math.hypot((i - 6) / 6, (j - 6) / 6)
          const band = Math.exp(-dist * 2.2) + (i > 7 ? 0.25 : 0)
          return Math.min(1, band + Math.random() * 0.15)
        }),
      ),
    [],
  )
  return (
    <div
      className={`grid grid-cols-12 gap-[2px] rounded-2xl overflow-hidden ${className}`}
    >
      {cells.flat().map((v, i) => (
        <div
          key={i}
          className="rounded-[2px]"
          style={{
            height: 14,
            background: `rgba(239,68,68,${Math.min(1, v * 0.95)})`,
            opacity: v < 0.2 ? 0.15 : 1,
          }}
        />
      ))}
    </div>
  )
}

// ─── SHAP contribution chart ──────────────────────────────────────────────────

export function SHAPChart({
  data,
  className = "",
}: {
  data: { label: string; value: number }[]
  className?: string
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)))
  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((d) => {
        const pct = (Math.abs(d.value) / max) * 100
        const positive = d.value >= 0
        return (
          <div key={d.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[12px] font-medium text-ink">
                {d.label}
              </span>
              <span className="text-[12px] font-semibold text-muted">
                {positive ? "+" : ""}
                {d.value.toFixed(2)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-2 overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  positive ? "bg-danger" : "bg-primary"
                }`}
                style={{
                  width: `${pct}%`,
                  marginLeft: positive ? "0" : "auto",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Line chart (health trend / growth) ───────────────────────────────────────

export function LineChart({
  data,
  color = "var(--color-primary)",
  height = 120,
  unit,
  className = "",
}: {
  data: number[]
  color?: string
  height?: number
  unit?: string
  className?: string
}) {
  const w = 300
  const h = height
  const min = Math.min(...data) * 0.95
  const max = Math.max(...data) * 1.05
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 16) - 8,
  }))
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")
  const area = `${path} L${w},${h} L0,${h} Z`
  const last = pts[pts.length - 1]

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="linefill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#linefill)" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {last && <circle cx={last.x} cy={last.y} r="4" fill={color} />}
      </svg>
      {unit && (
        <span className="absolute right-0 top-0 text-[11px] font-semibold text-faint">
          {unit}
        </span>
      )}
    </div>
  )
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────

export function BarChart({
  data,
  color = "var(--color-primary)",
  height = 100,
  labels,
  className = "",
}: {
  data: number[]
  color?: string
  height?: number
  labels?: string[]
  className?: string
}) {
  const max = Math.max(...data) || 1
  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
        >
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${(v / max) * 88}%`,
              background: color,
              opacity: 0.35 + (v / max) * 0.65,
            }}
          />
          {labels && (
            <span className="text-[10px] text-faint">{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

export function Sparkline({
  data,
  color = "var(--color-secondary)",
  className = "",
}: {
  data: number[]
  color?: string
  className?: string
}) {
  const w = 120
  const h = 36
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 6) - 3,
  }))
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
