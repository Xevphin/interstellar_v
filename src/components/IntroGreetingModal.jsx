import React from "react";
import { DrFarahPortrait } from "./DrFarahAvatar";
import { Rocket, CheckCircle2, Sparkles } from "lucide-react";

export default function IntroGreetingModal({ t, onStartExploration }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border-2 border-cyan-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)] my-auto">
        {/* Header with Dr. Farah Portrait */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
          <DrFarahPortrait mood="happy" size="lg" />

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.intro.badge}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              {t.intro.title}
            </h2>

            {/* Exact Required Core Briefing Line */}
            <blockquote className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/90 to-slate-800/90 border-l-4 border-cyan-400 text-cyan-100 text-sm sm:text-base font-bold leading-relaxed shadow-inner">
              “{t.intro.coreQuote}”
            </blockquote>
          </div>
        </div>

        {/* How to Play Steps */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-white/10 mb-6">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 mb-3">
            {t.intro.howToPlayTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {t.intro.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-white/5 text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={onStartExploration}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-display font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] transition transform hover:-translate-y-0.5"
        >
          <Rocket className="w-5 h-5" />
          <span>{t.intro.startBtn} →</span>
        </button>
      </div>
    </div>
  );
}
