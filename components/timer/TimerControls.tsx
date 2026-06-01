"use client";

import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { TimerMode } from "@/lib/types";

interface TimerControlsProps {
  isRunning: boolean;
  mode: TimerMode;
  lang: Lang;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExtend: (minutes: number) => void;
  onSkip: () => void;
}

export default function TimerControls({
  isRunning,
  mode,
  lang,
  onStart,
  onPause,
  onReset,
  onExtend,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="px-6 space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-all active:scale-95"
          aria-label={t(lang, "reset")}
        >
          ↺
        </button>

        <button
          onClick={isRunning ? onPause : onStart}
          className="w-20 h-20 rounded-full bg-white text-green-700 font-bold text-sm flex items-center justify-center shadow-lg hover:scale-105 transition-all active:scale-95"
        >
          {isRunning ? t(lang, "pause") : t(lang, "start")}
        </button>

        <button
          onClick={onSkip}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-all active:scale-95"
          aria-label={t(lang, "skip")}
        >
          ⏭
        </button>
      </div>

      {/* Extend buttons — only shown when in work mode and running */}
      {mode === "work" && isRunning && (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onExtend(5)}
            className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all active:scale-95"
          >
            +5{t(lang, "minutes")}
          </button>
          <button
            onClick={() => onExtend(15)}
            className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all active:scale-95"
          >
            +15{t(lang, "minutes")}
          </button>
        </div>
      )}
    </div>
  );
}
