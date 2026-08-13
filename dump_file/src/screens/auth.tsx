import { useEffect, useState } from "react"
import { Button, Field } from "../components/ui"
import { Screen } from "../components/layout"
import { useApp } from "../state/AppContext"

function Logo({ size = 72, light = false }: { size?: number; light?: boolean }) {
  return (
    <div
      className="rounded-[28%] flex items-center justify-center anim-float"
      style={{
        width: size,
        height: size,
        background: light
          ? "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))"
          : "linear-gradient(135deg, #1D7AFC, #3ECF8E)",
        boxShadow: light
          ? "0 12px 40px rgba(0,0,0,0.2)"
          : "0 16px 48px rgba(29,122,252,0.45)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span
        style={{ fontSize: size * 0.52, lineHeight: 1 }}
        className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
      >
        🫁
      </span>
    </div>
  )
}

export function SplashScreen() {
  const { navigate } = useApp()
  useEffect(() => {
    const t = setTimeout(() => navigate("onboarding"), 2200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary via-[#4a8ffc] to-secondary">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col items-center anim-fade-in">
          <Logo size={84} light />
          <h1 className="text-white text-[30px] font-extrabold tracking-tight mt-6">
            Neummo<span className="text-accent">Ai</span>-D
          </h1>
          <p className="text-white/70 text-[14px] mt-1.5 font-medium">
            Napas Anak Indonesia
          </p>
          <div className="flex gap-1.5 mt-10">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white"
                style={{
                  animation: `wave-bar 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
        <p className="absolute bottom-10 text-white/50 text-[12px]">
          Skrining dini penyakit pernapasan anak
        </p>
      </div>
    </Screen>
  )
}

const ONBOARD = [
  {
    icon: "🫁",
    title: "Deteksi Dini Lewat Suara",
    desc: "Rekam suara batuk si kecil dan biarkan AI menganalisis tanda-tanda awal penyakit pernapasan.",
    color: "from-primary to-[#5c9bff]",
  },
  {
    icon: "📊",
    title: "Hasil yang Mudah Dipahami",
    desc: "Terima laporan risiko, kemungkinan penyakit, dan visualisasi AI yang transparan dalam hitungan detik.",
    color: "from-secondary to-[#5fe0a4]",
  },
  {
    icon: "🏥",
    title: "Rekomendasi Langkah Tepat",
    desc: "Dapatkan saran dokter, akses fasilitas kesehatan terdekat, dan pantau tumbuh kembang setiap hari.",
    color: "from-accent to-[#ffab40]",
  },
]

export function OnboardingScreen() {
  const { navigate } = useApp()
  const [page, setPage] = useState(0)

  const next = () => {
    if (page === ONBOARD.length - 1) navigate("login")
    else setPage((p) => p + 1)
  }

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col px-7 py-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {ONBOARD.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === page ? "w-7 bg-primary" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => navigate("login")}
            className="text-[13px] font-semibold text-muted hover:text-primary transition-colors cursor-pointer"
          >
            Lewati
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div
            key={page}
            className="anim-fade-up flex flex-col items-center text-center"
          >
            <div
              className={`w-56 h-56 rounded-[44px] flex items-center justify-center text-[88px] bg-gradient-to-br ${ONBOARD[page].color} shadow-float mb-10 anim-float`}
              style={{ transform: "rotate(-3deg)" }}
            >
              <span className="drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                {ONBOARD[page].icon}
              </span>
            </div>
            <h2 className="text-[26px] font-extrabold text-ink tracking-tight text-balance mb-3">
              {ONBOARD[page].title}
            </h2>
            <p className="text-[15px] text-muted leading-relaxed max-w-[300px]">
              {ONBOARD[page].desc}
            </p>
          </div>
        </div>

        <div className="pb-6 space-y-4">
          <Button size="lg" className="w-full" onClick={next}>
            {page === ONBOARD.length - 1 ? "Mulai Sekarang" : "Lanjut"}
          </Button>
          {page === ONBOARD.length - 1 && (
            <button
              onClick={() => navigate("login")}
              className="w-full text-center text-[14px] font-medium text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Sudah punya akun?{" "}
              <span className="text-primary font-semibold">Masuk</span>
            </button>
          )}
        </div>
      </div>
    </Screen>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.1-2 3.2-4.9 3.2-8.3Z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.1 0 5.7-1 7.6-2.7l-3.7-2.8c-1 .7-2.4 1.1-3.9 1.1-3 0-5.6-2-6.5-4.8H1.6v2.9A12 12 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 13.8a7.2 7.2 0 0 1 0-4.6V6.3H1.6a12 12 0 0 0 0 10.4l3.9-2.9Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A12 12 0 0 0 1.6 6.3l3.9 2.9C6.4 7.4 9 5.4 12 5.4Z"
      />
    </svg>
  )
}

export function LoginScreen() {
  const { navigate } = useApp()
  const [email, setEmail] = useState("ibu.sari@gmail.com")
  const [password, setPassword] = useState("••••••••")

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col px-7 py-8">
        <div className="flex justify-center mb-8">
          <Logo size={64} />
        </div>
        <h2 className="text-[26px] font-extrabold text-ink tracking-tight">
          Halo, Selamat Datang! 👋
        </h2>
        <p className="text-[14px] text-muted mt-1.5 mb-8">
          Masuk untuk memantau kesehatan pernapasan si kecil.
        </p>

        <div className="space-y-4">
          <Field
            label="NOMOR HP / EMAIL"
            value={email}
            onChange={setEmail}
            placeholder="nama@email.com"
          />
          <Field
            label="KATA SANDI"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />
          <div className="flex justify-end">
            <button
              onClick={() => navigate("forgot")}
              className="text-[13px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Lupa kata sandi?
            </button>
          </div>
          <Button size="lg" className="w-full" onClick={() => navigate("home")}>
            Masuk
          </Button>
        </div>

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[12px] text-faint font-medium">atau</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate("home")}
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </Button>

        <div className="flex-1" />
        <button
          onClick={() => navigate("register")}
          className="w-full text-center text-[14px] text-muted py-4 cursor-pointer"
        >
          Belum punya akun?{" "}
          <span className="text-primary font-semibold">Daftar gratis</span>
        </button>
      </div>
    </Screen>
  )
}

export function RegisterScreen() {
  const { navigate, back } = useApp()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(true)

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col px-7 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={back}
            aria-label="Kembali"
            className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-ink cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Logo size={36} />
        </div>

        <h2 className="text-[26px] font-extrabold text-ink tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="text-[14px] text-muted mt-1.5 mb-8">
          Daftar gratis untuk mulai skrining kesehatan anak.
        </p>

        <div className="space-y-4">
          <Field
            label="NAMA LENGKAP"
            value={name}
            onChange={setName}
            placeholder="Ibu Sari"
          />
          <Field
            label="NOMOR HP / EMAIL"
            value={email}
            onChange={setEmail}
            placeholder="nama@email.com"
          />
          <Field
            label="KATA SANDI"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimal 8 karakter"
          />
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <button
              onClick={() => setAgree(!agree)}
              className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                agree
                  ? "bg-primary border-primary text-white"
                  : "border-line bg-surface"
              }`}
            >
              {agree && (
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-[13px] text-muted leading-relaxed">
              Saya menyetujui{" "}
              <span className="text-primary font-medium">
                Syarat & Ketentuan
              </span>{" "}
              dan{" "}
              <span className="text-primary font-medium">
                Kebijakan Privasi
              </span>
              .
            </span>
          </label>
          <Button size="lg" className="w-full" onClick={() => navigate("home")}>
            Daftar Gratis
          </Button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[12px] text-faint font-medium">atau</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate("home")}
        >
          <GoogleIcon />
          Daftar dengan Google
        </Button>

        <div className="flex-1" />
        <button
          onClick={() => navigate("login")}
          className="w-full text-center text-[14px] text-muted py-4 cursor-pointer"
        >
          Sudah punya akun?{" "}
          <span className="text-primary font-semibold">Masuk</span>
        </button>
      </div>
    </Screen>
  )
}

export function ForgotScreen() {
  const { navigate, back } = useApp()
  const [sent, setSent] = useState(false)

  return (
    <Screen className="min-h-screen">
      <div className="min-h-screen flex flex-col px-7 py-8">
        <button
          onClick={back}
          aria-label="Kembali"
          className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-ink cursor-pointer mb-8"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {!sent ? (
          <>
            <div className="w-20 h-20 rounded-3xl bg-primary-soft flex items-center justify-center text-[36px] mb-6">
              🔑
            </div>
            <h2 className="text-[26px] font-extrabold text-ink tracking-tight">
              Lupa Kata Sandi?
            </h2>
            <p className="text-[14px] text-muted mt-1.5 mb-8 leading-relaxed">
              Masukkan email terdaftar, kami akan kirimkan tautan untuk mengatur
              ulang kata sandi.
            </p>
            <Field label="NOMOR HP / EMAIL" placeholder="nama@email.com" />
            <Button
              size="lg"
              className="w-full mt-6"
              onClick={() => setSent(true)}
            >
              Kirim Tautan Reset
            </Button>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center anim-scale-in">
            <div className="w-20 h-20 rounded-3xl bg-secondary-soft flex items-center justify-center text-[36px] mb-6">
              📬
            </div>
            <h2 className="text-[24px] font-extrabold text-ink tracking-tight mb-2">
              Cek Email Anda
            </h2>
            <p className="text-[14px] text-muted leading-relaxed max-w-[280px] mb-8">
              Tautan reset kata sandi telah dikirim. Periksa kotak masuk (atau
              folder spam).
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("login")}
            >
              Kembali ke Login
            </Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
