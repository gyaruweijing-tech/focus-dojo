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
  const remaining = Math.max(0, estimatedPomodoros - actualPomodoros);

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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs font-medium">
            {lang === "ja" ? "目標セッション数" : "Session goal"}
          </span>
          {actualPomodoros > 0 && (
            <span className="text-white text-xs font-semibold">
              {lang === "ja"
                ? `${estimatedPomodoros}回中 ${actualPomodoros}回完了 — あと${remaining}回`
                : `${actualPomodoros}/${estimatedPomodoros} done — ${remaining} left`}
            </span>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const isCompleted = n <= actualPomodoros;
            const isGoal = n === estimatedPomodoros;
            const isSelected = n <= estimatedPomodoros && !isCompleted;
            return (
              <button
                key={n}
                onClick={() => onEstimateChange(n)}
                disabled={disabled}
                aria-label={`${n} sessions`}
                className="flex flex-col items-center gap-1 group disabled:opacity-50 transition-all"
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-white border-white scale-110"
                      : isSelected
                      ? "bg-white/30 border-white"
                      : "bg-transparent border-white/25 group-hover:border-white/50"
                  }`}
                />
                {isGoal && (
                  <span className="text-white/60 text-xs leading-none">{n}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
