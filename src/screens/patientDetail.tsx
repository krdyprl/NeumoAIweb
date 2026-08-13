import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PATIENTS, SCREENINGS_BY_PATIENT, AI_EXPLAIN } from "../data/doctorMock"
import { RiskBadge, EmptyState } from "../components/dashboard"
import { MelSpectrogram, GradCam, ShapBars, WaveformPlayer } from "../components/charts"
import { Button, Card, Chip, Avatar, Icon, Segmented } from "../components/ui"

const TABS: { value: "history" | "ai" | "medical"; label: string }[] = [
  { value: "history", label: "Riwayat" },
  { value: "ai", label: "Skrining AI" },
  { value: "medical", label: "Rekam Medis" },
]

export function PatientDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<"history" | "ai" | "medical">("ai")

  const patient = PATIENTS.find((p) => p.id === id)
  if (!patient) {
    return <div className="p-6 max-w-[1280px] mx-auto"><EmptyState icon="🙁" title="Pasien tidak ditemukan" desc="Pasien dengan ID tersebut tidak tersedia." /></div>
  }

  const screenings = SCREENINGS_BY_PATIENT[patient.id] ?? []
  const latest = screenings[0]
  const explain = AI_EXPLAIN[patient.id]
  const birth = new Date(patient.birthDate)
  const ageY = new Date().getFullYear() - birth.getFullYear()

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <button onClick={() => navigate("/patients")} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-primary mb-4 cursor-pointer">
        <Icon name="back" className="w-4 h-4" /> Kembali ke Daftar Pasien
      </button>

      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={64} />
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-extrabold text-ink">{patient.name}</h1>
            <p className="text-[13px] text-muted">NIK {patient.nik} · {ageY} tahun</p>
            <p className="text-[13px] text-muted">{patient.gender === "male" ? "Laki-laki" : "Perempuan"} · {patient.facility}</p>
            <p className="text-[13px] text-muted">{patient.address} · {patient.phone}</p>
          </div>
          {latest && <div className="text-right"><RiskBadge level={latest.riskLevel} /><p className="text-[13px] text-muted mt-2">Confidence {latest.confidence}%</p></div>}
        </div>
      </Card>

      <div className="mb-6"><Segmented options={TABS} value={tab} onChange={setTab} /></div>

      {tab === "history" && (
        <div className="space-y-3">
          {screenings.length === 0 && <Card><EmptyState icon="📋" title="Belum ada skrining" desc="Belum ada riwayat skrining untuk pasien ini." /></Card>}
          {screenings.map((s) => (
            <Card key={s.id} className="p-5 flex flex-wrap items-center gap-4">
              <RiskBadge level={s.riskLevel} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink">{s.disease} · {s.confidence}%</p>
                <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {s.audioDuration} dtk · {s.symptoms.join(", ")}</p>
              </div>
              <Chip tone={s.status === "done" ? "secondary" : "accent"}>{s.outcome ?? (s.status === "awaiting" ? "Menunggu" : s.status)}</Chip>
            </Card>
          ))}
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-6">
          <div className="p-4 bg-danger-soft border border-danger/20 rounded-2xl text-[13px] text-danger-deep font-medium">⚠️ Hasil AI adalah alat bantu skrining. Keputusan klinis tetap sepenuhnya pada dokter.</div>
          {latest ? (
            <>
              <Card className="p-6">
                <h2 className="text-[16px] font-bold text-ink mb-4">Ringkasan Prediksi</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-[12px] text-muted">Penyakit</p><p className="text-[15px] font-bold text-ink">{latest.disease}</p></div>
                  <div><p className="text-[12px] text-muted">Confidence</p><p className="text-[15px] font-bold text-ink">{latest.confidence}%</p></div>
                  <div><p className="text-[12px] text-muted">Risiko</p><RiskBadge level={latest.riskLevel} /></div>
                  <div><p className="text-[12px] text-muted">Gejala</p><p className="text-[15px] font-bold text-ink">{latest.symptoms.join(", ")}</p></div>
                </div>
              </Card>
              {explain ? (
                <>
                  <Card className="p-6">
                    <h2 className="text-[16px] font-bold text-ink mb-4">Alasan Prediksi (AI Reasoning)</h2>
                    <ul className="space-y-2">{explain.reasoning.map((r, i) => (<li key={i} className="flex gap-2 text-[14px] text-muted"><Icon name="check" className="w-4 h-4 text-secondary shrink-0" />{r}</li>))}</ul>
                  </Card>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Pemutaran Suara Napas</h2><WaveformPlayer duration={latest.audioDuration} /></Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Mel-Spektrogram</h2><MelSpectrogram grid={explain.melGrid} /><p className="text-[12px] text-muted mt-2">Representasi frekuensi-waktu dari sinyal suara napas.</p></Card>
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Grad-CAM</h2><GradCam points={explain.gradCam} /><p className="text-[12px] text-muted mt-2">Area yang paling berpengaruh terhadap prediksi (merah = tinggi).</p></Card>
                  </div>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Kontribusi Fitur (SHAP)</h2><ShapBars data={explain.shap} /></Card>
                </>
              ) : (
                <Card><EmptyState icon="📊" title="Belum ada analisis AI" desc="Analisis Grad-CAM, spektrogram, dan SHAP belum tersedia untuk skrining ini." /></Card>
              )}
            </>
          ) : (
            <Card><EmptyState icon="📊" title="Belum ada skrining" desc="Belum ada hasil skrining AI untuk pasien ini." /></Card>
          )}
        </div>
      )}

      {tab === "medical" && (
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-ink mb-4">Catatan & Rekam Medis</h2>
          <div className="space-y-4">
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Diagnosis</label><input defaultValue={latest ? `${latest.disease}` : ""} className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Catatan Dokter</label><textarea rows={4} defaultValue="Perlu pemeriksaan fisik dan penilaian klinis lebih lanjut." className="w-full rounded-2xl border border-line bg-surface p-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Tindak Lanjut / Rujukan</label><input defaultValue="" placeholder="Rujuk ke rumah sakit / tindak lanjut mandiri" className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <Button>Simpan Rekam Medis</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
