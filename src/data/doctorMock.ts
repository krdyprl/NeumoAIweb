import type {
  AiExplain,
  AppNotification,
  DoctorProfile,
  Patient,
  ReportRow,
  RiskLevel,
  Screening,
} from "../types"

export const CURRENT_DOCTOR: DoctorProfile = {
  name: "dr. Ayu Lestari",
  email: "dr.ayu@neumod.id",
  role: "Dokter Anak",
  nik: "317101198804120001",
  str: "STR-2026-0012345",
  specialization: "Spesialis Anak",
  facility: "Puskesmas Sehat Sejahtera",
  phone: "+62 811-2233-4455",
  emoji: "👩‍⚕️",
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
}

export const PATIENTS: Patient[] = [
  { id: "p1", name: "Arya Putra", nik: "3171011403200001", gender: "male", birthDate: "2023-03-14", address: "Jl. Melati No. 12, Jakarta", phone: "+62 812-1000-0001", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p2", name: "Anya Putri", nik: "3171010211200002", gender: "female", birthDate: "2025-11-02", address: "Jl. Anggrek No. 5, Jakarta", phone: "+62 812-1000-0002", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p3", name: "Raka Saputra", nik: "3171011510190003", gender: "male", birthDate: "2019-10-15", address: "Jl. Kenanga No. 8, Jakarta", phone: "+62 812-1000-0003", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p4", name: "Siti Rahma", nik: "3171012008180004", gender: "female", birthDate: "2018-08-20", address: "Jl. Cempaka No. 3, Jakarta", phone: "+62 812-1000-0004", facility: "Puskesmas Melati" },
  { id: "p5", name: "Bima Nugroho", nik: "3171010503210005", gender: "male", birthDate: "2021-03-05", address: "Jl. Flamboyan No. 9, Jakarta", phone: "+62 812-1000-0005", facility: "Puskesmas Melati" },
  { id: "p6", name: "Dewi Lestari", nik: "3171012810160006", gender: "female", birthDate: "2016-10-28", address: "Jl. Dahlia No. 2, Jakarta", phone: "+62 812-1000-0006", facility: "Puskesmas Cinta Damai" },
  { id: "p7", name: "Fajar Hidayat", nik: "3171010306220007", gender: "male", birthDate: "2022-06-03", address: "Jl. Mawar No. 7, Jakarta", phone: "+62 812-1000-0007", facility: "Puskesmas Cinta Damai" },
  { id: "p8", name: "Intan Permatasari", nik: "3171011111190008", gender: "female", birthDate: "2019-11-11", address: "Jl. Teratai No. 1, Jakarta", phone: "+62 812-1000-0008", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p9", name: "Galih Ramadhan", nik: "3171010901170009", gender: "male", birthDate: "2017-01-09", address: "Jl. Kamboja No. 4, Jakarta", phone: "+62 812-1000-0009", facility: "Puskesmas Melati" },
  { id: "p10", name: "Nadia Ayu", nik: "3171013008200010", gender: "female", birthDate: "2020-08-30", address: "Jl. Sakura No. 6, Jakarta", phone: "+62 812-1000-0010", facility: "Puskesmas Cinta Damai" },
  { id: "p11", name: "Hendra Wijaya", nik: "3171011806150011", gender: "male", birthDate: "2015-06-18", address: "Jl. Cendana No. 11, Jakarta", phone: "+62 812-1000-0011", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p12", name: "Putri Maharani", nik: "3171010712240012", gender: "female", birthDate: "2024-12-07", address: "Jl. Lili No. 13, Jakarta", phone: "+62 812-1000-0012", facility: "Puskesmas Melati" },
]

function screening(id: string, patientId: string, date: string, symptoms: string[], audioDuration: number, riskLevel: RiskLevel, confidence: number, status: Screening["status"], outcome = ""): Screening {
  return { id, patientId, date, symptoms, audioDuration, riskLevel, disease: "Pneumonia", confidence, status, outcome }
}

export const SCREENINGS_BY_PATIENT: Record<string, Screening[]> = {
  p1: [
    screening("s1", "p1", "2026-08-01T09:14:00", ["batuk", "demam", "sesak"], 5, "high", 87, "awaiting"),
    screening("s2", "p1", "2026-07-30T14:00:00", ["batuk", "pilek"], 4, "medium", 62, "done", "Tindak lanjut mandiri"),
    screening("s3", "p1", "2026-03-20T10:00:00", ["batuk"], 3, "low", 18, "done", "Pulang"),
  ],
  p2: [screening("s4", "p2", "2026-07-10T08:30:00", ["demam", "batuk"], 4, "low", 22, "done", "Pulang")],
  p3: [screening("s5", "p3", "2026-08-02T11:00:00", ["batuk", "sesak", "demam"], 6, "high", 91, "awaiting")],
  p4: [
    screening("s6", "p4", "2026-07-25T09:00:00", ["batuk"], 3, "low", 15, "done", "Pulang"),
    screening("s7", "p4", "2026-04-11T10:30:00", ["batuk", "demam"], 4, "medium", 55, "done", "Antibiotik"),
  ],
  p5: [screening("s8", "p5", "2026-08-03T13:00:00", ["sesak", "batuk"], 5, "high", 84, "awaiting")],
  p6: [screening("s9", "p6", "2026-06-18T08:00:00", ["batuk", "pilek"], 3, "low", 12, "done", "Pulang")],
  p7: [screening("s10", "p7", "2026-07-28T14:30:00", ["demam"], 3, "medium", 48, "awaiting")],
  p8: [screening("s11", "p8", "2026-05-02T09:45:00", ["batuk", "sesak"], 4, "high", 79, "done", "Rujuk RS")],
  p9: [screening("s12", "p9", "2026-02-14T10:00:00", ["batuk"], 3, "low", 10, "done", "Pulang")],
  p10: [screening("s13", "p10", "2026-07-05T08:15:00", ["demam", "sesak"], 4, "medium", 58, "done", "Tindak lanjut mandiri")],
  p11: [screening("s14", "p11", "2026-01-22T11:30:00", ["batuk", "demam"], 5, "medium", 52, "done", "Antibiotik")],
  p12: [screening("s15", "p12", "2026-08-04T08:45:00", ["batuk", "pilek"], 4, "low", 25, "awaiting")],
}

function makeAiExplain(id: string, confidence: number): AiExplain {
  const rows = 24
  const cols = 40
  const melGrid: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const base = 0.3 + 0.5 * Math.sin(c / 4 + r / 3)
      row.push(Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.25)))
    }
    melGrid.push(row)
  }
  const gradCam = Array.from({ length: 60 }, (_, i) => ({
    x: (i / 59) * 100,
    y: 50 + 40 * Math.sin(i / 3),
    intensity: 0.15 + 0.8 * Math.pow(Math.sin(i / 4), 2),
  }))
  return {
    patientId: id,
    prediction: "Pneumonia",
    confidence,
    reasoning: [
      "Model mendeteksi pola napas tidak teratur pada segmen 2-4 detik.",
      "Korelasi tinggi dengan referensi suara pneumonia pada basis data pelatihan.",
      "Durasi inspirasi memendek dibanding referensi normal.",
      "Rekomendasi: konfirmasi dengan pemeriksaan fisik dan rontgen dada.",
    ],
    melGrid,
    gradCam,
    shap: [
      { feature: "Durasi inspirasi", contribution: 0.42 },
      { feature: "Bunyi ronki basah", contribution: 0.31 },
      { feature: "Frekuensi dasar", contribution: 0.16 },
      { feature: "Ampiltudo sinyal", contribution: 0.08 },
      { feature: "Rasio H/N", contribution: -0.05 },
    ],
  }
}

