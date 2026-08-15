import { useApp } from "./state/AppContext"
import type { Lang } from "./types"

const dict: Record<string, { id: string; en: string }> = {
  // App / brand
  app: { id: "NeumoAI-D", en: "NeumoAI-D" },
  app_subtitle: { id: "Dashboard Dokter", en: "Doctor Dashboard" },
  login_subtitle: {
    id: "Dashboard Skrining Pernapasan Anak",
    en: "Pediatric Respiratory Screening Dashboard",
  },
  demo_note: {
    id: "Demo — gunakan email & kata sandi apa pun",
    en: "Demo — use any email & password",
  },
  error_required: {
    id: "Email dan kata sandi wajib diisi.",
    en: "Email and password are required.",
  },
  show_password: { id: "Tampilkan kata sandi", en: "Show password" },
  label_email: { id: "Email", en: "Email" },
  label_password: { id: "Kata Sandi", en: "Password" },
  "btn.login": { id: "Masuk", en: "Sign In" },

  // Nav
  "nav.dashboard": { id: "Dashboard", en: "Dashboard" },
  "nav.patients": { id: "Daftar Pasien", en: "Patients" },
  "nav.decisions": { id: "Keputusan Dokter", en: "Doctor Decisions" },
  "nav.notifications": { id: "Notifikasi", en: "Notifications" },
  "nav.reports": { id: "Laporan", en: "Reports" },
  "nav.settings": { id: "Pengaturan", en: "Settings" },
  "aria.theme": { id: "Ganti tema", en: "Toggle theme" },
  "aria.notifications": { id: "Notifikasi", en: "Notifications" },
  "aria.open_menu": { id: "Buka menu", en: "Open menu" },

  // Greetings
  greet_morning: { id: "Selamat pagi", en: "Good morning" },
  greet_afternoon: { id: "Selamat siang", en: "Good afternoon" },
  greet_evening: { id: "Selamat sore", en: "Good evening" },
  greet_night: { id: "Selamat malam", en: "Good night" },

  // Dashboard
  "page.dashboard": { id: "Dashboard", en: "Dashboard" },
  "kpi.total_patients": {
    id: "Total Pasien Terdaftar",
    en: "Registered Patients",
  },
  "kpi.screenings_today": { id: "Skrining Hari Ini", en: "Screenings Today" },
  "kpi.pneumonia_flagged": {
    id: "Terindikasi Pneumonia",
    en: "Pneumonia Flagged",
  },
  "kpi.pending_decisions": {
    id: "Menunggu Keputusan",
    en: "Pending Decisions",
  },
  "kpi.sub_this_week": { id: "+2 minggu ini", en: "+2 this week" },
  "kpi.sub_awaiting": { id: "3 menunggu", en: "3 awaiting" },
  "kpi.sub_high_risk": { id: "risiko tinggi", en: "high risk" },
  "kpi.sub_review": { id: "perlu tinjauan", en: "needs review" },
  "chart.screenings": {
    id: "Skrining — 7 Hari Terakhir",
    en: "Screenings — Last 7 Days",
  },
  "chart.risk_level": { id: "Tingkat Risiko", en: "Risk Level" },
  "panel.pending_list": {
    id: "Kasus Menunggu Keputusan",
    en: "Cases Awaiting Decision",
  },
  view_all: { id: "Lihat semua", en: "View all" },
  "panel.latest_notifications": {
    id: "Notifikasi Terbaru",
    en: "Latest Notifications",
  },
  "panel.open_patients": { id: "Buka Daftar Pasien", en: "Open Patient List" },
  "panel.open_patients_desc": {
    id: "Tinjau dan kelola hasil skrining pasien.",
    en: "Review and manage patient screening results.",
  },
  "btn.patient_list": { id: "Daftar Pasien", en: "Patient List" },
  empty_no_pending_cases: {
    id: "Tidak ada kasus menunggu.",
    en: "No pending cases.",
  },

  // Patients
  "page.patients": { id: "Daftar Pasien", en: "Patient List" },
  patients_subtitle: { id: "pasien terdaftar", en: "registered patients" },
  "filter.all": { id: "Semua", en: "All" },
  "filter.awaiting": { id: "Perlu Ditindaklanjuti", en: "Needs Follow-up" },
  "filter.low": { id: "Rendah", en: "Low" },
  "filter.medium": { id: "Sedang", en: "Medium" },
  "filter.high": { id: "Tinggi", en: "High" },
  search_placeholder: {
    id: "Cari nama atau NIK...",
    en: "Search name or NIK...",
  },
  "table.name": { id: "Nama", en: "Name" },
  "table.nik": { id: "NIK", en: "NIK" },
  "table.age_gender": { id: "Umur / JK", en: "Age / Sex" },
  "table.result": { id: "Hasil", en: "Result" },
  "table.risk": { id: "Risiko", en: "Risk" },
  "table.date": { id: "Tanggal", en: "Date" },
  "table.action": { id: "Aksi", en: "Action" },
  "table.not_available": { id: "—", en: "—" },
  "table.no_data": { id: "Belum ada", en: "None" },
  "table.detail": { id: "Detail", en: "Detail" },
  "empty.no_patients": { id: "Tidak ada pasien", en: "No patients found" },
  "empty.no_patients_desc": {
    id: "Coba ubah kata kunci pencarian atau filter.",
    en: "Try changing the search keyword or filter.",
  },
  age_yr: { id: "th", en: "y" },
  age_mo: { id: "bl", en: "mo" },
  sex_male: { id: "L", en: "M" },
  sex_female: { id: "P", en: "F" },

  // Patient Detail
  back_to_patients: {
    id: "Kembali ke Daftar Pasien",
    en: "Back to Patient List",
  },
  "tab.history": { id: "Riwayat", en: "History" },
  "tab.ai": { id: "Skrining AI", en: "AI Screening" },
  "tab.medical": { id: "Rekam Medis", en: "Medical Record" },
  age_years: { id: "tahun", en: "years" },
  gender_male: { id: "Laki-laki", en: "Male" },
  gender_female: { id: "Perempuan", en: "Female" },
  ai_disclaimer: {
    id: "Hasil AI adalah alat bantu skrining. Keputusan klinis tetap sepenuhnya pada dokter.",
    en: "AI results are a screening aid. Clinical decisions remain entirely with the doctor.",
  },
  ai_summary: { id: "Ringkasan Prediksi", en: "Prediction Summary" },
  ai_disease: { id: "Penyakit", en: "Disease" },
  ai_confidence: { id: "Confidence", en: "Confidence" },
  ai_risk: { id: "Risiko", en: "Risk" },
  ai_symptoms: { id: "Gejala", en: "Symptoms" },
  ai_reasoning: {
    id: "Alasan Prediksi (AI Reasoning)",
    en: "Prediction Reasoning (AI Reasoning)",
  },
  ai_playback: { id: "Pemutaran Suara Napas", en: "Breath Sound Playback" },
  ai_mel: { id: "Mel-Spektrogram", en: "Mel-Spectrogram" },
  ai_mel_desc: {
    id: "Representasi frekuensi-waktu dari sinyal suara napas.",
    en: "Time-frequency representation of the breath signal.",
  },
  ai_gradcam: { id: "Grad-CAM", en: "Grad-CAM" },
  ai_gradcam_desc: {
    id: "Area yang paling berpengaruh terhadap prediksi (merah = tinggi).",
    en: "Regions most influential to the prediction (red = high).",
  },
  ai_shap: {
    id: "Kontribusi Fitur (SHAP)",
    en: "Feature Contribution (SHAP)",
  },
  medical_notes: { id: "Catatan & Rekam Medis", en: "Notes & Medical Record" },
  field_diagnosis: { id: "Diagnosis", en: "Diagnosis" },
  field_doctor_notes: { id: "Catatan Dokter", en: "Doctor's Notes" },
  field_followup: { id: "Tindak Lanjut / Rujukan", en: "Follow-up / Referral" },
  followup_placeholder: {
    id: "Rujuk ke rumah sakit / tindak lanjut mandiri",
    en: "Refer to hospital / self follow-up",
  },
  "btn.save_medical": { id: "Simpan Rekam Medis", en: "Save Medical Record" },
  status_awaiting: { id: "Menunggu", en: "Awaiting" },
  "empty.patient_not_found": {
    id: "Pasien tidak ditemukan",
    en: "Patient not found",
  },
  "empty.patient_not_found_desc": {
    id: "Pasien dengan ID tersebut tidak tersedia.",
    en: "No patient with that ID is available.",
  },
  "empty.no_screenings": { id: "Belum ada skrining", en: "No screenings yet" },
  "empty.no_screenings_desc": {
    id: "Belum ada riwayat skrining untuk pasien ini.",
    en: "There is no screening history for this patient yet.",
  },
  "empty.no_ai": { id: "Belum ada analisis AI", en: "No AI analysis yet" },
  "empty.no_ai_desc": {
    id: "Analisis Grad-CAM, spektrogram, dan SHAP belum tersedia untuk skrining ini.",
    en: "Grad-CAM, spectrogram, and SHAP analysis are not yet available for this screening.",
  },
  "empty.no_ai_screening": { id: "Belum ada skrining", en: "No screening yet" },
  "empty.no_ai_screening_desc": {
    id: "Belum ada hasil skrining AI untuk pasien ini.",
    en: "There are no AI screening results for this patient yet.",
  },
  btn_pause: { id: "Jeda", en: "Pause" },
  btn_play: { id: "Putar suara", en: "Play audio" },
  sec: { id: "dtk", en: "sec" },
  chart_no_data: { id: "Data tidak tersedia.", en: "Data unavailable." },

  // Decisions
  "page.decisions": { id: "Keputusan Dokter", en: "Doctor Decisions" },
  decisions_subtitle: {
    id: "kasus menunggu keputusan",
    en: "cases awaiting decision",
  },
  "btn.accept": { id: "Terima / Rujuk", en: "Accept / Refer" },
  "btn.reject": { id: "Tolak", en: "Reject" },
  "modal.accept_title": {
    id: "Terima / Rujuk pasien?",
    en: "Accept / Refer patient?",
  },
  "modal.reject_title": { id: "Tolak pasien?", en: "Reject patient?" },
  "modal.accept_desc": {
    id: "Anda akan menindaklanjuti pasien dengan merujuk atau memberi tindakan medis lanjutan.",
    en: "You will follow up on the patient by referring or providing further medical care.",
  },
  "modal.reject_desc": {
    id: "Anda akan menolak rekomendasi AI dan menindaklanjuti pasien secara mandiri.",
    en: "You will reject the AI recommendation and follow up on the patient independently.",
  },
  "btn.cancel": { id: "Batal", en: "Cancel" },
  "btn.confirm": { id: "Konfirmasi", en: "Confirm" },
  empty_no_pending: { id: "Tidak ada kasus menunggu", en: "No pending cases" },
  empty_no_pending_desc: {
    id: "Semua skrining telah ditindaklanjuti.",
    en: "All screenings have been addressed.",
  },
  symptoms: { id: "Gejala", en: "Symptoms" },

  // Notifications
  "page.notifications": { id: "Notifikasi", en: "Notifications" },
  notifications_subtitle: { id: "belum dibaca", en: "unread" },
  "filter.ai": { id: "AI", en: "AI" },
  "filter.patient": { id: "Pasien", en: "Patients" },
  "filter.system": { id: "Sistem", en: "System" },
  "btn.mark_all_read": { id: "Tandai semua dibaca", en: "Mark all as read" },
  "empty.no_notifications": {
    id: "Tidak ada notifikasi",
    en: "No notifications",
  },
  "empty.no_notifications_desc": {
    id: "Tidak ada notifikasi pada filter ini.",
    en: "There are no notifications for this filter.",
  },

  // Reports
  "page.reports": { id: "Laporan", en: "Reports" },
  reports_subtitle: {
    id: "Rekap aktivitas skrining",
    en: "Screening activity recap",
  },
  "btn.export_pdf": { id: "Ekspor PDF", en: "Export PDF" },
  "btn.export_excel": { id: "Ekspor Excel", en: "Export Excel" },
  "kpi.total_screenings": { id: "Total Skrining", en: "Total Screenings" },
  "kpi.avg_confidence": { id: "Rata-rata Confidence", en: "Avg Confidence" },
  "kpi.referrals": { id: "Rujukan / Menunggu", en: "Referrals / Awaiting" },
  "chart.screenings_monthly": {
    id: "Skrining per Bulan",
    en: "Screenings per Month",
  },
  "chart.screenings_region": {
    id: "Skrining per Wilayah",
    en: "Screenings per Region",
  },
  field_from: { id: "Dari", en: "From" },
  field_to: { id: "Sampai", en: "To" },
  "table.patient": { id: "Pasien", en: "Patient" },
  "table.status": { id: "Status", en: "Status" },
  toast_export: {
    id: "Ekspor {kind} (demo) sedang diproses.",
    en: "Export {kind} (demo) is being processed.",
  },

  // Settings
  "page.settings": { id: "Pengaturan", en: "Settings" },
  settings_subtitle: {
    id: "Kelola profil dan preferensi",
    en: "Manage profile and preferences",
  },
  settings_doctor_profile: { id: "Profil Dokter", en: "Doctor Profile" },
  settings_preferences: { id: "Preferensi", en: "Preferences" },
  settings_theme: { id: "Tema", en: "Theme" },
  theme_light: { id: "Terang", en: "Light" },
  theme_dark: { id: "Gelap", en: "Dark" },
  settings_language: { id: "Bahasa", en: "Language" },
  lang_id: { id: "Bahasa Indonesia", en: "Bahasa Indonesia" },
  lang_en: { id: "English", en: "English" },
  settings_notifications: { id: "Notifikasi", en: "Notifications" },
  notif_new_ai: { id: "Hasil skrining AI baru", en: "New AI screening result" },
  notif_new_patient: {
    id: "Pasien baru terdaftar",
    en: "New patient registered",
  },
  notif_system_update: { id: "Pembaruan sistem", en: "System update" },
  settings_account: { id: "Akun", en: "Account" },
  "btn.logout": { id: "Keluar", en: "Logout" },
  "btn.save_changes": { id: "Simpan Perubahan", en: "Save Changes" },
  toast_saved: {
    id: "Perubahan berhasil disimpan (demo).",
    en: "Changes saved successfully (demo).",
  },
  field_full_name: { id: "Nama Lengkap", en: "Full Name" },
  field_specialization: { id: "Spesialisasi", en: "Specialization" },
  field_str: { id: "Nomor STR", en: "STR Number" },
  field_facility: { id: "Faskes", en: "Facility" },
  field_phone: { id: "Telepon", en: "Phone" },

  // Risk labels
  "risk.low": { id: "Rendah", en: "Low" },
  "risk.medium": { id: "Sedang", en: "Medium" },
  "risk.high": { id: "Tinggi", en: "High" },

  // Not found
  page_not_found: { id: "Halaman tidak ditemukan", en: "Page not found" },
  page_not_found_desc: {
    id: "Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.",
    en: "The page you are looking for is unavailable or has been moved.",
  },
  "btn.back_dashboard": { id: "Kembali ke Dashboard", en: "Back to Dashboard" },

  // Vitals
  "vitals.title": { id: "Tanda Vital Terbaru", en: "Latest Vitals" },
  "vitals.subtitle": {
    id: "Pengukuran pada skrining terakhir",
    en: "Measurements from the latest screening",
  },
  "vitals.hr": { id: "Denyut Jantung", en: "Heart Rate" },
  "vitals.rr": { id: "Laju Napas", en: "Respiratory Rate" },
  "vitals.spo2": { id: "SpO₂", en: "SpO₂" },
  "vitals.temp": { id: "Suhu", en: "Temperature" },
  "vitals.weight": { id: "Berat Badan", en: "Weight" },
  "vitals.bpm": { id: "bpm", en: "bpm" },
  "vitals.brpm": { id: "napas/mnt", en: "breaths/min" },
  "vitals.sat": { id: "sat", en: "sat" },
  "vitals.c": { id: "°C", en: "°C" },
  "vitals.kg": { id: "kg", en: "kg" },
  "vitals.baseline": { id: "Vs Baseline Normal", en: "vs Normal Baseline" },
  "vitals.baseline_desc": {
    id: "Perbandingan parameter dengan kisaran normal anak.",
    en: "Comparison of parameters against pediatric normal ranges.",
  },
  "vitals.in_range": { id: "Dalam rentang", en: "In range" },
  "vitals.out_of_range": { id: "Di luar rentang", en: "Out of range" },

  // AI Detail
  "ai.timeline": { id: "Timeline Prediksi", en: "Prediction Timeline" },
  "ai.timeline_desc": {
    id: "Perkembangan confidence dari riwayat skrining.",
    en: "Confidence progression across screening history.",
  },
  "ai.model_version": { id: "Versi Model", en: "Model Version" },
  "ai.recorded": { id: "Direkam", en: "Recorded" },

  // Activity / Tasks (dashboard)
  "panel.activity": { id: "Aktivitas Terkini", en: "Recent Activity" },
  "panel.tasks": { id: "Tugas Anda", en: "Your Tasks" },
  "task.see_all": { id: "Lihat semua tugas", en: "View all tasks" },
  "activity.today": { id: "Hari ini", en: "Today" },

  // Dashboard extras
  "kpi.accuracy": { id: "Akurasi AI", en: "AI Accuracy" },
  "kpi.referrals_count": { id: "Rujukan RS", en: "Hospital Referrals" },
  "kpi.trend_up": { id: "naik", en: "up" },
  "kpi.trend_down": { id: "turun", en: "down" },
  "kpi.vs_last_week": { id: "vs minggu lalu", en: "vs last week" },

  // Patients extras
  "patients.risk_trend": { id: "Tren Risiko", en: "Risk Trend" },
  "filter.referrals": { id: "Rujukan", en: "Referrals" },

  // Decisions extras
  "decision.reason": { id: "Alasan Keputusan", en: "Decision Reason" },
  "decision.reason_required": {
    id: "Alasan wajib diisi untuk keperluan audit.",
    en: "Reason is required for audit purposes.",
  },
  "decision.reason_placeholder": {
    id: "Tuliskan alasan keputusan Anda...",
    en: "Write your decision reason...",
  },
  "decision.pending_count": {
    id: "kasus menunggu",
    en: "cases awaiting",
  },
  "decision.spectrogram": { id: "Pratinjau Spektrogram", en: "Spectrogram Preview" },

  // Notifications extras
  "notif.today": { id: "Hari ini", en: "Today" },
  "notif.yesterday": { id: "Kemarin", en: "Yesterday" },
  "notif.week": { id: "Minggu ini", en: "This Week" },
  "notif.open": { id: "Buka", en: "Open" },

  // Reports extras
  "reports.export_csv": { id: "Ekspor CSV", en: "Export CSV" },
  "reports.drilldown": {
    id: "Perincian per Wilayah",
    en: "Region Breakdown",
  },
  "reports.date_range": { id: "Rentang Tanggal", en: "Date Range" },
  "table.confidence": { id: "Confidence", en: "Confidence" },
  "table.model_version": { id: "Versi Model", en: "Model Version" },
  "table.reviewer": { id: "Peninjau", en: "Reviewer" },

  // Settings extras
  "settings.security": { id: "Keamanan", en: "Security" },
  "settings.2fa": { id: "Autentikasi Dua Faktor", en: "Two-Factor Authentication" },
  "settings.2fa_desc": {
    id: "Tambah lapisan keamanan ekstra saat masuk.",
    en: "Add an extra layer of security when signing in.",
  },
  "settings.notif_pref": {
    id: "Preferensi Notifikasi",
    en: "Notification Preferences",
  },
  "settings.devices": { id: "Perangkat Terhubung", en: "Linked Devices" },
  "settings.device_now": { id: "Perangkat saat ini", en: "Current device" },
  "settings.device_last_seen": { id: "terakhir aktif", en: "last active" },
}

export function useT() {
  const { lang } = useApp()
  return (key: string) => {
    const entry = dict[key]
    if (!entry) return key
    return lang === "en" ? entry.en : entry.id
  }
}

export function tWithLang(lang: Lang, key: string): string {
  const entry = dict[key]
  if (!entry) return key
  return lang === "en" ? entry.en : entry.id
}
