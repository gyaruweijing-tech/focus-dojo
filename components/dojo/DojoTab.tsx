"use client";

import { getBeltInfo, getNextBeltInfo, getBeltProgress, minutesToHours, BELTS } from "@/lib/gamification";
import { t } from "@/lib/i18n";
import type { StorageActions } from "@/hooks/useStorage";

interface DojoTabProps {
  storage: StorageActions;
}

export default function DojoTab({ storage }: DojoTabProps) {
  const { data } = storage;
  const { gamification, settings } = data;
  const lang = settings.language;
  const { totalMinutes, totalPomodoros } = gamification;

  const current = getBeltInfo(totalMinutes);
  const next = getNextBeltInfo(totalMinutes);
  const progress = getBeltProgress(totalMinutes);
  const beltName = lang === "ja" ? current.belt : current.beltEn;

  return (
    <div className="px-6 pt-6 pb-4 space-y-5 text-white">
      {/* Belt card */}
      <div className="bg-white/10 rounded-2xl p-5 text-center">
        <div className="text-white/50 text-xs mb-3">{t(lang, "belt")}</div>
        {/* Belt visual */}
        <div className="flex justify-center mb-3">
          <div
            className="w-24 h-6 rounded-full shadow-lg"
            style={{ backgroundColor: current.color, border: "3px solid rgba(255,255,255,0.3)" }}
          />
        </div>
        <div className="text-2xl font-bold">{beltName}</div>
        <div className="text-white/50 text-xs mt-1">{minutesToHours(totalMinutes)}</div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>{progress}%</span>
          {next && (
            <span>
              {t(lang, "nextBelt")}: {minutesToHours(next.minMinutes - totalMinutes)}
            </span>
          )}
          {!next && <span>{lang === "ja" ? "最高段位！" : "Max rank!"}</span>}
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: current.color }}
          />
        </div>
        {next && (
          <div className="flex justify-between text-xs mt-2">
            <span style={{ color: current.color }} className="font-medium">
              {lang === "ja" ? current.belt : current.beltEn}
            </span>
            <span style={{ color: next.color }} className="font-medium">
              {lang === "ja" ? next.belt : next.beltEn}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "totalHours")}</div>
          <div className="text-2xl font-bold">{minutesToHours(totalMinutes)}</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "totalPomodoros")}</div>
          <div className="text-2xl font-bold">{totalPomodoros}</div>
        </div>
      </div>

      {/* Belt list */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="text-white/50 text-xs mb-3">{t(lang, "unlockedBelts")}</div>
        <div className="space-y-2">
          {BELTS.map((b) => {
            const unlocked = totalMinutes >= b.minMinutes;
            const isCurrent = b.rank === current.rank;
            const name = lang === "ja" ? b.belt : b.beltEn;
            const threshold = b.minMinutes === 0
              ? (lang === "ja" ? "最初から" : "From start")
              : minutesToHours(b.minMinutes);
            return (
              <div
                key={b.rank}
                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                  isCurrent ? "bg-white/20" : unlocked ? "bg-white/5" : "opacity-30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: b.color,
                      border: "2px solid rgba(255,255,255,0.2)",
                      opacity: unlocked ? 1 : 0.4,
                    }}
                  />
                  <span className={`text-sm font-medium ${isCurrent ? "text-yellow-300" : "text-white/80"}`}>
                    {name}
                  </span>
                </div>
                <span className="text-white/40 text-xs">{threshold}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
