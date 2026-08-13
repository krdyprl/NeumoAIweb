import type {
  AppNotification,
  Article,
  Child,
  GrowthRecord,
  HealthCenter,
  Profile,
  Screening,
} from "../types"

export const MOCK_PROFILE: Profile = {
  name: "Ibu Sari",
  email: "ibu.sari@gmail.com",
  phone: "+62 812-3456-7890",
  emoji: "👩",
  role: "Orang Tua",
}

export const MOCK_CHILDREN: Child[] = [
  {
    id: "c1",
    name: "Arya Putra",
    gender: "male",
    birthDate: "2023-03-14",
    birthWeight: 3.2,
    weight: 13.5,
    height: 92,
    emoji: "👦",
    medicalHistory: "Tidak ada alergi. Riwayat ISPA ringan saat usia 1 tahun.",
    vaccinations: [
      { id: "v1", name: "BCG", date: "2023-03-20", done: true },
      { id: "v2", name: "DPT-HB-Hib 1", date: "2023-06-14", done: true },
      { id: "v3", name: "Campak Rubella", date: "2024-03-14", done: true },
      { id: "v4", name: "Booster DPT", date: "2026-09-01", done: false },
    ],
  },
  {
    id: "c2",
    name: "Anya Putri",
    gender: "female",
    birthDate: "2025-11-02",
    birthWeight: 3.0,
    weight: 8.2,
    height: 71,
    emoji: "👧",
    medicalHistory: "Lahir cukup bulan. Tidak ada riwayat penyakit kronis.",
    vaccinations: [
      { id: "v5", name: "BCG", date: "2025-11-08", done: true },
      { id: "v6", name: "Polio 1", date: "2025-12-02", done: true },
      { id: "v7", name: "DPT-HB-Hib 2", date: "2026-07-01", done: false },
    ],
  },
]

export const MOCK_SCREENINGS: Screening[] = [
  {
    id: "s1",
    childId: "c1",
    date: "2026-07-31T09:14:00",
    symptoms: ["batuk", "demam", "sesak"],
    audioDuration: 5,
    riskLevel: "high",
    disease: "Pneumonia",
    confidence: 87,
    status: "synced",
  },
  {
    id: "s2",
    childId: "c1",
    date: "2026-07-30T14:00:00",
    symptoms: ["batuk", "pilek"],
    audioDuration: 4,
    riskLevel: "medium",
    disease: "Pneumonia",
    confidence: 62,
    status: "synced",
  },
  {
    id: "s3",
    childId: "c1",
    date: "2026-03-20T10:00:00",
    symptoms: ["batuk"],
    audioDuration: 3,
    riskLevel: "low",
    disease: "Pneumonia",
    confidence: 18,
    status: "synced",
  },
  {
    id: "s4",
    childId: "c2",
    date: "2026-07-10T08:30:00",
    symptoms: ["demam", "batuk"],
    audioDuration: 4,
    riskLevel: "low",
    disease: "Pneumonia",
    confidence: 22,
    status: "synced",
  },
]

