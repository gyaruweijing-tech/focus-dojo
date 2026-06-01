import type { AppData, Settings, Task, DayRecord, Gamification } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  sound: true,
  notification: true,
  language: "ja",
};

const DEFAULT_TASK: Task = {
  name: "",
  estimatedPomodoros: 1,
  actualPomodoros: 0,
};

const DEFAULT_GAMIFICATION: Gamification = {
  totalPomodoros: 0,
  totalMinutes: 0,
  level: 1,
  unlockedTitles: ["白帯"],
  currentTitle: "白帯",
};

export function getDefaultData(): AppData {
  return {
    settings: DEFAULT_SETTINGS,
    currentTask: DEFAULT_TASK,
    sessions: [],
    gamification: DEFAULT_GAMIFICATION,
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem("focus-dojo");
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw);
    const defaults = getDefaultData();
    return {
      ...defaults,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      gamification: { ...defaults.gamification, ...parsed.gamification },
    };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: Partial<AppData>): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadData();
    localStorage.setItem("focus-dojo", JSON.stringify({ ...current, ...data }));
  } catch {
    // Storage unavailable
  }
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getYesterdayKey(): string {
  return new Date(Date.now() - 86400000).toISOString().split("T")[0];
}

export function getTodayRecord(sessions: DayRecord[]): DayRecord {
  const today = getTodayKey();
  return sessions.find((s) => s.date === today) ?? { date: today, pomodoros: 0, tasks: [] };
}

export function getYesterdayRecord(sessions: DayRecord[]): DayRecord {
  const yesterday = getYesterdayKey();
  return sessions.find((s) => s.date === yesterday) ?? { date: yesterday, pomodoros: 0, tasks: [] };
}

export function recordPomodoro(sessions: DayRecord[], task: Task): DayRecord[] {
  const today = getTodayKey();
  const existing = sessions.find((s) => s.date === today);

  if (existing) {
    const updatedTasks = [...existing.tasks];
    if (task.name) {
      const idx = updatedTasks.findIndex((t) => t.name === task.name);
      if (idx >= 0) {
        updatedTasks[idx] = { ...updatedTasks[idx], actualPomodoros: updatedTasks[idx].actualPomodoros + 1 };
      } else {
        updatedTasks.push({ ...task, actualPomodoros: 1 });
      }
    }
    return sessions.map((s) =>
      s.date === today ? { ...s, pomodoros: s.pomodoros + 1, tasks: updatedTasks } : s
    );
  }

  const newTasks = task.name ? [{ ...task, actualPomodoros: 1 }] : [];
  return [...sessions, { date: today, pomodoros: 1, tasks: newTasks }];
}

export function exportData(): void {
  if (typeof window === "undefined") return;
  const data = loadData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `focus-dojo-backup-${getTodayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(json: string): AppData {
  const parsed = JSON.parse(json);
  const merged: AppData = {
    ...getDefaultData(),
    ...parsed,
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
  };
  localStorage.setItem("focus-dojo", JSON.stringify(merged));
  return merged;
}

export function getLast7Days(sessions: DayRecord[]): { date: string; label: string; pomodoros: number }[] {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateKey = d.toISOString().split("T")[0];
    const record = sessions.find((s) => s.date === dateKey);
    const label = i === 0 ? "今日" : i === 1 ? "昨日" : `${d.getMonth() + 1}/${d.getDate()}`;
    days.push({ date: dateKey, label, pomodoros: record?.pomodoros ?? 0 });
  }
  return days;
}
