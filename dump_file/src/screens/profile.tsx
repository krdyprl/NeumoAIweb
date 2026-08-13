import { useState } from "react"
import { Button, Segmented, ThemeToggle } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import type { Lang } from "../types"

export function ProfileScreen() {
  const {
    profile,
    navigate,
    children,
    pendingSync,
    setLang,
    lang,
    theme,
    setTheme,
  } = useApp()
  const [pref, setPref] = useState<"light" | "dark" | "auto">(
    theme === "dark" ? "dark" : "light",
  )

  const rows: {
    icon: string
    label: string
    sub?: string
    route: Parameters<typeof navigate>[0]
  }[] = [
    {
      icon: "👶",
      label: "Kelola Anak",
      sub: `${children.length} anak terdaftar`,
      route: "children",
    },
    {
      icon: "🔔",
      label: "Notifikasi",
      sub: "Jadwal vaksin, pengingat, alert AI",
      route: "notifications",
    },
    {
      icon: "🔒",
      label: "Privasi & Keamanan",
      sub: "Kelola data & izin",
      route: "privacy",
    },
    {
      icon: "🌐",
      label: "Bahasa",
      sub: lang === "id" ? "Bahasa Indonesia" : "English",
      route: "settings",
    },
    {
      icon: "📄",
      label: "Ketentuan Layanan",
      sub: "Syarat & kebijakan",
      route: "settings",
    },
  ]

  return (
    <Screen>
      <TopBar title="Profil Saya" right={<ThemeToggle />} />
      <div className="px-5 pb-32 space-y-5 lg:pb-10">
        {/* Profile card */}
        <div className="rounded-[28px] p-6 relative overflow-hidden bg-gradient-to-br from-primary to-[#4a8ffc] text-white card-shadow">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-[34px]">
              {profile.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[19px] font-extrabold truncate">
                {profile.name}
              </p>
              <p className="text-[13px] text-white/75">{profile.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold bg-white/15 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {pendingSync === 0
                  ? "Semua data tersinkronisasi"
                  : `Sinkronisasi tertunda (${pendingSync})`}
              </span>
            </div>
            <button
              onClick={() => navigate("edit-profile")}
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Edit profil"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path
                  d="M4 20h4L19 9l-4-4L4 16v4ZM13 6l4 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-3xl bg-surface border border-line card-shadow overflow-hidden divide-y divide-line">
          {rows.map((r) => (
            <button
              key={r.label}
              onClick={() => navigate(r.route)}
              className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <span className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-[20px]">
                {r.icon}
              </span>
              <div className="flex-1 text-left">
                <p className="text-[14.5px] font-bold text-ink">{r.label}</p>
                {r.sub && <p className="text-[12px] text-muted">{r.sub}</p>}
              </div>
              <span className="text-faint">→</span>
            </button>
          ))}
        </div>

        {/* Appearance */}
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <p className="text-[14.5px] font-bold text-ink mb-4">Tampilan</p>
          <Segmented<"light" | "dark" | "auto">
            options={[
              { value: "light", label: "☀️ Terang" },
              { value: "dark", label: "🌙 Gelap" },
              { value: "auto", label: "🔄 Auto" },
            ]}
            value={pref}
            onChange={(v) => {
              setPref(v)
              if (v === "auto") {
                const sysDark = window.matchMedia?.(
                  "(prefers-color-scheme: dark)",
                ).matches
                setTheme(sysDark ? "dark" : "light")
              } else {
                setTheme(v)
              }
            }}
          />
          <p className="text-[12px] text-muted mt-3">
            Mode gelap otomatis mengikuti sistem saat memilih "Auto".
          </p>
        </div>

        {/* Language */}
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <p className="text-[14.5px] font-bold text-ink mb-4">Bahasa</p>
          <Segmented<Lang>
            options={[
              { value: "id", label: "🇮🇩 Indonesia" },
              { value: "en", label: "🇬🇧 English" },
            ]}
            value={lang}
            onChange={setLang}
          />
        </div>

        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={() => {
            localStorage.removeItem("neumoai-session")
            navigate("login")
          }}
        >
          Keluar
        </Button>
        <p className="text-center text-[12px] text-faint pb-4">
          NeummoAi-D v1.0.0 · Made with 💙 di Indonesia
        </p>
      </div>
    </Screen>
  )
}

export function EditProfileScreen() {
  const { profile, setProfile, back } = useApp()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  return (
    <Screen>
      <TopBar title="Edit Profil" />
      <div className="px-5 pb-16 space-y-5">
        <div className="flex flex-col items-center mb-2">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/10 flex items-center justify-center text-[52px] card-shadow">
            {profile.emoji}
          </div>
          <button className="text-[13px] font-semibold text-primary mt-3 cursor-pointer">
            Ubah foto
          </button>
        </div>

        <label className="block">
          <span className="block mb-1.5 text-[13px] font-semibold text-ink">
            NAMA
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </label>
        <label className="block">
          <span className="block mb-1.5 text-[13px] font-semibold text-ink">
            EMAIL
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </label>
        <label className="block">
          <span className="block mb-1.5 text-[13px] font-semibold text-ink">
            NOMOR HP
          </span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </label>

        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            setProfile({ ...profile, name, email, phone })
            back()
          }}
        >
          Simpan Perubahan
        </Button>
      </div>
    </Screen>
  )
}

