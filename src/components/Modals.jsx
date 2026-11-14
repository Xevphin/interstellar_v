import React from "react";
import { X, Volume2, VolumeX, Globe, Sparkles, RotateCcw, Camera, MonitorCog, Users } from "lucide-react";
import DrFarahAvatar from "./DrFarahAvatar";
import { PROJECT_TITLE, TEAM_CREDITS } from "../data/credits";

export function SettingsModal({
  t,
  lang,
  onChangeLang,
  soundOn,
  onToggleSound,
  volume = 0.8,
  onChangeVolume,
  cameraSensitivity = 1,
  onChangeSensitivity,
  graphicsQuality = "high",
  onChangeGraphics,
  onClose,
}) {
  const s = t.settingsExtra;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl my-auto">
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

          <div className={`mt-2.5 p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 ${soundOn ? "" : "opacity-50"}`}>
            <div className="flex items-center justify-between text-sm font-bold text-slate-200 mb-2">
              <span>{s.volumeLabel}</span>
              <span className="font-mono text-emerald-300">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              disabled={!soundOn}
              onChange={(e) => onChangeVolume?.(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Camera Sensitivity */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
            <Camera className="w-4 h-4 text-sky-400" />
            <span>{s.cameraSection}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="flex items-center justify-between text-sm font-bold text-slate-200 mb-2">
              <span>{s.sensitivityLabel}</span>
              <span className="font-mono text-sky-300">{cameraSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={2}
              step={0.1}
              value={cameraSensitivity}
              onChange={(e) => onChangeSensitivity?.(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-1">
              <span>{s.sensitivityLow}</span>
              <span>{s.sensitivityHigh}</span>
            </div>
          </div>
        </div>

        {/* Graphics Quality */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
            <MonitorCog className="w-4 h-4 text-purple-400" />
            <span>{s.graphicsSection} • {s.graphicsLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "high", label: s.graphicsHigh },
              { key: "low", label: s.graphicsLow },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChangeGraphics?.(opt.key)}
                className={`py-2.5 px-3 rounded-2xl font-bold text-sm border transition ${
                  graphicsQuality === opt.key
                    ? "bg-purple-400 text-slate-950 border-purple-300"
                    : "bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
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

export function CreditsModal({ t, onClose }) {
  const c = t.credits;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-400/35 rounded-3xl p-6 shadow-2xl my-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <h2 className="font-display text-xl font-bold text-white">{c.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">{c.projectLabel}</div>
        <div className="font-display text-lg font-bold text-white mb-3">{PROJECT_TITLE}</div>

        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 mb-1">{c.overviewLabel}</div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{c.overview}</p>

        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 mb-2">{c.teamLabel}</div>
        <div className="flex flex-col gap-1.5 mb-4">
          {TEAM_CREDITS.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm"
            >
              <span className="text-slate-400 font-semibold">{member.role}</span>
              <span className="text-white font-bold text-right">{member.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300 mb-1">{c.scienceLabel}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{c.science}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300 mb-1">{c.techLabel}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{c.tech}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition"
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
          <DrFarahAvatar mood="alert" message={tip} />
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
