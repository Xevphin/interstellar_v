import React, { useEffect, useState } from "react";
import DrFarahAvatar, { DrFarahHelperPopup, DrFarahPortrait } from "./DrFarahAvatar";
import {
  Clock,
  ClipboardCheck,
  BookOpen,
  LogOut,
  Sparkles,
  Rocket,
  Compass,
  CheckCircle2,
  Zap,
  Sliders,
  FlaskConical,
} from "lucide-react";
import { spaceAudio } from "../utils/sound";

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

// -----------------------------------------------------------------------------
// AMONG US MINI-GAME 1: Fix Wiring (For "solar" structure task)
// -----------------------------------------------------------------------------
const LEFT_WIRES = [
  { id: "red", label: "RED", hex: "#ef4444", y: 22 },
  { id: "yellow", label: "YLW", hex: "#facc15", y: 50 },
  { id: "cyan", label: "CYN", hex: "#22d3ee", y: 78 },
];
const RIGHT_WIRES = [
  { id: "cyan", label: "CYN", hex: "#22d3ee", y: 22 },
  { id: "red", label: "RED", hex: "#ef4444", y: 50 },
  { id: "yellow", label: "YLW", hex: "#facc15", y: 78 },
];

function FixWiringMiniTask({ lang, onCompleted }) {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connected, setConnected] = useState([]); // array of color ids

  const handleLeftClick = (id) => {
    if (connected.includes(id)) return;
    spaceAudio.playTone(520, 0.06, "sine", 0.1);
    setSelectedLeft(id);
  };

  const handleRightClick = (id) => {
    if (connected.includes(id)) return;
    if (selectedLeft === id) {
      spaceAudio.playTone(780, 0.12, "sine", 0.12);
      const next = [...connected, id];
      setConnected(next);
      setSelectedLeft(null);
      if (next.length === LEFT_WIRES.length) {
        onCompleted?.();
      }
    } else if (selectedLeft) {
      spaceAudio.playTone(220, 0.12, "triangle", 0.1);
      setSelectedLeft(null);
    }
  };

  const allDone = connected.length === LEFT_WIRES.length;

  return (
    <div className="p-3.5 rounded-2xl bg-slate-950/90 border-2 border-amber-400/50 mb-4">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5 text-amber-300">
          <Zap className="w-4 h-4" />
          <span>
            {lang === "ms"
              ? "Tugasan Mini: Sambungkan Wayar Panel Suria"
              : "Mini-Task: Fix Solar Array Wiring (Click Matching Colors)"}
          </span>
        </span>
        <span className={allDone ? "text-emerald-400" : "text-slate-400"}>
          {connected.length}/{LEFT_WIRES.length} {allDone ? "✓ ONLINE" : ""}
        </span>
      </div>

      <div className="relative h-28 bg-slate-900 rounded-xl border border-white/10 px-3 py-2 flex items-center justify-between">
        {/* Left Terminals */}
        <div className="z-10 flex flex-col justify-between h-full py-1">
          {LEFT_WIRES.map((w) => {
            const isConn = connected.includes(w.id);
            const isSel = selectedLeft === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleLeftClick(w.id)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-extrabold border-2 transition ${
                  isConn
                    ? "opacity-60 border-emerald-400"
                    : isSel
                    ? "scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: w.hex, color: "#0f172a" }}
              >
                {w.label} ●
              </button>
            );
          })}
        </div>

        {/* SVG Wires */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connected.map((id) => {
            const l = LEFT_WIRES.find((w) => w.id === id);
            const r = RIGHT_WIRES.find((w) => w.id === id);
            if (!l || !r) return null;
            return (
              <line
                key={id}
                x1="16"
                y1={l.y}
                x2="84"
                y2={r.y}
                stroke={l.hex}
                strokeWidth="5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Right Terminals */}
        <div className="z-10 flex flex-col justify-between h-full py-1">
          {RIGHT_WIRES.map((w) => {
            const isConn = connected.includes(w.id);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleRightClick(w.id)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-extrabold border-2 transition ${
                  isConn
                    ? "opacity-60 border-emerald-400"
                    : selectedLeft
                    ? "border-white/70 animate-pulse hover:scale-105"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: w.hex, color: "#0f172a" }}
              >
                ● {w.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// AMONG US MINI-GAME 2: Divert Power Sliders (For "comms" structure task)
// -----------------------------------------------------------------------------
function DivertPowerMiniTask({ lang, onCompleted }) {
  const [sliders, setSliders] = useState([35, 40, 30]);

  const boostSlider = (idx) => {
    spaceAudio.playTone(580 + idx * 110, 0.1, "sine", 0.11);
    setSliders((prev) => {
      const next = [...prev];
      next[idx] = 100;
      if (next.every((v) => v >= 100)) {
        onCompleted?.();
      }
      return next;
    });
  };

  const allDone = sliders.every((v) => v >= 100);
  const labels = ["COIL A", "DISH GAIN", "SHIELD BUS"];

  return (
    <div className="p-3.5 rounded-2xl bg-slate-950/90 border-2 border-cyan-400/50 mb-4">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Sliders className="w-4 h-4" />
          <span>
            {lang === "ms"
              ? "Tugasan Mini: Alihkan Kuasa ke Perisai (Klik Suis)"
              : "Mini-Task: Divert Power to Storm Shields (Click Faders to Max)"}
          </span>
        </span>
        <span className={allDone ? "text-emerald-400" : "text-slate-400"}>
          {sliders.filter((v) => v >= 100).length}/3 {allDone ? "✓ LOCKED" : ""}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-900 rounded-xl p-3 border border-white/10">
        {sliders.map((val, idx) => {
          const locked = val >= 100;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => boostSlider(idx)}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${
                locked
                  ? "bg-emerald-950/60 border-emerald-400 text-emerald-300"
                  : "bg-slate-800 hover:bg-slate-700 border-amber-400/50 text-amber-200 animate-pulse"
              }`}
            >
              <div className="text-[10px] font-mono font-bold mb-1.5">{labels[idx]}</div>
              <div className="w-6 h-14 rounded-full bg-slate-950 border border-white/15 p-0.5 flex flex-col justify-end overflow-hidden">
                <div
                  className={`w-full rounded-full transition-all duration-300 ${
                    locked ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                  style={{ height: `${val}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] font-mono font-extrabold">
                {locked ? "100% ▲" : "BOOST ▲"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// AMONG US MINI-GAME 3: Inspect Sample Tubes (For "algae" structure task)
// -----------------------------------------------------------------------------
function InspectSampleMiniTask({ lang, onCompleted }) {
  // 5 tubes: true = purified green, false = red anomaly needing click
  const [tubes, setTubes] = useState([false, true, false, true, false]);

  const purifyTube = (idx) => {
    if (tubes[idx]) return;
    spaceAudio.playTone(740, 0.1, "sine", 0.11);
    setTubes((prev) => {
      const next = [...prev];
      next[idx] = true;
      if (next.every(Boolean)) {
        onCompleted?.();
      }
      return next;
    });
  };

  const allDone = tubes.every(Boolean);

  return (
    <div className="p-3.5 rounded-2xl bg-slate-950/90 border-2 border-emerald-400/50 mb-4">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5 text-emerald-300">
          <FlaskConical className="w-4 h-4" />
          <span>
            {lang === "ms"
              ? "Tugasan Mini: Tulenkan Sampel Alga Merah"
              : "Mini-Task: Inspect & Purify Red Algae Samples"}
          </span>
        </span>
        <span className={allDone ? "text-emerald-400" : "text-rose-300"}>
          {tubes.filter(Boolean).length}/5 {allDone ? "✓ PURE" : ""}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 bg-slate-900 rounded-xl p-3 border border-white/10">
        {tubes.map((pure, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => purifyTube(idx)}
            className={`flex flex-col items-center p-2 rounded-xl border transition ${
              pure
                ? "bg-emerald-950/50 border-emerald-400/50 text-emerald-300"
                : "bg-rose-950/80 hover:bg-rose-900 border-rose-400 text-rose-200 animate-bounce"
            }`}
          >
            <div className="text-[9px] font-mono font-bold mb-1">T-0{idx + 1}</div>
            <div
              className={`w-4 h-10 rounded-b-full border ${
                pure
                  ? "bg-emerald-400/80 border-emerald-200 shadow-[0_0_10px_#34d399]"
                  : "bg-rose-500 border-rose-200 shadow-[0_0_12px_#f43f5e]"
              }`}
            />
            <div className="mt-1 text-[9px] font-mono font-extrabold">
              {pure ? "OK" : "FIX"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StructureInteractModal({
  t,
  lang = "en",
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
  const [miniTaskDone, setMiniTaskDone] = useState(false);

  // Only "solar", "comms", and "algae" have Among Us mini-tasks (3 of 6 structures)
  const hasMiniTask =
    activeStructure?.id === "solar" ||
    activeStructure?.id === "comms" ||
    activeStructure?.id === "algae";

  // Reset 30s timer & mini-task state whenever Task modal opens
  useEffect(() => {
    if (interactionMode !== "task" || !activeStructure) return;
    setTimeLeft(30);
    setMiniTaskDone(
      !(
        activeStructure.id === "solar" ||
        activeStructure.id === "comms" ||
        activeStructure.id === "algae"
      )
    );
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
      if (
        (e.code === "KeyE" || e.key === "e" || e.key === "E") &&
        !interactionMode &&
        nearbyStructure
      ) {
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

  // 4. Structure Task Choice Modal (with 30s Timer, Dr. Farah AI Helper, & Among Us Mini-Tasks on 3 structures)
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
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3.5">
              {solCopy.context}
            </p>

            {/* AMONG US INTERACTIVE MINI-TASKS (Only on "solar", "comms", and "algae") */}
            {activeStructure.id === "solar" && (
              <FixWiringMiniTask
                lang={lang}
                onCompleted={() => {
                  onPlaySfx?.("success");
                  setMiniTaskDone(true);
                }}
              />
            )}
            {activeStructure.id === "comms" && (
              <DivertPowerMiniTask
                lang={lang}
                onCompleted={() => {
                  onPlaySfx?.("success");
                  setMiniTaskDone(true);
                }}
              />
            )}
            {activeStructure.id === "algae" && (
              <InspectSampleMiniTask
                lang={lang}
                onCompleted={() => {
                  onPlaySfx?.("success");
                  setMiniTaskDone(true);
                }}
              />
            )}

            {hasMiniTask && !miniTaskDone && (
              <div className="mb-2.5 text-center text-xs font-extrabold text-amber-300 animate-pulse">
                {lang === "ms"
                  ? "⬆️ Selesaikan tugasan mini di atas untuk mengaktifkan pilihan!"
                  : "⬆️ Complete the interactive terminal mini-task above to unlock your decision!"}
              </div>
            )}

            {/* Choices A & B */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 transition-opacity ${
                hasMiniTask && !miniTaskDone ? "opacity-45 pointer-events-none" : "opacity-100"
              }`}
            >
              <button
                type="button"
                disabled={hasMiniTask && !miniTaskDone}
                onClick={() => onChooseTaskOption(activeStructure, "A", timeLeft)}
                className="text-left p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border-2 border-cyan-400/45 hover:border-cyan-300 transition shadow-md active:scale-[0.99]"
              >
                <div className="font-bold text-sm sm:text-base text-white flex items-center justify-between">
                  <span>a. {solCopy.choiceA}</span>
                  {hasMiniTask && miniTaskDone && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <DirectionalBadges
                  effects={activeStructure.choiceA.effects}
                  resourceNames={t.resources}
                />
              </button>

              <button
                type="button"
                disabled={hasMiniTask && !miniTaskDone}
                onClick={() => onChooseTaskOption(activeStructure, "B", timeLeft)}
                className="text-left p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border-2 border-amber-400/45 hover:border-amber-300 transition shadow-md active:scale-[0.99]"
              >
                <div className="font-bold text-sm sm:text-base text-white flex items-center justify-between">
                  <span>b. {solCopy.choiceB}</span>
                  {hasMiniTask && miniTaskDone && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
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
