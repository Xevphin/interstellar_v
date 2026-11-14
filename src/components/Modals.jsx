import React from "react";
import { X, Volume2, VolumeX, Globe, Sparkles, RotateCcw } from "lucide-react";
import CapAvatar from "./CapAvatar";

export function SettingsModal({ t, lang, onChangeLang, soundOn, onToggleSound, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-white">{t.settings}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Toggle */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{t.language}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeLang("en")}
              className={`py-2.5 px-3 rounded-2xl font-bold text-sm border transition ${
                lang === "en"
                  ? "bg-cyan-400 text-slate-950 border-cyan-300"
                  : "bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onChangeLang("ms")}
              className={`py-2.5 px-3 rounded-2xl font-bold text-sm border transition ${
                lang === "ms"
                  ? "bg-cyan-400 text-slate-950 border-cyan-300"
                  : "bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700"
              }`}
            >
              Bahasa Melayu
            </button>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-200">
              {soundOn ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <span>{t.soundLabel}</span>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase transition ${
                soundOn
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {soundOn ? t.soundOn : t.soundOff}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 font-bold text-sm text-white transition"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}

export function LoseModal({ t, depletedResource, onRetry }) {
  const tip = t.lose.tips[depletedResource] || t.lose.tips.power;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl">
        <h2 className="font-display text-2xl font-bold text-rose-400 mb-4">
          {t.lose.title}
        </h2>

        <div className="mb-6">
          <CapAvatar mood="alert" message={tip} />
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-display font-bold text-base shadow-lg transition"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t.lose.retryBtn}</span>
        </button>
      </div>
    </div>
  );
}

export function NasaDataModal({ t, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-sky-400/35 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="font-display text-xl font-bold text-white">{t.nasaModal.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-4">{t.nasaModal.intro}</p>

        <div className="flex flex-col gap-3 mb-5">
          {t.nasaModal.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10"
            >
              <div className="font-bold text-sm text-sky-300 mb-0.5">{item.name}</div>
              <div className="text-xs text-slate-300 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm transition"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
