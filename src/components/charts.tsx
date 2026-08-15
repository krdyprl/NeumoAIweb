import { useEffect, useRef, useState } from "react"
import { formatTime } from "../utils/format"

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-48">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-muted">{d.value}</span>
          <div className="w-full rounded-t-xl bg-primary/20 hover:bg-primary/40 transition-colors" style={{ height: `${(d.value / max) * 150}px` }} />
          <span className="text-[11px] text-faint truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function AreaChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const w = 560
  const h = 180
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 20) - 10}`)
  const path = `M0,${h} L${pts.join(" L")} L${w},${h} Z`
  const line = `M${pts.join(" L")}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
      <path d={path} fill="var(--color-primary)" opacity="0.15" />
      <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0
  const r = 60
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-40 h-40">
        <g transform="rotate(-90 80 80)">
          {data.map((d) => {
            const frac = d.value / total
            const dash = frac * c
            const seg = <circle key={d.label} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="24" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
            offset += dash
            return seg
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-ink" fontSize="22" fontWeight="800">{total}</text>
        <text x="80" y="98" textAnchor="middle" className="fill-muted" fontSize="11">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[13px]">
            <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.label}</span>
            <span className="font-bold text-ink ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MelSpectrogram({ grid }: { grid: number[][] }) {
  if (!grid.length || !grid[0].length) return <p className="text-[13px] text-muted">Data tidak tersedia.</p>
  const rows = grid.length
  const cols = grid[0].length
  const colors = ["#1d3a6e", "#1d7afc", "#2fa8f0", "#3ecf8e", "#ffd166", "#ff8a00", "#ef4444"]
  function colorFor(v: number) {
    return colors[Math.max(0, Math.min(colors.length - 1, Math.floor(v * (colors.length - 1))))]
  }
  return (
    <div>
      <svg viewBox={`0 0 ${cols} ${rows}`} className="h-44 w-full rounded-lg" preserveAspectRatio="none">
        {grid.map((row, r) =>
          row.map((v, c) => <rect key={`${r}-${c}`} x={c + 0.25} y={r + 0.25} width={0.5} height={0.5} fill={colorFor(v)} />),
        )}
      </svg>
      <svg viewBox={`0 0 100 24`} className="w-full h-4" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="mel-scale" x1="0" y1="0" x2="1" y2="0">
            {colors.map((c, i) => (
              <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <rect x="0" y="4" width="100" height="10" fill="url(#mel-scale)" rx="2" />
      </svg>
    </div>
  )
}

export function GradCam({ points }: { points: { x: number; y: number; intensity: number }[] }) {
  const w = 200
  const h = 120
  const pad = 6
  if (!points.length) return <p className="text-[13px] text-muted">Data tidak tersedia.</p>
  // Build a smooth path through the points (baseline wave)
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${pad + (p.x / 100) * (w - pad * 2)},${pad + (p.y / 100) * (h - pad * 2)}`).join(" ")
  const maxI = Math.max(...points.map((p) => p.intensity))
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44 rounded-xl border border-line/60 bg-surface" preserveAspectRatio="none">
      <defs>
        <filter id="gradcam-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="gradcam-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      {points.map((p, i) => {
        const cx = pad + (p.x / 100) * (w - pad * 2)
        const cy = pad + (p.y / 100) * (h - pad * 2)
        const r = 6 + (p.intensity / maxI) * 26
        return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#gradcam-fade)" filter="url(#gradcam-blur)" />
      })}
      <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

export function ShapBars({ data }: { data: { feature: string; contribution: number }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.contribution)), 1)
  const scale = 50 / max
  return (
    <div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.feature} className="flex items-center gap-3">
            <span className="w-44 text-[13px] text-muted text-right shrink-0 truncate">{d.feature}</span>
            <div className="flex-1 flex items-center">
              {d.contribution < 0 && (
                <div className="h-3.5 rounded-r bg-danger/70 anim-grow" style={{ width: `${Math.abs(d.contribution) * scale}%`, transformOrigin: "right" }} />
              )}
              <span className="w-[2px] bg-line h-5 shrink-0" />
              {d.contribution > 0 && (
                <div className="h-3.5 rounded-l bg-secondary/80 anim-grow" style={{ width: `${d.contribution * scale}%`, transformOrigin: "left" }} />
              )}
            </div>
            <span className="w-10 text-[13px] font-bold text-ink text-right shrink-0">{d.contribution}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
        <span>-{max}</span>
        <span className="text-[11px] text-faint">SHAP value</span>
        <span>+{max}</span>
      </div>
    </div>
  )
}

export function WaveformPlayer({ duration }: { duration: number }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    timerRef.current = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 0.1 >= duration) {
          setPlaying(false)
          return 0
        }
        return prev + 0.1
      })
    }, 100)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [playing, duration])

  const progress = Math.min(elapsed / duration, 1)
  const bars = 28
  return (
    <div>
      <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Jeda" : "Putar suara"}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shrink-0 shadow-[0_6px_16px_rgba(29,122,252,0.3)]"
        >
          {playing ? <span className="w-3.5 h-3.5 bg-white rounded-[2px]" /> : <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M6 4l14 8-14 8V4Z" /></svg>}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1 h-10">
            {Array.from({ length: bars }).map((_, i) => {
              const segStart = i / bars
              const active = playing && progress >= segStart
              const h = 25 + 65 * Math.abs(Math.sin(i * 1.7 + 1)) * (active ? 1 : 0.45)
              return (
                <span
                  key={i}
                  className={`flex-1 rounded-full ${active ? "bg-primary" : "bg-primary/30"} transition-colors duration-100`}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}
                />
              )
            })}
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-line overflow-hidden">
            <div className="h-full bg-primary transition-[width] duration-100 ease-linear" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <span className="text-[12px] text-muted shrink-0 tabular-nums">{formatTime(elapsed)} / {formatTime(duration)}</span>
      </div>
    </div>
  )
}