export function PrivacyScreen() {
  const { back } = useApp()
  const [switches, setSwitches] = useState({
    shareData: true,
    analytics: false,
    reminders: true,
  })

  const items: {
    key: keyof typeof switches
    icon: string
    title: string
    desc: string
  }[] = [
    {
      key: "shareData",
      icon: "🩺",
      title: "Bagikan hasil dengan dokter",
      desc: "Izinkan akses hasil skrining untuk konsultasi medis",
    },
    {
      key: "analytics",
      icon: "📊",
      title: "Analitik penggunaan",
      desc: "Bantu kami meningkatkan akurasi AI secara anonim",
    },
    {
      key: "reminders",
      icon: "🔔",
      title: "Pengingat kesehatan",
      desc: "Vaksinasi, skrining rutin, dan saran kesehatan",
    },
  ]

  return (
    <Screen>
      <TopBar title="Privasi & Keamanan" />
      <div className="px-5 pb-16 space-y-5">
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow flex items-start gap-3.5">
          <span className="text-[26px]">🛡️</span>
          <p className="text-[13px] text-muted leading-relaxed">
            Data kesehatan Anda dan anak terenkripsi end-to-end. Hasil skrining
            hanya dapat diakses oleh Anda dan tenaga medis yang Anda pilih.
          </p>
        </div>

        <div className="rounded-3xl bg-surface border border-line card-shadow divide-y divide-line overflow-hidden">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-3.5 px-4 py-4">
              <span className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-[20px]">
                {item.icon}
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-ink">{item.title}</p>
                <p className="text-[12px] text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() =>
                  setSwitches((s) => ({ ...s, [item.key]: !s[item.key] }))
                }
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  switches[item.key] ? "bg-primary" : "bg-surface-2"
                }`}
                aria-label={item.title}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    switches[item.key] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <p className="text-[14px] font-bold text-ink mb-3">Data Pribadi</p>
          <div className="space-y-2">
            <button className="w-full text-left text-[13.5px] font-semibold text-primary py-2 cursor-pointer">
              Unduh data saya
            </button>
            <button className="w-full text-left text-[13.5px] font-semibold text-danger py-2 cursor-pointer">
              Hapus akun dan data
            </button>
          </div>
        </div>
      </div>
    </Screen>
  )
}

export function SettingsScreen() {
  const { back, setLang, lang, toggleTheme, theme } = useApp()
  return (
    <Screen>
      <TopBar title="Pengaturan" />
      <div className="px-5 pb-16 space-y-4">
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow space-y-4">
          <p className="text-[14px] font-bold text-ink">Bahasa Aplikasi</p>
          <Segmented<Lang>
            options={[
              { value: "id", label: "🇮🇩 Indonesia" },
              { value: "en", label: "🇬🇧 English" },
            ]}
            value={lang}
            onChange={setLang}
          />
        </div>
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow space-y-4">
          <p className="text-[14px] font-bold text-ink">Tampilan</p>
          <Segmented<"light" | "dark">
            options={[
              { value: "light", label: "☀️ Terang" },
              { value: "dark", label: "🌙 Gelap" },
            ]}
            value={theme}
            onChange={toggleTheme}
          />
        </div>
        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <p className="text-[14px] font-bold text-ink mb-2">Tentang</p>
          <p className="text-[13px] text-muted leading-relaxed">
            NeummoAi-D (Napas Anak Indonesia) adalah platform skrining dini
            penyakit pernapasan pada anak menggunakan AI analisis suara batuk.
          </p>
        </div>
      </div>
    </Screen>
  )
}
