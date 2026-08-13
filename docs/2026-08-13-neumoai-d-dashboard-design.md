# NeumoAI-D Dokter Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo web dashboard for the NeumoAI-D doctor / nakes experience with all dummy data, matching the 8-screen sitemap, using the design language of the `dump_file` reference app.

**Architecture:** React Router v6 provides real client-side routing across 8 screens. Authenticated screens render inside a persistent `DashboardShell` (left sidebar + topbar). A shared design system (Tailwind v4 tokens + `ui.tsx` primitives + `charts.tsx`) is copied from the moved `dump_file/` reference. All dummy data lives in `src/data/doctorMock.ts`. Charts are pure SVG/CSS — no chart library.

**Tech Stack:** React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4 (via `@tailwindcss/vite`), `react-router-dom@^6`. Standalone Vite app (no Figma Make).

## Project location (changed from earlier plan)

- **Working directory for the web app: `D:\NeumoAIweb`** (standalone Vite app, plain config — NO `.figma/` folder, no Figma Make plugins).
- **Reference material: `D:\NeumoAIweb\dump_file\`** — the former `D:\NeumoAI-D\dump_file`, moved here as a read-only reference.
- **`D:\NeumoAI-D`** is left as a pure Flutter project. `dump_file` is removed from it; nothing else in the Flutter project is touched.

## Global Constraints

- **Do NOT modify the Flutter `neumoaid` project** at `D:\NeumoAI-D`: `lib/`, `pubspec.yaml`, `android/`, `test/`, `assets/`, `trainAI/`, `pubspec.lock`, `.dart_tool/`. The only change there is removing `dump_file/` (Task 0).
- **Do NOT modify `dump_file/`** — it is a read-only reference. Copy files FROM it; never edit it.
- All new web code lives in `D:\NeumoAIweb`.
- Only new dependency: `react-router-dom@^6`. No chart library, no backend, no test framework.
- UI copy: **Bahasa Indonesia** default; English as secondary language.
- Design tokens: reuse `dump_file/src/index.css` verbatim (Inter font, `--color-primary #1d7afc`, `--color-secondary #3ecf8e`, `--color-accent #ff8a00`, `--color-danger #ef4444`, light + dark, glass, card-shadow, keyframes).
- Components are **default exports** (AGENTS.md convention).
- Double-quoted strings; balanced JSX/braces.
- Verification: `pnpm build` must pass; `npx tsc --noEmit` must pass.

---

### Task 0: Set up `D:\NeumoAIweb` and move `dump_file` + spec

**Files:**
- Move: `D:\NeumoAI-D\dump_file\**` → `D:\NeumoAIweb\dump_file\` (EXCLUDING `node_modules/` and `dist/`)
- Create: `D:\NeumoAIweb\docs\` and copy the plan/spec into `D:\NeumoAIweb\docs\2026-08-13-neumoai-d-dashboard-design.md`

**Interfaces:**
- Consumes: none.
- Produces: `D:\NeumoAIweb\dump_file\` containing `src/`, `index.html`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`; and `D:\NeumoAIweb\docs\` with the design spec.

- [ ] **Step 1: Move `dump_file` (excluding `node_modules` and `dist`)**

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path "D:\NeumoAIweb\dump_file" | Out-Null
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\src" -Destination "D:\NeumoAIweb\dump_file\src" -Recurse
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\index.html" -Destination "D:\NeumoAIweb\dump_file\index.html"
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\package.json" -Destination "D:\NeumoAIweb\dump_file\package.json"
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\pnpm-lock.yaml" -Destination "D:\NeumoAIweb\dump_file\pnpm-lock.yaml"
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\tsconfig.json" -Destination "D:\NeumoAIweb\dump_file\tsconfig.json"
Copy-Item -LiteralPath "D:\NeumoAI-D\dump_file\vite.config.ts" -Destination "D:\NeumoAIweb\dump_file\vite.config.ts"
```
Expected: `src/` (recursively) + the 5 config files copied into `D:\NeumoAIweb\dump_file\`. `node_modules/` and `dist/` are NOT copied (regenerated later if the reference ever needs to run).

- [ ] **Step 2: Create `D:\NeumoAIweb\docs\` and copy the design spec**

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path "D:\NeumoAIweb\docs" | Out-Null
Copy-Item -LiteralPath "C:\Users\nanya\.local\share\opencode\plans\2026-08-13-neumoai-d-dashboard.md" -Destination "D:\NeumoAIweb\docs\2026-08-13-neumoai-d-dashboard-design.md"
```
Expected: `D:\NeumoAIweb\docs\2026-08-13-neumoai-d-dashboard-design.md` exists.

- [ ] **Step 3: Remove `dump_file` from the Flutter project**

Run (PowerShell):
```powershell
Remove-Item -LiteralPath "D:\NeumoAI-D\dump_file" -Recurse -Force
```
Expected: `D:\NeumoAI-D\dump_file` no longer exists. Nothing else in `D:\NeumoAI-D` changes.

- [ ] **Step 4: Verify the move**

Run: `Test-Path -LiteralPath "D:\NeumoAIweb\dump_file\src"; Test-Path -LiteralPath "D:\NeumoAI-D\dump_file"`
Expected: `True` and `False` respectively.

---

### Task 1: Scaffold the standalone Vite app at `D:\NeumoAIweb`

**Files:**
- Create: `D:\NeumoAIweb\package.json`
- Create: `D:\NeumoAIweb\vite.config.ts`
- Create: `D:\NeumoAIweb\tsconfig.json`
- Create: `D:\NeumoAIweb\tsconfig.node.json`
- Create: `D:\NeumoAIweb\index.html`
- Create: `D:\NeumoAIweb\src\main.tsx`
- Create: `D:\NeumoAIweb\src\index.css`
- Create: `D:\NeumoAIweb\src\vite-env.d.ts`
- Copy: `D:\NeumoAIweb\dump_file\src\components\ui.tsx` → `D:\NeumoAIweb\src\components\ui.tsx` (reuse as-is)
- Copy: `D:\NeumoAIweb\dump_file\src\index.css` → used as the base for `D:\NeumoAIweb\src\index.css` (adjust body to desktop)

**Interfaces:**
- Consumes: none.
- Produces: runnable scaffold + `ui.tsx` design primitives (`Button`, `Card`, `Chip`, `Field`, `Segmented`, `ProgressBar`, `Ring`, `Avatar`, `EmptyState`, `Icon`, `ThemeToggle`). `ui.tsx` imports `useApp` from `../state/AppContext` — that provider is created in Task 2, so the module resolves only after Task 2.

- [ ] **Step 1: Create `D:\NeumoAIweb\package.json`**

```json
{
  "name": "neumoaiweb-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^8.0.0"
  }
}
```

- [ ] **Step 2: Create `D:\NeumoAIweb\vite.config.ts`** (plain — no Figma Make)

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "5173"),
    strictPort: false,
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "5173"),
  },
})
```

- [ ] **Step 3: Create `D:\NeumoAIweb\tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create `D:\NeumoAIweb\tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create `D:\NeumoAIweb\index.html`**

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NeumoAI-D · Dashboard Dokter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `D:\NeumoAIweb\src\main.tsx`**

```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 7: Create `D:\NeumoAIweb\src\vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 8: Create `D:\NeumoAIweb\src\index.css`** (copy from `dump_file`, adjust body to desktop)

Copy `D:\NeumoAIweb\dump_file\src\index.css` to `D:\NeumoAIweb\src\index.css`. It already defines `html, body, #root { height: 100% }` and all tokens. No `max-w-md` shell exists there, so it is already desktop-ready. Do NOT alter the palette or keyframes.

- [ ] **Step 9: Copy `ui.tsx`**

Run: `Copy-Item -LiteralPath "D:\NeumoAIweb\dump_file\src\components\ui.tsx" -Destination "D:\NeumoAIweb\src\components\ui.tsx"`

