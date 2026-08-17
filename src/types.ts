export type Gender = "male" | "female"
export type ThemeMode = "light" | "dark"
export type Lang = "id" | "en"
export type RiskLevel = "low" | "medium" | "high"

export interface DoctorProfile {
  name: string
  email: string
  role: string
  nik: string
  str: string
  specialization: string
  facility: string
  phone: string
  emoji: string
}

export interface Patient {
  id: string
  name: string
  nik: string
  gender: Gender
  birthDate: string
  address: string
  phone: string
  facility: string
}

export interface Vitals {
  heartRate: number
  respiratoryRate: number
  spo2: number
  temperature: number
  weight: number
}

export interface Screening {
  id: string
  patientId: string
  date: string
  symptoms: string[]
  audioDuration: number
  riskLevel: RiskLevel
  disease: string
  confidence: number
  status: "awaiting" | "accepted" | "rejected" | "done"
  outcome?: string
  vitals: Vitals
  modelVersion: string
  trend: number[]
  audioUrl?: string
  patientName?: string
}

export interface Activity {
  id: string
  type: "ai" | "patient" | "system" | "report"
  title: string
  body: string
  time: string
  icon: string
  patientId?: string
}

export interface TaskItem {
  id: string
  title: string
  body: string
  priority: "high" | "medium" | "low"
  patientId?: string
}

export interface AiExplain {
  patientId: string
  prediction: string
  confidence: number
  reasoning: string[]
  melGrid: number[][]
  gradCam: { x: number; y: number; intensity: number }[]
  shap: { feature: string; contribution: number }[]
}

export interface AppNotification {
  id: string
  type: "ai" | "patient" | "system"
  title: string
  body: string
  time: string
  read: boolean
}

export interface ReportRow {
  id: string
  patientName: string
  date: string
  riskLevel: RiskLevel
  confidence: number
  status: string
  modelVersion: string
  reviewer: string
}

export interface NavItem {
  path: string
  label: string
  icon: string
}
