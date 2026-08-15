import { useState } from "react"
import { REPORTS, MONTHLY_REPORTS, REGION_REPORTS } from "../data/doctorMock"
import { useT } from "../i18n"
import { PageHeader, RiskBadge, StatCard } from "../components/dashboard"
import { BarChart } from "../components/charts"
import { Button, Card, Chip, Field } from "../components/ui"
import { downloadCsv } from "../utils/format"

export function ReportsScreen() {
  const t = useT()
  const [toast, setToast] = useState("")
  const total = REPORTS.reduce((s, r) => s + (r.riskLevel === "high" ? 1 : 0), 0)
  const avgConf = Math.round(REPORTS.reduce((s, r) => s + r.confidence, 0) / REPORTS.length)
  const referrals = REPORTS.filter((r) => r.status.includes("Rujuk") || r.status.includes("Menunggu")).length

  function fakeExport(kind: string) {
    setToast(t("toast_export").replace("{kind}", kind))
    setTimeout(() => setToast(""), 3000)
  }

  function exportCsv() {
    downloadCsv("neumoai-laporan.csv", [
      [t("table.patient"), t("table.date"), t("table.risk"), t("table.confidence"), t("table.model_version"), t("table.reviewer"), t("table.status")],
      ...REPORTS.map((r) => [r.patientName, r.date, r.riskLevel, `${r.confidence}%`, r.modelVersion, r.reviewer, r.status]),
    ])
    setToast("CSV " + t("toast_export").replace("{kind}", "").trim())
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.reports")} subtitle={t("reports_subtitle")} actions={<><Button variant="outline" onClick={() => fakeExport("PDF")}>{t("btn.export_pdf")}</Button><Button variant="outline" onClick={() => fakeExport("Excel")}>{t("btn.export_excel")}</Button><Button onClick={exportCsv}>{t("reports.export_csv")}</Button></>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="chart" label={t("kpi.total_screenings")} value={REPORTS.length} tone="primary" />
        <StatCard icon="warning" label={t("kpi.pneumonia_flagged")} value={total} tone="danger" />
        <StatCard icon="user" label={t("kpi.avg_confidence")} value={`${avgConf}%`} tone="secondary" />
        <StatCard icon="location" label={t("kpi.referrals")} value={referrals} tone="accent" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("chart.screenings_monthly")}</h2><BarChart data={MONTHLY_REPORTS.map((m) => ({ label: m.month, value: m.total }))} /></Card>
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("reports.drilldown")}</h2><BarChart data={REGION_REPORTS.map((r) => ({ label: r.region, value: r.total }))} /></Card>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <Field label={t("field_from")} value="2026-01-01" onChange={() => {}} />
        <Field label={t("field_to")} value="2026-08-31" onChange={() => {}} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">{t("table.patient")}</th>
                <th className="px-5 py-3 font-semibold">{t("table.date")}</th>
                <th className="px-5 py-3 font-semibold">{t("table.risk")}</th>
                <th className="px-5 py-3 font-semibold">{t("ai_confidence")}</th>
                <th className="px-5 py-3 font-semibold">{t("table.model_version")}</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">{t("table.reviewer")}</th>
                <th className="px-5 py-3 font-semibold">{t("table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr key={r.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-ink">{r.patientName}</td>
                  <td className="px-5 py-3 text-muted text-[13px]">{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3"><RiskBadge level={r.riskLevel} /></td>
                  <td className="px-5 py-3 text-[13px] text-muted">{r.confidence}%</td>
                  <td className="px-5 py-3 text-[13px] text-muted">{r.modelVersion}</td>
                  <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{r.reviewer}</td>
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
