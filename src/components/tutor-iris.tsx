import { cn } from "@/lib/utils";

export type IrisMood = "idle" | "talk" | "think" | "ok";

export function TutorIris({
  mood = "idle",
  size = 120,
  className,
}: {
  mood?: IrisMood;
  size?: number;
  className?: string;
}) {
  const talking = mood === "talk";
  return (
    <div
      className={cn("iris-float relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <defs>
          <radialGradient id="irisCore" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#d7e0e8" />
            <stop offset="55%" stopColor="#9eb3c4" />
            <stop offset="100%" stopColor="#3d4a55" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#9eb3c4"
          strokeWidth="1.4"
          opacity="0.55"
          className={mood === "think" ? "iris-ring-think origin-center" : ""}
          style={{ transformOrigin: "50px 50px" }}
        />
        <circle cx="50" cy="50" r="34" fill="url(#irisCore)" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#eceae4" strokeWidth="0.6" opacity="0.25" />
        <g className="iris-eye" style={{ transformOrigin: "38px 44px" }}>
          <ellipse cx="38" cy="44" rx="4.2" ry="5" fill="#0b0c0d" />
          <circle cx="36.6" cy="42.4" r="1.1" fill="#eceae4" />
        </g>
        <g className="iris-eye" style={{ transformOrigin: "62px 44px", animationDelay: "0.12s" }}>
          <ellipse cx="62" cy="44" rx="4.2" ry="5" fill="#0b0c0d" />
          <circle cx="60.6" cy="42.4" r="1.1" fill="#eceae4" />
        </g>
        {talking ? (
          <path
            d="M38 62 Q50 72 62 62"
            fill="none"
            stroke="#0b0c0d"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="iris-mouth-talk"
          />
        ) : mood === "ok" ? (
          <path d="M38 61 Q50 70 62 61" fill="none" stroke="#0b0c0d" strokeWidth="2.2" strokeLinecap="round" />
        ) : mood === "think" ? (
          <path d="M40 64 H60" fill="none" stroke="#0b0c0d" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M38 62 Q50 66 62 62" fill="none" stroke="#0b0c0d" strokeWidth="2" strokeLinecap="round" />
        )}
        <circle cx="50" cy="18" r="3.2" fill="#6b8f71" />
      </svg>
    </div>
  );
}
