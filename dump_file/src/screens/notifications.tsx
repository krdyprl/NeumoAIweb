import { useState } from "react"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import type { AppNotification } from "../types"

const TYPE_META: Record<AppNotification["type"], {
  emoji: string
  soft: string
}> = {
  vaccination: { emoji: "💉", soft: "bg-primary-soft" },
  reminder: { emoji: "⏰", soft: "bg-accent-soft" },
  ai: { emoji: "🤖", soft: "bg-secondary-soft" },
  medical: { emoji: "🩺", soft: "bg-danger-soft" },
}

export function NotificationsScreen() {
  const { notifications, navigate, markNotificationRead } = useApp()
  const [filter, setFilter] = useState<"all" | AppNotification["type"]>("all")
  const unread = notifications.filter((n) => !n.read).length
  const list =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter)

  const filters: { key: "all" | AppNotification["type"]; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "ai", label: "AI" },
    { key: "medical", label: "Medis" },
    { key: "vaccination", label: "Vaksin" },
    { key: "reminder", label: "Pengingat" },
  ]

  return (
    <Screen>
      <TopBar
        title="Notifikasi"
        right={
          unread > 0 ? (
            <span className="text-[12px] font-bold text-primary bg-primary-soft rounded-full px-3 py-1">
              {unread} baru
            </span>
          ) : undefined
        }
      />
      <div className="px-5 pb-32 space-y-4 lg:pb-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-surface border border-line text-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {list.map((n) => {
            const meta = TYPE_META[n.type]
            return (
              <button
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id)
                  if (n.type === "ai" || n.type === "medical")
                    navigate("result", { screeningId: "s1" })
                }}
                className={`w-full text-left rounded-3xl p-4 flex gap-3.5 transition-all cursor-pointer hover:-translate-y-0.5 ${
                  n.read
                    ? "bg-surface/70 border border-line"
                    : "bg-surface border border-primary/25 card-shadow"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${meta.soft} flex items-center justify-center text-[22px] shrink-0`}
                >
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-[14.5px] leading-snug ${
                        n.read
                          ? "text-muted font-semibold"
                          : "text-ink font-bold"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-[13px] mt-1 leading-relaxed ${
                      n.read ? "text-faint" : "text-muted"
                    }`}
                  >
                    {n.body}
                  </p>
                  <p className="text-[11px] text-faint mt-1.5">{n.time}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
