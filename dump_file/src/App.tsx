import { AppProvider, useApp } from "./state/AppContext"
import { AppNav } from "./components/layout"
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  RegisterScreen,
  ForgotScreen,
} from "./screens/auth"
import { HomeScreen } from "./screens/home"
import { ChildrenScreen, ChildFormScreen } from "./screens/children"
import {
  SymptomsScreen,
  RecordScreen,
  ProcessingScreen,
} from "./screens/screening"
import { ResultScreen } from "./screens/result"
import { HistoryScreen } from "./screens/history"
import { EducationScreen, ArticleScreen } from "./screens/education"
import { NotificationsScreen } from "./screens/notifications"
import {
  ProfileScreen,
  EditProfileScreen,
  PrivacyScreen,
  SettingsScreen,
} from "./screens/profile"

const FULLSCREEN: Record<string, boolean> = {
  splash: true,
  onboarding: true,
  login: true,
  register: true,
  forgot: true,
  processing: true,
}

function Router() {
  const { route } = useApp()

  switch (route) {
    case "splash":
      return <SplashScreen />
    case "onboarding":
      return <OnboardingScreen />
    case "login":
      return <LoginScreen />
    case "register":
      return <RegisterScreen />
    case "forgot":
      return <ForgotScreen />
    case "home":
      return <HomeScreen />
    case "children":
      return <ChildrenScreen />
    case "child-form":
      return <ChildFormScreen />
    case "symptoms":
      return <SymptomsScreen />
    case "record":
      return <RecordScreen />
    case "processing":
      return <ProcessingScreen />
    case "result":
      return <ResultScreen />
    case "history":
      return <HistoryScreen />
    case "education":
      return <EducationScreen />
    case "article":
      return <ArticleScreen />
    case "notifications":
      return <NotificationsScreen />
    case "profile":
      return <ProfileScreen />
    case "edit-profile":
      return <EditProfileScreen />
    case "privacy":
      return <PrivacyScreen />
    case "settings":
      return <SettingsScreen />
    default:
      return <HomeScreen />
  }
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}

function Root() {
  const { route } = useApp()
  const fullscreen = FULLSCREEN[route]
  const hasNav = ["home", "history", "education", "profile"].includes(route)

  return (
    <div className="min-h-screen bg-bg text-ink">
      {fullscreen ? (
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-md min-h-screen anim-fade-in">
            <Router />
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <main className="min-h-screen flex justify-center">
            <div
              className={`w-full anim-fade-in ${
                hasNav ? "max-w-2xl lg:max-w-5xl lg:pl-20 xl:pl-24" : "max-w-md"
              }`}
            >
              <Router />
            </div>
          </main>
          {hasNav && <AppNav />}
        </div>
      )}
    </div>
  )
}
