import { useState } from "react"
import { Chip } from "../components/ui"
import { Screen, TopBar } from "../components/layout"
import { useApp } from "../state/AppContext"
import { MOCK_ARTICLES } from "../data/mock"

const CATS = ["Semua", "Pneumonia", "Deteksi", "Gizi", "Darurat"]

const TAGS: Record<string, string> = {
  Penting: "bg-danger-soft text-danger-deep",
  Edukasi: "bg-primary-soft text-primary",
  Panduan: "bg-secondary-soft text-secondary-deep",
  Tips: "bg-accent-soft text-accent-deep",
  Darurat: "bg-danger text-white",
}

const DISEASES = [
  {
    name: "Apa itu Pneumonia?",
    emoji: "🫁",
    desc: "Infeksi paru-paru yang menjadi penyebab utama kematian anak balita. Waspadai sejak dini.",
    color: "from-[#ef4444] to-[#f97316]",
  },
  {
    name: "Gejala Pneumonia",
    emoji: "🌡️",
    desc: "Batuk, napas cepat, tarikan dinding dada, demam, dan hilang nafsu makan.",
    color: "from-[#1d7afc] to-[#3ecf8e]",
  },
  {
    name: "Pencegahan",
    emoji: "💉",
    desc: "Vaksinasi lengkap, ASI eksklusif, gizi baik, dan jauhkan dari asap rokok.",
    color: "from-[#8b5cf6] to-[#ec4899]",
  },
  {
    name: "Kapan ke Dokter",
    emoji: "🚨",
    desc: "Napas cepat, bibir membiru, atau sulit minum — segera ke fasilitas kesehatan.",
    color: "from-[#3ecf8e] to-[#a7f3d0]",
  },
]

const TIPS = [
  {
    icon: "💧",
    title: "Cukupi cairan",
    desc: "Berikan ASI/cairan hangat lebih sering saat batuk.",
  },
  {
    icon: "🛌",
    title: "Istirahat cukup",
    desc: "Posisikan kepala sedikit lebih tinggi saat tidur.",
  },
  {
    icon: "🧴",
    title: "Hindari iritan",
    desc: "Jauhkan anak dari asap rokok dan polusi.",
  },
  {
    icon: "🌡️",
    title: "Pantau suhu",
    desc: "Cek suhu tubuh rutin dan catat perkembangan.",
  },
]

