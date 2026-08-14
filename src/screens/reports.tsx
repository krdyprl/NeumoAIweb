import { useState } from "react"
import { REPORTS, MONTHLY_REPORTS, REGION_REPORTS } from "../data/doctorMock"
import { PageHeader, RiskBadge, StatCard } from "../components/dashboard"
import { BarChart } from "../components/charts"
import { Button, Card, Chip, Field } from "../components/ui"

export function ReportsScreen() {
  const [toast, setToast] = useState("")
  const total = REPORTS.reduce((s, r) => s + (r.riskLevel === "high" ? 1 : 0), 0)
  const avgConf = Math.round(REPORTS.reduce((s, r) => s + r.confidence, 0) / REPORTS.length)
  const referrals = REPORTS.filter((r) => r.status.includes("Rujuk") || r.status.includes("Menunggu")).length

  function fakeExport(kind: string) {
    setToast(`Ekspor ${kind} (demo) sedang diproses.`)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Laporan" subtitle="Rekap aktivitas skrining" actions={<><Button variant="outline" onClick={() => fakeExport("PDF")}>Ekspor PDF</Button><Button onClick={() => fakeExport("Excel")}>Ekspor Excel</Button></>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="chart" label="Total Skrining" value={REPORTS.length} tone="primary" />
        <StatCard icon="warning" label="Terindikasi Pneumonia" value={total} tone="danger" />
        <StatCard icon="user" label="Rata-rata Confidence" value={`${avgConf}%`} tone="secondary" />
        <StatCard icon="location" label="Rujukan / Menunggu" value={referrals} tone="accent" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining per Bulan</h2><BarChart data={MONTHLY_REPORTS.map((m) => ({ label: m.month, value: m.total }))} /></Card>
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining per Wilayah</h2><BarChart data={REGION_REPORTS.map((r) => ({ label: r.region, value: r.total }))} /></Card>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <Field label="Dari" value="2026-01-01" onChange={() => {}} />
        <Field label="Sampai" value="2026-08-31" onChange={() => {}} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Pasien</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Risiko</th>
                <th className="px-5 py-3 font-semibold">Confidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr key={r.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-ink">{r.patientName}</td>
                  <td className="px-5 py-3 text-muted text-[13px]">{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3"><RiskBadge level={r.riskLevel} /></td>
                  <td className="px-5 py-3 text-[13px] text-muted">{r.confidence}%</td>
                  <td className="px-5 py-3"><Chip tone={r.status.includes("Menunggu") ? "accent" : "secondary"}>{r.status}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-bg rounded-2xl px-5 py-3 text-[13px] font-semibold card-shadow anim-fade-up">{toast}</div>}
    </div>
  )
}
