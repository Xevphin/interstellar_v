import React from "react";
import { Rocket, Settings, Users } from "lucide-react";

export default function TitleScreen({ t, onStart, onOpenSettings, onOpenCredits }) {
  const buttons = [
    {
      key: "start",
      label: t.title.startBtn,
      icon: Rocket,
      onClick: onStart,
      style:
        "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.55)] hover:shadow-[0_0_50px_rgba(56,189,248,0.8)]",
    },
    {
      key: "settings",
      label: t.title.settingsBtn,
      icon: Settings,
      onClick: onOpenSettings,
      style: "bg-slate-900/70 text-slate-100 border border-white/20 hover:border-cyan-300/70 hover:bg-slate-800/80",
    },
    {
      key: "credits",
      label: t.title.creditsBtn,
      icon: Users,
      onClick: onOpenCredits,
      style: "bg-slate-900/70 text-slate-100 border border-white/20 hover:border-amber-300/70 hover:bg-slate-800/80",
    },
  ];

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center p-6 pointer-events-none">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="px-4 py-1.5 rounded-full bg-slate-900/60 border border-cyan-400/40 backdrop-blur-md text-cyan-200 text-xs sm:text-sm font-bold tracking-wider uppercase mb-5">
          🚀 {t.title.kicker}
        </div>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-sky-400 drop-shadow-[0_6px_30px_rgba(56,189,248,0.45)]">
          {t.title.heading}
        </h1>
        <p className="mt-2 font-display text-lg sm:text-2xl font-semibold text-sky-200/90 tracking-wide">
          {t.title.subheading}
        </p>

        <div className="mt-10 flex flex-col gap-3.5 w-72 sm:w-80 pointer-events-auto">
          {buttons.map(({ key, label, icon: Icon, onClick, style }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              className={`group flex items-center justify-center gap-3 py-4 rounded-2xl backdrop-blur-md font-display font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${style}`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="absolute bottom-5 text-[11px] sm:text-xs font-semibold text-slate-400/90">
        {t.title.footer}
      </p>
    </div>
  );
}
