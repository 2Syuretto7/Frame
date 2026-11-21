/**
 * Theme preference. Midnight is dark-first, so dark is the default.
 * Until accounts exist (Milestone 2) the preference lives in this browser only.
 */
export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "frame-theme";
export const DEFAULT_THEME: ThemePreference = "dark";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}

export function resolveTheme(preference: ThemePreference, prefersLight: boolean): ResolvedTheme {
  if (preference === "system") return prefersLight ? "light" : "dark";
  return preference;
}

/**
 * Runs in <head> before the first paint so the page never flashes the wrong theme.
 * Kept small and dependency-free because it is inlined as a string.
 */
export const themeBootScript = `(function(){var d=document.documentElement;function apply(){var p="${DEFAULT_THEME}";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="dark"||s==="light"||s==="system")p=s}catch(e){}var l=window.matchMedia("(prefers-color-scheme: light)").matches;d.dataset.theme=p==="system"?(l?"light":"dark"):p;d.dataset.themePreference=p}apply();window.matchMedia("(prefers-color-scheme: light)").addEventListener("change",apply)})();`;
