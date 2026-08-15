import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PATIENTS, SCREENINGS_BY_PATIENT, AI_EXPLAIN } from "../data/doctorMock"
import { useT } from "../i18n"
import { RiskBadge, EmptyState } from "../components/dashboard"
import { MelSpectrogram, GradCam, ShapBars, WaveformPlayer } from "../components/charts"
import { Button, Card, Chip, Avatar, Icon, Segmented } from "../components/ui"

export function PatientDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const t = useT()
  const [tab, setTab] = useState<"history" | "ai" | "medical">("ai")

  const TABS: { value: "history" | "ai" | "medical"; label: string }[] = [
    { value: "history", label: t("tab.history") },
    { value: "ai", label: t("tab.ai") },
    { value: "medical", label: t("tab.medical") },
  ]

  const patient = PATIENTS.find((p) => p.id === id)
  if (!patient) {
    return <div className="p-6 max-w-[1280px] mx-auto"><EmptyState icon="🙁" title={t("empty.patient_not_found")} desc={t("empty.patient_not_found_desc")} /></div>
  }

  const screenings = SCREENINGS_BY_PATIENT[patient.id] ?? []
  const latest = screenings[0]
  const explain = AI_EXPLAIN[patient.id]
  const birth = new Date(patient.birthDate)
  const ageY = new Date().getFullYear() - birth.getFullYear()

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <button onClick={() => navigate("/patients")} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-primary mb-4 cursor-pointer">
        <Icon name="back" className="w-4 h-4" /> {t("back_to_patients")}
      </button>

      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={64} />
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-extrabold text-ink">{patient.name}</h1>
            <p className="text-[13px] text-muted">NIK {patient.nik} · {ageY} {t("age_years")}</p>
            <p className="text-[13px] text-muted">{patient.gender === "male" ? t("gender_male") : t("gender_female")} · {patient.facility}</p>
            <p className="text-[13px] text-muted">{patient.address} · {patient.phone}</p>
          </div>
          {latest && <div className="text-right"><RiskBadge level={latest.riskLevel} /><p className="text-[13px] text-muted mt-2">Confidence {latest.confidence}%</p></div>}
        </div>
      </Card>

      <div className="mb-6"><Segmented options={TABS} value={tab} onChange={setTab} /></div>

      {tab === "history" && (
        <div className="space-y-3">
          {screenings.length === 0 && <Card><EmptyState icon="📋" title={t("empty.no_screenings")} desc={t("empty.no_screenings_desc")} /></Card>}
          {screenings.map((s) => (
            <Card key={s.id} className="p-5 flex flex-wrap items-center gap-4">
              <RiskBadge level={s.riskLevel} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink">{s.disease} · {s.confidence}%</p>
                <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {s.audioDuration} {t("sec")} · {s.symptoms.join(", ")}</p>
              </div>
              <Chip tone={s.status === "done" ? "secondary" : "accent"}>{s.outcome ?? (s.status === "awaiting" ? t("status_awaiting") : s.status)}</Chip>
            </Card>
          ))}
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-6">
          <div className="p-4 bg-danger-soft border border-danger/20 rounded-2xl text-[13px] text-danger-deep font-medium">⚠️ {t("ai_disclaimer")}</div>
          {latest ? (
            <>
              <Card className="p-6">
                <h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_summary")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-[12px] text-muted">{t("ai_disease")}</p><p className="text-[15px] font-bold text-ink">{latest.disease}</p></div>
                  <div><p className="text-[12px] text-muted">{t("ai_confidence")}</p><p className="text-[15px] font-bold text-ink">{latest.confidence}%</p></div>
                  <div><p className="text-[12px] text-muted">{t("ai_risk")}</p><RiskBadge level={latest.riskLevel} /></div>
                  <div><p className="text-[12px] text-muted">{t("ai_symptoms")}</p><p className="text-[15px] font-bold text-ink">{latest.symptoms.join(", ")}</p></div>
                </div>
              </Card>
              {explain ? (
                <>
                  <Card className="p-6">
                    <h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_reasoning")}</h2>
                    <ul className="space-y-2">{explain.reasoning.map((r, i) => (<li key={i} className="flex gap-2 text-[14px] text-muted"><Icon name="check" className="w-4 h-4 text-secondary shrink-0" />{r}</li>))}</ul>
                  </Card>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_playback")}</h2><WaveformPlayer duration={latest.audioDuration} /></Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_mel")}</h2><MelSpectrogram grid={explain.melGrid} /><p className="text-[12px] text-muted mt-2">{t("ai_mel_desc")}</p></Card>
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_gradcam")}</h2><GradCam points={explain.gradCam} /><p className="text-[12px] text-muted mt-2">{t("ai_gradcam_desc")}</p></Card>
                  </div>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">{t("ai_shap")}</h2><ShapBars data={explain.shap} /></Card>
                </>
              ) : (
                <Card><EmptyState icon="📊" title={t("empty.no_ai")} desc={t("empty.no_ai_desc")} /></Card>
              )}
            </>
          ) : (
            <Card><EmptyState icon="📊" title={t("empty.no_ai_screening")} desc={t("empty.no_ai_screening_desc")} /></Card>
          )}
        </div>
      )}

      {tab === "medical" && (
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-ink mb-4">{t("medical_notes")}</h2>
          <div className="space-y-4">
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">{t("field_diagnosis")}</label><input defaultValue={latest ? `${latest.disease}` : ""} className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">{t("field_doctor_notes")}</label><textarea rows={4} defaultValue="Perlu pemeriksaan fisik dan penilaian klinis lebih lanjut." className="w-full rounded-2xl border border-line bg-surface p-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">{t("field_followup")}</label><input defaultValue="" placeholder={t("followup_placeholder")} className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <Button>{t("btn.save_medical")}</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
