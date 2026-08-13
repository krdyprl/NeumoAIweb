import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PATIENTS, SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { PageHeader, SearchBar, FilterChips, RiskBadge, EmptyState } from "../components/dashboard"
import { Card, Avatar, Icon } from "../components/ui"

const FILTERS = ["Semua", "Perlu Ditindaklanjuti", "Rendah", "Sedang", "Tinggi"]

export function PatientsScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("Semua")

  const rows = useMemo(() => {
    return PATIENTS.map((p) => ({ patient: p, latest: (SCREENINGS_BY_PATIENT[p.id] ?? [])[0] })).filter(({ patient, latest }) => {
      const q = query.toLowerCase()
      if (q && !patient.name.toLowerCase().includes(q) && !patient.nik.includes(q)) return false
      if (filter === "Semua") return true
      if (filter === "Perlu Ditindaklanjuti") return latest?.status === "awaiting"
      return latest?.riskLevel === filter.toLowerCase()
    })
  }, [query, filter])

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Daftar Pasien" subtitle={`${PATIENTS.length} pasien terdaftar`} />
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <SearchBar value={query} onChange={setQuery} />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>
      {rows.length === 0 ? (
        <Card><EmptyState icon="🔍" title="Tidak ada pasien" desc="Coba ubah kata kunci pencarian atau filter." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">NIK</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">Umur / JK</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">Hasil</th>
                  <th className="px-5 py-3 font-semibold">Risiko</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ patient, latest }) => {
                  const birth = new Date(patient.birthDate)
                  const ageY = new Date().getFullYear() - birth.getFullYear()
                  const ageM = Math.max(0, new Date().getMonth() - birth.getMonth())
                  return (
                    <tr key={patient.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={38} /><span className="font-semibold text-ink">{patient.name}</span></div></td>
                      <td className="px-5 py-3 text-muted text-[13px] hidden md:table-cell">{patient.nik}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{ageY} th {ageM} bl · {patient.gender === "male" ? "L" : "P"}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{latest ? `${latest.disease} · ${latest.confidence}%` : "—"}</td>
                      <td className="px-5 py-3">{latest ? <RiskBadge level={latest.riskLevel} /> : <span className="text-[12px] text-faint">Belum ada</span>}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden sm:table-cell">{latest ? new Date(latest.date).toLocaleDateString("id-ID") : "—"}</td>
                      <td className="px-5 py-3"><button onClick={() => navigate(`/patients/${patient.id}`)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer">Detail <Icon name="chevron" className="w-4 h-4" /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
