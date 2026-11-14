import React from "react";
import { Lock, Settings, Rocket, Sparkles } from "lucide-react";

export default function StartScreen({ t, onStartMars, onOpenSettings, onOpenNasa }) {
  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 pointer-events-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={onOpenNasa}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/75 hover:bg-slate-800/90 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-sky-200 transition shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{t.nasaDataBtn}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.settings}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/75 hover:bg-slate-800/90 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-slate-100 transition shadow-lg"
        >
          <Settings className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">{t.settings}</span>
        </button>
      </div>

      {/* Hero Title + Planet Selector Cards */}
      <div className="my-auto flex flex-col items-center text-center max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur-md text-orange-200 text-xs sm:text-sm font-bold mb-3 shadow">
          <span>🚀</span>
          <span>{t.heroTagline}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)] mb-2">
          {t.gameTitle}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-orange-100/90 drop-shadow mb-6 sm:mb-8">
          {t.choosePlanet}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full pointer-events-auto">
          {/* Card 1: Mars (Unlocked) */}
          <button
            type="button"
            onClick={onStartMars}
            className="group relative text-left p-5 sm:p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-md border-2 border-orange-400/70 hover:border-orange-300 shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-2xl shadow-inner">
                🔴
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                {t.marsCTA}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-orange-300 transition">
              {t.marsTitle}
            </h2>
            <p className="text-sm text-slate-300 mb-4">{t.marsSubtitle}</p>

            <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
              <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>{t.marsCTA} →</span>
            </div>
          </button>

          {/* Card 2: Moon (Locked) */}
          <div
            aria-disabled="true"
            className="relative text-left p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-lg border-2 border-white/15 shadow-xl overflow-hidden cursor-not-allowed select-none"
          >
            {/* Frosted Lock Overlay */}
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px] flex flex-col items-center justify-center z-10 p-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-white/20 flex items-center justify-center mb-2 shadow-lg">
                <Lock className="w-6 h-6 text-slate-200" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-white/15 text-xs font-extrabold uppercase tracking-wider text-slate-200">
                🔒 {t.moonSubtitle}
              </span>
            </div>

            <div className="opacity-45">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-600 flex items-center justify-center text-2xl">
                  🌕
                </div>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                {t.moonTitle}
              </h2>
              <p className="text-sm text-slate-300">{t.moonSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
