"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Maximize, Minimize } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TaskInput from "./TaskInput";
import FullscreenModal from "./FullscreenModal";
import { useTimer } from "@/hooks/useTimer";
import { useNotification } from "@/hooks/useNotification";
import { recordPomodoro } from "@/lib/storage";
import { getLevelInfo, getUnlockedTitles } from "@/lib/gamification";
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

  const [stealthMode, setStealthMode] = useState(settings.stealthMode);
  const [fullscreenLock, setFullscreenLock] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  const { requestPermission, sendNotification, playSound } = useNotification();

  const handleComplete = useCallback(
    (completedMode: TimerMode, newCount: number) => {
      if (settings.sound) playSound(completedMode === "work" ? "work" : "break");
      if (settings.notification) {
        const msg = completedMode === "work" ? t(lang, "workComplete") : t(lang, "breakComplete");
        sendNotification(t(lang, "appName"), msg);
      }
      if (completedMode === "work") {
        const newSessions = recordPomodoro(sessions, currentTask);
        addSession(newSessions);
        const newTotal = gamification.totalPomodoros + 1;
        const levelInfo = getLevelInfo(newTotal);
        const unlocked = getUnlockedTitles(newTotal);
        updateGamification({
          totalPomodoros: newTotal,
          level: levelInfo.level,
          currentTitle: lang === "ja" ? levelInfo.title : levelInfo.titleEn,
          unlockedTitles: unlocked.map((u) => u.title),
        });
      }
      void newCount;
    },
    [settings, lang, sessions, currentTask, gamification, playSound, sendNotification, addSession, updateGamification]
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

  const enableFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen API not available (iOS etc.)
    }
    setFullscreenLock(true);
  }, []);

  const disableFullscreen = useCallback(() => {
    setFullscreenLock(false);
    setShowFullscreenModal(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!fullscreenLock) return;
    const onVisChange = () => {
      if (document.hidden) setShowFullscreenModal(true);
    };
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, [fullscreenLock]);

  const modeLabel =
    timer.mode === "work" ? t(lang, "work") : timer.mode === "break" ? t(lang, "break") : t(lang, "longBreak");

  const handleStart = useCallback(() => {
    requestPermission();
    timer.start();
  }, [requestPermission, timer]);

  const toggleStealth = useCallback(() => {
    const next = !stealthMode;
    setStealthMode(next);
    updateSettings({ stealthMode: next });
  }, [stealthMode, updateSettings]);

  return (
    <div className="flex flex-col min-h-full pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-2">
        <span className="text-white/70 text-sm font-medium tracking-widest uppercase">
          {modeLabel}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs tabular-nums">
            {timer.completedPomodoros} / {currentTask.estimatedPomodoros}
          </span>
          <button
            onClick={() => updateSettings({ language: lang === "ja" ? "en" : "ja" })}
            className="text-white/50 text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            {lang === "ja" ? "EN" : "JP"}
          </button>
        </div>
      </div>

      {/* Timer ring + stealth bar */}
      <TimerDisplay
        timeLeft={timer.timeLeft}
        totalSeconds={timer.totalSeconds}
        stealthMode={stealthMode}
      />

      {/* Task input */}
      <TaskInput
        name={currentTask.name}
        estimatedPomodoros={currentTask.estimatedPomodoros}
        actualPomodoros={currentTask.actualPomodoros}
        lang={lang}
        disabled={timer.isRunning}
        onNameChange={(name) => updateTask({ name })}
        onEstimateChange={(n) => updateTask({ estimatedPomodoros: n })}
      />

      {/* Controls */}
      <div className="mt-6">
        <TimerControls
          isRunning={timer.isRunning}
          mode={timer.mode}
          lang={lang}
          onStart={handleStart}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
          onExtend={timer.extend}
        />
      </div>

      {/* Mode toggles */}
      <div className="flex justify-center gap-3 mt-5 px-6">
        <button
          onClick={toggleStealth}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            stealthMode ? "bg-white/30 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"
          }`}
        >
          {stealthMode ? <EyeOff size={13} /> : <Eye size={13} />}
          {t(lang, "stealth")}
        </button>
        <button
          onClick={fullscreenLock ? disableFullscreen : enableFullscreen}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            fullscreenLock ? "bg-white/30 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"
          }`}
        >
          {fullscreenLock ? <Minimize size={13} /> : <Maximize size={13} />}
          {t(lang, "fullscreen")}
        </button>
      </div>

      {showFullscreenModal && (
        <FullscreenModal
          lang={lang}
          onLeave={disableFullscreen}
          onStay={() => setShowFullscreenModal(false)}
        />
      )}
    </div>
  );
}
