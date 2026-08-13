import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { SCREENINGS_BY_PATIENT, PATIENTS, NOTIFICATIONS, WEEKLY_SCREENINGS, RISK_DISTRIBUTION } from "../data/doctorMock"
import { StatCard, PageHeader, RiskBadge } from "../components/dashboard"
import { AreaChart, DonutChart } from "../components/charts"
import { Button, Card, Icon } from "../components/ui"

export function DashboardScreen() {
  const { doctor, pendingCases } = useApp()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam"
  const totalPatients = PATIENTS.length
  const todayScreening = SCREENINGS_BY_PATIENT.p1.length + SCREENINGS_BY_PATIENT.p3.length + SCREENINGS_BY_PATIENT.p5.length
  const highRisk = Object.values(SCREENINGS_BY_PATIENT).flat().filter((s) => s.riskLevel === "high" && s.status === "awaiting").length

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={`${greet}, ${doctor.name}`} subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="user" label="Total Pasien Terdaftar" value={totalPatients} sub="+2 minggu ini" tone="primary" />
        <StatCard icon="chart" label="Skrining Hari Ini" value={todayScreening} sub="3 menunggu" tone="secondary" />
        <StatCard icon="warning" label="Terindikasi Pneumonia" value={highRisk} sub="risiko tinggi" tone="danger" />
        <StatCard icon="clock" label="Menunggu Keputusan" value={pendingCases} sub="perlu tinjauan" tone="accent" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining — 30 Hari Terakhir</h2><AreaChart data={WEEKLY_SCREENINGS} /></Card>
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Tingkat Risiko</h2><DonutChart data={RISK_DISTRIBUTION} /></Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-ink">Kasus Menunggu Keputusan</h2>
              <button onClick={() => navigate("/decisions")} className="text-[13px] font-semibold text-primary hover:underline cursor-pointer">Lihat semua</button>
            </div>
            <div className="space-y-3">
              {Object.entries(SCREENINGS_BY_PATIENT).flatMap(([pid, list]) => list.filter((s) => s.status === "awaiting").map((s) => ({ ...s, patient: PATIENTS.find((p) => p.id === pid) }))).slice(0, 3).map((s) => (
                <button key={s.id} onClick={() => navigate(`/patients/${s.patient?.id}`)} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-surface-2 hover:bg-primary-soft transition-colors cursor-pointer">
                  <RiskBadge level={s.riskLevel} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold text-ink truncate">{s.patient?.name}</span>
                    <span className="block text-[12px] text-muted truncate">{s.disease} · {s.confidence}%</span>
                  </span>
                  <Icon name="chevron" className="w-4 h-4 text-faint" />
                </button>
              ))}
              {highRisk === 0 && <p className="text-[13px] text-muted text-center py-2">Tidak ada kasus menunggu.</p>}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">Notifikasi Terbaru</h2>
            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-line" : "bg-primary"}`} />
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{n.title}</p>
                    <p className="text-[12px] text-muted line-clamp-2">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-primary to-primary-deep border-transparent">
            <h2 className="text-[16px] font-bold text-white mb-1">Buka Daftar Pasien</h2>
            <p className="text-[13px] text-white/80 mb-4">Tinjau dan kelola hasil skrining pasien.</p>
            <Button variant="secondary" onClick={() => navigate("/patients")} className="w-full">Daftar Pasien</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
