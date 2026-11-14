import React, { useState } from "react";
import { ChevronRight, Rocket } from "lucide-react";

const FRAMES = {
  stable: "/cockpit/frame-1-stable.jpg",
  alert: "/cockpit/frame-2-alert.jpg",
  chilly: "/cockpit/frame-3-chilly.jpg",
  choice: "/cockpit/frame-4-choice.png",
  outcomeA: "/cockpit/frame-5a-outcome.jpg",
  outcomeB: "/cockpit/frame-5b-outcome.jpg",
};

export default function LunarCockpitTask({ t, onCompleteCockpitTask, onPlaySfx }) {
  // Steps: "stable" -> "alert" -> "chilly" -> "choice" -> "outcomeA" | "outcomeB"
  const [step, setStep] = useState("stable");
  const [chosenOption, setChosenOption] = useState(null); // "A" | "B"

  const ct = t.cockpitTask;

  const handleNext = () => {
    onPlaySfx?.("click");
    if (step === "stable") {
      onPlaySfx?.("alert");
      setStep("alert");
    } else if (step === "alert") {
      setStep("chilly");
    } else if (step === "chilly") {
      setStep("choice");
    }
  };

  const handleChoose = (opt) => {
    setChosenOption(opt);
    if (opt === "A") {
      onPlaySfx?.("success");
      setStep("outcomeA");
    } else {
      onPlaySfx?.("alert");
      setStep("outcomeB");
    }
  };

  const handleExitToBase = () => {
    onPlaySfx?.("success");
    // Pass the chosen option ("A" or "B") so App updates the starting resources accordingly
    onCompleteCockpitTask(chosenOption || "A");
  };

  const currentImg = FRAMES[step] || FRAMES.stable;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Full-Frame Compiled Visual Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <img
          key={currentImg}
          src={currentImg}
          alt="Lunar Rocket Cockpit Power Control System"
          className="w-full h-full object-contain sm:object-cover animate-fade-in"
        />

        {/* Top-Left Badge covering the baked-in "DAY 1/4" corner on the artwork */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-6 px-4 py-2 rounded-xl bg-slate-950 border border-cyan-400/50 shadow-lg">
          <span className="font-display text-xs sm:text-sm font-bold tracking-wider uppercase text-cyan-300">
            🌕 {ct.badge}
          </span>
        </div>

        {/* Clean Speech Bubble Overlay on Outcome B (removes "on Day 1" from baked text) */}
        {step === "outcomeB" && (
          <div className="hidden sm:flex absolute bottom-[9%] left-[37%] w-[43%] min-h-[16%] bg-white rounded-3xl px-6 py-4 items-center justify-center text-center shadow-xl">
            <p className="font-sans font-bold text-slate-900 text-sm md:text-lg leading-snug">
              {ct.frames.outcomeB}
            </p>
          </div>
        )}

        {/* Interactive Choice Overlay on Step "choice" */}
        {step === "choice" && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-950/35 backdrop-blur-[1px]">
            <div className="w-full max-w-3xl rounded-3xl bg-[#141b3d]/95 border-2 border-indigo-400/40 p-5 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85)] animate-fade-in">
              <div className="text-center mb-4">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-200 mb-1">
                  {ct.systemTitle}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-orange-400 tracking-wide">
                  {ct.alertTitle}
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed mb-6 text-center sm:text-left">
                {ct.choosePrompt}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Option A Card */}
                <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/25 hover:border-amber-300 transition">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 mb-3">
                      {ct.optionATitle}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {ct.optionABadges.map((badge, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChoose("A")}
                    className="w-full py-3 rounded-full bg-amber-300 hover:bg-amber-200 text-slate-950 font-display font-extrabold text-sm tracking-wider uppercase shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    {ct.chooseABtn}
                  </button>
                </div>

                {/* Option B Card */}
                <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/25 hover:border-amber-300 transition">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 mb-3">
                      {ct.optionBTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {ct.optionBBadges.map((badge, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChoose("B")}
                    className="w-full py-3 rounded-full bg-amber-300 hover:bg-amber-200 text-slate-950 font-display font-extrabold text-sm tracking-wider uppercase shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    {ct.chooseBBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar for Narrative Frames & Final Exit to Basecamp */}
        {step !== "choice" && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-3">
            {step === "outcomeA" || step === "outcomeB" ? (
              <button
                type="button"
                onClick={handleExitToBase}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-display font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(34,211,238,0.65)] transition transform hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5" />
                <span>{ct.exitToBaseBtn} →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-base sm:text-lg shadow-[0_0_25px_rgba(251,191,36,0.6)] transition transform hover:-translate-y-0.5"
              >
                <span>{ct.nextBtn}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
