import React from "react";
import {
  Settings,
  Gamepad2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
} from "lucide-react";

const GAUGE_META = [
  { key: "power", icon: "⚡", bar: "bg-amber-400", text: "text-amber-300", border: "border-amber-400/30" },
  { key: "oxygen", icon: "🫁", bar: "bg-cyan-400", text: "text-cyan-300", border: "border-cyan-400/30" },
  { key: "shielding", icon: "🛡️", bar: "bg-indigo-400", text: "text-indigo-300", border: "border-indigo-400/30" },
  { key: "food", icon: "🌱", bar: "bg-emerald-400", text: "text-emerald-300", border: "border-emerald-400/30" },
];

export default function HUD({
  t,
  planet,
  currentSol,
  completedTasksCount,
  roverUpgraded,
  stats,
  roverMode,
  onToggleRoverMode,
  onOpenSettings,
  onOpenNasa,
  onDpadChange,
}) {
  const setDpad = (dir, pressed) => {
    onDpadChange((prev) => ({ ...prev, [dir]: pressed }));
  };

  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-0 inset-x-0 z-20 p-3 sm:p-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Day & Task Counter */}
          <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 shadow-lg">
            <span className="text-xl">{planet === "lunar" ? "🌕" : "🔴"}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm sm:text-base font-bold text-white">
                  {t.solLabel} {currentSol} <span className="text-xs text-slate-400">{t.ofSix}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-extrabold">
                  {t.tasksLabel}: {completedTasksCount}/6
                </span>
                {roverUpgraded && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-[10px] font-extrabold uppercase">
                    <Zap className="w-3 h-3" /> MK-II
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4 Resource Gauges */}
          <div className="pointer-events-auto flex-1 min-w-[260px] max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GAUGE_META.map((g) => {
              const val = Math.max(0, Math.min(100, stats[g.key]));
              const isLow = val <= 25;
              return (
                <div
                  key={g.key}
                  className={`px-3 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border ${
                    isLow ? "border-rose-500/80 animate-pulse" : g.border
                  } shadow-lg`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1 text-slate-200">
                      <span>{g.icon}</span>
                      <span className="truncate">{t.resources[g.key]}</span>
                    </span>
                    <span className={isLow ? "text-rose-400 font-extrabold" : g.text}>{val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? "bg-rose-500" : g.bar
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleRoverMode}
              title={roverMode ? t.roverMode : t.freeCamMode}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl backdrop-blur-md border text-xs font-bold transition shadow-lg ${
                roverMode
                  ? "bg-cyan-400 text-slate-950 border-cyan-300"
                  : "bg-slate-900/85 hover:bg-slate-800 text-slate-100 border-white/15"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden md:inline">
                {roverMode ? t.roverMode : t.freeCamMode}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenNasa}
              title={t.nasaDataBtn}
              className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-sky-300 transition shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              title={t.settings}
              className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-amber-300 transition shadow-lg"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* On-Screen D-Pad for Touch / Click Driving */}
      <div className="fixed right-4 bottom-32 sm:bottom-28 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onPointerDown={() => setDpad("up", true)}
          onPointerUp={() => setDpad("up", false)}
          onPointerLeave={() => setDpad("up", false)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/85 active:bg-cyan-400 active:text-slate-950 border border-white/20 flex items-center justify-center shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onPointerDown={() => setDpad("left", true)}
            onPointerUp={() => setDpad("left", false)}
            onPointerLeave={() => setDpad("left", false)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/85 active:bg-cyan-400 active:text-slate-950 border border-white/20 flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onPointerDown={() => setDpad("down", true)}
            onPointerUp={() => setDpad("down", false)}
            onPointerLeave={() => setDpad("down", false)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/85 active:bg-cyan-400 active:text-slate-950 border border-white/20 flex items-center justify-center shadow-lg"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onPointerDown={() => setDpad("right", true)}
            onPointerUp={() => setDpad("right", false)}
            onPointerLeave={() => setDpad("right", false)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/85 active:bg-cyan-400 active:text-slate-950 border border-white/20 flex items-center justify-center shadow-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
