"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, isThemePreference, resolveTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS: Array<{ value: ThemePreference; label: string; hint: string }> = [
  { value: "dark", label: "Dark", hint: "Light text on a dark background" },
  { value: "light", label: "Light", hint: "Dark text on a light background" },
  {
    value: "system",
    label: "Match my device",
    hint: "Switches with your device's setting",
  },
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

/** Dark, light or match the device, as a radio group whose choice is marked three ways: border, fill and a filled dot. */
export function ThemeSelector() {
  const current = useSyncExternalStore(subscribe, readPreference, () => null);
  return (
    <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
      <legend className="heading-2 mb-4 p-0 text-ink">Appearance</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const selected = current === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)] ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-raised hover:bg-hover"
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
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-round border ${
                  selected ? "border-accent" : "border-line-input"
                }`}
              >
                {selected ? <span className="h-2 w-2 rounded-round bg-accent" /> : null}
              </span>
              <span className="flex flex-col gap-1">
                <span className="small text-ink">
                  {option.label}
                  {selected ? <span className="sr-only"> (selected)</span> : null}
                </span>
                <span className="caption text-ink-secondary">{option.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
