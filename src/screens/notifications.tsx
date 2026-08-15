import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { NOTIFICATIONS, PATIENTS } from "../data/doctorMock"
import { useT } from "../i18n"
import { PageHeader, FilterChips, EmptyState } from "../components/dashboard"
import { Button, Card, Icon } from "../components/ui"
import type { AppNotification } from "../types"

export function NotificationsScreen() {
  const { lang } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const [items, setItems] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState(() => t("filter.all"))

  const FILTERS = [t("filter.all"), t("filter.ai"), t("filter.patient"), t("filter.system")]

  useEffect(() => {
    setFilter(t("filter.all"))
  }, [lang])

  const filtered = items.filter((n) => {
    if (filter === t("filter.all")) return true
    if (filter === t("filter.ai")) return n.type === "ai"
    if (filter === t("filter.patient")) return n.type === "patient"
    return n.type === "system"
  })
  const unread = items.filter((n) => !n.read).length

  const tones: Record<string, string> = {
    ai: "bg-primary-soft text-primary",
    patient: "bg-secondary-soft text-secondary-deep",
    system: "bg-accent-soft text-accent-deep",
  }

  function groupLabel(time: string): string {
    const lower = time.toLowerCase()
    if (lower.includes("menit") || lower.includes("jam") || lower.includes("minute") || lower.includes("hour")) return t("notif.today")
    if (lower.includes("kemarin") || lower.includes("yesterday")) return t("notif.yesterday")
    return t("notif.week")
  }

  const groups = filtered.reduce<Record<string, AppNotification[]>>((acc, n) => {
    const g = groupLabel(n.time)
    ;(acc[g] = acc[g] || []).push(n)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.notifications")} subtitle={`${unread} ${t("notifications_subtitle")}`} actions={<Button variant="outline" onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}>{t("btn.mark_all_read")}</Button>} />
      <div className="mb-5"><FilterChips options={FILTERS} value={filter} onChange={setFilter} /></div>
      {filtered.length === 0 ? (
        <Card><EmptyState icon="🔔" title={t("empty.no_notifications")} desc={t("empty.no_notifications_desc")} /></Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([group, list]) => (
            <div key={group}>
              <h2 className="text-[13px] font-bold text-muted uppercase tracking-wide mb-3 px-1">{group}</h2>
              <div className="space-y-3">
                {list.map((n) => {
                  const isAi = n.type === "ai"
                  return (
                    <Card key={n.id} className={`p-4 flex items-start gap-3 ${n.read ? "opacity-70" : ""}`}>
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tones[n.type]}`}><Icon name={n.type === "ai" ? "wave" : n.type === "patient" ? "user" : "refresh"} className="w-5 h-5" /></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-ink flex items-center gap-2">{n.title}{!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}</p>
                        <p className="text-[13px] text-muted">{n.body}</p>
                        <p className="text-[12px] text-faint mt-1">{n.time}</p>
                      </div>
                      {isAi && (
                        <button onClick={() => navigate(`/patients/${aiPatientId(n.body)}`)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer shrink-0">{t("notif.open")} <Icon name="chevron" className="w-4 h-4" /></button>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function aiPatientId(body: string): string {
  const byName: Record<string, string> = {}
  PATIENTS.forEach((p) => {
    byName[p.name.toLowerCase()] = p.id
  })
  for (const name of Object.keys(byName)) {
    if (body.toLowerCase().includes(name)) return byName[name]
  }
  return ""
}