export const AI_EXPLAIN: Record<string, AiExplain> = {
  p1: makeAiExplain("p1", 87),
  p3: makeAiExplain("p3", 91),
  p5: makeAiExplain("p5", 84),
  p8: makeAiExplain("p8", 79),
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", type: "ai", title: "Hasil AI tersedia", body: "Skrining Arya Putra: indikasi tinggi pneumonia (87%).", time: "5 menit lalu", read: false },
  { id: "n2", type: "patient", title: "Pasien baru terdaftar", body: "Putri Maharani menambahkan hasil skrining baru.", time: "1 jam lalu", read: false },
  { id: "n3", type: "system", title: "Pembaruan model AI", body: "Model v2.4 dipasang dan aktif untuk semua skrining baru.", time: "3 jam lalu", read: true },
  { id: "n4", type: "ai", title: "Hasil AI tersedia", body: "Skrining Raka Saputra: indikasi tinggi pneumonia (91%).", time: "Kemarin", read: false },
  { id: "n5", type: "patient", title: "Jadwal rujukan", body: "Rujukan RS untuk Intan Permatasari dikonfirmasi.", time: "Kemarin", read: true },
]

export const REPORTS: ReportRow[] = [
  { id: "r1", patientName: "Arya Putra", date: "2026-08-01", riskLevel: "high", confidence: 87, status: "Menunggu keputusan" },
  { id: "r2", patientName: "Raka Saputra", date: "2026-08-02", riskLevel: "high", confidence: 91, status: "Menunggu keputusan" },
  { id: "r3", patientName: "Bima Nugroho", date: "2026-08-03", riskLevel: "high", confidence: 84, status: "Menunggu keputusan" },
  { id: "r4", patientName: "Anya Putri", date: "2026-07-10", riskLevel: "low", confidence: 22, status: "Selesai" },
  { id: "r5", patientName: "Siti Rahma", date: "2026-07-25", riskLevel: "low", confidence: 15, status: "Selesai" },
  { id: "r6", patientName: "Fajar Hidayat", date: "2026-07-28", riskLevel: "medium", confidence: 48, status: "Menunggu keputusan" },
]

export const WEEKLY_SCREENINGS = [12, 18, 15, 22, 19, 25, 30]
export const RISK_DISTRIBUTION = [
  { label: "Rendah", value: 42, color: "var(--color-secondary)" },
  { label: "Sedang", value: 33, color: "var(--color-accent)" },
  { label: "Tinggi", value: 25, color: "var(--color-danger)" },
]
export const MONTHLY_REPORTS = [
  { month: "Mar", total: 96, positive: 9 },
  { month: "Apr", total: 112, positive: 13 },
  { month: "Mei", total: 105, positive: 11 },
  { month: "Jun", total: 128, positive: 16 },
  { month: "Jul", total: 141, positive: 19 },
  { month: "Agu", total: 88, positive: 12 },
]
export const REGION_REPORTS = [
  { region: "Puskesmas Sehat Sejahtera", total: 210 },
  { region: "Puskesmas Melati", total: 150 },
  { region: "Puskesmas Cinta Damai", total: 122 },
]
