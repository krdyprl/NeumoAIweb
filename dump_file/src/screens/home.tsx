import { Ring } from "../components/ui"
import { NotifBell, SyncStatus } from "../components/layout"
import { useApp } from "../state/AppContext"
import type { Child } from "../types"
import { MOCK_CENTERS } from "../data/mock"

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return "Selamat pagi"
  if (h < 15) return "Selamat siang"
  if (h < 19) return "Selamat sore"
  return "Selamat malam"
}

const riskTone = {
  low: {
    color: "var(--color-secondary)",
    label: "Rendah",
    soft: "bg-secondary-soft text-secondary-deep",
    desc: "Kesehatan pernapasan dalam kondisi baik. Lanjutkan pola sehat.",
  },
  medium: {
    color: "var(--color-accent)",
    label: "Sedang",
    soft: "bg-accent-soft text-accent-deep",
    desc: "Ada tanda pneumonia yang perlu diwaspadai. Pantau gejala lebih dekat.",
  },
  high: {
    color: "var(--color-danger)",
    label: "Tinggi",
    soft: "bg-danger-soft text-danger-deep",
    desc: "Segera bawa anak ke fasilitas kesehatan terdekat untuk pemeriksaan pneumonia.",
  },
} as const

function ChildSelector() {
  const { children, currentChildId, setCurrentChild, navigate } = useApp()
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
      {children.map((c) => {
        const active = c.id === currentChildId
        return (
          <button
            key={c.id}
            onClick={() => setCurrentChild(c.id)}
            className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition-all cursor-pointer shrink-0 ${
              active
                ? "bg-surface border-primary shadow-[0_4px_16px_rgba(29,122,252,0.2)]"
                : "bg-surface/60 border-line hover:border-primary/40"
            }`}
          >
            <span className="text-[22px]">{c.emoji}</span>
            <div className="text-left">
              <p className="text-[13px] font-bold text-ink leading-tight">
                {c.name.split(" ")[0]}
              </p>
              <p className="text-[11px] text-muted">
                {c.gender === "male" ? "Laki-laki" : "Perempuan"}
              </p>
            </div>
          </button>
        )
      })}
      <button
        onClick={() => navigate("child-form")}
        className="flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line px-4 text-[13px] font-semibold text-muted hover:text-primary hover:border-primary/50 transition-colors cursor-pointer shrink-0"
      >
        <span className="text-[18px]">＋</span> Tambah
      </button>
    </div>
  )
}

function QuickActions({ onScreening }: { onScreening: () => void }) {
  const { navigate } = useApp()
  const items = [
    {
      label: "Mulai Skrining",
      icon: "🩺",
      onClick: onScreening,
      primary: true,
    },
    {
      label: "Riwayat Kesehatan",
      icon: "📈",
      onClick: () => navigate("history"),
    },
    {
      label: "Edukasi Napas",
      icon: "📚",
      onClick: () => navigate("education"),
    },
    {
      label: "Faskes Terdekat",
      icon: "🏥",
      onClick: () => {
        document.getElementById("faskes")?.scrollIntoView({ behavior: "smooth" })
      },
    },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className={`rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
            item.primary
              ? "bg-gradient-to-br from-primary to-primary-deep text-white shadow-[0_10px_24px_rgba(29,122,252,0.35)]"
              : "bg-surface border border-line card-shadow hover:shadow-float"
          }`}
        >
          <span className="text-[26px] block mb-3">{item.icon}</span>
          <span
            className={`text-[13.5px] font-bold leading-snug ${
              item.primary ? "text-white" : "text-ink"
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function LatestRecommendation({ child }: { child: Child }) {
  const { navigate } = useApp()
  return (
    <button
      onClick={() => navigate("result", { screeningId: "s1" })}
      className="w-full text-left rounded-3xl p-5 bg-gradient-to-br from-[#0b1b33] to-[#13294d] text-white card-shadow transition-all hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
          Rekomendasi AI Terbaru
        </span>
      </div>
      <p className="text-[17px] font-bold mb-1.5">
        Rekomendasi dr. Rina untuk {child.name.split(" ")[0]}
      </p>
      <p className="text-[13.5px] text-white/75 leading-relaxed mb-4">
        Segera bawa ke puskesmas untuk pemeriksaan lanjutan. Jangan beri obat
        batuk sebelum diperiksa dokter.
      </p>
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-white">
        Lihat hasil lengkap
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}

export function HomeScreen() {
  const {
    profile,
    children,
    currentChildId,
    screenings,
    navigate,
    pendingSync,
  } = useApp()
  const child = children.find((c) => c.id === currentChildId) ?? children[0]
  const latest = screenings.find((s) => s.childId === child.id) ?? screenings[0]
  const risk = latest ? riskTone[latest.riskLevel] : riskTone.low

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-muted font-medium">
              {greeting()} 👋
            </p>
            <h1 className="text-[22px] font-extrabold text-ink tracking-tight truncate mt-0.5">
              {profile.name}
            </h1>
          </div>
          <SyncStatus />
          <NotifBell />
        </div>
      </header>

      <main className="px-5 py-4 space-y-5 pb-28 lg:pb-8">
        {/* Child selector */}
        <ChildSelector />

        {/* Health status */}
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[16px] font-bold text-ink">
                Status Kesehatan
              </h2>
              <p className="text-[12px] text-muted mt-0.5">
                {child.name.split(" ")[0]} · pemantauan terakhir hari ini
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-bold ${risk.soft}`}
            >
              Risiko {risk.label}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Ring
              value={latest?.confidence ?? 20}
              color={risk.color}
              label={`${latest?.confidence ?? 20}%`}
              sublabel="keyakinan AI"
              size={92}
            />
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink mb-1">
                {latest
                  ? latest.riskLevel === "low"
                    ? `Tidak terindikasi ${latest.disease}`
                    : `Terindikasi ${latest.disease}`
                  : "Belum ada skrining"}
              </p>
              <p className="text-[13px] text-muted leading-relaxed">
                {risk.desc}
              </p>
            </div>
          </div>
          {latest && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
              <div className="flex items-center gap-2 text-[12.5px] text-muted">
                <span>🕒</span>
                <span>
                  {new Date(latest.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-faint">·</span>
                <span>{latest.audioDuration} detik audio</span>
              </div>
              <span className="text-[12px] font-semibold text-primary">
                Terbaru
              </span>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <QuickActions onScreening={() => navigate("symptoms")} />

        {/* Latest AI recommendation */}
        <LatestRecommendation child={child} />

        {/* Health centers */}
        <section id="faskes">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-ink">
              Fasilitas Kesehatan Terdekat
            </h2>
            <button
              onClick={() => {
                document.getElementById("faskes")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-[13px] font-semibold text-primary cursor-pointer"
            >
              Lihat semua
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_CENTERS.map((hc) => (
              <div
                key={hc.id}
                className="rounded-2xl p-4 bg-surface border border-line card-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[24px]">{hc.open ? "🏥" : "🌙"}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      hc.open
                        ? "bg-secondary-soft text-secondary-deep"
                        : "bg-surface-2 text-faint"
                    }`}
                  >
                    {hc.open ? "Buka" : "Tutup"}
                  </span>
                </div>
                <p className="text-[14px] font-bold text-ink leading-snug mb-0.5">
                  {hc.name}
                </p>
                <p className="text-[12px] text-muted mb-2">{hc.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-faint font-medium">
                    ⭐ {hc.rating.toFixed(1)}
                  </span>
                  <span className="text-[12px] text-primary font-semibold">
                    {hc.distance} · Arah →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offline status */}
        {pendingSync > 0 && (
          <div className="rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 flex items-center gap-3">
            <span className="text-[20px]">🔄</span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-accent-deep">
                Menunggu sinkronisasi
              </p>
              <p className="text-[12px] text-accent-deep/70">
                {pendingSync} perubahan akan diunggah saat koneksi kembali.
              </p>
            </div>
            <span className="text-[12px] font-semibold text-accent-deep">
              Offline
            </span>
          </div>
        )}
      </main>
    </div>
  )
}
