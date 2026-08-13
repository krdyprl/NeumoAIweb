import { useState } from "react"
import { Button, Card, Chip } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import type { Child, Gender } from "../types"

export function ChildrenScreen() {
  const { children, setCurrentChild, navigate, currentChildId, screenings } =
    useApp()

  return (
    <Screen>
      <TopBar
        title="Data Anak"
        right={
          <button
            onClick={() => navigate("child-form")}
            className="h-10 px-4 rounded-xl bg-primary text-white text-[13px] font-semibold flex items-center gap-1 hover:bg-primary-deep transition-colors cursor-pointer"
          >
            <span className="text-[16px] leading-none">＋</span> Tambah
          </button>
        }
      />
      <div className="px-5 pb-28 space-y-4 lg:pb-8">
        <p className="text-[14px] text-muted leading-relaxed">
          Kelola data anak untuk hasil skrining yang lebih akurat. Data
          tersimpan aman dan tersinkronisasi.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((c) => {
            const count = screenings.filter((s) => s.childId === c.id).length
            const due = c.vaccinations.filter((v) => !v.done).length
            const active = c.id === currentChildId
            return (
              <Card
                key={c.id}
                className={`p-5 ${active ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-[30px]">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-ink truncate">
                      {c.name}
                    </p>
                    <p className="text-[12px] text-muted">
                      {c.gender === "male" ? "Laki-laki" : "Perempuan"} ·{" "}
                      {ageLabel(c.birthDate)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStat label="Berat" value={`${c.weight} kg`} />
                  <MiniStat label="Tinggi" value={`${c.height} cm`} />
                  <MiniStat label="Skrining" value={`${count}×`} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Chip tone={due > 0 ? "accent" : "secondary"}>
                    {due > 0 ? `${due} vaksin terjadwal` : "Vaksinasi lengkap"}
                  </Chip>
                  <Chip tone="neutral">
                    {c.medicalHistory
                      ? "Riwayat medis ada"
                      : "Tanpa riwayat medis"}
                  </Chip>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={active ? "primary" : "soft"}
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setCurrentChild(c.id)
                      navigate("home")
                    }}
                  >
                    {active ? "Aktif" : "Pilih Anak"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate("child-form", { childId: c.id })}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <button
          onClick={() => navigate("child-form")}
          className="w-full rounded-2xl border-2 border-dashed border-line py-8 flex flex-col items-center gap-2 text-muted hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
        >
          <span className="text-[28px]">👶</span>
          <span className="text-[14px] font-semibold">Tambahkan Anak Baru</span>
        </button>
      </div>
    </Screen>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2 text-center">
      <p className="text-[14px] font-bold text-ink">{value}</p>
      <p className="text-[10px] text-muted font-medium">{label}</p>
    </div>
  )
}

export function ageLabel(birth: string) {
  const b = new Date(birth)
  const now = new Date()
  let months =
    (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth())
  if (months < 0) months = 0
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} bulan`
  if (m === 0) return `${y} tahun`
  return `${y} tahun ${m} bln`
}

const EMOJIS = [
  "👦",
  "👧",
  "🧒",
  "👶",
  "👦🏽",
  "👧🏽",
  "👶🏽",
  "🦁",
  "🐯",
  "🐰",
  "🐼",
  "🦄",
]

export function ChildFormScreen() {
  const { params, back, children, addChild, updateChild } = useApp()
  const existing = params.childId
    ? children.find((c) => c.id === params.childId)
    : undefined

  const [name, setName] = useState(existing?.name ?? "")
  const [gender, setGender] = useState<Gender>(existing?.gender ?? "male")
  const [birthDate, setBirthDate] = useState(
    existing?.birthDate ?? "2024-01-01",
  )
  const [weight, setWeight] = useState(existing ? String(existing.weight) : "")
  const [height, setHeight] = useState(existing ? String(existing.height) : "")
  const [birthWeight, setBirthWeight] = useState(
    existing ? String(existing.birthWeight) : "",
  )
  const [medicalHistory, setMedicalHistory] = useState(
    existing?.medicalHistory ?? "",
  )
  const [emoji, setEmoji] = useState(existing?.emoji ?? "👦")

  const save = () => {
    if (!name.trim()) return
    const data: Child = {
      id: existing?.id ?? `c${Date.now()}`,
      name: name.trim(),
      gender,
      birthDate,
      weight: parseFloat(weight) || 0,
      height: parseFloat(height) || 0,
      birthWeight: parseFloat(birthWeight) || 0,
      medicalHistory,
      emoji,
      vaccinations: existing?.vaccinations ?? [],
    }
    if (existing) updateChild(data)
    else addChild(data)
    back()
  }

  return (
    <Screen>
      <TopBar title={existing ? "Edit Data Anak" : "Tambah Anak"} />
      <div className="px-5 pb-32 space-y-5 lg:pb-10">
        {/* Photo / avatar picker */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/10 flex items-center justify-center text-[52px] card-shadow">
            {emoji}
          </div>
          <p className="text-[12px] text-muted mt-2 font-medium">
            Pilih foto profil
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-[300px]">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-[20px] transition-all cursor-pointer ${
                  emoji === e
                    ? "bg-primary-soft ring-2 ring-primary scale-110"
                    : "bg-surface-2 hover:bg-primary/10"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGender("male")}
            className={`rounded-2xl border-2 p-4 flex items-center gap-2.5 transition-all cursor-pointer ${
              gender === "male"
                ? "border-primary bg-primary-soft"
                : "border-line bg-surface"
            }`}
          >
            <span className="text-[24px]">👦</span>
            <span className="text-[14px] font-bold text-ink">Laki-laki</span>
          </button>
          <button
            onClick={() => setGender("female")}
            className={`rounded-2xl border-2 p-4 flex items-center gap-2.5 transition-all cursor-pointer ${
              gender === "female"
                ? "border-primary bg-primary-soft"
                : "border-line bg-surface"
            }`}
          >
            <span className="text-[24px]">👧</span>
            <span className="text-[14px] font-bold text-ink">Perempuan</span>
          </button>
        </div>

        <label className="block">
          <span className="block mb-1.5 text-[13px] font-semibold text-ink">
            NAMA LENGKAP ANAK
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth. Arya Putra Santoso"
            className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block mb-1.5 text-[13px] font-semibold text-ink">
              TANGGAL LAHIR
            </span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-[13px] font-semibold text-ink">
              BERAT LAHIR (kg)
            </span>
            <input
              type="number"
              step="0.1"
              value={birthWeight}
              onChange={(e) => setBirthWeight(e.target.value)}
              placeholder="3.2"
              className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-[13px] font-semibold text-ink">
              BERAT SAAT INI (kg)
            </span>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="13.5"
              className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-[13px] font-semibold text-ink">
              TINGGI (cm)
            </span>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="92"
              className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </label>
        </div>

        <label className="block">
          <span className="block mb-1.5 text-[13px] font-semibold text-ink">
            RIWAYAT MEDIS
          </span>
          <textarea
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            placeholder="cth. Alergi, riwayat perawatan, atau pengobatan"
            rows={3}
            className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
          />
        </label>

        {existing && existing.vaccinations.length > 0 && (
          <div>
            <span className="block mb-2 text-[13px] font-semibold text-ink">
              STATUS VAKSINASI
            </span>
            <div className="space-y-2">
              {existing.vaccinations.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-ink">
                      {v.name}
                    </p>
                    <p className="text-[11px] text-muted">
                      {v.done
                        ? new Date(v.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : `Jadwal: ${new Date(v.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                    </p>
                  </div>
                  <Chip tone={v.done ? "secondary" : "accent"}>
                    {v.done ? "Selesai" : "Terjadwal"}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button size="lg" className="w-full" onClick={save}>
          {existing ? "Simpan Perubahan" : "Simpan Data Anak"}
        </Button>
      </div>
    </Screen>
  )
}
