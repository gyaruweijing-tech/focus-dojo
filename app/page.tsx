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

  const bgClass =
    timerMode === "work"
      ? "bg-gradient-to-br from-green-500 via-green-600 to-green-800"
      : timerMode === "break"
      ? "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"
      : "bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600";

  return (
    // Full-width wrapper carries the gradient so landscape sides aren't dark
    <div className={`h-full transition-colors duration-700 ${bgClass}`}>
      <main className="h-full flex flex-col max-w-md mx-auto">
        <div className="flex-1 overflow-y-auto pb-16">
          <div className={activeTab === "timer" ? "" : "hidden"}>
            <TimerTab storage={storage} onModeChange={setTimerMode} />
          </div>
          <div className={activeTab === "stats" ? "" : "hidden"}>
            <StatsTab storage={storage} />
          </div>
          <div className={activeTab === "dojo" ? "" : "hidden"}>
            <DojoTab storage={storage} />
          </div>
          <div className={activeTab === "settings" ? "" : "hidden"}>
            <SettingsTab storage={storage} />
          </div>
        </div>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />
      </main>
    </div>
  );
}
