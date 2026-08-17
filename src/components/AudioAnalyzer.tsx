import { useEffect, useMemo, useState } from "react"
import { Button, Card, Chip } from "./ui"
import { useT } from "../i18n"
import { generateExplain } from "../lib/explain"
import { MelSpectrogram, GradCam, ShapBars, WaveformPlayer } from "./charts"
import type { AiExplain } from "../types"

export function AudioAnalyzer({
  patientId,
  onAnalyzed,
}: {
  patientId: string
  onAnalyzed?: (explain: AiExplain) => void
}) {
  const t = useT()
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [explain, setExplain] = useState<AiExplain | null>(null)
  const [modelActive, setModelActive] = useState(false)
  const [error, setError] = useState("")

  const audioPreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    }
  }, [audioPreviewUrl])

  async function analyze() {
    if (!file) return
    setError("")
    setProcessing(true)
    try {
      const result = await generateExplain(patientId, file, 70)
      setExplain(result.explain)
      setModelActive(result.modelActive)
      onAnalyzed?.(result.explain)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memproses audio.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-[16px] font-bold text-ink mb-1">Analisis Audio Baru</h2>
      <p className="text-[13px] text-muted mb-4">Unggah rekaman napas untuk menghitung Grad-CAM di browser.</p>

      <label className="block cursor-pointer">
        <span className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl border border-dashed border-line bg-surface-2 text-[14px] font-semibold text-muted hover:border-primary hover:text-primary transition-colors">
          📁 {file ? file.name : "Pilih file audio (wav/mp3)"}
        </span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {error && <p className="mt-3 text-[13px] font-semibold text-danger bg-danger-soft rounded-xl px-4 py-3">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={analyze} disabled={!file || processing} size="sm">
          {processing ? "Memproses…" : "Analisis Grad-CAM"}
        </Button>
        {modelActive && <Chip tone="secondary">Model aktif</Chip>}
        {!modelActive && <Chip tone="accent">Fallback (model belum tersedia)</Chip>}
      </div>

      {explain && (
        <div className="mt-6 space-y-6">
          <WaveformPlayer duration={5} src={audioPreviewUrl} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[14px] font-bold text-ink mb-2">{t("ai_mel")}</h3>
              <MelSpectrogram grid={explain.melGrid} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-ink mb-2">{t("ai_gradcam")}</h3>
              <GradCam points={explain.gradCam} grid={explain.gradCamGrid} />
            </div>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-ink mb-2">{t("ai_shap")}</h3>
            <ShapBars data={explain.shap} />
          </div>
        </div>
      )}
    </Card>
  )
}
