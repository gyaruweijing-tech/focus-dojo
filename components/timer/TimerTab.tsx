"use client";

import { useEffect, useCallback, useState } from "react";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TaskInput from "./TaskInput";
import { useTimer } from "@/hooks/useTimer";
import { useNotification } from "@/hooks/useNotification";
import { recordPomodoro } from "@/lib/storage";
import { getBeltInfo, BELTS } from "@/lib/gamification";
import { t } from "@/lib/i18n";
import type { StorageActions } from "@/hooks/useStorage";
import type { TimerMode } from "@/lib/types";

interface TimerTabProps {
  storage: StorageActions;
  onModeChange: (mode: TimerMode) => void;
}

export default function TimerTab({ storage, onModeChange }: TimerTabProps) {
  const { data, updateSettings, updateTask, addSession, updateGamification } = storage;
  const { settings, currentTask, sessions, gamification } = data;
  const lang = settings.language;

  const { requestPermission, sendNotification, playSound } = useNotification();
  const [goalAchieved, setGoalAchieved] = useState(false);

  const handleComplete = useCallback(
    (completedMode: TimerMode, newCount: number) => {
      playSound(completedMode === "work" ? "work" : "break");
      if (settings.notification) {
        const msg = completedMode === "work" ? t(lang, "workComplete") : t(lang, "breakComplete");
        sendNotification(t(lang, "appName"), msg);
      }
      if (completedMode === "work") {
        const newSessions = recordPomodoro(sessions, currentTask);
        addSession(newSessions);
        const newActual = Math.min(currentTask.actualPomodoros + 1, currentTask.estimatedPomodoros);
        updateTask({ actualPomodoros: newActual });
        if (newActual >= currentTask.estimatedPomodoros) {
          setGoalAchieved(true);
        }
        const newPomodoros = gamification.totalPomodoros + 1;
        const newMinutes = gamification.totalMinutes + settings.workDuration;
        const beltInfo = getBeltInfo(newMinutes);
        const unlocked = BELTS.filter((b) => newMinutes >= b.minMinutes).map((b) => b.belt);
        updateGamification({
          totalPomodoros: newPomodoros,
          totalMinutes: newMinutes,
          level: beltInfo.rank,
          currentTitle: lang === "ja" ? beltInfo.belt : beltInfo.beltEn,
          unlockedTitles: unlocked,
        });
      }
      void newCount;
    },
    [settings, lang, sessions, currentTask, gamification, playSound, sendNotification, addSession, updateTask, updateGamification]
  );

  const timer = useTimer(
    {
      workDuration: settings.workDuration,
      shortBreakDuration: settings.shortBreakDuration,
      longBreakDuration: settings.longBreakDuration,
      longBreakInterval: settings.longBreakInterval,
    },
    handleComplete
  );

  useEffect(() => {
    onModeChange(timer.mode);
  }, [timer.mode, onModeChange]);

  const modeLabel =
    timer.mode === "work" ? t(lang, "work") : timer.mode === "break" ? t(lang, "break") : t(lang, "longBreak");

  const handleStart = useCallback(() => {
    requestPermission();
    timer.start();
  }, [requestPermission, timer]);

  return (
    <div className="flex flex-col min-h-full pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-2">
        <span className="text-white/70 text-sm font-medium tracking-widest uppercase">
          {modeLabel}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs tabular-nums">
            {currentTask.actualPomodoros} / {currentTask.estimatedPomodoros}
          </span>
          <button
            onClick={() => updateSettings({ language: lang === "ja" ? "en" : "ja" })}
            className="text-white/50 text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            {lang === "ja" ? "EN" : "JP"}
          </button>
        </div>
      </div>

      {/* Goal achieved banner */}
      {goalAchieved && (
        <button
          onClick={() => setGoalAchieved(false)}
          className="mx-6 mb-2 bg-yellow-400/20 border border-yellow-300/40 rounded-2xl px-4 py-3 text-center w-auto"
        >
          <p className="text-yellow-200 font-bold text-sm">
            {lang === "ja" ? "目標達成！お疲れ様でした🎉" : "Goal complete! Great work!"}
          </p>
          <p className="text-yellow-200/60 text-xs mt-0.5">
            {lang === "ja" ? "タップして閉じる" : "Tap to dismiss"}
          </p>
        </button>
      )}

      {/* Timer ring */}
      <TimerDisplay
        timeLeft={timer.timeLeft}
        totalSeconds={timer.totalSeconds}
      />

      {/* Task input */}
      <TaskInput
        name={currentTask.name}
        estimatedPomodoros={currentTask.estimatedPomodoros}
        actualPomodoros={currentTask.actualPomodoros}
        lang={lang}
        disabled={timer.isRunning || timer.pendingBreak}
        onNameChange={(name) => {
          updateTask({ name, actualPomodoros: 0 });
          setGoalAchieved(false);
        }}
        onEstimateChange={(n) => updateTask({ estimatedPomodoros: n })}
      />

      {/* Controls or break choice */}
      {timer.pendingBreak ? (
        <div className="mt-6 px-6">
          <div className="bg-white/15 rounded-2xl p-5 text-center space-y-4">
            <p className="text-white font-bold text-lg">
              {lang === "ja" ? "セッション完了！" : "Session done!"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={timer.confirmBreak}
                className="flex-1 py-3 rounded-xl bg-white text-green-700 font-bold text-sm shadow-md hover:scale-105 transition-all active:scale-95"
              >
                {lang === "ja" ? "休憩を始める" : "Start Break"}
              </button>
              <button
                onClick={() => timer.extendWorkFromCompletion(5)}
                className="flex-1 py-3 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-all active:scale-95"
              >
                {lang === "ja" ? "+5分 続ける" : "+5 min more"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <TimerControls
            isRunning={timer.isRunning}
            mode={timer.mode}
            lang={lang}
            onStart={handleStart}
            onPause={timer.pause}
            onReset={timer.reset}
            onExtend={timer.extend}
            onSkip={timer.skip}
          />
        </div>
      )}
    </div>
  );
}
