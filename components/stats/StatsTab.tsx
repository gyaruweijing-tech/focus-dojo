"use client";

import { getTodayRecord, getYesterdayRecord, getLast7Days } from "@/lib/storage";
import { t } from "@/lib/i18n";
import type { StorageActions } from "@/hooks/useStorage";

interface StatsTabProps {
  storage: StorageActions;
}

export default function StatsTab({ storage }: StatsTabProps) {
  const { data } = storage;
  const { sessions, currentTask, settings } = data;
  const lang = settings.language;

  const today = getTodayRecord(sessions);
  const yesterday = getYesterdayRecord(sessions);
  const week = getLast7Days(sessions);
  const maxWeek = Math.max(...week.map((d) => d.pomodoros), 1);

  const diff = today.pomodoros - yesterday.pomodoros;
  const raceLabel =
    diff > 0
      ? `▲ ${diff} ${t(lang, "ahead")}`
      : diff < 0
      ? `▼ ${Math.abs(diff)} ${t(lang, "behind")}`
      : t(lang, "tied");
  const raceColor = diff > 0 ? "text-green-300" : diff < 0 ? "text-red-300" : "text-white/60";

  return (
    <div className="px-6 pt-6 pb-4 space-y-6 text-white">
      {/* Today / Yesterday */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "today")}</div>
          <div className="text-4xl font-bold">{today.pomodoros}</div>
          <div className="text-white/40 text-xs mt-1">{lang === "ja" ? "回" : "sessions"}</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-white/50 text-xs mb-1">{t(lang, "yesterday")}</div>
          <div className="text-4xl font-bold">{yesterday.pomodoros}</div>
          <div className="text-white/40 text-xs mt-1">{lang === "ja" ? "回" : "sessions"}</div>
        </div>
      </div>

      {/* Race vs yesterday */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="text-white/50 text-xs mb-2">{t(lang, "vsYesterday")}</div>
        <div className={`text-lg font-bold ${raceColor}`}>{raceLabel}</div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all"
            style={{ width: `${yesterday.pomodoros > 0 ? Math.min(100, (today.pomodoros / yesterday.pomodoros) * 100) : today.pomodoros > 0 ? 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="text-white/50 text-xs mb-3">{t(lang, "weeklyRecord")}</div>
        <div className="flex items-end justify-between gap-1 h-24">
          {week.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: "72px" }}>
                <div
                  className="w-full bg-green-400 rounded-t-sm transition-all"
                  style={{ height: `${(d.pomodoros / maxWeek) * 72}px`, minHeight: d.pomodoros > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-white/40 text-xs">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's task breakdown */}
      {today.tasks.length > 0 && (
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="text-white/50 text-xs mb-3">{t(lang, "estimateVsActual")}</div>
          <div className="space-y-2">
            {today.tasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-white/80 flex-1 truncate mr-3">{task.name || t(lang, "noTasks")}</span>
                <span className="text-xs text-white/50 flex-shrink-0">
                  {task.estimatedPomodoros} → {task.actualPomodoros}
                  <span className="ml-1 text-white/30">{lang === "ja" ? "回" : "×"}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTask.name && today.tasks.length === 0 && (
        <div className="text-white/30 text-sm text-center py-4">{t(lang, "noTasks")}</div>
      )}
    </div>
  );
}
