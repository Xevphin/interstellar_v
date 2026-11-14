import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, MapPin, Rocket } from "lucide-react";
import { DrFarahPortrait } from "./DrFarahAvatar";

export default function IntroGreetingModal({ t, planet = "lunar", onStartExploration, onPlaySfx }) {
  const chat = t.introChat;
  const messages = chat[planet] || chat.lunar;

  const [shownCount, setShownCount] = useState(0);
  const [typing, setTyping] = useState(true);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  // Reveal the first bubble after a short "typing" beat
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShownCount(1);
      setTyping(false);
    }, 700);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Keep the newest bubble in view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [shownCount, typing]);

  const isLast = shownCount >= messages.length;

  const handleNext = () => {
    if (typing) return;
    onPlaySfx?.("click");
    if (isLast) {
      onStartExploration();
      return;
    }
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setShownCount((c) => Math.min(messages.length, c + 1));
      setTyping(false);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-slate-950/55 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl flex gap-3 sm:gap-5 items-end animate-fade-in">
        {/* Dr. Farah portrait beside the chat */}
        <div className="hidden sm:flex flex-col items-center gap-2 shrink-0 animate-float">
          <DrFarahPortrait mood="happy" size="lg" />
        </div>

        <div className="flex-1 min-w-0 bg-slate-900/90 border border-cyan-400/40 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/10 bg-slate-950/50">
            <div className="sm:hidden">
              <DrFarahPortrait mood="happy" size="sm" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white">Dr. Farah</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-400">{chat.role}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{chat.location[planet]}</span>
              </div>
            </div>
          </div>

          {/* Chat bubbles */}
          <div ref={scrollRef} className="max-h-[52vh] overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-2.5">
            {messages.slice(0, shownCount).map((msg, idx) => (
              <div
                key={`${planet}-${idx}`}
                className={`self-start max-w-[92%] px-4 py-3 rounded-2xl rounded-bl-md text-sm sm:text-[15px] leading-relaxed shadow-md animate-bubble-in ${
                  msg.highlight
                    ? "bg-gradient-to-br from-cyan-500/25 to-indigo-500/25 border-2 border-cyan-300/70 text-white font-bold"
                    : "bg-slate-800/95 border border-white/10 text-slate-100"
                }`}
              >
                {msg.highlight && <span className="block text-[10px] uppercase tracking-widest text-cyan-300 mb-1">⭐ {chat.secretLabel}</span>}
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="self-start flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md bg-slate-800/95 border border-white/10" aria-label={chat.typing}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Progress + Next / Begin */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-white/10 bg-slate-950/40">
            <div className="flex gap-1.5">
              {messages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx < shownCount ? "w-5 bg-cyan-400" : "w-1.5 bg-slate-600"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={typing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base transition ${
                isLast
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.45)]"
                  : "bg-slate-800 hover:bg-slate-700 border border-cyan-400/40 text-cyan-100"
              } disabled:opacity-50`}
            >
              {isLast ? <Rocket className="w-4 h-4" /> : null}
              <span>{isLast ? chat.beginBtn : chat.nextBtn}</span>
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
