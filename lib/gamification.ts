export interface BeltInfo {
  rank: number;
  belt: string;
  beltEn: string;
  color: string;
  minMinutes: number;
}

export const BELTS: BeltInfo[] = [
  { rank: 1, belt: "白帯",  beltEn: "White Belt",  color: "#f0f0f0", minMinutes: 0      },
  { rank: 2, belt: "黄帯",  beltEn: "Yellow Belt", color: "#f5c842", minMinutes: 300    },
  { rank: 3, belt: "橙帯",  beltEn: "Orange Belt", color: "#f5803e", minMinutes: 900    },
  { rank: 4, belt: "青帯",  beltEn: "Blue Belt",   color: "#4a90d9", minMinutes: 1800   },
  { rank: 5, belt: "緑帯",  beltEn: "Green Belt",  color: "#4caf50", minMinutes: 3600   },
  { rank: 6, belt: "紫帯",  beltEn: "Purple Belt", color: "#9c27b0", minMinutes: 7200   },
  { rank: 7, belt: "茶帯",  beltEn: "Brown Belt",  color: "#795548", minMinutes: 12000  },
  { rank: 8, belt: "黒帯",  beltEn: "Black Belt",  color: "#212121", minMinutes: 21000  },
  { rank: 9, belt: "師範",  beltEn: "Shihan",      color: "#ffd700", minMinutes: 36000  },
];

export function getBeltInfo(totalMinutes: number): BeltInfo {
  let current = BELTS[0];
  for (const b of BELTS) {
    if (totalMinutes >= b.minMinutes) current = b;
  }
  return current;
}

export function getNextBeltInfo(totalMinutes: number): BeltInfo | null {
  const current = getBeltInfo(totalMinutes);
  const idx = BELTS.findIndex((b) => b.rank === current.rank);
  return idx < BELTS.length - 1 ? BELTS[idx + 1] : null;
}

export function getBeltProgress(totalMinutes: number): number {
  const current = getBeltInfo(totalMinutes);
  const next = getNextBeltInfo(totalMinutes);
  if (!next) return 100;
  const range = next.minMinutes - current.minMinutes;
  const progress = totalMinutes - current.minMinutes;
  return Math.floor((progress / range) * 100);
}

export function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
