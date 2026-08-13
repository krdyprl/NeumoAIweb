import { useMemo, useState } from "react"
import { Button, Segmented } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import { LineChart, Sparkline } from "../components/charts"
import { MOCK_GROWTH } from "../data/mock"
import type { RiskLevel, Screening } from "../types"

const riskColor: Record<RiskLevel, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
}

const riskLabel: Record<RiskLevel, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
}

function filterByChild(screenings: Screening[], childId: string) {
  return screenings.filter((s) => s.childId === childId)
}

function Timeline({ screenings }: { screenings: Screening[] }) {
  const { navigate } = useApp()
  return (
    <div className="space-y-3">
      {screenings.map((s) => (
        <button
          key={s.id}
          onClick={() => navigate("result", { screeningId: s.id })}
          className="w-full text-left rounded-3xl p-4 bg-surface border border-line card-shadow flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-float transition-all cursor-pointer"
        >
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-[20px] shrink-0"
            style={{ background: `${riskColor[s.riskLevel]}1a` }}
          >
            {s.riskLevel === "high"
              ? "🚨"
              : s.riskLevel === "medium"
                ? "⚠️"
                : "✅"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-ink">{s.disease}</p>
              <span
                className="text-[11px] font-bold rounded-full px-2 py-0.5"
                style={{
                  color: riskColor[s.riskLevel],
                  background: `${riskColor[s.riskLevel]}1a`,
                }}
              >
                {riskLabel[s.riskLevel]}
              </span>
            </div>
            <p className="text-[12px] text-muted mt-0.5">
              {formatDateTime(s.date)} · {s.audioDuration} detik audio ·
              keyakinan {s.confidence}%
            </p>
          </div>
          <span className="text-faint">→</span>
        </button>
      ))}
    </div>
  )
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function CalendarView({ screenings }: { screenings: Screening[] }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const marks = useMemo(() => {
    const map: Record<string, RiskLevel> = {}
    screenings.forEach((s) => {
      const d = new Date(s.date)
      if (d.getMonth() === month && d.getFullYear() === year) {
        map[d.getDate()] = s.riskLevel
      }
    })
    return map
  }, [screenings, month, year])

  return (
    <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
      <p className="text-[15px] font-bold text-ink mb-4 text-center">
        {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-faint">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const risk = marks[day + 1]
          const isToday = day + 1 === now.getDate()
          return (
            <div
              key={day}
              className={`relative h-9 rounded-xl flex items-center justify-center text-[12px] font-semibold ${
                isToday ? "bg-primary text-white" : "text-ink"
              }`}
            >
              {day + 1}
              {risk && (
                <span
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: riskColor[risk] }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {(["low", "medium", "high"] as const).map((r) => (
          <span
            key={r}
            className="flex items-center gap-1.5 text-[11px] text-muted"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: riskColor[r] }}
            />
            {riskLabel[r]}
          </span>
        ))}
      </div>
    </div>
  )
}

function GrowthCharts({ childId }: { childId: string }) {
  const growth = MOCK_GROWTH[childId] ?? MOCK_GROWTH.c1
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[15px] font-bold text-ink">Tren Berat Badan</p>
            <p className="text-[12px] text-muted">
              Kurva pertumbuhan 7 bulan terakhir
            </p>
          </div>
          <Sparkline
            data={growth.map((g) => g.weight)}
            color="var(--color-primary)"
          />
        </div>
        <LineChart
          data={growth.map((g) => g.weight)}
          color="var(--color-primary)"
          unit="kg"
        />
      </div>

      <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[15px] font-bold text-ink">Tren Tinggi Badan</p>
            <p className="text-[12px] text-muted">Pertumbuhan tinggi badan</p>
          </div>
          <Sparkline
            data={growth.map((g) => g.height)}
            color="var(--color-secondary)"
          />
        </div>
        <LineChart
          data={growth.map((g) => g.height)}
          color="var(--color-secondary)"
          unit="cm"
        />
      </div>

      <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
        <p className="text-[15px] font-bold text-ink mb-1">Status Gizi</p>
        <p className="text-[12px] text-muted mb-4">
          Berdasarkan berat & tinggi terakhir
        </p>
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-secondary-soft flex items-center justify-center text-[24px]">
            🥇
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink">Gizi Baik</p>
            <p className="text-[12px] text-muted">
              Berada pada kurva pertumbuhan normal (WHO)
            </p>
          </div>
          <span className="ml-auto text-[12px] font-bold text-secondary-deep bg-secondary-soft rounded-full px-3 py-1">
            Normal
          </span>
        </div>
      </div>
    </div>
  )
}

export function HistoryScreen() {
  const { children, currentChildId, screenings, navigate, setCurrentChild } =
    useApp()
  const child = children.find((c) => c.id === currentChildId) ?? children[0]
  const [view, setView] = useState<"timeline" | "calendar" | "chart">(
    "timeline",
  )
  const childScreenings = filterByChild(screenings, child.id)

  return (
    <Screen>
      <TopBar title="Riwayat Kesehatan" />
      <div className="px-5 pb-32 space-y-4 lg:pb-10">
        {/* Child selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => setCurrentChild(c.id)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 transition-all cursor-pointer shrink-0 ${
                c.id === currentChildId
                  ? "bg-primary text-white"
                  : "bg-surface border border-line text-muted"
              }`}
            >
              <span>{c.emoji}</span>
              <span className="text-[13px] font-semibold">
                {c.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        <Segmented<"timeline" | "calendar" | "chart">
          options={[
            { value: "timeline", label: "Riwayat" },
            { value: "calendar", label: "Kalender" },
            { value: "chart", label: "Grafik" },
          ]}
          value={view}
          onChange={setView}
        />

        <div className="flex items-center justify-between">
          <p className="text-[14px] text-muted">
            {childScreenings.length} skrining · {child.name.split(" ")[0]}
          </p>
          <Button variant="soft" size="sm" onClick={() => navigate("symptoms")}>
            ＋ Skrining baru
          </Button>
        </div>

        {view === "timeline" && <Timeline screenings={childScreenings} />}
        {view === "calendar" && <CalendarView screenings={childScreenings} />}
        {view === "chart" && <GrowthCharts childId={child.id} />}
      </div>
    </Screen>
  )
}
