import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Field, Icon } from "../components/ui"

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.")
      return
    }
    localStorage.setItem("neumod_session", JSON.stringify({ email, role: "dokter" }))
    navigate("/dashboard", { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-bg to-secondary/10 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-surface border border-line rounded-3xl card-shadow p-8 anim-fade-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-[28px] mb-4">N</div>
          <h1 className="text-[22px] font-extrabold text-ink">NeumoAI-D</h1>
          <p className="text-[13px] text-muted mt-1">Dashboard Skrining Pernapasan Anak</p>
        </div>
        <div className="space-y-4">
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@faskes.id" />
          <div>
            <span className="block mb-1.5 text-[13px] font-semibold text-ink">Kata Sandi</span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-[52px] w-full rounded-2xl border border-line bg-surface px-4 pr-12 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Tampilkan kata sandi" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-faint hover:text-primary cursor-pointer">
                <Icon name={showPw ? "user" : "shield"} className="w-5 h-5" />
              </button>
            </div>
          </div>
          {error && <p className="text-[13px] font-semibold text-danger bg-danger-soft rounded-xl px-4 py-3">{error}</p>}
          <Button type="submit" className="w-full">Masuk</Button>
          <p className="text-center text-[12px] text-faint">Demo — gunakan email & kata sandi apa pun</p>
        </div>
      </form>
    </div>
  )
}

export function NotFoundScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <p className="text-[72px] font-black text-primary leading-none mb-4">404</p>
      <h1 className="text-[20px] font-extrabold text-ink mb-2">Halaman tidak ditemukan</h1>
      <p className="text-[14px] text-muted mb-6 text-center max-w-[320px]">Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.</p>
      <Button onClick={() => navigate("/dashboard")}>Kembali ke Dashboard</Button>
    </div>
  )
}
