import { useState } from "react"
import { useApp } from "../state/AppContext"
import { PATIENTS } from "../data/doctorMock"
import { useT } from "../i18n"
import { PageHeader, RiskBadge, EmptyState } from "../components/dashboard"
import { Button, Card, Avatar } from "../components/ui"
import type { Screening } from "../types"

export function DecisionsScreen() {
  const { decisionCases, decideCase, lang } = useApp()
  const t = useT()
  const [modal, setModal] = useState<{ s: Screening; action: "accept" | "reject" } | null>(null)

  function confirm() {
    if (!modal) return
    decideCase(modal.s.id, modal.action)
    setModal(null)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.decisions")} subtitle={`${decisionCases.length} ${t("decisions_subtitle")}`} />
      {decisionCases.length === 0 ? (
        <Card><EmptyState icon="✅" title={t("empty.no_pending")} desc={t("empty.no_pending_desc")} /></Card>
      ) : (
        <div className="space-y-4">
          {decisionCases.map((s) => {
            const patient = PATIENTS.find((p) => p.id === s.patientId)
            return (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar emoji={patient?.gender === "male" ? "👦" : "👧"} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-[15px] font-bold text-ink">{patient?.name}</p><RiskBadge level={s.riskLevel} /></div>
                    <p className="text-[13px] text-muted mt-0.5">{s.disease} · Confidence {s.confidence}%</p>
                    <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString(lang === "en" ? "en-US" : "id-ID")} · {s.audioDuration} {t("sec")} · {t("symptoms")}: {s.symptoms.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setModal({ s, action: "accept" })}>{t("btn.accept")}</Button>
                    <Button variant="outline" onClick={() => setModal({ s, action: "reject" })}>{t("btn.reject")}</Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-surface border border-line rounded-3xl card-shadow p-6 max-w-md w-full anim-scale-in">
            <h3 className="text-[18px] font-bold text-ink mb-2">{modal.action === "accept" ? t("modal.accept_title") : t("modal.reject_title")}</h3>
            <p className="text-[14px] text-muted mb-6">{modal.action === "accept" ? t("modal.accept_desc") : t("modal.reject_desc")}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>{t("btn.cancel")}</Button>
              <Button variant={modal.action === "accept" ? "secondary" : "danger"} className="flex-1" onClick={confirm}>{t("btn.confirm")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
