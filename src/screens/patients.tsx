import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { PATIENTS, SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { useT } from "../i18n"
import { PageHeader, SearchBar, FilterChips, RiskBadge, EmptyState } from "../components/dashboard"
import { Card, Avatar, Icon, Sparkline } from "../components/ui"

export function PatientsScreen() {
  const navigate = useNavigate()
  const { lang } = useApp()
  const t = useT()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(() => t("filter.all"))

  const FILTERS = [t("filter.all"), t("filter.awaiting"), t("filter.low"), t("filter.medium"), t("filter.high")]

  useEffect(() => {
    setFilter(t("filter.all"))
  }, [lang])

  const rows = useMemo(() => {
    return PATIENTS.map((p) => ({ patient: p, latest: (SCREENINGS_BY_PATIENT[p.id] ?? [])[0] })).filter(({ patient, latest }) => {
      const q = query.toLowerCase()
      if (q && !patient.name.toLowerCase().includes(q) && !patient.nik.includes(q)) return false
      if (filter === t("filter.all")) return true
      if (filter === t("filter.awaiting")) return latest?.status === "awaiting"
      if (filter === t("filter.low")) return latest?.riskLevel === "low"
      if (filter === t("filter.medium")) return latest?.riskLevel === "medium"
      return latest?.riskLevel === "high"
    })
  }, [query, filter, t])

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.patients")} subtitle={`${PATIENTS.length} ${t("patients_subtitle")}`} />
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <SearchBar value={query} onChange={setQuery} placeholder={t("search_placeholder")} />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>
      {rows.length === 0 ? (
        <Card><EmptyState icon="🔍" title={t("empty.no_patients")} desc={t("empty.no_patients_desc")} /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">{t("table.name")}</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">{t("table.nik")}</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">{t("table.age_gender")}</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">{t("table.result")}</th>
                  <th className="px-5 py-3 font-semibold hidden xl:table-cell">{t("patients.risk_trend")}</th>
                  <th className="px-5 py-3 font-semibold">{t("table.risk")}</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">{t("table.date")}</th>
                  <th className="px-5 py-3 font-semibold">{t("table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ patient, latest }) => {
                  const birth = new Date(patient.birthDate)
                  const ageY = new Date().getFullYear() - birth.getFullYear()
                  const ageM = Math.max(0, new Date().getMonth() - birth.getMonth())
                  return (
                    <tr key={patient.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={38} /><span className="font-semibold text-ink">{patient.name}</span></div></td>
                      <td className="px-5 py-3 text-muted text-[13px] hidden md:table-cell">{patient.nik}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{ageY} {t("age_yr")} {ageM} {t("age_mo")} · {patient.gender === "male" ? t("sex_male") : t("sex_female")}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{latest ? `${latest.disease} · ${latest.confidence}%` : t("table.not_available")}</td>
                      <td className="px-5 py-3 hidden xl:table-cell">{latest && latest.trend.length > 0 ? <Sparkline data={latest.trend} positive={latest.trend[latest.trend.length - 1] >= latest.trend[0]} className="w-24 h-8" /> : <span className="text-[12px] text-faint">{t("table.not_available")}</span>}</td>
                      <td className="px-5 py-3">{latest ? <RiskBadge level={latest.riskLevel} /> : <span className="text-[12px] text-faint">{t("table.no_data")}</span>}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden sm:table-cell">{latest ? new Date(latest.date).toLocaleDateString("id-ID") : t("table.not_available")}</td>
                      <td className="px-5 py-3"><button onClick={() => navigate(`/patients/${patient.id}`)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer">{t("table.detail")} <Icon name="chevron" className="w-4 h-4" /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
