import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BatteryWarning,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Flame,
  Gauge,
  Power,
  Radio,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  ThermometerSnowflake,
  Wind,
  Zap,
} from "lucide-react";
import { DrFarahPortrait } from "./DrFarahAvatar";
import { spaceAudio } from "../utils/sound";

export default function LunarCockpitTask({ t, onCompleteCockpitTask, onPlaySfx }) {
  // Narrative steps: "stable" -> "alert" -> "chilly" -> "choice" -> "outcomeA" | "outcomeB"
  const [step, setStep] = useState("stable");
  const [chosenOption, setChosenOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);

  // Interactive Spaceship Terminal States (Clickable Monitors, Switches & Nodes)
  const [mainTab, setMainTab] = useState("SYSTEM"); // "SYSTEM" | "ACTIVITY" | "LOG"
  const [pieMode, setPieMode] = useState(0);
  const [ecgBoost, setEcgBoost] = useState(false);
  const [thermalView, setThermalView] = useState("EXT"); // "EXT" | "CABIN"
  const [schematicNodes, setSchematicNodes] = useState({
    core: true,
    heaters: true,
    o2: true,
    shields: true,
  });
  const [keypadSwitches, setKeypadSwitches] = useState({
    aux: true,
    heaters: false,
    o2: true,
    shield: true,
    radar: true,
    deice: false,
  });
  const [terminalLog, setTerminalLog] = useState(
    "SYS-OK // SHACKLETON LANDER TERMINAL READY — CLICK ANY SCREEN OR SWITCH"
  );

  const ct = t.cockpitTask;
  const isSunsetAlert = step === "alert" || step === "chilly" || step === "choice";
  const isChilly = step === "chilly" || step === "choice";
  const isOutcome = step === "outcomeA" || step === "outcomeB";

  const displayedStats = useMemo(() => {
    if (step === "outcomeA") {
      return { power: 85, oxygen: 90, shielding: 90, food: 100 };
    }
    if (step === "outcomeB") {
      return { power: 70, oxygen: 100, shielding: 100, food: 85 };
    }
    return { power: 100, oxygen: 100, shielding: 100, food: 100 };
  }, [step]);

  const previewStats = useMemo(() => {
    if (step !== "choice" || !hoveredOption) return null;
    if (hoveredOption === "A") {
      return { power: 85, oxygen: 90, shielding: 90, food: 100 };
    }
    return { power: 70, oxygen: 100, shielding: 100, food: 85 };
  }, [step, hoveredOption]);

  const playBeep = (freq = 620) => {
    spaceAudio.playTone(freq, 0.08, "sine", 0.1);
  };

  const handleNext = () => {
    onPlaySfx?.("click");
    if (step === "stable") {
      onPlaySfx?.("alert");
      setStep("alert");
      setTerminalLog("WARN // SUNSET APPROACHING SHACKLETON CRATER — SOLAR INPUT DROPPING!");
    } else if (step === "alert") {
      setStep("chilly");
      setTerminalLog("TEMP ALERT // EXTERIOR PLUNGING TO -130°C — RESERVE DECISION REQUIRED");
    } else if (step === "chilly") {
      setStep("choice");
      setTerminalLog("AWAITING COMMAND // SELECT POWER ALLOCATION PROTOCOL A OR B");
    }
  };

  const handleChoose = (opt) => {
    setChosenOption(opt);
    setHoveredOption(null);
    if (opt === "A") {
      onPlaySfx?.("success");
      setStep("outcomeA");
      setTerminalLog("PROTOCOL A LOCKED // HEATERS & LIFE SUPPORT BALANCED (PWR 85%)");
    } else {
      onPlaySfx?.("alert");
      setStep("outcomeB");
      setTerminalLog("PROTOCOL B LOCKED // FULL HEATERS ENGAGED (PWR 70%, FOOD 85%)");
    }
  };

  const handleExitToBase = () => {
    onPlaySfx?.("success");
    onCompleteCockpitTask(chosenOption || "A");
  };

  const toggleKeypad = (key, label, freq) => {
    playBeep(freq);
    setKeypadSwitches((prev) => {
      const nextVal = !prev[key];
      setTerminalLog(
        `CONSOLE SWITCH // [${label}] -> ${nextVal ? "ENGAGED (ONLINE)" : "STANDBY"}`
      );
      return { ...prev, [key]: nextVal };
    });
  };

  const toggleSchematicNode = (key, label, freq) => {
    playBeep(freq);
    setSchematicNodes((prev) => {
      const nextVal = !prev[key];
      setTerminalLog(
        `GRID BUS // NODE [${label}] -> ${nextVal ? "ROUTING 100%" : "BYPASSED"}`
      );
      return { ...prev, [key]: nextVal };
    });
  };

  const currentDialogue =
    step === "stable"
      ? ct.frames.stable
      : step === "alert"
      ? ct.frames.sunsetAlert
      : step === "chilly"
      ? ct.frames.chillyPrompt
      : step === "outcomeA"
      ? ct.frames.outcomeA
      : ct.frames.outcomeB;

  const resourceRows = [
    { key: "power", label: t.resources.power.toUpperCase(), barColor: "bg-amber-400", textColor: "text-amber-300" },
    { key: "oxygen", label: t.resources.oxygen.toUpperCase(), barColor: "bg-cyan-400", textColor: "text-cyan-300" },
    { key: "shielding", label: t.resources.shielding.toUpperCase(), barColor: "bg-indigo-400", textColor: "text-indigo-300" },
    { key: "food", label: t.resources.food.toUpperCase(), barColor: "bg-emerald-400", textColor: "text-emerald-300" },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 overflow-hidden select-none">
      {/* 1. Spaceship Cockpit Interior Concept Backdrop */}
      <div className="fixed inset-0 z-0">
        <img
          src="/cockpit-interior.png"
          alt="Spaceship Cockpit Interior"
          className="w-full h-full object-cover object-center"
        />
        {/* Dynamic Sunset / Red Alert Lighting Tint over the Cockpit & Window */}
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-700 ${
            isSunsetAlert
              ? "bg-gradient-to-tr from-rose-950/45 via-orange-600/25 to-amber-500/20"
              : "bg-slate-950/10"
          }`}
        />
      </div>

      {/* 2. Top Header Bar & Live Terminal Ticker */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-7 pt-3 sm:pt-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-400/50 shadow-lg backdrop-blur-md">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-display text-xs sm:text-sm font-bold tracking-wider uppercase text-cyan-200">
            🌕 {ct.badge}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="px-4 py-1 rounded-full bg-slate-950/85 border border-white/15 font-display text-xs sm:text-base font-bold tracking-[0.18em] uppercase text-slate-100 shadow-lg">
            {ct.systemTitle}
          </div>
          {isSunsetAlert && (
            <div className="mt-1 flex items-center gap-2 px-4 py-1 rounded-full bg-rose-950/90 border-2 border-orange-400 text-orange-300 font-display text-sm sm:text-xl font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(249,115,22,0.65)] animate-pulse">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span>{ct.alertTitle}</span>
            </div>
          )}
        </div>

        {/* Live Terminal Command Log Pill */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-400/40 text-[11px] font-mono text-emerald-300 shadow-lg max-w-md truncate">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
          <span className="truncate">{terminalLog}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. CLICKABLE SPACESHIP TERMINAL SCREENS & CONSOLE BUTTON HOTSPOTS   */}
      {/* =================================================================== */}

      {/* A. Top-Left Main Tactical Monitor Overlay (Interactive Tabs & Sunset Alert) */}
      <div className="fixed left-[3%] top-[10%] w-[35%] h-[44%] z-20 hidden sm:flex flex-col justify-between p-3 rounded-2xl bg-slate-950/45 hover:bg-slate-950/65 backdrop-blur-[1px] border border-cyan-400/35 hover:border-cyan-300 transition shadow-[inset_0_0_30px_rgba(6,182,212,0.2)]">
        {/* Top Screen Telemetry Header */}
        <div className="flex items-start justify-between text-[11px] font-mono text-cyan-200">
          <div className="bg-slate-950/75 px-2.5 py-1 rounded-lg border border-cyan-400/30">
            <div>OXYGEN LEVEL: {displayedStats.oxygen}%</div>
            <div>SEISMIC ACTIVITY: LOW</div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/75 px-2.5 py-1 rounded-lg border border-cyan-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GRID: {mainTab}</span>
          </div>
        </div>

        {/* Center Screen Content (Changes based on Alert State or Selected Tab) */}
        <div className="my-auto mx-auto w-full max-w-sm">
          {isSunsetAlert && mainTab === "SYSTEM" ? (
            <button
              type="button"
              onClick={() => {
                playBeep(440);
                setStep("choice");
                setTerminalLog("TERMINAL OVERRIDE // OPENING POWER RESERVE ALLOCATION");
              }}
              className="w-full p-3 rounded-2xl bg-rose-950/90 hover:bg-rose-900/95 border-2 border-rose-500 text-center shadow-[0_0_30px_rgba(244,63,94,0.6)] transition group"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono text-[10px] font-bold mb-1">
                <BatteryWarning className="w-3.5 h-3.5 text-rose-300 animate-bounce" />
                <span>CRITICAL BATTERY: 4%</span>
              </div>
              <div className="font-display text-sm md:text-base font-extrabold text-white uppercase tracking-wide">
                ⚠️ WARNING: SUNSET APPROACHING
              </div>
              <div className="text-[11px] font-bold text-orange-300 uppercase">
                SHACKLETON CRATER • -130°C
              </div>
              <div className="mt-1.5 inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider group-hover:scale-105 transition">
                Click Screen to Manage Reserves →
              </div>
            </button>
          ) : mainTab === "ACTIVITY" ? (
            <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-400/50 text-xs font-mono text-cyan-200">
              <div className="font-bold text-cyan-300 mb-1">
                📡 SHACKLETON SURFACE ROVERS: 4 ACTIVE
              </div>
              <div>• SOLAR ARRAY PEAK: {isSunsetAlert ? "12% (SHADOW)" : "98% (OPTIMAL)"}</div>
              <div>• HABITAT DOME SEAL: 100% PRESSURIZED</div>
              <div>• REGOLITH O₂ EXTRACTOR: STANDBY</div>
            </div>
          ) : mainTab === "LOG" ? (
            <div className="p-3 rounded-xl bg-slate-950/85 border border-amber-400/50 text-xs font-mono text-amber-200">
              <div className="font-bold text-amber-300 mb-1">📋 FLIGHT RECORDER LOG</div>
              <div>00:01 — TOUCHDOWN AT SHACKLETON RIM</div>
              <div>00:02 — POWER CONTROL SYSTEM ONLINE</div>
              <div>00:03 — {terminalLog}</div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-400/40 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>SHACKLETON OUTPOST CAM • LIVE FEED</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Screen Clickable Mode Buttons (Matching the 3 buttons on the monitor frame) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {["SYSTEM", "ACTIVITY", "LOG"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  playBeep(720);
                  setMainTab(tab);
                  setTerminalLog(`MAIN MONITOR // VIEW SWITCHED TO [${tab}]`);
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-extrabold uppercase border transition ${
                  mainTab === tab
                    ? "bg-cyan-400 text-slate-950 border-white shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                    : "bg-slate-900/85 hover:bg-slate-800 text-cyan-200 border-cyan-400/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-cyan-300/80 hidden md:inline">
            CLICK TABS
          </span>
        </div>
      </div>

      {/* B. 3 Clickable Sub-Monitors Below Main Screen */}
      <div className="fixed left-[3%] top-[56%] w-[36%] h-[15%] z-20 hidden sm:grid grid-cols-3 gap-2.5">
        {/* Sub-Monitor 1: Cell Load Pie/Bars */}
        <button
          type="button"
          onClick={() => {
            playBeep(520);
            setPieMode((m) => (m + 1) % 3);
            setTerminalLog("SUB-MON 01 // CYCLING BATTERY CELL DISTRIBUTION");
          }}
          className="p-2 rounded-xl bg-slate-950/75 hover:bg-slate-900/90 border border-emerald-400/45 hover:border-emerald-300 flex flex-col justify-between text-left transition group shadow-lg"
        >
          <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-emerald-300">
            <span>CELL BUS #{pieMode + 1}</span>
            <Gauge className="w-3.5 h-3.5 group-hover:rotate-45 transition" />
          </div>
          <div className="flex items-end gap-1 h-9 w-full mt-1">
            {[
              [70, 90, 55, 85],
              [95, 60, 80, 45],
              [60, 75, 95, 70],
            ][pieMode].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-cyan-300 transition-all duration-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <span className="text-[9px] font-mono text-slate-400">CLICK TO CYCLE</span>
        </button>

        {/* Sub-Monitor 2: Life Support & Crew Vitals Waveform */}
        <button
          type="button"
          onClick={() => {
            playBeep(660);
            setEcgBoost((b) => !b);
            setTerminalLog(
              `SUB-MON 02 // O₂ SCRUBBER PUMP ${!ecgBoost ? "TURBO (98%)" : "NOMINAL"}`
            );
          }}
          className="p-2 rounded-xl bg-slate-950/75 hover:bg-slate-900/90 border border-amber-400/45 hover:border-amber-300 flex flex-col justify-between text-left transition group shadow-lg"
        >
          <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-amber-300">
            <span>O₂ VITALS</span>
            <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          </div>
          <div className="my-auto w-full px-1.5 py-1 rounded bg-rose-500/20 border border-rose-400/40 text-[11px] font-mono font-extrabold text-rose-200 text-center">
            {ecgBoost ? "⚡ FLOW: BOOST" : "♥ BPM: 76 NOMINAL"}
          </div>
          <span className="text-[9px] font-mono text-slate-400">CLICK TO PULSE</span>
        </button>

        {/* Sub-Monitor 3: Thermal Curve */}
        <button
          type="button"
          onClick={() => {
            playBeep(580);
            setThermalView((v) => (v === "EXT" ? "CABIN" : "EXT"));
            setTerminalLog("SUB-MON 03 // TOGGLED THERMAL SENSOR CURVE");
          }}
          className="p-2 rounded-xl bg-slate-950/75 hover:bg-slate-900/90 border border-sky-400/45 hover:border-sky-300 flex flex-col justify-between text-left transition group shadow-lg"
        >
          <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-sky-300">
            <span>THERM: {thermalView}</span>
            <ThermometerSnowflake className="w-3.5 h-3.5" />
          </div>
          <div className="my-auto text-center font-mono text-sm font-extrabold text-white">
            {thermalView === "EXT"
              ? isSunsetAlert
                ? "-130°C"
                : "-25°C"
              : "+21.5°C"}
          </div>
          <span className="text-[9px] font-mono text-slate-400">CLICK SENSOR</span>
        </button>
      </div>

      {/* C. Center Diagnostic Screen Overlay (Above Astronaut's Right Hand) */}
      <div className="fixed left-[39.8%] top-[51%] w-[13%] h-[18%] z-20 hidden lg:flex flex-col justify-between p-2.5 rounded-xl bg-slate-950/75 hover:bg-slate-900/90 border border-orange-400/50 transition shadow-lg">
        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-orange-300">
          <span>POWER BUS</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-200">
            {isSunsetAlert ? "ALERT" : "OK"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            playBeep(780);
            if (step !== "outcomeA" && step !== "outcomeB") {
              setStep("choice");
              setTerminalLog("DIAGNOSTIC SCREEN // OPENED POWER CONTROL DECISION");
            }
          }}
          className="my-auto py-1.5 px-2 rounded-lg bg-gradient-to-r from-orange-500/30 to-amber-500/30 hover:from-orange-500/50 hover:to-amber-500/50 border border-orange-400/60 text-[10px] font-mono font-extrabold text-amber-200 text-center transition"
        >
          {isOutcome ? "✓ BUS LOCKED" : "⚡ CALIBRATE RESERVE"}
        </button>

        <div className="text-[8px] font-mono text-slate-400 text-center">
          ROVER & BASE LINK
        </div>
      </div>

      {/* D. Right Cyan Schematic Terminal Overlay (Interactive Power Grid Nodes) */}
      <div className="fixed right-[5.5%] top-[53%] w-[27%] h-[25%] z-20 hidden lg:flex flex-col justify-between p-3.5 rounded-2xl bg-slate-950/65 backdrop-blur-[1px] border border-cyan-400/45 shadow-[inset_0_0_25px_rgba(34,211,238,0.2)]">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-300 border-b border-cyan-400/25 pb-1.5">
          <span>SHIP POWER SCHEMATIC // CLICK NODES</span>
          <span className="text-emerald-300">
            {Object.values(schematicNodes).filter(Boolean).length}/4 ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-auto">
          {[
            { key: "core", label: "REACTOR CORE", icon: Zap, freq: 520 },
            { key: "heaters", label: "THERMAL LOOP", icon: Flame, freq: 580 },
            { key: "o2", label: "O₂ LIFE SUPPORT", icon: Wind, freq: 640 },
            { key: "shields", label: "DOME SHIELDS", icon: Shield, freq: 700 },
          ].map(({ key, label, icon: Icon, freq }) => {
            const active = schematicNodes[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSchematicNode(key, label, freq)}
                className={`flex items-center justify-between p-2 rounded-xl border font-mono text-[10px] font-bold transition ${
                  active
                    ? "bg-cyan-500/20 border-cyan-300 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                    : "bg-slate-900/80 border-slate-700 text-slate-400"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-cyan-300" : "text-slate-500"}`} />
                  <span className="truncate">{label}</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    active ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-rose-500"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="text-[9px] font-mono text-cyan-300/75 flex justify-between">
          <span>BUS VOLTAGE: 120.4V</span>
          <span>LOAD: {displayedStats.power}%</span>
        </div>
      </div>

      {/* E. Lower Tactile Console Push-Buttons (Clickable Hardware Keypad Strip) */}
      <div className="fixed left-[12%] bottom-[17%] z-20 hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/85 border border-slate-600/80 shadow-2xl backdrop-blur-md">
        <span className="text-[9px] font-mono font-bold text-slate-400 mr-1 uppercase">
          CONSOLE:
        </span>
        {[
          { key: "aux", label: "AUX PWR", freq: 480, color: "emerald" },
          { key: "heaters", label: "HEATERS", freq: 540, color: "amber" },
          { key: "o2", label: "O₂ FLOW", freq: 600, color: "cyan" },
          { key: "shield", label: "SHIELD", freq: 660, color: "indigo" },
          { key: "radar", label: "RADAR", freq: 720, color: "emerald" },
          { key: "deice", label: "DE-ICE", freq: 780, color: "amber" },
        ].map((btn) => {
          const on = keypadSwitches[btn.key];
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => toggleKeypad(btn.key, btn.label, btn.freq)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-[10px] font-extrabold transition active:scale-95 ${
                on
                  ? "bg-slate-800 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Power className={`w-3 h-3 ${on ? "text-emerald-400" : "text-slate-500"}`} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Top-Right 4 Resources Panel */}
      <div className="fixed right-4 sm:right-7 top-16 sm:top-20 z-20 w-64 sm:w-80 bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl">
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">
          4 RESOURCES
        </div>
        <div className="flex flex-col gap-2.5">
          {resourceRows.map((r) => {
            const currentVal = displayedStats[r.key];
            const previewVal = previewStats ? previewStats[r.key] : null;
            const shownVal = previewVal !== null ? previewVal : currentVal;
            const isDropping = previewVal !== null && previewVal < currentVal;

            return (
              <div key={r.key}>
                <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                  <span className="text-white tracking-wide">{r.label}</span>
                  <span className={isDropping ? "text-rose-400 animate-pulse" : r.textColor}>
                    {shownVal}%
                    {isDropping && (
                      <span className="ml-1 text-[11px] text-rose-300">
                        ({shownVal - currentVal}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDropping ? "bg-rose-400" : r.barColor
                    }`}
                    style={{ width: `${shownVal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Choice Overlay Modal (When step === "choice") */}
      {step === "choice" && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-[#141b3d]/95 border-2 border-indigo-400/50 p-5 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85)] animate-fade-in">
            <div className="text-center mb-4">
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300 mb-1">
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
              {/* Option A */}
              <div
                onMouseEnter={() => setHoveredOption("A")}
                onMouseLeave={() => setHoveredOption(null)}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/70 border-2 border-white/20 hover:border-amber-300 transition shadow-lg"
              >
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

              {/* Option B */}
              <div
                onMouseEnter={() => setHoveredOption("B")}
                onMouseLeave={() => setHoveredOption(null)}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/70 border-2 border-white/20 hover:border-amber-300 transition shadow-lg"
              >
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

      {/* 6. Bottom Dialogue Bar with Expressive Dr. Farah & Next / Exit Rocket Button */}
      <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-20 px-4 sm:px-8 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="pointer-events-auto flex-1 w-full bg-white text-slate-900 rounded-3xl px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_20px_50px_rgba(0,0,0,0.75)] border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans font-bold text-xs sm:text-base leading-snug text-center sm:text-left">
              {currentDialogue}
            </p>

            {step !== "choice" && (
              <div className="shrink-0">
                {isOutcome ? (
                  <button
                    type="button"
                    onClick={handleExitToBase}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-bold text-sm sm:text-base shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{ct.exitToBaseBtn} →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-display font-bold text-sm sm:text-base shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    <span>{ct.nextBtn}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Expressive Dr. Farah Character Badge */}
          <div className="pointer-events-auto relative shrink-0 hidden sm:flex flex-col items-center">
            {isChilly && (
              <div className="absolute -top-3 -left-3 px-2 py-0.5 rounded-full bg-sky-200 text-slate-900 text-[10px] font-extrabold shadow animate-bounce">
                ❄️ Brrr! -130°C
              </div>
            )}
            <DrFarahPortrait mood={isSunsetAlert ? "alert" : "happy"} size="md" />
            <div
              className={`mt-1 px-2.5 py-0.5 rounded-lg border text-[9px] font-mono font-extrabold uppercase flex items-center gap-1 shadow ${
                isSunsetAlert
                  ? "bg-rose-950/90 border-rose-400 text-rose-300"
                  : "bg-emerald-950/90 border-emerald-400 text-emerald-300"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isSunsetAlert ? "ALERT" : "STABLE"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
