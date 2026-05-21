"use client";

import { Timer, BarChart2, Trophy, Settings2 } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

type Tab = "timer" | "stats" | "dojo" | "settings";

const TABS: { id: Tab; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "timer", Icon: Timer },
  { id: "stats", Icon: BarChart2 },
  { id: "dojo", Icon: Trophy },
  { id: "settings", Icon: Settings2 },
];

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  lang: Lang;
}

export default function TabNav({ activeTab, onTabChange, lang }: TabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/25 backdrop-blur-md border-t border-white/10">
      <div className="flex">
        {TABS.map(({ id, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-all ${
                active ? "text-white" : "text-white/35"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`${active ? "font-semibold" : "font-normal"}`}>{t(lang, id)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
