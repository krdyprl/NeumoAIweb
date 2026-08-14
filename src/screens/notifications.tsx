import { useState } from "react"
import { NOTIFICATIONS } from "../data/doctorMock"
import { PageHeader, FilterChips, EmptyState } from "../components/dashboard"
import { Button, Card, Icon } from "../components/ui"

const FILTERS = ["Semua", "AI", "Pasien", "Sistem"]

export function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState("Semua")

  const filtered = items.filter((n) => {
    if (filter === "Semua") return true
    if (filter === "AI") return n.type === "ai"
    if (filter === "Pasien") return n.type === "patient"
    return n.type === "system"
  })
  const unread = items.filter((n) => !n.read).length

  const tones: Record<string, string> = {
    ai: "bg-primary-soft text-primary",
    patient: "bg-secondary-soft text-secondary-deep",
    system: "bg-accent-soft text-accent-deep",
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Notifikasi" subtitle={`${unread} belum dibaca`} actions={<Button variant="outline" onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}>Tandai semua dibaca</Button>} />
      <div className="mb-5"><FilterChips options={FILTERS} value={filter} onChange={setFilter} /></div>
      {filtered.length === 0 ? (
        <Card><EmptyState icon="🔔" title="Tidak ada notifikasi" desc="Tidak ada notifikasi pada filter ini." /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card key={n.id} className={`p-4 flex items-start gap-3 ${n.read ? "opacity-70" : ""}`}>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tones[n.type]}`}><Icon name={n.type === "ai" ? "wave" : n.type === "patient" ? "user" : "refresh"} className="w-5 h-5" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink flex items-center gap-2">{n.title}{!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}</p>
                <p className="text-[13px] text-muted">{n.body}</p>
                <p className="text-[12px] text-faint mt-1">{n.time}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
