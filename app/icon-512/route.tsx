import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = 512;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: `${Math.round(SIZE * 0.18)}px`,
        }}
      >
        <svg
          width={Math.round(SIZE * 0.72)}
          height={Math.round(SIZE * 0.72)}
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M256 118 L88 212 L112 238 L400 238 L424 212 Z" fill="none" stroke="white" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="152" y1="238" x2="152" y2="398" stroke="white" strokeWidth="20" strokeLinecap="round" />
          <line x1="360" y1="238" x2="360" y2="398" stroke="white" strokeWidth="20" strokeLinecap="round" />
          <line x1="112" y1="398" x2="400" y2="398" stroke="white" strokeWidth="20" strokeLinecap="round" />
          <circle cx="256" cy="318" r="68" fill="none" stroke="white" strokeWidth="18" />
          <rect x="238" y="236" width="36" height="16" rx="8" fill="white" />
          <line x1="256" y1="318" x2="256" y2="276" stroke="white" strokeWidth="14" strokeLinecap="round" />
          <line x1="256" y1="318" x2="290" y2="318" stroke="white" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
