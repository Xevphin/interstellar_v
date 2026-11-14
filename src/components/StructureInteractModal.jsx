import React, { useEffect, useState } from "react";
import DrFarahAvatar, { DrFarahHelperPopup, DrFarahPortrait } from "./DrFarahAvatar";
import { Clock, ClipboardCheck, BookOpen, LogOut, Sparkles, Rocket, Compass } from "lucide-react";

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

export default function StructureInteractModal({
  t,
  nearbyStructure,
  activeStructure,
  interactionMode, // null | "menu" | "task" | "fact"
  completedTasks,
  stats,
  drFarahMood,
  timeoutBanner,
  showUpgradeModal,
  onOpenMenu,
  onSelectMode,
  onCloseInteraction,
  onChooseTaskOption,
  onTaskTimeout,
  onDismissUpgrade,
  onStartQuiz,
  onLocateNextTask,
  onPlaySfx,
}) {
  const [timeLeft, setTimeLeft] = useState(30);

  // Reset 30s timer whenever Task modal opens
  useEffect(() => {
    if (interactionMode !== "task" || !activeStructure) return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTaskTimeout(activeStructure);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [interactionMode, activeStructure, onTaskTimeout]);

  // Listen for [E] key to open menu when near a structure, or Escape to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showUpgradeModal) return;
      if ((e.code === "KeyE" || e.key === "e" || e.key === "E") && !interactionMode && nearbyStructure) {
        e.preventDefault();
        onOpenMenu(nearbyStructure);
      } else if (e.code === "Escape" && interactionMode) {
        e.preventDefault();
        onCloseInteraction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nearbyStructure, interactionMode, showUpgradeModal, onOpenMenu, onCloseInteraction]);

  // 1. Rover Upgrade Celebration Modal (Once all 6 tasks are completed)
  if (showUpgradeModal) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.35)]">
          <div className="flex items-center gap-3.5 mb-4">
            <DrFarahPortrait mood="happy" size="md" />
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rover MK-II Unlocked</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                {t.upgrade.bannerTitle}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-800/80 border border-white/10 rounded-2xl p-4 mb-5">
            “{t.upgrade.drFarahMsg}”
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onDismissUpgrade}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-cyan-400/40 text-cyan-200 font-bold text-sm transition"
            >
              🏎️ {t.upgrade.dismissBtn}
            </button>
            <button
              type="button"
              onClick={onStartQuiz}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-display font-bold text-sm shadow-lg transition"
            >
              🏆 {t.upgrade.quizNowBtn} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unified 3-Option Action Menu: Task, Fact, Exit
  if (interactionMode === "menu" && activeStructure) {
    const structName = t.modules[activeStructure.id];
    const isDone = completedTasks.includes(activeStructure.id);

    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
        <div className="w-full max-w-md bg-slate-900/95 border-2 border-cyan-400/60 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <DrFarahPortrait mood={drFarahMood} size="sm" />
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                {t.actionMenu.title}
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {structName}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-4">{t.actionMenu.subtitle}</p>

          <div className="flex flex-col gap-2.5">
            {/* Option 1: Task */}
            <button
              type="button"
              onClick={() => onSelectMode("task")}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/90 hover:bg-cyan-950/80 border border-cyan-400/40 hover:border-cyan-300 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-white group-hover:text-cyan-200 flex items-center gap-2">
                    <span>1. {t.actionMenu.taskBtn}</span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase">
                        ✓ {t.actionMenu.taskDoneBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{t.actionMenu.taskDesc}</div>
                </div>
              </div>
            </button>

            {/* Option 2: Fact */}
            <button
              type="button"
              onClick={() => onSelectMode("fact")}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/90 hover:bg-amber-950/60 border border-amber-400/40 hover:border-amber-300 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-white group-hover:text-amber-200">
                    2. {t.actionMenu.factBtn}
                  </div>
                  <div className="text-xs text-slate-400">{t.actionMenu.factDesc}</div>
                </div>
              </div>
            </button>

            {/* Option 3: Exit */}
            <button
              type="button"
              onClick={onCloseInteraction}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/15 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-300">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-slate-200">
                    3. {t.actionMenu.exitBtn}
                  </div>
                  <div className="text-xs text-slate-400">{t.actionMenu.exitDesc}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Structure Science Fact Modal
  if (interactionMode === "fact" && activeStructure) {
    const solCopy = t.sols[activeStructure.day];
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <DrFarahPortrait mood="happy" size="md" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                {t.modules[activeStructure.id]}
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                {solCopy.factTitle}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 text-sm text-slate-100 leading-relaxed mb-5">
            {solCopy.factBody}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectMode("task")}
              className="flex-1 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition"
            >
              {t.actionMenu.taskBtn} →
            </button>
            <button
              type="button"
              onClick={onCloseInteraction}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 font-bold text-sm transition"
            >
              {t.actionMenu.exitBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Structure Task Choice Modal (with 30s Countdown Timer & Dr. Farah AI Helper Chatbot)
  if (interactionMode === "task" && activeStructure) {
    const solCopy = t.sols[activeStructure.day];
    const pct = (timeLeft / 30) * 100;
    const isRed = timeLeft <= 5;
    const isAmber = timeLeft > 5 && timeLeft <= 10;

    const timerColor = isRed
      ? "text-rose-400 border-rose-500/70 bg-rose-950/60 animate-pulse"
      : isAmber
      ? "text-amber-300 border-amber-400/70 bg-amber-950/60"
      : "text-cyan-300 border-cyan-400/40 bg-slate-800/90";

    const barColor = isRed ? "bg-rose-500" : isAmber ? "bg-amber-400" : "bg-cyan-400";

    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-2xl my-auto flex flex-col gap-3">
          {/* Dr. Farah AI Helper Chatbot Popup */}
          <DrFarahHelperPopup
            t={t}
            solCopy={solCopy}
            stats={stats}
            onPlaySfx={onPlaySfx}
          />

          {/* Main Task Decision Card */}
          <div className="bg-slate-900/95 border-2 border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl">
            {/* Top Row: Title + 30s Countdown Readout */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="font-display text-lg sm:text-2xl font-bold text-orange-300">
                {solCopy.title}
              </h2>

              <div
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs sm:text-sm font-extrabold ${timerColor}`}
              >
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* 30-Second Countdown Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-300 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              {solCopy.context}
            </p>

            {/* Choices A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => onChooseTaskOption(activeStructure, "A", timeLeft)}
                className="text-left p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border-2 border-cyan-400/45 hover:border-cyan-300 transition shadow-md active:scale-[0.99]"
              >
                <div className="font-bold text-sm sm:text-base text-white">
                  a. {solCopy.choiceA}
                </div>
                <DirectionalBadges
                  effects={activeStructure.choiceA.effects}
                  resourceNames={t.resources}
                />
              </button>

              <button
                type="button"
                onClick={() => onChooseTaskOption(activeStructure, "B", timeLeft)}
                className="text-left p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border-2 border-amber-400/45 hover:border-amber-300 transition shadow-md active:scale-[0.99]"
              >
                <div className="font-bold text-sm sm:text-base text-white">
                  b. {solCopy.choiceB}
                </div>
                <DirectionalBadges
                  effects={activeStructure.choiceB.effects}
                  resourceNames={t.resources}
                />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCloseInteraction}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
              >
                {t.actionMenu.exitBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Floating Bottom Exploration HUD (Proximity [E] Prompt + Dr. Farah Status + Quick Actions)
  const allDone = completedTasks.length >= 6;

  return (
    <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-20 px-3 sm:px-4 pointer-events-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {timeoutBanner && (
          <div className="pointer-events-auto self-center px-4 py-2 rounded-2xl bg-rose-950/90 border border-rose-400 text-rose-200 text-xs sm:text-sm font-bold shadow-lg">
            ⏰ {t.timer.timeoutNotice}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          <DrFarahAvatar
            mood={drFarahMood}
            message={
              nearbyStructure
                ? `${t.modules[nearbyStructure.id]} — ${t.interactPrompt}!`
                : allDone
                ? t.upgrade.bannerTitle
                : t.roverHint
            }
          />

          <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-end">
            {nearbyStructure && (
              <button
                type="button"
                onClick={() => onOpenMenu(nearbyStructure)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-display font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(34,211,238,0.5)] animate-bounce"
              >
                <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-xs font-mono">
                  E
                </span>
                <span>{t.interactPrompt}</span>
              </button>
            )}

            {!allDone && (
              <button
                type="button"
                onClick={onLocateNextTask}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-bold shadow-lg transition"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>{t.nextTaskBtn}</span>
              </button>
            )}

            {allDone && (
              <button
                type="button"
                onClick={onStartQuiz}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-display font-bold text-sm sm:text-base shadow-xl transition"
              >
                <Rocket className="w-4 h-4" />
                <span>{t.finishMissionBtn} →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