- [ ] **Step 10: Install dependencies**

Run (workdir `D:\NeumoAIweb`): `pnpm install`
Expected: install succeeds.

- [ ] **Step 11: Verify scaffold (ignore missing App/screens for now)**

Run: `pnpm build`
Expected: fails ONLY because `./App` does not exist yet (Task 4). All config is otherwise valid.

---

### Task 2: Create doctor-domain AppContext provider

**Files:**
- Create: `D:\NeumoAIweb\src\state\AppContext.tsx`

**Interfaces:**
- Consumes: `DoctorProfile`, `Lang`, `ThemeMode` from `../types` (created in Task 3).
- Produces: `AppProvider` + `useApp()` returning:
  ```ts
  {
    theme: ThemeMode;            // "light" | "dark"
    lang: Lang;                  // "id" | "en"
    doctor: DoctorProfile;
    pendingCases: number;
    setTheme: (t: ThemeMode) => void;
    toggleTheme: () => void;
    setLang: (l: Lang) => void;
    setDoctor: (d: DoctorProfile) => void;
    setPendingCases: (n: number | ((p: number) => number)) => void;
  }
  ```

- [ ] **Step 1: Create `D:\NeumoAIweb\src\state\AppContext.tsx`**

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { DoctorProfile, Lang, ThemeMode } from "../types"

interface AppState {
  theme: ThemeMode
  lang: Lang
  doctor: DoctorProfile
  pendingCases: number
  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  setLang: (l: Lang) => void
  setDoctor: (d: DoctorProfile) => void
  setPendingCases: (n: number | ((p: number) => number)) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({
  children,
  doctor,
}: {
  children: ReactNode
  doctor: DoctorProfile
}) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("neumod-theme")
    if (saved === "dark" || saved === "light") return saved
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })
  const [lang, setLang] = useState<Lang>("id")
  const [doctorState, setDoctor] = useState<DoctorProfile>(doctor)
  const [pendingCases, setPendingCases] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("neumod-theme", theme)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  )

  const value = useMemo<AppState>(
    () => ({
      theme,
      lang,
      doctor: doctorState,
      pendingCases,
      setTheme,
      toggleTheme,
      setLang,
      setDoctor,
      setPendingCases,
    }),
    [theme, lang, doctorState, pendingCases, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
```

- [ ] **Step 2: Verify type-checks (resolves after Task 3)**

Run: `npx tsc --noEmit`
Expected: errors ONLY about missing `../types` (added in Task 3). Proceed without fixing yet.

---

### Task 3: Doctor-domain types and dummy data

**Files:**
- Create: `D:\NeumoAIweb\src\types.ts`
- Create: `D:\NeumoAIweb\src\data\doctorMock.ts`

**Interfaces:**
- Consumes: none.
- Produces:
  - `src/types.ts`: `Gender`, `RiskLevel`, `DoctorProfile`, `Patient`, `Screening`, `AiExplain`, `AppNotification`, `ReportRow`, `NavItem`.
  - `src/data/doctorMock.ts`: `CURRENT_DOCTOR`, `PATIENTS`, `SCREENINGS_BY_PATIENT`, `AI_EXPLAIN`, `NOTIFICATIONS`, `REPORTS`, `WEEKLY_SCREENINGS`, `RISK_DISTRIBUTION`, `MONTHLY_REPORTS`, `REGION_REPORTS`, `RISK_LABEL`, `NAV_ITEMS`.

- [ ] **Step 1: Create `D:\NeumoAIweb\src\types.ts`**

```ts
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
}

export interface NavItem {
  path: string
  label: string
  icon: string
}
```

- [ ] **Step 2: Create `D:\NeumoAIweb\src\data\doctorMock.ts`**

```ts
import type {
  AiExplain,
  AppNotification,
  DoctorProfile,
  Patient,
  ReportRow,
  RiskLevel,
  Screening,
} from "../types"

export const CURRENT_DOCTOR: DoctorProfile = {
  name: "dr. Ayu Lestari",
  email: "dr.ayu@neumod.id",
  role: "Dokter Anak",
  nik: "317101198804120001",
  str: "STR-2026-0012345",
  specialization: "Spesialis Anak",
  facility: "Puskesmas Sehat Sejahtera",
  phone: "+62 811-2233-4455",
  emoji: "👩‍⚕️",
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
}

export const PATIENTS: Patient[] = [
  { id: "p1", name: "Arya Putra", nik: "3171011403200001", gender: "male", birthDate: "2023-03-14", address: "Jl. Melati No. 12, Jakarta", phone: "+62 812-1000-0001", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p2", name: "Anya Putri", nik: "3171010211200002", gender: "female", birthDate: "2025-11-02", address: "Jl. Anggrek No. 5, Jakarta", phone: "+62 812-1000-0002", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p3", name: "Raka Saputra", nik: "3171011510190003", gender: "male", birthDate: "2019-10-15", address: "Jl. Kenanga No. 8, Jakarta", phone: "+62 812-1000-0003", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p4", name: "Siti Rahma", nik: "3171012008180004", gender: "female", birthDate: "2018-08-20", address: "Jl. Cempaka No. 3, Jakarta", phone: "+62 812-1000-0004", facility: "Puskesmas Melati" },
  { id: "p5", name: "Bima Nugroho", nik: "3171010503210005", gender: "male", birthDate: "2021-03-05", address: "Jl. Flamboyan No. 9, Jakarta", phone: "+62 812-1000-0005", facility: "Puskesmas Melati" },
  { id: "p6", name: "Dewi Lestari", nik: "3171012810160006", gender: "female", birthDate: "2016-10-28", address: "Jl. Dahlia No. 2, Jakarta", phone: "+62 812-1000-0006", facility: "Puskesmas Cinta Damai" },
  { id: "p7", name: "Fajar Hidayat", nik: "3171010306220007", gender: "male", birthDate: "2022-06-03", address: "Jl. Mawar No. 7, Jakarta", phone: "+62 812-1000-0007", facility: "Puskesmas Cinta Damai" },
  { id: "p8", name: "Intan Permatasari", nik: "3171011111190008", gender: "female", birthDate: "2019-11-11", address: "Jl. Teratai No. 1, Jakarta", phone: "+62 812-1000-0008", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p9", name: "Galih Ramadhan", nik: "3171010901170009", gender: "male", birthDate: "2017-01-09", address: "Jl. Kamboja No. 4, Jakarta", phone: "+62 812-1000-0009", facility: "Puskesmas Melati" },
  { id: "p10", name: "Nadia Ayu", nik: "3171013008200010", gender: "female", birthDate: "2020-08-30", address: "Jl. Sakura No. 6, Jakarta", phone: "+62 812-1000-0010", facility: "Puskesmas Cinta Damai" },
  { id: "p11", name: "Hendra Wijaya", nik: "3171011806150011", gender: "male", birthDate: "2015-06-18", address: "Jl. Cendana No. 11, Jakarta", phone: "+62 812-1000-0011", facility: "Puskesmas Sehat Sejahtera" },
  { id: "p12", name: "Putri Maharani", nik: "3171010712240012", gender: "female", birthDate: "2024-12-07", address: "Jl. Lili No. 13, Jakarta", phone: "+62 812-1000-0012", facility: "Puskesmas Melati" },
]

function screening(id: string, patientId: string, date: string, symptoms: string[], audioDuration: number, riskLevel: RiskLevel, confidence: number, status: Screening["status"], outcome = ""): Screening {
  return { id, patientId, date, symptoms, audioDuration, riskLevel, disease: "Pneumonia", confidence, status, outcome }
}

export const SCREENINGS_BY_PATIENT: Record<string, Screening[]> = {
  p1: [
    screening("s1", "p1", "2026-08-01T09:14:00", ["batuk", "demam", "sesak"], 5, "high", 87, "awaiting"),
    screening("s2", "p1", "2026-07-30T14:00:00", ["batuk", "pilek"], 4, "medium", 62, "done", "Tindak lanjut mandiri"),
    screening("s3", "p1", "2026-03-20T10:00:00", ["batuk"], 3, "low", 18, "done", "Pulang"),
  ],
  p2: [screening("s4", "p2", "2026-07-10T08:30:00", ["demam", "batuk"], 4, "low", 22, "done", "Pulang")],
  p3: [screening("s5", "p3", "2026-08-02T11:00:00", ["batuk", "sesak", "demam"], 6, "high", 91, "awaiting")],
  p4: [
    screening("s6", "p4", "2026-07-25T09:00:00", ["batuk"], 3, "low", 15, "done", "Pulang"),
    screening("s7", "p4", "2026-04-11T10:30:00", ["batuk", "demam"], 4, "medium", 55, "done", "Antibiotik"),
  ],
  p5: [screening("s8", "p5", "2026-08-03T13:00:00", ["sesak", "batuk"], 5, "high", 84, "awaiting")],
  p6: [screening("s9", "p6", "2026-06-18T08:00:00", ["batuk", "pilek"], 3, "low", 12, "done", "Pulang")],
  p7: [screening("s10", "p7", "2026-07-28T14:30:00", ["demam"], 3, "medium", 48, "awaiting")],
  p8: [screening("s11", "p8", "2026-05-02T09:45:00", ["batuk", "sesak"], 4, "high", 79, "done", "Rujuk RS")],
  p9: [screening("s12", "p9", "2026-02-14T10:00:00", ["batuk"], 3, "low", 10, "done", "Pulang")],
  p10: [screening("s13", "p10", "2026-07-05T08:15:00", ["demam", "sesak"], 4, "medium", 58, "done", "Tindak lanjut mandiri")],
  p11: [screening("s14", "p11", "2026-01-22T11:30:00", ["batuk", "demam"], 5, "medium", 52, "done", "Antibiotik")],
  p12: [screening("s15", "p12", "2026-08-04T08:45:00", ["batuk", "pilek"], 4, "low", 25, "awaiting")],
}

function makeAiExplain(id: string, confidence: number): AiExplain {
  const rows = 24
  const cols = 40
  const melGrid: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const base = 0.3 + 0.5 * Math.sin(c / 4 + r / 3)
      row.push(Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.25)))
    }
    melGrid.push(row)
  }
  const gradCam = Array.from({ length: 60 }, (_, i) => ({
    x: (i / 59) * 100,
    y: 50 + 40 * Math.sin(i / 3),
    intensity: 0.15 + 0.8 * Math.pow(Math.sin(i / 4), 2),
  }))
  return {
    patientId: id,
    prediction: "Pneumonia",
    confidence,
    reasoning: [
      "Model mendeteksi pola napas tidak teratur pada segmen 2-4 detik.",
      "Korelasi tinggi dengan referensi suara pneumonia pada basis data pelatihan.",
      "Durasi inspirasi memendek dibanding referensi normal.",
      "Rekomendasi: konfirmasi dengan pemeriksaan fisik dan rontgen dada.",
    ],
    melGrid,
    gradCam,
    shap: [
      { feature: "Durasi inspirasi", contribution: 0.42 },
      { feature: "Bunyi ronki basah", contribution: 0.31 },
      { feature: "Frekuensi dasar", contribution: 0.16 },
      { feature: "Ampiltudo sinyal", contribution: 0.08 },
      { feature: "Rasio H/N", contribution: -0.05 },
    ],
  }
}