export const MOCK_ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Kenali 4 Tanda Bahaya Napas Cepat pada Anak",
    category: "Pneumonia",
    readTime: "4 menit",
    tag: "Penting",
  },
  {
    id: "a2",
    title: "Kapan Batuk Si Kecil Bisa Jadi Gejala Pneumonia?",
    category: "Pneumonia",
    readTime: "5 menit",
    tag: "Edukasi",
  },
  {
    id: "a3",
    title: "Panduan Menghitung Napas per Menit Sesuai Usia",
    category: "Deteksi",
    readTime: "3 menit",
    tag: "Panduan",
  },
  {
    id: "a4",
    title: "Pneumonia vs Batuk Biasa: Apa Bedanya?",
    category: "Pneumonia",
    readTime: "6 menit",
    tag: "Edukasi",
  },
  {
    id: "a5",
    title: "Nutrisi untuk Memperkuat Daya Tahan Anak",
    category: "Gizi",
    readTime: "4 menit",
    tag: "Tips",
  },
  {
    id: "a6",
    title: "Pertolongan Pertama saat Anak Sesak Napas",
    category: "Darurat",
    readTime: "3 menit",
    tag: "Darurat",
  },
]

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "ai",
    title: "Hasil skrining Arya tersedia",
    body: "AI mendeteksi indikasi pneumonia dengan kepercayaan 87%. Lihat rekomendasi dokter.",
    time: "09.14",
    read: false,
  },
  {
    id: "n2",
    type: "medical",
    title: "Saran dari dr. Rina",
    body: "Segera bawa Arya ke puskesmas terdekat untuk pemeriksaan lanjutan.",
    time: "10.20",
    read: false,
  },
  {
    id: "n3",
    type: "vaccination",
    title: "Jadwal vaksinasi Anya",
    body: "DPT-HB-Hib 2 dijadwalkan 1 Agustus. Jangan lupa kunjungi posyandu.",
    time: "Kemarin",
    read: true,
  },
  {
    id: "n4",
    type: "reminder",
    title: "Waktunya skrining ulang",
    body: "Sudah 30 hari sejak skrining terakhir Arya. Lakukan pemantauan rutin.",
    time: "3 hari lalu",
    read: true,
  },
]

export const MOCK_CENTERS: HealthCenter[] = [
  {
    id: "h1",
    name: "Puskesmas Kedungkandang",
    distance: "1,2 km",
    address: "Jl. Mayjen Sungkono No.54",
    rating: 4.6,
    open: true,
  },
  {
    id: "h2",
    name: "RSIA Melati Husada",
    distance: "2,8 km",
    address: "Jl. Kapten Tendean No.21",
    rating: 4.8,
    open: true,
  },
  {
    id: "h3",
    name: "Puskesmas Bareng",
    distance: "3,1 km",
    address: "Jl. Kerto Raharjo No.12",
    rating: 4.5,
    open: false,
  },
]

export const MOCK_GROWTH: Record<string, GrowthRecord[]> = {
  c1: [
    { month: "Agu", weight: 13.8, height: 91 },
    { month: "Sep", weight: 13.4, height: 91.5 },
    { month: "Okt", weight: 13.1, height: 92 },
    { month: "Nov", weight: 12.9, height: 92.5 },
    { month: "Des", weight: 13.0, height: 93 },
    { month: "Jan", weight: 13.3, height: 93.5 },
    { month: "Feb", weight: 13.5, height: 94 },
  ],
  c2: [
    { month: "Jan", weight: 7.9, height: 69 },
    { month: "Feb", weight: 8.0, height: 70 },
    { month: "Mar", weight: 8.1, height: 70.5 },
    { month: "Apr", weight: 8.2, height: 71 },
  ],
}

export const SYMPTOMS = [
  { id: "demam", label: "Demam", icon: "🌡️", desc: "Suhu > 37,5°C" },
  { id: "batuk", label: "Batuk", icon: "🤧", desc: "Kering / berdahak" },
  { id: "pilek", label: "Pilek", icon: "🤒", desc: "Hidung tersumbat" },
  {
    id: "sesak",
    label: "Sulit bernapas",
    icon: "😮‍💨",
    desc: "Napas cepat/terdengar berat",
  },
  {
    id: "nafsu",
    label: "Kehilangan nafsu makan",
    icon: "🍽️",
    desc: "Malas makan/minum",
  },
  {
    id: "lemah",
    label: "Tampak lemas",
    icon: "🫠",
    desc: "Kurang aktif dari biasanya",
  },
  {
    id: "mengi",
    label: "Suara mengi",
    icon: "🔊",
    desc: "Bunyi 'ngik' saat bernapas",
  },
  {
    id: "muntah",
    label: "Muntah",
    icon: "🤢",
    desc: "Setelah batuk / saat makan",
  },
] as const
