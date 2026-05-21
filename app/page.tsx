"use client";

import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import TabNav from "@/components/TabNav";
import TimerTab from "@/components/timer/TimerTab";
import StatsTab from "@/components/stats/StatsTab";
import DojoTab from "@/components/dojo/DojoTab";
import SettingsTab from "@/components/settings/SettingsTab";
import type { TimerMode } from "@/lib/types";

type Tab = "timer" | "stats" | "dojo" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");
  const [timerMode, setTimerMode] = useState<TimerMode>("work");
  const storage = useStorage();
  const lang = storage.data.settings.language;

  // Gradient follows timer mode across ALL tabs
  const bgClass =
    timerMode === "work"
      ? "bg-gradient-to-br from-orange-400 via-orange-500 to-red-600"
      : timerMode === "break"
      ? "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"
      : "bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600";

  return (
    <main className={`h-full flex flex-col max-w-md mx-auto transition-colors duration-700 ${bgClass}`}>
      <div className="flex-1 overflow-y-auto pb-16">
        {activeTab === "timer" && (
          <TimerTab storage={storage} onModeChange={setTimerMode} />
        )}
        {activeTab === "stats" && <StatsTab storage={storage} />}
        {activeTab === "dojo" && <DojoTab storage={storage} />}
        {activeTab === "settings" && <SettingsTab storage={storage} />}
      </div>
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />
    </main>
  );
}
