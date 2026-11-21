"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveTheme,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: Array<{ value: ThemePreference; label: string; hint: string }> = [
  { value: "dark", label: "Dark", hint: "Midnight's default" },
  { value: "light", label: "Light", hint: "Inverted greys, same accent" },
  { value: "system", label: "Match my device", hint: "Follows your device setting" },
];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readPreference(): ThemePreference {
  const fromDom = document.documentElement.dataset.themePreference;
  return isThemePreference(fromDom) ? fromDom : DEFAULT_THEME;
}

function setPreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private browsing can refuse storage; the choice still applies to this visit.
  }
  const root = document.documentElement;
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolveTheme(preference, prefersLight);
  listeners.forEach((listener) => listener());
}

/** Dark, light or match the device, as a radio group in Midnight's hairline style. */
export function ThemeSelector() {
  const current = useSyncExternalStore(subscribe, readPreference, () => null);
  return (
    <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
      <legend className="small mb-3 p-0 text-ink">Appearance</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const selected = current === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-1 rounded-card border bg-raised p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)] ${
                selected ? "border-accent" : "border-line hover:bg-hover"
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={selected}
                onChange={() => setPreference(option.value)}
                className="sr-only"
              />
              <span className="small text-ink">{option.label}</span>
              <span className="caption text-ink-faint">{option.hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
