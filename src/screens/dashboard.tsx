import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { PATIENTS, SCREENINGS_BY_PATIENT, NOTIFICATIONS, WEEKLY_SCREENINGS, RISK_DISTRIBUTION } from "../data/doctorMock"
import { useT } from "../i18n"
import { StatCard, PageHeader, RiskBadge } from "../components/dashboard"
import { AreaChart, DonutChart } from "../components/charts"
import { Button, Card, Icon } from "../components/ui"

export function DashboardScreen() {
  const { doctor, decisionCases, pendingCases, lang } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 11 ? t("greet_morning") : hour < 15 ? t("greet_afternoon") : hour < 18 ? t("greet_evening") : t("greet_night")
  const totalPatients = PATIENTS.length
  const todayScreening = SCREENINGS_BY_PATIENT.p1.length + SCREENINGS_BY_PATIENT.p3.length + SCREENINGS_BY_PATIENT.p5.length
  const highRisk = decisionCases.filter((s) => s.riskLevel === "high").length
  const pendingList = decisionCases.slice(0, 3)

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={`${greet}, ${doctor.name}`} subtitle={new Date().toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="user" label={t("kpi.total_patients")} value={totalPatients} sub={t("kpi.sub_this_week")} tone="primary" />
        <StatCard icon="chart" label={t("kpi.screenings_today")} value={todayScreening} sub={t("kpi.sub_awaiting")} tone="secondary" />
        <StatCard icon="warning" label={t("kpi.pneumonia_flagged")} value={highRisk} sub={t("kpi.sub_high_risk")} tone="danger" />
        <StatCard icon="clock" label={t("kpi.pending_decisions")} value={pendingCases} sub={t("kpi.sub_review")} tone="accent" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("chart.screenings")}</h2><AreaChart data={WEEKLY_SCREENINGS} /></Card>
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("chart.risk_level")}</h2><DonutChart data={RISK_DISTRIBUTION} /></Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-ink">{t("panel.pending_list")}</h2>
              <button onClick={() => navigate("/decisions")} className="text-[13px] font-semibold text-primary hover:underline cursor-pointer">{t("view_all")}</button>
            </div>
            <div className="space-y-3">
              {pendingList.map((s) => {
                const patient = PATIENTS.find((p) => p.id === s.patientId)
                return (
                  <button key={s.id} onClick={() => navigate(`/patients/${patient?.id}`)} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-surface-2 hover:bg-primary-soft transition-colors cursor-pointer">
                    <RiskBadge level={s.riskLevel} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-bold text-ink truncate">{patient?.name}</span>
                      <span className="block text-[12px] text-muted truncate">{s.disease} · {s.confidence}%</span>
                    </span>
                    <Icon name="chevron" className="w-4 h-4 text-faint" />
                  </button>
                )
              })}
              {decisionCases.length === 0 && <p className="text-[13px] text-muted text-center py-2">{t("empty_no_pending_cases")}</p>}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("panel.latest_notifications")}</h2>
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
            <h2 className="text-[16px] font-bold text-white mb-1">{t("panel.open_patients")}</h2>
            <p className="text-[13px] text-white/80 mb-4">{t("panel.open_patients_desc")}</p>
            <Button variant="secondary" onClick={() => navigate("/patients")} className="w-full">{t("btn.patient_list")}</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
