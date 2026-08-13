import { useState } from "react"
import { Button, Chip, ProgressBar, Ring } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import { GradCAM, SHAPChart, Spectrogram } from "../components/charts"
import type { Disease, RiskLevel } from "../types"

interface ResultModel {
  riskLevel: RiskLevel
  disease: Disease
  confidence: number
  diseasePct: Record<string, number>
  shap: { label: string; value: number }[]
  recs: { color: string; text: string }[]
  doctor: string
  meaning: string
}

const RESULT_BY_CHILD: Record<string, ResultModel> = {
  c1: {
    riskLevel: "high",
    disease: "Pneumonia",
    confidence: 87,
    diseasePct: { Pneumonia: 87, "Non-Pneumonia": 13 },
    shap: [
      { label: "Durasi batuk panjang", value: 0.42 },
      { label: "Pola napas cepat", value: 0.31 },
      { label: "Kualitas frekuensi batuk", value: 0.18 },
      { label: "Kehadiran demam", value: 0.11 },
    ],
    recs: [
      {
        color: "#ef4444",
        text: "Bawa ke puskesmas hari ini — jangan tunggu gejala memburuk",
      },
      {
        color: "#3ecf8e",
        text: "Perbanyak minum air putih hangat, minimal 6 gelas sehari",
      },
      {
        color: "#1d7afc",
        text: "Belum perlu beri obat batuk sebelum diperiksa dokter",
      },
    ],
    doctor:
      "Hasil skrining menunjukkan indikasi pneumonia. Saya sarankan Arya segera diperiksa langsung agar kami bisa konfirmasi dan berikan penanganan yang tepat.",
    meaning:
      "Batuk Arya menunjukkan tanda-tanda yang perlu diperiksa dokter. Terdapat potensi gejala pneumonia yang memerlukan pemeriksaan lanjutan.",
  },
  c2: {
    riskLevel: "low",
    disease: "Pneumonia",
    confidence: 22,
    diseasePct: { Pneumonia: 22, "Non-Pneumonia": 78 },
    shap: [
      { label: "Durasi batuk pendek", value: 0.2 },
      { label: "Kehadiran pilek", value: 0.15 },
      { label: "Tidak ada pola napas cepat", value: -0.11 },
      { label: "Kualitas suara batuk", value: 0.08 },
    ],
    recs: [
      {
        color: "#3ecf8e",
        text: "Lanjutkan pemberian ASI/MPASI dan cairan hangat",
      },
      { color: "#1d7afc", text: "Pantau suhu tubuh setiap 4 jam" },
      {
        color: "#64748b",
        text: "Hubungi layanan kesehatan jika gejala pneumonia menetap > 5 hari",
      },
    ],
    doctor:
      "Hasil skrining menunjukkan indikasi pneumonia yang rendah. Tidak perlu panik, namun tetap pantau kondisi Anya dan jaga asupan cairan.",
    meaning:
      "Batuk Anya masih dalam kategori ringan. Pola suara tidak menunjukkan tanda bahaya pneumonia, namun tetap pantau perkembangannya.",
  },
}

const RISK_META: Record<RiskLevel, {
  label: string
  color: string
  soft: string
  emoji: string
}> = {
  low: {
    label: "Risiko Rendah",
    color: "var(--color-secondary)",
    soft: "bg-secondary-soft text-secondary-deep",
    emoji: "😊",
  },
  medium: {
    label: "Risiko Sedang",
    color: "var(--color-accent)",
    soft: "bg-accent-soft text-accent-deep",
    emoji: "😟",
  },
  high: {
    label: "Risiko Tinggi",
    color: "var(--color-danger)",
    soft: "bg-danger-soft text-danger-deep",
    emoji: "🚨",
  },
}

