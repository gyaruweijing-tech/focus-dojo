"use client";

import { t } from "@/lib/i18n";
import type { StorageActions } from "@/hooks/useStorage";

const PRESETS = [
  { label: "25/5/15", work: 25, short: 5, long: 15 },
  { label: "50/10/20", work: 50, short: 10, long: 20 },
  { label: "90/20/30", work: 90, short: 20, long: 30 },
];

interface SettingsTabProps {
  storage: StorageActions;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${value ? "bg-green-500" : "bg-white/20"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          value ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}

function NumberInput({
  value,
  onChange,
  min = 1,
  max = 120,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 5))}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-all"
      >
        −
      </button>
      <span className="text-white font-semibold w-8 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 5))}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-all"
      >
        ＋
      </button>
    </div>
  );
}

export default function SettingsTab({ storage }: SettingsTabProps) {
  const { data, updateSettings } = storage;
  const { settings } = data;
  const lang = settings.language;

  return (
    <div className="px-6 pt-6 pb-4 space-y-5 text-white">
      {/* Language */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t(lang, "language")}</span>
          <div className="flex gap-2">
            {(["ja", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => updateSettings({ language: l })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  settings.language === l ? "bg-white text-green-700" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {l === "ja" ? "日本語" : "English"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="text-white/50 text-xs mb-3">{t(lang, "presets")}</div>
        <div className="flex gap-2">
          {PRESETS.map((p) => {
            const active =
              settings.workDuration === p.work &&
              settings.shortBreakDuration === p.short &&
              settings.longBreakDuration === p.long;
            return (
              <button
                key={p.label}
                onClick={() =>
                  updateSettings({
                    workDuration: p.work,
                    shortBreakDuration: p.short,
                    longBreakDuration: p.long,
                  })
                }
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  active ? "bg-white text-green-700" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom durations */}
      <div className="bg-white/10 rounded-2xl p-4 space-y-4">
        {(
          [
            { key: "workDuration", label: t(lang, "workDuration") },
            { key: "shortBreakDuration", label: t(lang, "shortBreakDuration") },
            { key: "longBreakDuration", label: t(lang, "longBreakDuration") },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-white/80">{label}</span>
            <div className="flex items-center gap-2">
              <NumberInput
                value={settings[key]}
                onChange={(v) => updateSettings({ [key]: v })}
              />
              <span className="text-white/40 text-xs w-6">{t(lang, "minutes")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Long break interval */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">{t(lang, "longBreakInterval")}</span>
          <NumberInput
            value={settings.longBreakInterval}
            onChange={(v) => updateSettings({ longBreakInterval: v })}
            min={1}
            max={10}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white/10 rounded-2xl p-4 space-y-4">
        {(
          [
            { key: "sound", label: t(lang, "sound") },
            { key: "notification", label: t(lang, "notification") },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Toggle
              value={settings[key]}
              onChange={(v) => updateSettings({ [key]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
