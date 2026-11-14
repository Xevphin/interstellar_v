import React from "react";

export default function CapAvatar({ mood = "happy", message }) {
  const visorConfig = {
    happy: {
      border: "border-cyan-400/70",
      glow: "shadow-[0_0_24px_rgba(34,211,238,0.45)]",
      visorBg: "bg-cyan-950",
      eyeColor: "bg-cyan-300",
      labelColor: "text-cyan-300",
    },
    worried: {
      border: "border-amber-400/80",
      glow: "shadow-[0_0_24px_rgba(251,191,36,0.45)]",
      visorBg: "bg-amber-950",
      eyeColor: "bg-amber-300",
      labelColor: "text-amber-300",
    },
    alert: {
      border: "border-rose-500/90",
      glow: "shadow-[0_0_28px_rgba(244,63,94,0.6)]",
      visorBg: "bg-rose-950",
      eyeColor: "bg-rose-400",
      labelColor: "text-rose-300",
    },
  };

  const v = visorConfig[mood] || visorConfig.happy;

  return (
    <div className="pointer-events-none flex items-end gap-3 max-w-md">
      {/* Animated Hologram Rover-Bot */}
      <div
        className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/85 backdrop-blur-md border-2 ${v.border} ${v.glow} flex flex-col items-center justify-center animate-float`}
      >
        {/* Antenna */}
        <div className="absolute -top-2.5 w-1 h-3 bg-slate-400 rounded-full">
          <div
            className={`w-2.5 h-2.5 -ml-[3px] -mt-1.5 rounded-full ${v.eyeColor} animate-ping opacity-75`}
          />
          <div className={`w-2.5 h-2.5 -ml-[3px] -mt-2.5 rounded-full ${v.eyeColor}`} />
        </div>

        {/* Visor */}
        <div
          className={`w-12 sm:w-14 h-7 sm:h-8 rounded-xl ${v.visorBg} border border-white/15 flex items-center justify-center gap-2.5 overflow-hidden`}
        >
          {mood === "happy" && (
            <>
              <span className={`w-2.5 h-2.5 rounded-full ${v.eyeColor}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${v.eyeColor}`} />
            </>
          )}
          {mood === "worried" && (
            <>
              <span className={`w-3 h-1.5 rounded-full ${v.eyeColor} -rotate-12`} />
              <span className={`w-3 h-1.5 rounded-full ${v.eyeColor} rotate-12`} />
            </>
          )}
          {mood === "alert" && (
            <>
              <span className={`w-2.5 h-2.5 rotate-45 ${v.eyeColor} animate-pulse`} />
              <span className={`w-2.5 h-2.5 rotate-45 ${v.eyeColor} animate-pulse`} />
            </>
          )}
        </div>

        {/* Nameplate */}
        <span className={`mt-1 text-[10px] font-extrabold tracking-widest uppercase ${v.labelColor}`}>
          CAP
        </span>
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-xl text-xs sm:text-sm text-slate-100 leading-snug max-w-xs sm:max-w-sm">
          {message}
        </div>
      )}
    </div>
  );
}
