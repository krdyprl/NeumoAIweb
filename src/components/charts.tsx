import { useEffect, useRef, useState } from "react"
import { Line, Bar } from "react-chartjs-2"
import { formatTime } from "../utils/format"
import { useApp } from "../state/AppContext"
import "../lib/chartjs"
import { chartColors } from "../lib/chartColors"

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
  // grid[rows][cols] dengan rows = frekuensi (mel), cols = waktu (frame).
  // Balik sumbu-y agar frekuensi RENDAH di bawah (konvensi spectrogram).
  return (
    <div>
      <svg viewBox={`0 0 ${cols} ${rows}`} className="h-44 w-full rounded-lg" preserveAspectRatio="none">
        {grid.map((row, r) =>
          row.map((v, c) => <rect key={`${r}-${c}`} x={c} y={rows - 1 - r} width={1} height={1} fill={colorFor(v)} />),
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

export function GradCam({ points, grid }: { points: { x: number; y: number; intensity: number }[]; grid?: number[][] }) {
  const { theme } = useApp()

  // Jika heatmap 2D tersedia (Grad-CAM asli), tampilkan sebagai heatmap overlay.
  if (grid && grid.length && grid[0].length) {
    const rows = grid.length
    const cols = grid[0].length
    const colors = ["rgba(29,58,110,0.05)", "rgba(29,122,252,0.2)", "rgba(62,207,142,0.4)", "rgba(255,209,102,0.6)", "rgba(255,138,0,0.8)", "rgba(239,68,68,0.95)"]
    function colorFor(v: number) {
      return colors[Math.max(0, Math.min(colors.length - 1, Math.floor(v * (colors.length - 1))))]
    }
    // grid[rows][cols]: rows=frekuensi, cols=waktu. Balik y agar frekuensi rendah di bawah.
    return (
      <div>
        <svg viewBox={`0 0 ${cols} ${rows}`} className="h-44 w-full rounded-lg" preserveAspectRatio="none">
          {grid.map((row, r) =>
            row.map((v, c) => <rect key={`${r}-${c}`} x={c} y={rows - 1 - r} width={1} height={1} fill={colorFor(Math.max(0, Math.min(1, v)))} />),
          )}
        </svg>
        <svg viewBox={`0 0 100 24`} className="w-full h-4" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="gradcam-scale" x1="0" y1="0" x2="1" y2="0">
              {colors.map((c, i) => (
                <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <rect x="0" y="4" width="100" height="10" fill="url(#gradcam-scale)" rx="2" />
        </svg>
      </div>
    )
  }

  // Fallback: line chart (data placeholder / legacy).
  if (!points.length) return <p className="text-[13px] text-muted">Data tidak tersedia.</p>
  const colors = chartColors()
  const duration = 6
  const labels = points.map((p) => +((p.x / 100) * duration).toFixed(2))
  const signal = points.map((p) => ((p.y - 50) / 50) * 1.2)
  const heat = points.map((p) => 0.2 + p.intensity * 1.4)

  return (
    <div className="relative h-44 w-full">
      <Line
        key={theme}
        data={{
          labels,
          datasets: [
            {
              label: "Sinyal",
              data: signal,
              borderColor: colors.ink,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
              fill: false,
              order: 2,
            },
            {
              label: "Heatmap",
              data: heat,
              borderWidth: 0,
              pointRadius: 0,
              fill: "origin",
              tension: 0.4,
              backgroundColor: (ctx) => {
                const { chart } = ctx
                const { ctx: c, chartArea } = chart
                if (!chartArea) return "rgba(239,68,68,0.15)"
                const grad = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
                grad.addColorStop(0, "rgba(239,68,68,0.05)")
                grad.addColorStop(1, "rgba(239,68,68,0.55)")
                return grad
              },
              order: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "nearest", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#f8fafc",
              bodyColor: "#cbd5e1",
              callbacks: {
                title: (items) => `t = ${items[0]?.label ?? 0}s`,
                label: (item) => {
                  const v = item.parsed.y ?? 0
                  if (item.dataset.label === "Heatmap") return `Pengaruh: ${Math.round((v / 1.6) * 100)}%`
                  return `Amplitudo: ${v.toFixed(2)}`
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: colors.line },
              ticks: { color: colors.muted, font: { size: 10 } },
              title: { display: true, text: "Waktu (s)", color: colors.muted, font: { size: 11 } },
              min: 0,
              max: duration,
            },
            y: {
              grid: { color: colors.line },
              ticks: { color: colors.muted, font: { size: 10 }, display: false },
              display: true,
            },
          },
        }}
      />
    </div>
  )
}

export function ShapBars({ data }: { data: { feature: string; contribution: number }[] }) {
  const { theme } = useApp()
  const colors = chartColors()
  const labels = data.map((d) => d.feature)
  const values = data.map((d) => d.contribution)
  const barColors = values.map((v) => (v >= 0 ? `${colors.secondary}cc` : `${colors.danger}cc`))

  return (
    <div className="relative h-64 w-full">
      <Bar
        key={theme}
        data={{
          labels,
          datasets: [
            {
              label: "SHAP",
              data: values,
              backgroundColor: barColors,
              borderRadius: 5,
              borderSkipped: false,
              barPercentage: 0.7,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#f8fafc",
              bodyColor: "#cbd5e1",
              callbacks: {
                label: (item) => {
                  const v = item.parsed.x ?? 0
                  return `${item.dataset.label}: ${v >= 0 ? "+" : ""}${v}`
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: colors.line },
              ticks: { color: colors.muted, font: { size: 10 } },
              title: { display: true, text: "SHAP value", color: colors.muted, font: { size: 11 } },
            },
            y: {
              grid: { display: false },
              ticks: { color: colors.ink, font: { size: 12 }, autoSkip: false },
            },
          },
        }}
      />
    </div>
  )
}

export function WaveformPlayer({ duration, src }: { duration: number; src?: string }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  function toggle() {
    const audio = audioRef.current
    if (playing) {
      setPlaying(false)
      audio?.pause()
      return
    }
    if (audio) {
      audio.currentTime = 0
      void audio.play().catch(() => {})
    }
    setPlaying(true)
  }

  const progress = Math.min(elapsed / duration, 1)
  const bars = 28
  return (
    <div>
      <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
        <button
          onClick={toggle}
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