export const AI_EXPLAIN: Record<string, AiExplain> = {
  p1: makeAiExplain("p1", 87),
  p3: makeAiExplain("p3", 91),
  p5: makeAiExplain("p5", 84),
  p8: makeAiExplain("p8", 79),
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", type: "ai", title: "Hasil AI tersedia", body: "Skrining Arya Putra: indikasi tinggi pneumonia (87%).", time: "5 menit lalu", read: false },
  { id: "n2", type: "patient", title: "Pasien baru terdaftar", body: "Putri Maharani menambahkan hasil skrining baru.", time: "1 jam lalu", read: false },
  { id: "n3", type: "system", title: "Pembaruan model AI", body: "Model v2.4 dipasang dan aktif untuk semua skrining baru.", time: "3 jam lalu", read: true },
  { id: "n4", type: "ai", title: "Hasil AI tersedia", body: "Skrining Raka Saputra: indikasi tinggi pneumonia (91%).", time: "Kemarin", read: false },
  { id: "n5", type: "patient", title: "Jadwal rujukan", body: "Rujukan RS untuk Intan Permatasari dikonfirmasi.", time: "Kemarin", read: true },
]

export const REPORTS: ReportRow[] = [
  { id: "r1", patientName: "Arya Putra", date: "2026-08-01", riskLevel: "high", confidence: 87, status: "Menunggu keputusan" },
  { id: "r2", patientName: "Raka Saputra", date: "2026-08-02", riskLevel: "high", confidence: 91, status: "Menunggu keputusan" },
  { id: "r3", patientName: "Bima Nugroho", date: "2026-08-03", riskLevel: "high", confidence: 84, status: "Menunggu keputusan" },
  { id: "r4", patientName: "Anya Putri", date: "2026-07-10", riskLevel: "low", confidence: 22, status: "Selesai" },
  { id: "r5", patientName: "Siti Rahma", date: "2026-07-25", riskLevel: "low", confidence: 15, status: "Selesai" },
  { id: "r6", patientName: "Fajar Hidayat", date: "2026-07-28", riskLevel: "medium", confidence: 48, status: "Menunggu keputusan" },
]

export const WEEKLY_SCREENINGS = [12, 18, 15, 22, 19, 25, 30]
export const RISK_DISTRIBUTION = [
  { label: "Rendah", value: 42, color: "var(--color-secondary)" },
  { label: "Sedang", value: 33, color: "var(--color-accent)" },
  { label: "Tinggi", value: 25, color: "var(--color-danger)" },
]
export const MONTHLY_REPORTS = [
  { month: "Mar", total: 96, positive: 9 },
  { month: "Apr", total: 112, positive: 13 },
  { month: "Mei", total: 105, positive: 11 },
  { month: "Jun", total: 128, positive: 16 },
  { month: "Jul", total: 141, positive: 19 },
  { month: "Agu", total: 88, positive: 12 },
]
export const REGION_REPORTS = [
  { region: "Puskesmas Sehat Sejahtera", total: 210 },
  { region: "Puskesmas Melati", total: 150 },
  { region: "Puskesmas Cinta Damai", total: 122 },
]
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors from `types.ts`/`doctorMock.ts`. (App still missing — see Task 4.)

---

### Task 4: Replace App.tsx and create layout + dashboard components

**Files:**
- Create: `D:\NeumoAIweb\src\App.tsx`
- Create: `D:\NeumoAIweb\src\components\layout.tsx`
- Create: `D:\NeumoAIweb\src\components\dashboard.tsx`

**Interfaces:**
- Consumes: `AppProvider`, `useApp` (Task 2); `CURRENT_DOCTOR`, `NAV_ITEMS`, `RISK_LABEL` (Task 3); screen components `LoginScreen`, `DashboardScreen`, `PatientsScreen`, `PatientDetailScreen`, `DecisionsScreen`, `NotificationsScreen`, `ReportsScreen`, `SettingsScreen`, `NotFoundScreen` (Tasks 5–9).
- Produces: default export `App` (router tree); `DashboardShell`, `Sidebar`, `TopBar`; `StatCard`, `PageHeader`, `SearchBar`, `FilterChips`, `EmptyState`, `RiskBadge`.

- [ ] **Step 1: Create `D:\NeumoAIweb\src\components\layout.tsx`**

