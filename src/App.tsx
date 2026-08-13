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
