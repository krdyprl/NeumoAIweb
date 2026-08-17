import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { useT } from "../i18n"
import { PageHeader } from "../components/dashboard"
import { Button, Card, Field, Icon, Segmented, Avatar } from "../components/ui"
import { signOut } from "../lib/auth"
import type { Lang, ThemeMode } from "../types"

export function SettingsScreen() {
  const { doctor, setDoctor, theme, setTheme, lang, setLang } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const [form, setForm] = useState(doctor)
  const [toast, setToast] = useState("")
  const [twoFA, setTwoFA] = useState(true)
  const [notifPrefs, setNotifPrefs] = useState({ ai: true, patient: true, report: true })

  function save() {
    setDoctor(form)
    setToast(t("toast_saved"))
    setTimeout(() => setToast(""), 3000)
  }

  function logout() {
    signOut()
    navigate("/login", { replace: true })
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={t("page.settings")} subtitle={t("settings_subtitle")} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings_doctor_profile")}</h2>
          <div className="flex items-center gap-4 mb-6"><Avatar emoji={form.emoji} size={60} /><div><p className="text-[16px] font-bold text-ink">{form.name}</p><p className="text-[13px] text-muted">{form.role}</p></div></div>
          <div className="space-y-4">
            <Field label={t("field_full_name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label={t("field_specialization")} value={form.specialization} onChange={(v) => setForm({ ...form, specialization: v })} />
            <Field label="NIK" value={form.nik} onChange={(v) => setForm({ ...form, nik: v })} />
            <Field label={t("label_email")} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label={t("field_str")} value={form.str} onChange={(v) => setForm({ ...form, str: v })} />
            <Field label={t("field_facility")} value={form.facility} onChange={(v) => setForm({ ...form, facility: v })} />
            <Field label={t("field_phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings_preferences")}</h2>
            <p className="text-[13px] font-semibold text-muted mb-2">{t("settings_theme")}</p>
            <Segmented options={[{ value: "light", label: t("theme_light") }, { value: "dark", label: t("theme_dark") }] as { value: ThemeMode; label: string }[]} value={theme} onChange={setTheme} />
            <p className="text-[13px] font-semibold text-muted mb-2 mt-5">{t("settings_language")}</p>
            <Segmented options={[{ value: "id", label: t("lang_id") }, { value: "en", label: t("lang_en") }] as { value: Lang; label: string }[]} value={lang} onChange={setLang} />
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings_notifications")}</h2>
            <div className="space-y-3">{[t("notif_new_ai"), t("notif_new_patient"), t("notif_system_update")].map((label, i) => (<label key={i} className="flex items-center justify-between py-2"><span className="text-[14px] text-ink">{label}</span><input type="checkbox" defaultChecked className="accent-primary w-5 h-5" /></label>))}</div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings.security")}</h2>
            <label className="flex items-center justify-between py-2">
              <div>
                <p className="text-[14px] text-ink font-semibold">{t("settings.2fa")}</p>
                <p className="text-[12px] text-muted">{t("settings.2fa_desc")}</p>
              </div>
              <button
                onClick={() => setTwoFA((v) => !v)}
                aria-pressed={twoFA}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${twoFA ? "bg-primary" : "bg-line"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${twoFA ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </label>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings.notif_pref")}</h2>
            <div className="space-y-2">
              {([
                { key: "ai" as const, label: t("notif_new_ai") },
                { key: "patient" as const, label: t("notif_new_patient") },
                { key: "report" as const, label: t("settings_theme") },
              ]).map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between py-2">
                  <span className="text-[14px] text-ink">{label}</span>
                  <input type="checkbox" checked={notifPrefs[key]} onChange={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))} className="accent-primary w-5 h-5" />
                </label>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings.devices")}</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2">
                <span className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center text-[16px]">💻</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink">Chrome · Windows 11</p>
                  <p className="text-[12px] text-muted">{t("settings.device_now")}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-secondary" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2">
                <span className="w-9 h-9 rounded-xl bg-surface-2 text-muted flex items-center justify-center text-[16px]">📱</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink">Safari · iPhone</p>
                  <p className="text-[12px] text-muted">{t("settings.device_last_seen")}: 2 hari lalu</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">{t("settings_account")}</h2>
            <Button variant="danger" className="w-full" onClick={logout}><Icon name="logout" className="w-5 h-5" /> {t("btn.logout")}</Button>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={save}>{t("btn.save_changes")}</Button></div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-bg rounded-2xl px-5 py-3 text-[13px] font-semibold card-shadow anim-fade-up">{toast}</div>}
    </div>
  )
}