```tsx
import { useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { Icon, Avatar } from "./ui"

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { doctor, pendingCases } = useApp()
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-line bg-surface shrink-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-line">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">
          N
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold text-ink">NeumoAI-D</p>
          <p className="text-[11px] text-muted">Dashboard Dokter</p>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {[
          { path: "/dashboard", label: "Dashboard", icon: "home" },
          { path: "/patients", label: "Daftar Pasien", icon: "user" },
          { path: "/decisions", label: "Keputusan Dokter", icon: "check" },
          { path: "/notifications", label: "Notifikasi", icon: "bell" },
          { path: "/reports", label: "Laporan", icon: "chart" },
          { path: "/settings", label: "Pengaturan", icon: "edit" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-[0_6px_16px_rgba(29,122,252,0.3)]"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`
            }
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.path === "/decisions" && pendingCases > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center">
                {pendingCases}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-line flex items-center gap-3">
        <Avatar emoji={doctor.emoji} size={40} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[13px] font-bold text-ink truncate">{doctor.name}</p>
          <p className="text-[11px] text-muted truncate">{doctor.role}</p>
        </div>
      </div>
    </aside>
  )
}

export function TopBar() {
  const { doctor, pendingCases, toggleTheme, theme } = useApp()
  const navigate = useNavigate()
  return (
    <header className="flex items-center gap-4 px-6 h-16 border-b border-line bg-bg/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex-1" />
      <button
        onClick={toggleTheme}
        aria-label="Ganti tema"
        className="w-10 h-10 rounded-xl bg-surface-2 text-muted hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} className="w-5 h-5" />
      </button>
      <button
        onClick={() => navigate("/notifications")}
        aria-label="Notifikasi"
        className="relative w-10 h-10 rounded-xl bg-surface-2 text-muted hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
      >
        <Icon name="bell" className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
          {pendingCases}
        </span>
      </button>
      <div className="flex items-center gap-2.5 pl-2 border-l border-line">
        <Avatar emoji={doctor.emoji} size={38} />
        <div className="hidden md:block leading-tight">
          <p className="text-[13px] font-bold text-ink">{doctor.name}</p>
          <p className="text-[11px] text-muted">{doctor.facility}</p>
        </div>
      </div>
    </header>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-bg text-ink flex">
      <Sidebar />
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-line">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-line">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            className="w-10 h-10 rounded-xl bg-surface-2 text-muted flex items-center justify-center cursor-pointer"
          >
            <Icon name="back" className="w-5 h-5 rotate-180" />
          </button>
          <p className="text-[15px] font-bold text-ink">NeumoAI-D</p>
          <span className="w-10" />
        </div>
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `D:\NeumoAIweb\src\components\dashboard.tsx`**

```tsx
import type { ReactNode } from "react"
import type { RiskLevel } from "../types"
import { RISK_LABEL } from "../data/doctorMock"

export function StatCard({ icon, label, value, sub, tone = "primary" }: { icon: string; label: string; value: string | number; sub?: string; tone?: "primary" | "secondary" | "accent" | "danger" }) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary-deep",
    accent: "bg-accent-soft text-accent-deep",
    danger: "bg-danger-soft text-danger-deep",
  }
  return (
    <div className="bg-surface border border-line rounded-3xl card-shadow p-5">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${tones[tone]}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
          <path d={icon === "chart" ? "M3 3v18h18M8 17v-6m4 6V7m4 10v-3" : icon === "user" ? "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-7 9a7 7 0 0 1 14 0H5Z" : icon === "warning" ? "M12 3 1.5 20h21L12 3Zm0 6v5m0 3v.5" : icon === "clock" ? "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v5l3.5 2" : "M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2.5 6.5h17C19.5 14.5 18 13 18 9a6 6 0 0 0-6-6Z"} />
        </svg>
      </div>
      <p className="text-[13px] text-muted font-medium">{label}</p>
      <p className="text-[28px] font-extrabold text-ink leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-[12px] text-faint mt-1">{sub}</p>}
    </div>
  )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const tones: Record<RiskLevel, string> = {
    low: "bg-secondary-soft text-secondary-deep",
    medium: "bg-accent-soft text-accent-deep",
    high: "bg-danger-soft text-danger-deep",
  }
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${tones[level]}`}>{RISK_LABEL[level]}</span>
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="text-[14px] text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm8 15-4-4" /></svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Cari nama atau NIK..."}
        className="h-12 w-full rounded-2xl border border-line bg-surface pl-12 pr-4 text-[15px] text-ink placeholder:text-faint outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
      />
    </div>
  )
}

export function FilterChips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`h-9 px-4 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${value === o ? "bg-primary text-white" : "bg-surface-2 text-muted hover:text-primary"}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center text-[40px] mb-5">{icon}</div>
      <h3 className="text-[18px] font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-[14px] text-muted max-w-[300px] leading-relaxed">{desc}</p>
    </div>
  )
}
```

- [ ] **Step 3: Create `D:\NeumoAIweb\src\App.tsx`**

```tsx
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import type { ReactElement } from "react"
import { AppProvider } from "./state/AppContext"
import { DashboardShell } from "./components/layout"
import { CURRENT_DOCTOR } from "./data/doctorMock"
import { LoginScreen } from "./screens/auth"
import { DashboardScreen } from "./screens/dashboard"
import { PatientsScreen } from "./screens/patients"
import { PatientDetailScreen } from "./screens/patientDetail"
import { DecisionsScreen } from "./screens/decisions"
import { NotificationsScreen } from "./screens/notifications"
import { ReportsScreen } from "./screens/reports"
import { SettingsScreen } from "./screens/settings"

function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation()
  const session = localStorage.getItem("neumod_session")
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider doctor={CURRENT_DOCTOR}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/dashboard" element={<RequireAuth><DashboardShell><DashboardScreen /></DashboardShell></RequireAuth>} />
          <Route path="/patients" element={<RequireAuth><DashboardShell><PatientsScreen /></DashboardShell></RequireAuth>} />
          <Route path="/patients/:id" element={<RequireAuth><DashboardShell><PatientDetailScreen /></DashboardShell></RequireAuth>} />
          <Route path="/decisions" element={<RequireAuth><DashboardShell><DecisionsScreen /></DashboardShell></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><DashboardShell><NotificationsScreen /></DashboardShell></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><DashboardShell><ReportsScreen /></DashboardShell></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><DashboardShell><SettingsScreen /></DashboardShell></RequireAuth>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Verify build compiles (screens not yet created → expect missing-module errors)**

Run: `npx tsc --noEmit`
Expected: errors about missing `./screens/auth`, `./screens/dashboard`, etc. These are created in Tasks 5–9. Proceed without fixing.

---

### Task 5: Login screen, 404, and chart components

**Files:**
- Create: `D:\NeumoAIweb\src\screens\auth.tsx`
- Create: `D:\NeumoAIweb\src\components\charts.tsx`

**Interfaces:**
- Consumes: `useApp` (Task 2), `Button`/`Field`/`Icon` from `ui.tsx`.
- Produces: `LoginScreen`, `NotFoundScreen`; `BarChart`, `AreaChart`, `DonutChart`, `MelSpectrogram`, `GradCam`, `ShapBars`, `WaveformPlayer`.

- [ ] **Step 1: Create `D:\NeumoAIweb\src\screens\auth.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `D:\NeumoAIweb\src\components\charts.tsx`**

