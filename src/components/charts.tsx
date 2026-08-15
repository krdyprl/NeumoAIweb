import { useState } from "react"

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
  const colors = ["#1d3a6e", "#1d7afc", "#3ecf8e", "#ffd166", "#ff8a00", "#ef4444"]
  function colorFor(v: number) {
    return colors[Math.max(0, Math.min(colors.length - 1, Math.floor(v * (colors.length - 1))))]
  }
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} className="w-full h-48 rounded-xl" preserveAspectRatio="none">
      {grid.map((row, r) =>
        row.map((v, c) => <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={colorFor(v)} />),
      )}
    </svg>
  )
}

export function GradCam({ points }: { points: { x: number; y: number; intensity: number }[] }) {
  const line = points.map((p) => `${p.x},${p.y}`).join(" ")
  return (
    <svg viewBox="0 0 100 100" className="w-full h-40 rounded-xl" preserveAspectRatio="none">
      <polyline points={line} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3 + p.intensity * 6} fill="var(--color-danger)" opacity={0.15 + p.intensity * 0.4} />
      ))}
    </svg>
  )
}

export function ShapBars({ data }: { data: { feature: string; contribution: number }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.contribution)), 0.01)
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.feature} className="flex items-center gap-3">
          <span className="w-44 text-[13px] text-muted text-right">{d.feature}</span>
          <div className="flex-1 flex items-center">
            {d.contribution < 0 && <div className="h-3 rounded-r bg-danger/70" style={{ width: `${(Math.abs(d.contribution) / max) * 50}%` }} />}
            <span className="w-[2px] bg-line h-4 shrink-0" />
            {d.contribution > 0 && <div className="h-3 rounded-l bg-secondary/70" style={{ width: `${(d.contribution / max) * 50}%` }} />}
          </div>
          <span className="w-12 text-[13px] font-bold text-ink">{(d.contribution * 100).toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

export function WaveformPlayer({ duration }: { duration: number }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
      <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Jeda" : "Putar suara"} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer">
        {playing ? <span className="w-3.5 h-3.5 bg-white rounded-[2px]" /> : <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M6 4l14 8-14 8V4Z" /></svg>}
      </button>
      <div className="flex-1 flex items-center gap-1 h-10">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className={`w-1 rounded-full ${playing ? "bg-primary anim-wave" : "bg-primary/30"}`} style={playing ? { animationDelay: `${i * 0.04}s`, transformOrigin: "bottom" } : { height: "30%", transformOrigin: "bottom" }} />
        ))}
      </div>
      <span className="text-[12px] text-muted">{duration} dtk</span>
    </div>
  )
}
