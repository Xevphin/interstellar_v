import React from "react";
import CapAvatar from "./CapAvatar";

const ICON_MAP = {
  power: "⚡",
  oxygen: "🫁",
  shielding: "🛡️",
  food: "🌱",
};

function DirectionalBadges({ effects, resourceNames }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {Object.entries(effects).map(([key, delta]) => {
        const up = delta > 0;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${
              up
                ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                : "bg-rose-500/20 border-rose-400/40 text-rose-300"
            }`}
          >
            <span>{ICON_MAP[key]}</span>
            <span>{resourceNames[key]}</span>
            <span>{up ? "▲" : "▼"}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function SolCard({
  t,
  phase,
  currentSol,
  solConfig,
  capMood,
  onStartSol1,
  onChoose,
  onGoToQuiz,
}) {
  if (phase === "intro") {
    return (
      <div className="fixed bottom-4 inset-x-0 z-20 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <CapAvatar mood="happy" message={t.intro.capLine} />
          <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-orange-400/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {t.intro.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{t.clickModuleHint}</p>
            </div>
            <button
              type="button"
              onClick={onStartSol1}
              className="shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-display font-bold text-base shadow-lg transition transform hover:-translate-y-0.5"
            >
              {t.intro.startBtn} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "victory") {
    return (
      <div className="fixed bottom-4 inset-x-0 z-20 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <CapAvatar mood="happy" message={t.victory.capLine} />
          <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border-2 border-emerald-400/60 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-emerald-300">
                {t.victory.bannerTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={onGoToQuiz}
              className="shrink-0 px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-display font-bold text-base shadow-lg transition transform hover:-translate-y-0.5"
            >
              {t.victory.goToQuiz} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase !== "playing" || !solConfig) return null;

  const solCopy = t.sols[currentSol];

  return (
    <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-20 px-3 sm:px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
        <CapAvatar mood={capMood} message={solCopy.capTip} />

        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h2 className="font-display text-base sm:text-xl font-bold text-orange-300">
              {solCopy.title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3.5">
            {solCopy.context}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => onChoose("A")}
              className="text-left p-3 sm:p-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-700/90 border border-cyan-400/40 hover:border-cyan-300 transition shadow-md active:scale-[0.99]"
            >
              <div className="font-bold text-sm sm:text-base text-white">
                🅰️ {solCopy.choiceA}
              </div>
              <DirectionalBadges effects={solConfig.choiceA.effects} resourceNames={t.resources} />
            </button>

            <button
              type="button"
              onClick={() => onChoose("B")}
              className="text-left p-3 sm:p-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-700/90 border border-amber-400/40 hover:border-amber-300 transition shadow-md active:scale-[0.99]"
            >
              <div className="font-bold text-sm sm:text-base text-white">
                🅱️ {solCopy.choiceB}
              </div>
              <DirectionalBadges effects={solConfig.choiceB.effects} resourceNames={t.resources} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