```tsx
import { useState } from "react"

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-48">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-muted">{d.value}</span>
          <div className="w-full rounded-t-xl bg-primary/20 hover:bg-primary/40 transition-colors" style={{ height: `${(d.value / max) * 150}px` }} />
          <span className="text-[11px] text-faint truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function AreaChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const w = 560
  const h = 180
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 20) - 10}`)
  const path = `M0,${h} L${pts.join(" L")} L${w},${h} Z`
  const line = `M${pts.join(" L")}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
      <path d={path} fill="var(--color-primary)" opacity="0.15" />
      <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0
  const r = 60
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-40 h-40">
        <g transform="rotate(-90 80 80)">
          {data.map((d) => {
            const frac = d.value / total
            const dash = frac * c
            const seg = <circle key={d.label} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="24" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
            offset += dash
            return seg
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-ink" fontSize="22" fontWeight="800">{total}</text>
        <text x="80" y="98" textAnchor="middle" className="fill-muted" fontSize="11">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[13px]">
            <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.label}</span>
            <span className="font-bold text-ink ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MelSpectrogram({ grid }: { grid: number[][] }) {
  if (!grid.length || !grid[0].length) return <p className="text-[13px] text-muted">Data tidak tersedia.</p>
  const rows = grid.length
  const cols = grid[0].length
  const colors = ["#1d3a6e", "#1d7afc", "#3ecf8e", "#ffd166", "#ff8a00", "#ef4444"]
  function colorFor(v: number) {
    return colors[Math.max(0, Math.min(colors.length - 1, Math.floor(v * (colors.length - 1))))]
  }
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} className="w-full h-48 rounded-xl" preserveAspectRatio="none">
      {grid.map((row, r) =>
        row.map((v, c) => <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={colorFor(v)} />),
      )}
    </svg>
  )
}

export function GradCam({ points }: { points: { x: number; y: number; intensity: number }[] }) {
  const line = points.map((p) => `${p.x},${p.y}`).join(" ")
  return (
    <svg viewBox="0 0 100 100" className="w-full h-40 rounded-xl" preserveAspectRatio="none">
      <polyline points={line} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3 + p.intensity * 6} fill="var(--color-danger)" opacity={0.15 + p.intensity * 0.4} />
      ))}
    </svg>
  )
}

export function ShapBars({ data }: { data: { feature: string; contribution: number }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.contribution)), 0.01)
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.feature} className="flex items-center gap-3">
          <span className="w-44 text-[13px] text-muted text-right">{d.feature}</span>
          <div className="flex-1 flex items-center">
            {d.contribution < 0 && <div className="h-3 rounded-r bg-danger/70" style={{ width: `${(Math.abs(d.contribution) / max) * 50}%` }} />}
            <span className="w-[2px] bg-line h-4 shrink-0" />
            {d.contribution > 0 && <div className="h-3 rounded-l bg-secondary/70" style={{ width: `${(d.contribution / max) * 50}%` }} />}
          </div>
          <span className="w-12 text-[13px] font-bold text-ink">{(d.contribution * 100).toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

export function WaveformPlayer({ duration }: { duration: number }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
      <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Jeda" : "Putar suara"} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer">
        {playing ? <span className="w-3.5 h-3.5 bg-white rounded-[2px]" /> : <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M6 4l14 8-14 8V4Z" /></svg>}
      </button>
      <div className="flex-1 flex items-center gap-1 h-10">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className={`w-1 rounded-full ${playing ? "bg-primary anim-wave" : "bg-primary/30"}`} style={playing ? { animationDelay: `${i * 0.04}s` } : { height: "30%" }} />
        ))}
      </div>
      <span className="text-[12px] text-muted">{duration} dtk</span>
    </div>
  )
}
```

- [ ] **Step 3: Add the waveform keyframe to `D:\NeumoAIweb\src\index.css`**

Append after the existing `.anim-pulse-ring` block:
```css
@keyframes wave-bar {
  0%, 100% { transform: scaleY(0.2); }
  50% { transform: scaleY(1); }
}
.anim-wave {
  animation: wave-bar 0.8s ease-in-out infinite;
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: errors ONLY about missing screens `dashboard`, `patients`, `patientDetail`, `decisions`, `notifications`, `reports`, `settings`.

---

### Task 6: Dashboard and Patients screens

**Files:**
- Create: `D:\NeumoAIweb\src\screens\dashboard.tsx`
- Create: `D:\NeumoAIweb\src\screens\patients.tsx`

**Interfaces:**
- Consumes: `useApp` (Task 2); data (Task 3); `StatCard`, `RiskBadge`, `PageHeader`, `SearchBar`, `FilterChips`, `EmptyState` (Task 4); `AreaChart`, `DonutChart` (Task 5); `Button`, `Card`, `Icon`, `Avatar` from `ui.tsx`.
- Produces: `DashboardScreen`, `PatientsScreen`.

- [ ] **Step 1: Create `D:\NeumoAIweb\src\screens\dashboard.tsx`**

```tsx
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { SCREENINGS_BY_PATIENT, PATIENTS, NOTIFICATIONS, WEEKLY_SCREENINGS, RISK_DISTRIBUTION } from "../data/doctorMock"
import { StatCard, PageHeader, RiskBadge } from "../components/dashboard"
import { AreaChart, DonutChart } from "../components/charts"
import { Button, Card, Icon } from "../components/ui"

