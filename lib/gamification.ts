export interface TitleInfo {
  level: number;
  title: string;
  titleEn: string;
  minPomodoros: number;
}

export const TITLES: TitleInfo[] = [
  { level: 1, title: "道場入門", titleEn: "Beginner", minPomodoros: 0 },
  { level: 2, title: "集中の芽", titleEn: "Focus Sprout", minPomodoros: 10 },
  { level: 3, title: "修行者", titleEn: "Practitioner", minPomodoros: 25 },
  { level: 4, title: "道場の影", titleEn: "Dojo Shadow", minPomodoros: 50 },
  { level: 5, title: "集中の士", titleEn: "Focus Warrior", minPomodoros: 100 },
  { level: 6, title: "道場破り", titleEn: "Dojo Breaker", minPomodoros: 200 },
  { level: 7, title: "抽象化の達人", titleEn: "Abstraction Master", minPomodoros: 400 },
  { level: 8, title: "APIマスター", titleEn: "API Master", minPomodoros: 700 },
  { level: 9, title: "道場主", titleEn: "Dojo Master", minPomodoros: 1000 },
];

export function getLevelInfo(totalPomodoros: number): TitleInfo {
  let current = TITLES[0];
  for (const t of TITLES) {
    if (totalPomodoros >= t.minPomodoros) current = t;
  }
  return current;
}

export function getNextLevelInfo(totalPomodoros: number): TitleInfo | null {
  const current = getLevelInfo(totalPomodoros);
  const idx = TITLES.findIndex((t) => t.level === current.level);
  return idx < TITLES.length - 1 ? TITLES[idx + 1] : null;
}

export function getExpProgress(totalPomodoros: number): number {
  const current = getLevelInfo(totalPomodoros);
  const next = getNextLevelInfo(totalPomodoros);
  if (!next) return 100;
  const range = next.minPomodoros - current.minPomodoros;
  const progress = totalPomodoros - current.minPomodoros;
  return Math.floor((progress / range) * 100);
}

export function getUnlockedTitles(totalPomodoros: number): TitleInfo[] {
  return TITLES.filter((t) => totalPomodoros >= t.minPomodoros);
}
