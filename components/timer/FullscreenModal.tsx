"use client";

import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface FullscreenModalProps {
  lang: Lang;
  onLeave: () => void;
  onStay: () => void;
}

export default function FullscreenModal({ lang, onLeave, onStay }: FullscreenModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-stone-800 rounded-2xl p-8 mx-6 text-center shadow-2xl">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-white font-semibold text-lg mb-6">{t(lang, "fullscreenWarning")}</p>
        <div className="flex gap-3">
          <button
            onClick={onLeave}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-all"
          >
            {t(lang, "fullscreenYes")}
          </button>
          <button
            onClick={onStay}
            className="flex-1 py-3 rounded-xl bg-white text-orange-500 font-bold text-sm hover:scale-105 transition-all"
          >
            {t(lang, "fullscreenNo")}
          </button>
        </div>
      </div>
    </div>
  );
}