export function ResultScreen() {
  const { params, children, currentChildId } = useApp()
  const child = children.find((c) => c.id === currentChildId) ?? children[0]
  const model =
    params.screeningId === "s1"
      ? RESULT_BY_CHILD.c1
      : (RESULT_BY_CHILD[child.id] ?? RESULT_BY_CHILD.c1)
  const risk = RISK_META[model.riskLevel]
  const [aiTab, setAiTab] = useState<"spectro" | "gradcam" | "shap">("spectro")
  const [toast, setToast] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <Screen>
      <TopBar title="Hasil Skrining" />
      <div className="px-5 pb-12 space-y-5">
        {/* Hero */}
        <div className="rounded-[28px] p-6 relative overflow-hidden bg-gradient-to-br from-[#0b1b33] to-[#16305c] text-white card-shadow">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Hasil Analisis AI
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[12px] font-bold ${risk.soft}`}
              >
                {risk.emoji} {risk.label}
              </span>
            </div>
            <h2 className="text-[26px] font-extrabold leading-tight mb-1.5">
              {model.riskLevel === "low" ? "Indikasi" : "Terindikasi"}{" "}
              <span className={model.riskLevel === "low" ? "text-[#6ee7b7]" : "text-[#ff9b6b]"}>
                {model.disease}
              </span>
            </h2>
            <p className="text-[13px] text-white/60 mb-5">
              Analisis suara batuk {child.name} ·{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
              })}
            </p>
            <div className="flex items-center gap-5">
              <Ring
                value={model.confidence}
                color="var(--color-accent)"
                label={`${model.confidence}%`}
                sublabel="keyakinan AI"
                size={96}
              />
              <div className="flex-1 space-y-2">
                {Object.entries(model.diseasePct)
                  .slice(0, 3)
                  .map(([d, p]) => (
                    <div key={d}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-white/70 font-medium">{d}</span>
                        <span className="font-bold text-white/90">{p}%</span>
                      </div>
                      <ProgressBar
                        value={p}
                        color={
                          d === model.disease
                            ? "var(--color-accent)"
                            : "rgba(255,255,255,0.2)"
                        }
                        className="h-1.5"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency warning */}
        {model.riskLevel === "high" && (
          <div className="rounded-2xl border-2 border-danger/30 bg-danger-soft p-4 flex items-start gap-3 anim-scale-in">
            <span className="text-[24px] shrink-0">🚨</span>
            <div>
              <p className="text-[14px] font-extrabold text-danger-deep mb-0.5">
                Butuh Penanganan Segera
              </p>
              <p className="text-[12.5px] text-danger-deep/80 leading-relaxed">
                Hasil ini menunjukkan risiko tinggi. Kunjungi fasilitas
                kesehatan atau IGD terdekat segera.
              </p>
            </div>
          </div>
        )}

        {/* Apa artinya */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-2.5">
            Apa artinya untuk si kecil?
          </h2>
          <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
            <p className="text-[14px] text-muted leading-relaxed">
              {model.meaning}
            </p>
          </div>
        </section>

        {/* Explainable AI */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[16px] font-bold text-ink">Penjelasan AI</h2>
            <Chip tone="primary">Transparan</Chip>
          </div>
          <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
            <div className="flex rounded-xl bg-surface-2 p-1 mb-4 gap-1">
              {[
                { key: "spectro" as const, label: "Spektrogram" },
                { key: "gradcam" as const, label: "Grad-CAM" },
                { key: "shap" as const, label: "SHAP" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setAiTab(t.key)}
                  className={`flex-1 h-8 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                    aiTab === t.key
                      ? "bg-surface text-primary shadow-card"
                      : "text-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {aiTab === "spectro" && (
              <div className="anim-fade-in">
                <Spectrogram className="mb-3" />
                <p className="text-[12px] text-muted leading-relaxed">
                  Area dengan warna{" "}
                  <span className="text-danger font-semibold">
                    merah-oranye
                  </span>{" "}
                  menunjukkan bagian spektrum suara yang paling memengaruhi
                  prediksi model.
                </p>
              </div>
            )}
            {aiTab === "gradcam" && (
              <div className="anim-fade-in">
                <div className="rounded-2xl bg-surface-2 p-3 mb-3">
                  <div className="flex gap-1 mb-2">
                    <span className="w-12 h-12 rounded-lg bg-primary/20" />
                    <span className="w-12 h-12 rounded-lg bg-primary/20" />
                    <span className="w-12 h-12 rounded-lg bg-primary/20" />
                    <span className="w-12 h-12 rounded-lg bg-primary/20" />
                  </div>
                  <GradCAM />
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Peta panas menunjukkan{" "}
                  <span className="text-danger font-semibold">fokus model</span>{" "}
                  pada segmen sinyal yang mengandung pola batuk khas.
                </p>
              </div>
            )}
            {aiTab === "shap" && (
              <div className="anim-fade-in">
                <SHAPChart data={model.shap} className="mb-3" />
                <p className="text-[12px] text-muted leading-relaxed">
                  Kontribusi tiap fitur terhadap keputusan AI. Nilai positif
                  memperkuat diagnosis {model.disease}.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Doctor recommendation */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-2.5">
            Rekomendasi Dokter
          </h2>
          <div className="rounded-3xl p-5 bg-[#d9e9ff] dark:bg-[rgba(29,122,252,0.12)] border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[16px]">
                R
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#0a4d9d] dark:text-[#9cc4ff]">
                  dr. Rina Susanti
                </p>
                <p className="text-[12px] text-[#0a4d9d]/70 dark:text-[#9cc4ff]/70">
                  Puskesmas Kedungkandang
                </p>
              </div>
              <Chip tone="primary" className="ml-auto">
                Saran AI
              </Chip>
            </div>
            <p className="text-[13.5px] text-[#0a4d9d] dark:text-[#bcd6ff] leading-relaxed">
              “{model.doctor}”
            </p>
          </div>
        </section>

        {/* Action recommendation */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">
            Yang perlu Anda lakukan
          </h2>
          <div className="rounded-3xl p-5 bg-surface border border-line card-shadow space-y-4">
            {model.recs.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full mt-[7px] shrink-0"
                  style={{ background: r.color }}
                />
                <p className="text-[14px] text-ink font-medium leading-relaxed">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => notify("Laporan PDF berhasil disimpan 📄")}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path
                d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Simpan PDF
          </Button>
          <Button
            variant="soft"
            size="lg"
            onClick={() => notify("Hasil berhasil dibagikan 🔗")}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path
                d="M14 5l7 7-7 7M3 12h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Bagikan
          </Button>
        </div>

        <p className="text-center text-[12px] text-faint leading-relaxed pb-4">
          Hasil skrining AI bukan pengganti diagnosis medis profesional.
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 anim-scale-in">
          <div className="glass rounded-2xl px-5 py-3 card-shadow flex items-center gap-2">
            <span className="text-[16px]">✅</span>
            <span className="text-[13px] font-semibold text-ink">{toast}</span>
          </div>
        </div>
      )}
    </Screen>
  )
}
