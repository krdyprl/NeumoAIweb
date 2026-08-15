const FALLBACKS: Record<string, string> = {
  "--color-ink": "#1a2233",
  "--color-muted": "#64748b",
  "--color-line": "#e2e8f0",
  "--color-surface": "#ffffff",
  "--color-primary": "#1d7afc",
  "--color-secondary": "#3ecf8e",
  "--color-danger": "#ef4444",
  "--color-accent": "#ff8a00",
}

export function resolveCssVar(name: string, fallback?: string): string {
  if (typeof window === "undefined") return fallback ?? FALLBACKS[name] ?? "#000000"
  const computed = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return computed || fallback || FALLBACKS[name] || "#000000"
}

export function chartColors() {
  return {
    ink: resolveCssVar("--color-ink"),
    muted: resolveCssVar("--color-muted"),
    line: resolveCssVar("--color-line"),
    surface: resolveCssVar("--color-surface"),
    primary: resolveCssVar("--color-primary"),
    secondary: resolveCssVar("--color-secondary"),
    danger: resolveCssVar("--color-danger"),
    accent: resolveCssVar("--color-accent"),
  }
}
