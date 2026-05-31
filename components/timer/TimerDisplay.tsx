"use client";

const R = 108;
const CX = 120;
const CY = 120;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface TimerDisplayProps {
  timeLeft: number;
  totalSeconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TimerDisplay({ timeLeft, totalSeconds }: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center my-4">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={12}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="white"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="timer-ring"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          fill="white"
          fontSize="44"
          fontWeight="700"
          fontFamily="var(--font-geist-sans), monospace"
        >
          {formatTime(timeLeft)}
        </text>
      </svg>
    </div>
  );
}
