export type TimerMode = "work" | "break" | "longBreak";
export type Language = "ja" | "en";

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  sound: boolean;
  notification: boolean;
  language: Language;
}

export interface Task {
  name: string;
  estimatedPomodoros: number;
  actualPomodoros: number;
}

export interface DayRecord {
  date: string;
  pomodoros: number;
  tasks: Task[];
}

export interface Gamification {
  totalPomodoros: number;
  totalMinutes: number;
  level: number;
  unlockedTitles: string[];
  currentTitle: string;
}

export interface AppData {
  settings: Settings;
  currentTask: Task;
  sessions: DayRecord[];
  gamification: Gamification;
}
