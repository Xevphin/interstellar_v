import React, { useState } from "react";
import { Sparkles, HelpCircle, Scale, Activity, ChevronDown, ChevronUp } from "lucide-react";

export function DrFarahPortrait({ mood = "happy", size = "md" }) {
  const [imgError, setImgError] = useState(false);

  const moodRing = {
    happy: "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.45)]",
    worried: "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.45)]",
    alert: "border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.65)]",
  };

  const sizeClasses = {
    sm: "w-12 h-12 rounded-2xl",
    md: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
    lg: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl",
  };

  return (
    <div
      className={`relative shrink-0 ${sizeClasses[size] || sizeClasses.md} bg-gradient-to-b from-slate-800 to-slate-950 border-2 ${
        moodRing[mood] || moodRing.happy
      } overflow-hidden flex flex-col items-center justify-end select-none`}
    >
      {!imgError ? (
        <img
          src="/dr-farah.png"
          alt="Dr. Farah"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain object-bottom p-0.5 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-2xl">
          👩‍🚀
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-sm py-0.5 text-center border-t border-white/10">
        <span className="text-[9px] font-extrabold tracking-wider uppercase text-cyan-300 block leading-none">
          DR. FARAH
        </span>
      </div>
    </div>
  );
}

export default function DrFarahAvatar({ mood = "happy", message }) {
  return (
    <div className="pointer-events-none flex items-end gap-3 max-w-md">
      <div className="animate-float">
        <DrFarahPortrait mood={mood} size="md" />
      </div>

      {message && (
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-cyan-400/35 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xl text-xs sm:text-sm text-slate-100 leading-snug max-w-xs sm:max-w-sm">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 mb-0.5">
            Dr. Farah • Mission Scientist
          </div>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
}

export function DrFarahHelperPopup({ t, solCopy, stats, onPlaySfx }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("default"); // default | hint | tradeoff | lowest

  const lowestEntry = Object.entries(stats).reduce((min, cur) =>
    cur[1] < min[1] ? cur : min
  );
  const lowestStatName = t.resources[lowestEntry[0]];
  const lowestStatVal = lowestEntry[1];

  let replyText = t.aiHelper.defaultGreeting;
  if (activeTab === "hint") {
    replyText = solCopy.hint;
  } else if (activeTab === "tradeoff") {
    replyText = solCopy.tradeoff;
  } else if (activeTab === "lowest") {
    replyText = t.aiHelper.lowestStatAdvice(lowestStatName, lowestStatVal);
  }

  return (
    <div className="bg-slate-900/95 border border-cyan-400/45 rounded-2xl p-3 sm:p-3.5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <DrFarahPortrait mood="happy" size="sm" />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.aiHelper.title}</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">{ solCopy.drFarahTip }</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onPlaySfx?.("click");
            setOpen((o) => !o);
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 text-cyan-200 text-xs font-extrabold transition"
        >
          <span>{t.aiHelper.buttonLabel}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="p-3 rounded-xl bg-slate-800/90 border border-cyan-400/30 text-xs sm:text-sm text-cyan-100 leading-relaxed mb-2.5">
            “{replyText}”
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onPlaySfx?.("click");
                setActiveTab("hint");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeTab === "hint"
                  ? "bg-cyan-400 text-slate-950 border-cyan-300"
                  : "bg-slate-800 hover:bg-slate-700 text-cyan-200 border-white/15"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.aiHelper.askHintBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx?.("click");
                setActiveTab("tradeoff");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeTab === "tradeoff"
                  ? "bg-amber-400 text-slate-950 border-amber-300"
                  : "bg-slate-800 hover:bg-slate-700 text-amber-200 border-white/15"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t.aiHelper.explainTradeoffBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx?.("click");
                setActiveTab("lowest");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeTab === "lowest"
                  ? "bg-emerald-400 text-slate-950 border-emerald-300"
                  : "bg-slate-800 hover:bg-slate-700 text-emerald-200 border-white/15"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.aiHelper.checkLowestBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
