export type Gender = "male" | "female"
export type ThemeMode = "light" | "dark"
export type Lang = "id" | "en"

export interface Vaccination {
  id: string
  name: string
  date: string
  done: boolean
}

export interface Child {
  id: string
  name: string
  gender: Gender
  birthDate: string
  birthWeight: number
  weight: number
  height: number
  emoji: string
  medicalHistory: string
  vaccinations: Vaccination[]
}

export type RiskLevel = "low" | "medium" | "high"
export type Disease = "Pneumonia"

export interface Screening {
  id: string
  childId: string
  date: string
  symptoms: string[]
  audioDuration: number
  riskLevel: RiskLevel
  disease: Disease
  confidence: number
  status: "synced" | "pending"
}

export interface Article {
  id: string
  title: string
  category: string
  readTime: string
  tag: string
}

export interface AppNotification {
  id: string
  type: "vaccination" | "reminder" | "ai" | "medical"
  title: string
  body: string
  time: string
  read: boolean
}

export interface HealthCenter {
  id: string
  name: string
  distance: string
  address: string
  rating: number
  open: boolean
}

export interface GrowthRecord {
  month: string
  weight: number
  height: number
}

export interface Profile {
  name: string
  email: string
  phone: string
  emoji: string
  role: string
}

export type Route = "splash" | "onboarding" | "login" | "register" | "forgot" | "home" | "children" | "child-form" | "symptoms" | "record" | "processing" | "result" | "history" | "education" | "article" | "notifications" | "profile" | "edit-profile" | "privacy" | "settings"

export interface NavParams {
  [key: string]: string | number | undefined
  childId?: string
  articleId?: string
  screeningId?: string
}
