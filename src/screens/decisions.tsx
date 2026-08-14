import { useState } from "react"
import { useApp } from "../state/AppContext"
import { PATIENTS, SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { PageHeader, RiskBadge, EmptyState } from "../components/dashboard"
import { Button, Card, Avatar } from "../components/ui"
import type { Screening } from "../types"

export function DecisionsScreen() {
  const { setPendingCases } = useApp()
  const [queue, setQueue] = useState<Screening[]>(() => Object.values(SCREENINGS_BY_PATIENT).flat().filter((s) => s.status === "awaiting"))
  const [modal, setModal] = useState<{ s: Screening; action: "accept" | "reject" } | null>(null)

  function confirm() {
    if (!modal) return
    setQueue((q) => q.filter((s) => s.id !== modal.s.id))
    setPendingCases((p) => Math.max(0, p - 1))
    setModal(null)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Keputusan Dokter" subtitle={`${queue.length} kasus menunggu keputusan`} />
      {queue.length === 0 ? (
        <Card><EmptyState icon="✅" title="Tidak ada kasus menunggu" desc="Semua skrining telah ditindaklanjuti." /></Card>
      ) : (
        <div className="space-y-4">
          {queue.map((s) => {
            const patient = PATIENTS.find((p) => p.id === s.patientId)
            return (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar emoji={patient?.gender === "male" ? "👦" : "👧"} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-[15px] font-bold text-ink">{patient?.name}</p><RiskBadge level={s.riskLevel} /></div>
                    <p className="text-[13px] text-muted mt-0.5">{s.disease} · Confidence {s.confidence}%</p>
                    <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString("id-ID")} · {s.audioDuration} dtk · Gejala: {s.symptoms.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setModal({ s, action: "accept" })}>Terima / Rujuk</Button>
                    <Button variant="outline" onClick={() => setModal({ s, action: "reject" })}>Tolak</Button>
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
            <h3 className="text-[18px] font-bold text-ink mb-2">{modal.action === "accept" ? "Terima / Rujuk pasien?" : "Tolak pasien?"}</h3>
            <p className="text-[14px] text-muted mb-6">{modal.action === "accept" ? "Anda akan menindaklanjuti pasien dengan merujuk atau memberi tindakan medis lanjutan." : "Anda akan menolak rekomendasi AI dan menindaklanjuti pasien secara mandiri."}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Batal</Button>
              <Button variant={modal.action === "accept" ? "secondary" : "danger"} className="flex-1" onClick={confirm}>Konfirmasi</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
