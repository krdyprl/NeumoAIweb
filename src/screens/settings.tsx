import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { useT } from "../i18n"
import { PageHeader } from "../components/dashboard"
import { Button, Card, Field, Icon, Segmented, Avatar } from "../components/ui"
import type { Lang, ThemeMode } from "../types"

export function SettingsScreen() {
  const { doctor, setDoctor, theme, setTheme, lang, setLang } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const [form, setForm] = useState(doctor)
  const [toast, setToast] = useState("")

  function save() {
    setDoctor(form)
    setToast(t("toast_saved"))
    setTimeout(() => setToast(""), 3000)
  }

  function logout() {
    localStorage.removeItem("neumod_session")
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
