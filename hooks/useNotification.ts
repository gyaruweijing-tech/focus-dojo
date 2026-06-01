"use client";

import { useCallback, useRef } from "react";

export function useNotification() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined") return;
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icons/icon-192.png" });
    }
  }, []);

  const playTone = useCallback(
    (ctx: AudioContext, freq: number, startTime: number, duration: number, volume = 0.4) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.setValueAtTime(volume, startTime + duration - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    },
    []
  );

  const playSound = useCallback(
    (type: "work" | "break") => {
      try {
        const ctx = getAudioCtx();
        const t = ctx.currentTime;

        if (type === "work") {
          // 集中終了：3音チャイム（ド・ミ・ソ）
          playTone(ctx, 523, t,        0.4);
          playTone(ctx, 659, t + 0.35, 0.4);
          playTone(ctx, 784, t + 0.70, 0.6);
        } else {
          // 休憩終了：2音（ソ・ド）
          playTone(ctx, 784, t,        0.4);
          playTone(ctx, 523, t + 0.35, 0.6);
        }
      } catch {
        // Audio unavailable
      }
    },
    [getAudioCtx, playTone]
  );

  return { requestPermission, sendNotification, playSound };
}