export function DashboardScreen() {
  const { doctor, pendingCases } = useApp()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam"
  const totalPatients = PATIENTS.length
  const todayScreening = SCREENINGS_BY_PATIENT.p1.length + SCREENINGS_BY_PATIENT.p3.length + SCREENINGS_BY_PATIENT.p5.length
  const highRisk = Object.values(SCREENINGS_BY_PATIENT).flat().filter((s) => s.riskLevel === "high" && s.status === "awaiting").length

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title={`${greet}, ${doctor.name}`} subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="user" label="Total Pasien Terdaftar" value={totalPatients} sub="+2 minggu ini" tone="primary" />
        <StatCard icon="chart" label="Skrining Hari Ini" value={todayScreening} sub="3 menunggu" tone="secondary" />
        <StatCard icon="warning" label="Terindikasi Pneumonia" value={highRisk} sub="risiko tinggi" tone="danger" />
        <StatCard icon="clock" label="Menunggu Keputusan" value={pendingCases} sub="perlu tinjauan" tone="accent" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining — 30 Hari Terakhir</h2><AreaChart data={WEEKLY_SCREENINGS} /></Card>
          <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Tingkat Risiko</h2><DonutChart data={RISK_DISTRIBUTION} /></Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-ink">Kasus Menunggu Keputusan</h2>
              <button onClick={() => navigate("/decisions")} className="text-[13px] font-semibold text-primary hover:underline cursor-pointer">Lihat semua</button>
            </div>
            <div className="space-y-3">
              {Object.entries(SCREENINGS_BY_PATIENT).flatMap(([pid, list]) => list.filter((s) => s.status === "awaiting").map((s) => ({ ...s, patient: PATIENTS.find((p) => p.id === pid) }))).slice(0, 3).map((s) => (
                <button key={s.id} onClick={() => navigate(`/patients/${s.patient?.id}`)} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-surface-2 hover:bg-primary-soft transition-colors cursor-pointer">
                  <RiskBadge level={s.riskLevel} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold text-ink truncate">{s.patient?.name}</span>
                    <span className="block text-[12px] text-muted truncate">{s.disease} · {s.confidence}%</span>
                  </span>
                  <Icon name="chevron" className="w-4 h-4 text-faint" />
                </button>
              ))}
              {highRisk === 0 && <p className="text-[13px] text-muted text-center py-2">Tidak ada kasus menunggu.</p>}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">Notifikasi Terbaru</h2>
            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-line" : "bg-primary"}`} />
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{n.title}</p>
                    <p className="text-[12px] text-muted line-clamp-2">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-primary to-primary-deep border-transparent">
            <h2 className="text-[16px] font-bold text-white mb-1">Buka Daftar Pasien</h2>
            <p className="text-[13px] text-white/80 mb-4">Tinjau dan kelola hasil skrining pasien.</p>
            <Button variant="secondary" onClick={() => navigate("/patients")} className="w-full">Daftar Pasien</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `D:\NeumoAIweb\src\screens\patients.tsx`**

```tsx
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PATIENTS, SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { PageHeader, SearchBar, FilterChips, RiskBadge, EmptyState } from "../components/dashboard"
import { Card, Avatar, Icon } from "../components/ui"

const FILTERS = ["Semua", "Perlu Ditindaklanjuti", "Rendah", "Sedang", "Tinggi"]

export function PatientsScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("Semua")

  const rows = useMemo(() => {
    return PATIENTS.map((p) => ({ patient: p, latest: (SCREENINGS_BY_PATIENT[p.id] ?? [])[0] })).filter(({ patient, latest }) => {
      const q = query.toLowerCase()
      if (q && !patient.name.toLowerCase().includes(q) && !patient.nik.includes(q)) return false
      if (filter === "Semua") return true
      if (filter === "Perlu Ditindaklanjuti") return latest?.status === "awaiting"
      return latest?.riskLevel === filter.toLowerCase()
    })
  }, [query, filter])

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Daftar Pasien" subtitle={`${PATIENTS.length} pasien terdaftar`} />
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <SearchBar value={query} onChange={setQuery} />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>
      {rows.length === 0 ? (
        <Card><EmptyState icon="🔍" title="Tidak ada pasien" desc="Coba ubah kata kunci pencarian atau filter." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">NIK</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">Umur / JK</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">Hasil</th>
                  <th className="px-5 py-3 font-semibold">Risiko</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ patient, latest }) => {
                  const birth = new Date(patient.birthDate)
                  const ageY = new Date().getFullYear() - birth.getFullYear()
                  const ageM = Math.max(0, new Date().getMonth() - birth.getMonth())
                  return (
                    <tr key={patient.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={38} /><span className="font-semibold text-ink">{patient.name}</span></div></td>
                      <td className="px-5 py-3 text-muted text-[13px] hidden md:table-cell">{patient.nik}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{ageY} th {ageM} bl · {patient.gender === "male" ? "L" : "P"}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden lg:table-cell">{latest ? `${latest.disease} · ${latest.confidence}%` : "—"}</td>
                      <td className="px-5 py-3">{latest ? <RiskBadge level={latest.riskLevel} /> : <span className="text-[12px] text-faint">Belum ada</span>}</td>
                      <td className="px-5 py-3 text-[13px] text-muted hidden sm:table-cell">{latest ? new Date(latest.date).toLocaleDateString("id-ID") : "—"}</td>
                      <td className="px-5 py-3"><button onClick={() => navigate(`/patients/${patient.id}`)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer">Detail <Icon name="chevron" className="w-4 h-4" /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: errors ONLY about remaining screens `patientDetail`, `decisions`, `notifications`, `reports`, `settings`.

---

### Task 7: Patient detail screen with AI visualizations

**Files:**
- Create: `D:\NeumoAIweb\src\screens\patientDetail.tsx`

**Interfaces:**
- Consumes: `PATIENTS`, `SCREENINGS_BY_PATIENT`, `AI_EXPLAIN` (Task 3); `PageHeader`, `RiskBadge`, `EmptyState` (Task 4); `MelSpectrogram`, `GradCam`, `ShapBars`, `WaveformPlayer` (Task 5); `Button`, `Card`, `Chip`, `Avatar`, `Icon`, `Segmented` from `ui.tsx`.
- Produces: `PatientDetailScreen` (reads `:id` via `useParams`).

- [ ] **Step 1: Create `D:\NeumoAIweb\src\screens\patientDetail.tsx`**

```tsx
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PATIENTS, SCREENINGS_BY_PATIENT, AI_EXPLAIN } from "../data/doctorMock"
import { PageHeader, RiskBadge, EmptyState } from "../components/dashboard"
import { MelSpectrogram, GradCam, ShapBars, WaveformPlayer } from "../components/charts"
import { Button, Card, Chip, Avatar, Icon, Segmented } from "../components/ui"

const TABS = [
  { value: "history", label: "Riwayat" },
  { value: "ai", label: "Skrining AI" },
  { value: "medical", label: "Rekam Medis" },
]

