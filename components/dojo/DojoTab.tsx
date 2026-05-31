"use client";

import { getLevelInfo, getNextLevelInfo, getExpProgress, TITLES } from "@/lib/gamification";
import { t } from "@/lib/i18n";
import type { StorageActions } from "@/hooks/useStorage";

interface DojoTabProps {
  storage: StorageActions;
}

export default function DojoTab({ storage }: DojoTabProps) {
  const { data } = storage;
  const { gamification, settings } = data;
  const lang = settings.language;
  const { totalPomodoros } = gamification;

  const current = getLevelInfo(totalPomodoros);
  const next = getNextLevelInfo(totalPomodoros);
  const expProgress = getExpProgress(totalPomodoros);
  const currentTitle = lang === "ja" ? current.title : current.titleEn;

  return (
    <div className="px-6 pt-6 pb-4 space-y-5 text-white">
      {/* Level card */}
      <div className="bg-white/10 rounded-2xl p-5 text-center">
        <div className="text-white/50 text-xs mb-1">{t(lang, "level")}</div>
        <div className="text-6xl font-bold mb-1">{current.level}</div>
        <div className="text-xl font-semibold">{currentTitle}</div>
      </div>

      {/* EXP bar */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>{t(lang, "exp")}: {expProgress}%</span>
          {next && (
            <span>
              {t(lang, "nextLevel")}: {next.minPomodoros - totalPomodoros}
            </span>
          )}
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full transition-all duration-500"
            style={{ width: `${expProgress}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "totalPomodoros")}</div>
          <div className="text-3xl font-bold">{totalPomodoros}</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "sessions")}</div>
          <div className="text-3xl font-bold">{data.sessions.length}</div>
        </div>
      </div>

      {/* Unlocked titles */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="text-white/50 text-xs mb-3">{t(lang, "unlockedTitles")}</div>
        <div className="space-y-2">
          {TITLES.map((titleInfo) => {
            const unlocked = totalPomodoros >= titleInfo.minPomodoros;
            const isCurrent = titleInfo.level === current.level;
            const displayTitle = lang === "ja" ? titleInfo.title : titleInfo.titleEn;
            return (
              <div
                key={titleInfo.level}
                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-white/20"
                    : unlocked
                    ? "bg-white/5"
                    : "opacity-30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${unlocked ? "text-yellow-300" : "text-white/30"}`}>{unlocked ? "★" : "○"}</span>
                  <span className={`text-sm font-medium ${isCurrent ? "text-yellow-300" : "text-white/80"}`}>
                    {displayTitle}
                  </span>
                </div>
                <span className="text-white/40 text-xs">Lv.{titleInfo.level}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
