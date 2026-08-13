import { useEffect, useMemo, useRef, useState } from "react"
import { Button, Chip } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import { SYMPTOMS } from "../data/mock"
import { Waveform } from "../components/charts"
import type { Disease, RiskLevel } from "../types"

// ─── Step 1: Symptoms ─────────────────────────────────────────────────────────

export function SymptomsScreen() {
  const { navigate, children, currentChildId } = useApp()
  const child = children.find((c) => c.id === currentChildId) ?? children[0]
  const [selected, setSelected] = useState<string[]>(["demam", "batuk"])
  const [duration, setDuration] = useState("2-7 hari")
  const [breathing, setBreathing] = useState("normal")

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  return (
    <Screen>
      <TopBar title="Mulai Skrining" />
      <div className="px-5 pb-32 space-y-5 lg:pb-10">
        {/* Stepper */}
        <div className="flex items-center gap-2">
          {["Gejala", "Rekam", "Analisis"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  i === 0 ? "bg-primary text-white" : "bg-surface-2 text-faint"
                }`}
              >
                {i < 1 ? "✓" : i + 1}
              </div>
              <span
                className={`text-[12px] font-semibold ${
                  i === 0 ? "text-ink" : "text-faint"
                }`}
              >
                {step}
              </span>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 rounded ${
                    i === 0 ? "bg-primary" : "bg-line"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-4 bg-surface border border-line card-shadow flex items-center gap-3">
          <span className="text-[32px]">{child.emoji}</span>
          <div>
            <p className="text-[15px] font-bold text-ink">{child.name}</p>
            <p className="text-[12px] text-muted">
              {child.gender === "male" ? "Laki-laki" : "Perempuan"} ·{" "}
              {child.weight} kg · {child.height} cm
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-[16px] font-bold text-ink mb-1">Pilih Gejala</h2>
          <p className="text-[13px] text-muted mb-3">
            Tandai gejala yang dialami si kecil saat ini.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {SYMPTOMS.map((s) => {
              const on = selected.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`rounded-2xl border-2 p-3.5 text-left transition-all cursor-pointer ${
                    on
                      ? "border-primary bg-primary-soft shadow-[0_4px_14px_rgba(29,122,252,0.18)]"
                      : "border-line bg-surface hover:border-primary/40"
                  }`}
                >
                  <span className="text-[24px] block mb-1.5">{s.icon}</span>
                  <p
                    className={`text-[13.5px] font-bold leading-tight ${
                      on ? "text-primary" : "text-ink"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{s.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">Durasi Batuk</h2>
          <div className="flex gap-2">
            {["< 2 hari", "2-7 hari", "> 7 hari"].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 h-11 rounded-2xl text-[13px] font-semibold transition-all cursor-pointer ${
                  duration === d
                    ? "bg-primary text-white shadow-[0_4px_14px_rgba(29,122,252,0.3)]"
                    : "bg-surface border border-line text-muted hover:border-primary/40"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">
            Pola Pernapasan
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                key: "normal",
                label: "Normal",
                icon: "😌",
                desc: "Tanpa bunyi aneh",
              },
              {
                key: "cepat",
                label: "Cepat",
                icon: "😮‍💨",
                desc: "Lebih dari biasanya",
              },
              {
                key: "mengi",
                label: "Ada mengi",
                icon: "🔊",
                desc: "Bunyi 'ngik-ngik'",
              },
              {
                key: "tarikan",
                label: "Tarik napas dalam",
                icon: "🫁",
                desc: "Dinding dada tertarik",
              },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => setBreathing(b.key)}
                className={`rounded-2xl border-2 p-3 text-left transition-all cursor-pointer ${
                  breathing === b.key
                    ? "border-primary bg-primary-soft"
                    : "border-line bg-surface"
                }`}
              >
                <span className="text-[22px]">{b.icon}</span>
                <p
                  className={`text-[13px] font-bold mt-1 ${
                    breathing === b.key ? "text-primary" : "text-ink"
                  }`}
                >
                  {b.label}
                </p>
                <p className="text-[11px] text-muted">{b.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <Button size="lg" className="w-full" onClick={() => navigate("record")}>
          Lanjut Rekam Suara →
        </Button>
      </div>
    </Screen>
  )
}

// ─── Step 2: Record ───────────────────────────────────────────────────────────

export function RecordScreen() {
  const { navigate, children, currentChildId } = useApp()
  const child = children.find((c) => c.id === currentChildId) ?? children[0]
  const [state, setState] = useState<"idle" | "recording" | "done">("idle")
  const [seconds, setSeconds] = useState(0)
  const [noise, setNoise] = useState(0.12)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  const start = () => {
    setState("recording")
    setSeconds(0)
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= 5) {
          if (timer.current) clearInterval(timer.current)
          setState("done")
          return s
        }
        return s + 1
      })
      setNoise(0.08 + Math.random() * 0.2)
    }, 1000)
  }

  const retry = () => {
    if (timer.current) clearInterval(timer.current)
    setState("idle")
    setSeconds(0)
  }

  const progress = Math.min(100, (seconds / 5) * 100)

  return (
    <Screen>
      <TopBar title="Rekam Suara Batuk" />
      <div className="px-5 pb-32 space-y-6 lg:pb-10">
        <div className="text-center">
          <p className="text-[15px] font-bold text-ink">
            Rekam batuk {child.name.split(" ")[0]} selama 5 detik
          </p>
          <p className="text-[13px] text-muted mt-1">
            Posisikan ponsel 15–20 cm dari mulut si kecil.
          </p>
        </div>

        <div className="rounded-3xl p-6 bg-surface border border-line card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  state === "recording" ? "bg-danger animate-pulse" : "bg-faint"
                }`}
              />
              <span className="text-[12px] font-semibold text-muted">
                {state === "recording"
                  ? "Sedang merekam…"
                  : state === "done"
                    ? "Rekaman selesai"
                    : "Siap merekam"}
              </span>
            </div>
            <span className="text-[15px] font-bold text-ink tabular-nums">
              {state === "idle" ? "0:00" : `0:0${Math.min(seconds, 5)}`}
            </span>
          </div>

          <Waveform
            active={state === "recording"}
            color={
              state === "done"
                ? "var(--color-secondary)"
                : "var(--color-primary)"
            }
          />

          {/* Progress */}
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden mt-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Noise indicator */}
        {state === "recording" && (
          <div className="rounded-2xl bg-surface border border-line px-4 py-3 anim-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-semibold text-muted">
                Indikator kebisingan
              </span>
              <span
                className={`text-[12px] font-bold ${
                  noise > 0.22 ? "text-accent-deep" : "text-secondary-deep"
                }`}
              >
                {noise > 0.22 ? "Lingkungan berisik" : "Kualitas audio baik"}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  noise > 0.22 ? "bg-accent" : "bg-secondary"
                }`}
                style={{ width: `${Math.min(100, noise * 260)}%` }}
              />
            </div>
          </div>
        )}

        {/* Record button */}
        <div className="flex flex-col items-center gap-5">
          {state === "done" ? (
            <div className="flex items-center gap-4">
              <button
                onClick={retry}
                className="w-16 h-16 rounded-2xl bg-surface border border-line flex flex-col items-center justify-center gap-0.5 text-muted hover:border-danger/50 hover:text-danger transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path
                    d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-semibold">Ulangi</span>
              </button>
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-secondary/40 anim-pulse-ring" />
                <button
                  onClick={() => navigate("processing")}
                  className="relative w-24 h-24 rounded-full bg-secondary flex flex-col items-center justify-center text-white shadow-[0_16px_40px_rgba(62,207,142,0.5)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[11px] font-bold mt-0.5">Kirim</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {state === "recording" && (
                <span className="absolute inset-0 rounded-full bg-danger/30 anim-pulse-ring" />
              )}
              <button
                onClick={state === "recording" ? retry : start}
                className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center text-white transition-transform active:scale-95 cursor-pointer ${
                  state === "recording"
                    ? "bg-danger shadow-[0_16px_40px_rgba(239,68,68,0.5)]"
                    : "bg-gradient-to-br from-primary to-primary-deep shadow-[0_16px_40px_rgba(29,122,252,0.5)] hover:scale-105"
                }`}
              >
                {state === "recording" ? (
                  <span className="w-8 h-8 rounded-lg bg-white" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8"
                    fill="currentColor"
                  >
                    <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12h-2Z" />
                  </svg>
                )}
                <span className="text-[11px] font-bold mt-1">
                  {state === "recording" ? "Berhenti" : "Rekam"}
                </span>
              </button>
            </div>
          )}
          {state === "idle" && (
            <button
              onClick={() => navigate("processing")}
              className="text-[13px] font-semibold text-muted hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path
                  d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v4h16v-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Unggah rekaman audio
            </button>
          )}
        </div>

        {state === "done" && (
          <div className="rounded-2xl bg-secondary-soft px-4 py-3 flex items-center gap-2.5 anim-fade-up">
            <span className="text-[18px]">✅</span>
            <p className="text-[12.5px] text-secondary-deep font-medium">
              Rekaman tersimpan secara lokal. Akan diunggah otomatis saat AI
              mulai menganalisis.
            </p>
          </div>
        )}
      </div>
    </Screen>
  )
}

// ─── Step 3: Processing ───────────────────────────────────────────────────────

export function ProcessingScreen() {
  const { navigate } = useApp()
  const steps = useMemo(
    () => [
      { label: "Mengunggah rekaman audio", done: true },
      { label: "Mengekstrak fitur akustik", done: true },
      { label: "Menjalankan model AI", done: false },
      { label: "Menyusun laporan hasil", done: false },
    ],
    [],
  )
  const [active, setActive] = useState(2)

  useEffect(() => {
    const t = setTimeout(() => {
      setActive(3)
      const t2 = setTimeout(() => {
        navigate("result")
      }, 1500)
      return () => clearTimeout(t2)
    }, 1800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="relative mb-10">
          <div
            className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
            style={{
              width: 160,
              height: 160,
              transform: "translate(-18px, -18px)",
            }}
          />
          <div className="relative w-28 h-28 rounded-[32px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_20px_60px_rgba(29,122,252,0.45)]">
            <span
              className="absolute inset-0 rounded-[32px] border-4 border-white/20"
              style={{ animation: "wave-bar 1.4s ease-in-out infinite" }}
            />
            <Waveform
              active
              barCount={12}
              color="white"
              className="h-14"
            />
          </div>
        </div>

        <h2 className="text-[22px] font-extrabold text-ink tracking-tight mb-2">
          AI Sedang Menganalisis…
        </h2>
        <p className="text-[14px] text-muted mb-10">
          Memproses gelombang suara batuk si kecil.
        </p>

        <div className="w-full max-w-[320px] space-y-3">
          {steps.map((s, i) => {
            const isCurrent = i === active
            return (
              <div
                key={s.label}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  s.done || i < active
                    ? "bg-secondary-soft"
                    : isCurrent
                      ? "bg-primary-soft"
                      : "bg-surface/60 border border-line"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    s.done || i < active
                      ? "bg-secondary text-white"
                      : isCurrent
                        ? "bg-primary text-white"
                        : "bg-surface-2 text-faint"
                  }`}
                >
                  {s.done || i < active ? "✓" : i + 1}
                </span>
                <span
                  className={`text-[13.5px] font-semibold flex-1 ${
                    s.done || i < active
                      ? "text-secondary-deep"
                      : isCurrent
                        ? "text-primary"
                        : "text-faint"
                  }`}
                >
                  {s.label}
                </span>
                {isCurrent && (
                  <span
                    className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent"
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex items-center gap-1.5 text-[12px] text-faint">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span>
            Mode offline aktif · hasil akan disimpan saat koneksi kembali
          </span>
        </div>
      </div>
    </Screen>
  )
}