export function EducationScreen() {
  const { navigate } = useApp()
  const [cat, setCat] = useState("Semua")
  const articles =
    cat === "Semua"
      ? MOCK_ARTICLES
      : MOCK_ARTICLES.filter((a) => a.category === cat)

  return (
    <Screen>
      <TopBar
        title="Edukasi Napas"
        right={
          <button
            onClick={() => navigate("article", { articleId: "a6" })}
            className="h-10 px-4 rounded-xl bg-danger-soft text-danger-deep text-[13px] font-bold flex items-center gap-1.5 hover:brightness-95 transition-all cursor-pointer"
          >
            🆘 Darurat
          </button>
        }
      />
      <div className="px-5 pb-32 space-y-6 lg:pb-10">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            🔍
          </span>
          <input
            placeholder="Cari artikel, penyakit, atau tips…"
            className="h-[50px] w-full rounded-2xl border border-line bg-surface pl-11 pr-4 text-[14px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>

        {/* Featured */}
        <button
          onClick={() => navigate("article", { articleId: "a1" })}
          className="w-full text-left rounded-3xl overflow-hidden relative text-white transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="bg-gradient-to-br from-primary to-primary-deep p-6 min-h-[160px] flex flex-col justify-between">
            <span className="absolute -right-6 -bottom-8 text-[110px] opacity-20">
              🫁
            </span>
            <Chip tone="warning" className="w-fit">
              Artikel Unggulan
            </Chip>
            <div className="relative">
              <h2 className="text-[19px] font-extrabold leading-snug mb-2 text-balance">
                Kenali 4 Tanda Bahaya Napas Cepat pada Anak
              </h2>
              <p className="text-[12.5px] text-white/70">
                4 menit baca · Pneumonia
              </p>
            </div>
          </div>
        </button>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                cat === c
                  ? "bg-primary text-white shadow-[0_4px_14px_rgba(29,122,252,0.35)]"
                  : "bg-surface border border-line text-muted hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">
            Artikel Terbaru
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {articles.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate("article", { articleId: a.id })}
                className="text-left rounded-3xl p-4 bg-surface border border-line card-shadow hover:-translate-y-0.5 hover:shadow-float transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center text-[18px]">
                    📄
                  </span>
                  <Chip tone="neutral" className={TAGS[a.tag]}>
                    {a.tag}
                  </Chip>
                </div>
                <p className="text-[14.5px] font-bold text-ink leading-snug mb-2">
                  {a.title}
                </p>
                <p className="text-[12px] text-muted flex items-center gap-1">
                  ⏱️ {a.readTime} · {a.category}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Disease info */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">
            Kenali Penyakit
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {DISEASES.map((d) => (
              <div
                key={d.name}
                className="rounded-3xl p-4 bg-surface border border-line card-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${d.color} flex items-center justify-center text-[24px] mb-3`}
                >
                  {d.emoji}
                </div>
                <p className="text-[14.5px] font-bold text-ink mb-1">
                  {d.name}
                </p>
                <p className="text-[12.5px] text-muted leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Healthy tips */}
        <section>
          <h2 className="text-[16px] font-bold text-ink mb-3">Tips Sehat</h2>
          <div className="grid grid-cols-2 gap-3">
            {TIPS.map((t) => (
              <div
                key={t.title}
                className="rounded-3xl p-4 bg-gradient-to-br from-surface to-surface-2 border border-line card-shadow"
              >
                <span className="text-[26px] block mb-2">{t.icon}</span>
                <p className="text-[13.5px] font-bold text-ink mb-0.5">
                  {t.title}
                </p>
                <p className="text-[12px] text-muted leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Screen>
  )
}

export function ArticleScreen() {
  const { params, back, navigate } = useApp()
  const article =
    MOCK_ARTICLES.find((a) => a.id === params.articleId) ?? MOCK_ARTICLES[0]

  return (
    <Screen>
      <TopBar title="Artikel" />
      <div className="px-5 pb-16 space-y-4">
        <div className="rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-secondary p-8 flex flex-col items-center text-center text-white">
            <span className="text-[64px] mb-4 anim-float">🫁</span>
            <Chip tone="warning">{article.category}</Chip>
            <h1 className="text-[22px] font-extrabold leading-tight mt-4 text-balance">
              {article.title}
            </h1>
            <p className="text-[12.5px] text-white/70 mt-2">
              ⏱️ {article.readTime} baca · NeummoAi-D Edukasi
            </p>
          </div>
        </div>

        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow space-y-4">
          <h2 className="text-[17px] font-bold text-ink">Poin Penting</h2>
          {[
            "Perhatikan pola napas anak: hitung napas per menit saat anak tenang.",
            "Tarikan dinding dada yang kuat menandakan anak berusaha keras bernapas.",
            "Bibir dan kuku membiru adalah tanda darurat — segera ke IGD.",
            "Batuk selama 2 minggu atau lebih perlu pemeriksaan medis.",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-[14px] text-ink leading-relaxed">{p}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-5 bg-surface border border-line card-shadow">
          <h2 className="text-[17px] font-bold text-ink mb-3">
            Kapan Harus ke Dokter?
          </h2>
          <div className="space-y-2.5">
            {[
              {
                text: "Napas lebih cepat dari 40×/menit (anak 1–5 tahun)",
                danger: true,
              },
              {
                text: "Sulit makan/minum atau muntah terus-menerus",
                danger: true,
              },
              { text: "Demam tinggi lebih dari 3 hari", danger: false },
              {
                text: "Batuk mengganggu tidur lebih dari 1 minggu",
                danger: false,
              },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-[3px] shrink-0">
                  {r.danger ? "🔴" : "🟡"}
                </span>
                <p className="text-[13.5px] text-ink leading-relaxed">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("symptoms")}
          className="w-full rounded-3xl p-5 bg-gradient-to-br from-primary to-primary-deep text-white text-center transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <p className="text-[16px] font-extrabold">
            Sudah punya gejala? Cek sekarang
          </p>
          <p className="text-[12.5px] text-white/75 mt-1">
            Skrining cepat hanya 5 detik · Gratis
          </p>
        </button>
      </div>
    </Screen>
  )
}
