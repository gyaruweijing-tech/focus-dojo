"use client";

import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface TaskInputProps {
  name: string;
  estimatedPomodoros: number;
  actualPomodoros: number;
  lang: Lang;
  disabled: boolean;
  onNameChange: (name: string) => void;
  onEstimateChange: (n: number) => void;
}

export default function TaskInput({
  name,
  estimatedPomodoros,
  actualPomodoros,
  lang,
  disabled,
  onNameChange,
  onEstimateChange,
}: TaskInputProps) {
  return (
    <div className="px-6 space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={t(lang, "taskPlaceholder")}
        disabled={disabled}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40 disabled:opacity-50"
      />

      {/* Session goal */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs font-medium">
            {lang === "ja" ? "目標セッション数（何回やる？）" : "Session goal (how many rounds?)"}
          </span>
          {actualPomodoros > 0 && (
            <span className="text-white/50 text-xs">
              {lang === "ja" ? `実績 ${actualPomodoros}回` : `Done: ${actualPomodoros}`}
            </span>
          )}
        </div>
        {/* Dot selector */}
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => onEstimateChange(n)}
              disabled={disabled}
              aria-label={`${n} sessions`}
              className="flex flex-col items-center gap-1 group disabled:opacity-50 transition-all"
            >
              <span
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  n <= estimatedPomodoros
                    ? "bg-white border-white"
                    : "bg-transparent border-white/30 group-hover:border-white/60"
                }`}
              />
              {n === estimatedPomodoros && (
                <span className="text-white text-xs font-bold leading-none">{n}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
