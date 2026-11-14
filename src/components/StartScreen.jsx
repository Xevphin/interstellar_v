import React from "react";
import { Settings, Rocket, Sparkles, ArrowLeft } from "lucide-react";
import { DrFarahPortrait } from "./DrFarahAvatar";

export default function StartScreen({ t, onStartMission, onBack, onOpenSettings, onOpenNasa }) {
  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 pointer-events-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-slate-200 transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.select?.backBtn || "Back"}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenNasa}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-sky-200 transition shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{t.nasaDataBtn}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.settings}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-slate-100 transition shadow-lg"
        >
          <Settings className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">{t.settings}</span>
        </button>
      </div>

      {/* Hero Title + Planet Selector Cards */}
      <div className="my-auto flex flex-col items-center text-center max-w-3xl mx-auto w-full">
        <div className="mb-3 pointer-events-auto">
          <DrFarahPortrait mood="happy" size="md" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md text-cyan-200 text-xs sm:text-sm font-bold mb-3 shadow">
          <span>🚀</span>
          <span>{t.heroTagline}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)] mb-2">
          {t.gameTitle}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-slate-200 drop-shadow mb-6">
          {t.choosePlanet}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full pointer-events-auto">
          {/* Card 1: Moon Shackleton Lunar Outpost (Primary Featured) */}
          <button
            type="button"
            onClick={() => onStartMission("lunar")}
            className="group relative text-left p-5 sm:p-6 rounded-3xl bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md border-2 border-cyan-400/75 hover:border-cyan-300 shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center text-2xl shadow-inner">
                🌕
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
                {t.lunarCTA}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition">
              {t.lunarTitle}
            </h2>
            <p className="text-sm text-slate-300 mb-4">{t.lunarSubtitle}</p>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>{t.lunarCTA} →</span>
            </div>
          </button>

          {/* Card 2: Mars Jezero Crater Outpost */}
          <button
            type="button"
            onClick={() => onStartMission("mars")}
            className="group relative text-left p-5 sm:p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-md border-2 border-orange-400/65 hover:border-orange-300 shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-2xl shadow-inner">
                🔴
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-extrabold uppercase tracking-wider">
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
        </div>
      </div>

      <div className="h-2" />
    </div>
  );
}