export function PatientDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<"history" | "ai" | "medical">("ai")

  const patient = PATIENTS.find((p) => p.id === id)
  if (!patient) {
    return <div className="p-6 max-w-[1280px] mx-auto"><EmptyState icon="🙁" title="Pasien tidak ditemukan" desc="Pasien dengan ID tersebut tidak tersedia." /></div>
  }

  const screenings = SCREENINGS_BY_PATIENT[patient.id] ?? []
  const latest = screenings[0]
  const explain = AI_EXPLAIN[patient.id]
  const birth = new Date(patient.birthDate)
  const ageY = new Date().getFullYear() - birth.getFullYear()

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <button onClick={() => navigate("/patients")} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-primary mb-4 cursor-pointer">
        <Icon name="back" className="w-4 h-4" /> Kembali ke Daftar Pasien
      </button>

      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar emoji={patient.gender === "male" ? "👦" : "👧"} size={64} />
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-extrabold text-ink">{patient.name}</h1>
            <p className="text-[13px] text-muted">NIK {patient.nik} · {ageY} tahun</p>
            <p className="text-[13px] text-muted">{patient.gender === "male" ? "Laki-laki" : "Perempuan"} · {patient.facility}</p>
            <p className="text-[13px] text-muted">{patient.address} · {patient.phone}</p>
          </div>
          {latest && <div className="text-right"><RiskBadge level={latest.riskLevel} /><p className="text-[13px] text-muted mt-2">Confidence {latest.confidence}%</p></div>}
        </div>
      </Card>

      <div className="mb-6"><Segmented options={TABS} value={tab} onChange={setTab} /></div>

      {tab === "history" && (
        <div className="space-y-3">
          {screenings.length === 0 && <Card><EmptyState icon="📋" title="Belum ada skrining" desc="Belum ada riwayat skrining untuk pasien ini." /></Card>}
          {screenings.map((s) => (
            <Card key={s.id} className="p-5 flex flex-wrap items-center gap-4">
              <RiskBadge level={s.riskLevel} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink">{s.disease} · {s.confidence}%</p>
                <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {s.audioDuration} dtk · {s.symptoms.join(", ")}</p>
              </div>
              <Chip tone={s.status === "done" ? "secondary" : "accent"}>{s.outcome ?? (s.status === "awaiting" ? "Menunggu" : s.status)}</Chip>
            </Card>
          ))}
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-6">
          <div className="p-4 bg-danger-soft border border-danger/20 rounded-2xl text-[13px] text-danger-deep font-medium">⚠️ Hasil AI adalah alat bantu skrining. Keputusan klinis tetap sepenuhnya pada dokter.</div>
          {latest ? (
            <>
              <Card className="p-6">
                <h2 className="text-[16px] font-bold text-ink mb-4">Ringkasan Prediksi</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-[12px] text-muted">Penyakit</p><p className="text-[15px] font-bold text-ink">{latest.disease}</p></div>
                  <div><p className="text-[12px] text-muted">Confidence</p><p className="text-[15px] font-bold text-ink">{latest.confidence}%</p></div>
                  <div><p className="text-[12px] text-muted">Risiko</p><RiskBadge level={latest.riskLevel} /></div>
                  <div><p className="text-[12px] text-muted">Gejala</p><p className="text-[15px] font-bold text-ink">{latest.symptoms.join(", ")}</p></div>
                </div>
              </Card>
              {explain ? (
                <>
                  <Card className="p-6">
                    <h2 className="text-[16px] font-bold text-ink mb-4">Alasan Prediksi (AI Reasoning)</h2>
                    <ul className="space-y-2">{explain.reasoning.map((r, i) => (<li key={i} className="flex gap-2 text-[14px] text-muted"><Icon name="check" className="w-4 h-4 text-secondary shrink-0" />{r}</li>))}</ul>
                  </Card>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Pemutaran Suara Napas</h2><WaveformPlayer duration={latest.audioDuration} /></Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Mel-Spektrogram</h2><MelSpectrogram grid={explain.melGrid} /><p className="text-[12px] text-muted mt-2">Representasi frekuensi-waktu dari sinyal suara napas.</p></Card>
                    <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Grad-CAM</h2><GradCam points={explain.gradCam} /><p className="text-[12px] text-muted mt-2">Area yang paling berpengaruh terhadap prediksi (merah = tinggi).</p></Card>
                  </div>
                  <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Kontribusi Fitur (SHAP)</h2><ShapBars data={explain.shap} /></Card>
                </>
              ) : (
                <Card><EmptyState icon="📊" title="Belum ada analisis AI" desc="Analisis Grad-CAM, spektrogram, dan SHAP belum tersedia untuk skrining ini." /></Card>
              )}
            </>
          ) : (
            <Card><EmptyState icon="📊" title="Belum ada skrining" desc="Belum ada hasil skrining AI untuk pasien ini." /></Card>
          )}
        </div>
      )}

      {tab === "medical" && (
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-ink mb-4">Catatan & Rekam Medis</h2>
          <div className="space-y-4">
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Diagnosis</label><input defaultValue={latest ? `${latest.disease}` : ""} className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Catatan Dokter</label><textarea rows={4} defaultValue="Perlu pemeriksaan fisik dan penilaian klinis lebih lanjut." className="w-full rounded-2xl border border-line bg-surface p-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none" /></div>
            <div><label className="block mb-1.5 text-[13px] font-semibold text-ink">Tindak Lanjut / Rujukan</label><input defaultValue="" placeholder="Rujuk ke rumah sakit / tindak lanjut mandiri" className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            <Button>Simpan Rekam Medis</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: errors ONLY about remaining screens `decisions`, `notifications`, `reports`, `settings`.

---

### Task 8: Decisions, Notifications, and Reports screens

**Files:**
- Create: `D:\NeumoAIweb\src\screens\decisions.tsx`
- Create: `D:\NeumoAIweb\src\screens\notifications.tsx`
- Create: `D:\NeumoAIweb\src\screens\reports.tsx`

**Interfaces:**
- Consumes: `useApp` (Task 2); data (Task 3); `PageHeader`, `RiskBadge`, `EmptyState`, `FilterChips`, `StatCard` (Task 4); `BarChart` (Task 5); `Button`, `Card`, `Chip`, `Avatar`, `Icon`, `Field` from `ui.tsx`.
- Produces: `DecisionsScreen`, `NotificationsScreen`, `ReportsScreen`.

- [ ] **Step 1: Create `D:\NeumoAIweb\src\screens\decisions.tsx`**

```tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { PATIENTS, SCREENINGS_BY_PATIENT } from "../data/doctorMock"
import { PageHeader, RiskBadge, EmptyState } from "../components/dashboard"
import { Button, Card, Avatar, Icon } from "../components/ui"
import type { Screening } from "../types"

export function DecisionsScreen() {
  const { setPendingCases } = useApp()
  const navigate = useNavigate()
  const [queue, setQueue] = useState<Screening[]>(() => Object.values(SCREENINGS_BY_PATIENT).flat().filter((s) => s.status === "awaiting"))
  const [modal, setModal] = useState<{ s: Screening; action: "accept" | "reject" } | null>(null)

  function confirm() {
    if (!modal) return
    setQueue((q) => q.filter((s) => s.id !== modal.s.id))
    setPendingCases((p) => Math.max(0, p - 1))
    setModal(null)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Keputusan Dokter" subtitle={`${queue.length} kasus menunggu keputusan`} />
      {queue.length === 0 ? (
        <Card><EmptyState icon="✅" title="Tidak ada kasus menunggu" desc="Semua skrining telah ditindaklanjuti." /></Card>
      ) : (
        <div className="space-y-4">
          {queue.map((s) => {
            const patient = PATIENTS.find((p) => p.id === s.patientId)
            return (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar emoji={patient?.gender === "male" ? "👦" : "👧"} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-[15px] font-bold text-ink">{patient?.name}</p><RiskBadge level={s.riskLevel} /></div>
                    <p className="text-[13px] text-muted mt-0.5">{s.disease} · Confidence {s.confidence}%</p>
                    <p className="text-[13px] text-muted">{new Date(s.date).toLocaleDateString("id-ID")} · {s.audioDuration} dtk · Gejala: {s.symptoms.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setModal({ s, action: "accept" })}>Terima / Rujuk</Button>
                    <Button variant="outline" onClick={() => setModal({ s, action: "reject" })}>Tolak</Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-surface border border-line rounded-3xl card-shadow p-6 max-w-md w-full anim-scale-in">
            <h3 className="text-[18px] font-bold text-ink mb-2">{modal.action === "accept" ? "Terima / Rujuk pasien?" : "Tolak pasien?"}</h3>
            <p className="text-[14px] text-muted mb-6">{modal.action === "accept" ? "Anda akan menindaklanjuti pasien dengan merujuk atau memberi tindakan medis lanjutan." : "Anda akan menolak rekomendasi AI dan menindaklanjuti pasien secara mandiri."}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Batal</Button>
              <Button variant={modal.action === "accept" ? "secondary" : "danger"} className="flex-1" onClick={confirm}>Konfirmasi</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `D:\NeumoAIweb\src\screens\notifications.tsx`**

```tsx
import { useState } from "react"
import { NOTIFICATIONS } from "../data/doctorMock"
import { PageHeader, FilterChips, EmptyState } from "../components/dashboard"
import { Button, Card, Icon } from "../components/ui"

const FILTERS = ["Semua", "AI", "Pasien", "Sistem"]

export function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState("Semua")

  const filtered = items.filter((n) => {
    if (filter === "Semua") return true
    if (filter === "AI") return n.type === "ai"
    if (filter === "Pasien") return n.type === "patient"
    return n.type === "system"
  })
  const unread = items.filter((n) => !n.read).length

  const tones: Record<string, string> = {
    ai: "bg-primary-soft text-primary",
    patient: "bg-secondary-soft text-secondary-deep",
    system: "bg-accent-soft text-accent-deep",
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Notifikasi" subtitle={`${unread} belum dibaca`} actions={<Button variant="outline" onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}>Tandai semua dibaca</Button>} />
      <div className="mb-5"><FilterChips options={FILTERS} value={filter} onChange={setFilter} /></div>
      {filtered.length === 0 ? (
        <Card><EmptyState icon="🔔" title="Tidak ada notifikasi" desc="Tidak ada notifikasi pada filter ini." /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card key={n.id} className={`p-4 flex items-start gap-3 ${n.read ? "opacity-70" : ""}`}>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tones[n.type]}`}><Icon name={n.type === "ai" ? "wave" : n.type === "patient" ? "user" : "refresh"} className="w-5 h-5" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink flex items-center gap-2">{n.title}{!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}</p>
                <p className="text-[13px] text-muted">{n.body}</p>
                <p className="text-[12px] text-faint mt-1">{n.time}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `D:\NeumoAIweb\src\screens\reports.tsx`**

```tsx
import { useState } from "react"
import { REPORTS, MONTHLY_REPORTS, REGION_REPORTS } from "../data/doctorMock"
import { PageHeader, RiskBadge, StatCard } from "../components/dashboard"
import { BarChart } from "../components/charts"
import { Button, Card, Chip, Field } from "../components/ui"

export function ReportsScreen() {
  const [toast, setToast] = useState("")
  const total = REPORTS.reduce((s, r) => s + (r.riskLevel === "high" ? 1 : 0), 0)
  const avgConf = Math.round(REPORTS.reduce((s, r) => s + r.confidence, 0) / REPORTS.length)
  const referrals = REPORTS.filter((r) => r.status.includes("Rujuk") || r.status.includes("Menunggu")).length

  function fakeExport(kind: string) {
    setToast(`Ekspor ${kind} (demo) sedang diproses.`)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Laporan" subtitle="Rekap aktivitas skrining" actions={<><Button variant="outline" onClick={() => fakeExport("PDF")}>Ekspor PDF</Button><Button onClick={() => fakeExport("Excel")}>Ekspor Excel</Button></>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="chart" label="Total Skrining" value={REPORTS.length} tone="primary" />
        <StatCard icon="warning" label="Terindikasi Pneumonia" value={total} tone="danger" />
        <StatCard icon="user" label="Rata-rata Confidence" value={`${avgConf}%`} tone="secondary" />
        <StatCard icon="location" label="Rujukan / Menunggu" value={referrals} tone="accent" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining per Bulan</h2><BarChart data={MONTHLY_REPORTS.map((m) => ({ label: m.month, value: m.total }))} /></Card>
        <Card className="p-6"><h2 className="text-[16px] font-bold text-ink mb-4">Skrining per Wilayah</h2><BarChart data={REGION_REPORTS.map((r) => ({ label: r.region, value: r.total }))} /></Card>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <Field label="Dari" value="2026-01-01" onChange={() => {}} />
        <Field label="Sampai" value="2026-08-31" onChange={() => {}} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-2 text-[12px] text-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Pasien</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Risiko</th>
                <th className="px-5 py-3 font-semibold">Confidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr key={r.id} className="border-t border-line hover:bg-surface-2/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-ink">{r.patientName}</td>
                  <td className="px-5 py-3 text-muted text-[13px]">{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3"><RiskBadge level={r.riskLevel} /></td>
                  <td className="px-5 py-3 text-[13px] text-muted">{r.confidence}%</td>
                  <td className="px-5 py-3"><Chip tone={r.status.includes("Menunggu") ? "accent" : "secondary"}>{r.status}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-bg rounded-2xl px-5 py-3 text-[13px] font-semibold card-shadow anim-fade-up">{toast}</div>}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: errors ONLY about the remaining `settings` screen.

---

### Task 9: Settings screen

**Files:**
- Create: `D:\NeumoAIweb\src\screens\settings.tsx`

**Interfaces:**
- Consumes: `useApp` (Task 2); `CURRENT_DOCTOR` (Task 3); `PageHeader` (Task 4); `Button`, `Card`, `Field`, `Icon`, `Segmented`, `Avatar` from `ui.tsx`.
- Produces: `SettingsScreen` (reads `doctor`, `setDoctor`, `theme`, `setTheme`, `lang`, `setLang`; logout clears `localStorage.neumod_session` and navigates to `/login`).

- [ ] **Step 1: Create `D:\NeumoAIweb\src\screens\settings.tsx`**

```tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../state/AppContext"
import { CURRENT_DOCTOR } from "../data/doctorMock"
import { PageHeader } from "../components/dashboard"
import { Button, Card, Field, Icon, Segmented, Avatar } from "../components/ui"

export function SettingsScreen() {
  const { doctor, setDoctor, theme, setTheme, lang, setLang } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(doctor)
  const [toast, setToast] = useState("")

  function save() {
    setDoctor(form)
    setToast("Perubahan berhasil disimpan (demo).")
    setTimeout(() => setToast(""), 3000)
  }

  function logout() {
    localStorage.removeItem("neumod_session")
    navigate("/login", { replace: true })
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto anim-fade-up">
      <PageHeader title="Pengaturan" subtitle="Kelola profil dan preferensi" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-ink mb-4">Profil Dokter</h2>
          <div className="flex items-center gap-4 mb-6"><Avatar emoji={form.emoji} size={60} /><div><p className="text-[16px] font-bold text-ink">{form.name}</p><p className="text-[13px] text-muted">{form.role}</p></div></div>
          <div className="space-y-4">
            <Field label="Nama Lengkap" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Spesialisasi" value={form.specialization} onChange={(v) => setForm({ ...form, specialization: v })} />
            <Field label="NIK" value={form.nik} onChange={(v) => setForm({ ...form, nik: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Nomor STR" value={form.str} onChange={(v) => setForm({ ...form, str: v })} />
            <Field label="Faskes" value={form.facility} onChange={(v) => setForm({ ...form, facility: v })} />
            <Field label="Telepon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">Preferensi</h2>
            <p className="text-[13px] font-semibold text-muted mb-2">Tema</p>
            <Segmented options={[{ value: "light", label: "Terang" }, { value: "dark", label: "Gelap" }]} value={theme} onChange={setTheme} />
            <p className="text-[13px] font-semibold text-muted mb-2 mt-5">Bahasa</p>
            <Segmented options={[{ value: "id", label: "Bahasa Indonesia" }, { value: "en", label: "English" }]} value={lang} onChange={setLang} />
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">Notifikasi</h2>
            <div className="space-y-3">{["Hasil skrining AI baru", "Pasien baru terdaftar", "Pembaruan sistem"].map((label, i) => (<label key={i} className="flex items-center justify-between py-2"><span className="text-[14px] text-ink">{label}</span><input type="checkbox" defaultChecked className="accent-primary w-5 h-5" /></label>))}</div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[16px] font-bold text-ink mb-4">Akun</h2>
            <Button variant="danger" className="w-full" onClick={logout}><Icon name="logout" className="w-5 h-5" /> Keluar</Button>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={save}>Simpan Perubahan</Button></div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-bg rounded-2xl px-5 py-3 text-[13px] font-semibold card-shadow anim-fade-up">{toast}</div>}
    </div>
  )
}
```

- [ ] **Step 2: Verify full build**

Run: `pnpm build`
Expected: production build succeeds with no TypeScript errors.

- [ ] **Step 3: Verify typecheck clean**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 10: Final verification

**Files:**
- No new files.

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Run production build**

Run: `pnpm build`
Expected: build succeeds, `dist/` produced.

- [ ] **Step 2: Confirm Flutter project untouched**

Run: `git status --short lib/ pubspec.yaml android/ test/ assets/ trainAI/`
Expected: only the pre-existing Flutter modifications remain; NO new web files appear under the Flutter paths. The dashboard lives entirely under `D:\NeumoAIweb`.

- [ ] **Step 3: Manual smoke test via dev server**

Run: `pnpm dev` (in `D:\NeumoAIweb`), open the printed local URL.
1. `/` → redirected to `/dashboard` → redirected to `/login` (no session).
2. Empty login → inline error. Any email/password → `/dashboard`.
3. `/dashboard` shows greeting, 4 KPIs, area chart, donut, pending cases, notifications, CTA.
4. `/patients` — table + search + filter; Detail → `/patients/p1`.
5. `/patients/p1` — Skrining AI tab shows spectrogram, Grad-CAM, SHAP, waveform; Riwayat and Rekam Medis tabs work.
6. `/decisions` — confirm dialog; case leaves queue, count decrements.
7. `/notifications` — "Tandai semua dibaca" clears dots.
8. `/reports` — KPIs, two bar charts, table, export toasts.
9. `/settings` — edit + save toast; dark toggle; logout → `/login`.
10. Dark mode toggle reflects across screens.

- [ ] **Step 4: Fix any issues**, then re-run `pnpm build` until clean.

---

## Self-Review Notes

- **Scope:** All 8 sitemap screens covered (Tasks 5–9). Auth gate + 404 (Tasks 4–5). Visualizations (mel-spectrogram, Grad-CAM, SHAP, waveform) (Task 5 + Task 7). Dummy data (Task 3). Theme/lang (Task 2 + Task 9). Responsive sidebar (Task 4). Move/setup (Task 0).
- **Placeholders:** None — every step has concrete code.
- **Type consistency:** `DoctorProfile`/`Lang`/`ThemeMode` defined once in `types.ts`; `useApp()` shape consistent; `RiskBadge`/`StatCard`/`PageHeader`/`SearchBar`/`FilterChips`/`EmptyState` signatures consistent; `RiskLevel` values `low|medium|high` align with `RISK_LABEL`.
- **Verify imports:** `useState` imported in `layout.tsx` (Task 4) and `charts.tsx` (Task 5); `useNavigate`/`NavLink` from `react-router-dom` in `layout.tsx`; `ReactElement` type imported in `App.tsx`.
- **Runtime:** Standalone Vite, no `.figma` dependency. `vite.config.ts` is plain.
