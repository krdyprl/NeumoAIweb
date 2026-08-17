import { useState } from "react"
import { useApp } from "../state/AppContext"
import { PATIENTS } from "../data/doctorMock"
import { useT } from "../i18n"
import { PageHeader, RiskBadge, EmptyState } from "../components/dashboard"
import { MelSpectrogram } from "../components/charts"
import { Button, Card, Avatar } from "../components/ui"
import type { Screening } from "../types"

export function DecisionsScreen() {
  const { decisionCases, decideCase, lang } = useApp()
  const t = useT()
  const [modal, setModal] = useState<{ s: Screening; action: "accept" | "reject" } | null>(null)
  const [reason, setReason] = useState("")
  const [reasonError, setReasonError] = useState(false)

  function confirm() {
    if (!modal) return
    if (!reason.trim()) {
      setReasonError(true)
      return
    }
    decideCase(modal.s.id, modal.action)
    setModal(null)
    setReason("")
    setReasonError(false)
  }

  function openModal(s: Screening, action: "accept" | "reject") {
    setModal({ s, action })
    setReason("")
    setReasonError(false)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.decisions")} subtitle={`${decisionCases.length} ${t("decision.pending_count")}`} />
      {decisionCases.length === 0 ? (
        <Card><EmptyState icon="✅" title={t("empty_no_pending")} desc={t("empty_no_pending_desc")} /></Card>
      ) : (
        <div className="space-y-4">
          {decisionCases.map((s) => {
            const patient = PATIENTS.find((p) => p.id === s.patientId)
            const name = patient?.name ?? s.patientName ?? s.patientId
            return (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar emoji={patient?.gender === "male" ? "👦" : "👧"} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-[15px] font-bold text-ink">{name}</p><RiskBadge level={s.riskLevel} /></div>
                    <p className="text-[13px] text-muted mt-0.5">{s.disease} · Confidence {s.confidence}% · {s.modelVersion}</p>
                    <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString(lang === "en" ? "en-US" : "id-ID")} · {s.audioDuration} {t("sec")} · {t("symptoms")}: {s.symptoms.join(", ")}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-[12px] text-muted">
                      <span>HR {s.vitals.heartRate} bpm</span>
                      <span>RR {s.vitals.respiratoryRate}</span>
                      <span>SpO₂ {s.vitals.spo2}%</span>
                      <span>{s.vitals.temperature.toFixed(1)}°C</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openModal(s, "accept")}>{t("btn.accept")}</Button>
                    <Button variant="outline" onClick={() => openModal(s, "reject")}>{t("btn.reject")}</Button>
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
            <p className="text-[14px] text-muted mb-4">{modal.action === "accept" ? t("modal.accept_desc") : t("modal.reject_desc")}</p>
            <div className="rounded-2xl bg-surface-2 p-3 mb-4">
              <p className="text-[12px] font-semibold text-muted mb-2">{t("decision.spectrogram")}</p>
              <MelSpectrogram grid={[[0.2, 0.4, 0.6, 0.5, 0.3, 0.5, 0.7, 0.6, 0.4, 0.6, 0.8, 0.5, 0.3, 0.4, 0.6, 0.5]]} />
            </div>
            <div className="mb-1.5">
              <label className="block mb-1.5 text-[13px] font-semibold text-ink">{t("decision.reason")} <span className="text-danger">*</span></label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => { setReason(e.target.value); setReasonError(false) }}
                placeholder={t("decision.reason_placeholder")}
                className={`w-full rounded-2xl border bg-surface p-3 text-[14px] text-ink outline-none focus:ring-4 focus:ring-primary/10 resize-none transition-all ${reasonError ? "border-danger" : "border-line focus:border-primary"}`}
              />
              {reasonError && <p className="text-[12px] text-danger mt-1">{t("decision.reason_required")}</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>{t("btn.cancel")}</Button>
              <Button variant={modal.action === "accept" ? "secondary" : "danger"} className="flex-1" onClick={confirm}>{t("btn.confirm")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
