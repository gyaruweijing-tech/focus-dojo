"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TimerMode } from "@/lib/types";

interface TimerConfig {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface UseTimerReturn {
  mode: TimerMode;
  timeLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  completedPomodoros: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  extend: (minutes: number) => void;
}

function getDuration(mode: TimerMode, config: TimerConfig): number {
  if (mode === "work") return config.workDuration * 60;
  if (mode === "longBreak") return config.longBreakDuration * 60;
  return config.shortBreakDuration * 60;
}

function nextMode(completedMode: TimerMode, completedCount: number, interval: number): TimerMode {
  if (completedMode !== "work") return "work";
  return completedCount % interval === 0 ? "longBreak" : "break";
}

export function useTimer(
  config: TimerConfig,
  onComplete: (completedMode: TimerMode, newCount: number) => void
): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(config.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const modeRef = useRef<TimerMode>("work");
  const startTimeRef = useRef<number | null>(null);
  const remainingRef = useRef(config.workDuration * 60);
  const completedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const configRef = useRef(config);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advance = useCallback((completedMode: TimerMode) => {
    const newCount = completedMode === "work" ? completedRef.current + 1 : completedRef.current;
    completedRef.current = newCount;

    const nm = nextMode(completedMode, newCount, configRef.current.longBreakInterval);
    const duration = getDuration(nm, configRef.current);

    modeRef.current = nm;
    remainingRef.current = duration;
    setMode(nm);
    setTimeLeft(duration);
    setCompletedPomodoros(newCount);
    onCompleteRef.current(completedMode, newCount);
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = Math.max(0, remainingRef.current - elapsed);
    setTimeLeft(remaining);
    if (remaining === 0) {
      clearTimer();
      setIsRunning(false);
      startTimeRef.current = null;
      advance(modeRef.current);
    }
  }, [clearTimer, advance]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 500);
  }, [tick]);

  const pause = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      startTimeRef.current = null;
      setTimeLeft(remainingRef.current);
    }
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    startTimeRef.current = null;
    const duration = getDuration(modeRef.current, configRef.current);
    remainingRef.current = duration;
    setTimeLeft(duration);
  }, [clearTimer]);

  const skip = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    startTimeRef.current = null;
    advance(modeRef.current);
  }, [clearTimer, advance]);

  const extend = useCallback((minutes: number) => {
    const extra = minutes * 60;
    if (startTimeRef.current !== null) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const current = Math.max(0, remainingRef.current - elapsed);
      remainingRef.current = current + extra;
      startTimeRef.current = Date.now();
    } else {
      remainingRef.current += extra;
    }
    setTimeLeft((prev) => prev + extra);
  }, []);

  // Sync duration when config changes (only when idle)
  useEffect(() => {
    if (!isRunning && startTimeRef.current === null) {
      const duration = getDuration(modeRef.current, config);
      remainingRef.current = duration;
      setTimeLeft(duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.workDuration, config.shortBreakDuration, config.longBreakDuration]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    mode,
    timeLeft,
    totalSeconds: getDuration(mode, config),
    isRunning,
    completedPomodoros,
    start,
    pause,
    reset,
    skip,
    extend,
  };
}
