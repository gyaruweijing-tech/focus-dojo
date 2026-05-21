"use client";

import { useState, useEffect, useCallback } from "react";
import { loadData, saveData } from "@/lib/storage";
import type { AppData, Settings, Task, DayRecord, Gamification } from "@/lib/types";

export interface StorageActions {
  data: AppData;
  updateSettings: (settings: Partial<Settings>) => void;
  updateTask: (task: Partial<Task>) => void;
  addSession: (sessions: DayRecord[]) => void;
  updateGamification: (g: Partial<Gamification>) => void;
}

export function useStorage(): StorageActions {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    setData(loadData());
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    setData((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...settings } };
      saveData({ settings: next.settings });
      return next;
    });
  }, []);

  const updateTask = useCallback((task: Partial<Task>) => {
    setData((prev) => {
      const next = { ...prev, currentTask: { ...prev.currentTask, ...task } };
      saveData({ currentTask: next.currentTask });
      return next;
    });
  }, []);

  const addSession = useCallback((sessions: DayRecord[]) => {
    setData((prev) => {
      const next = { ...prev, sessions };
      saveData({ sessions });
      return next;
    });
  }, []);

  const updateGamification = useCallback((g: Partial<Gamification>) => {
    setData((prev) => {
      const next = { ...prev, gamification: { ...prev.gamification, ...g } };
      saveData({ gamification: next.gamification });
      return next;
    });
  }, []);

  return { data, updateSettings, updateTask, addSession, updateGamification };
}
