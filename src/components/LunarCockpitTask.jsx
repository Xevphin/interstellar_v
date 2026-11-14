import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  AlertTriangle,
  BatteryWarning,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Radio,
  Rocket,
  ShieldAlert,
  Sparkles,
  ThermometerSnowflake,
} from "lucide-react";
import { DrFarahPortrait } from "./DrFarahAvatar";
import { Earth } from "./three/SpaceProps";

// ---------------------------------------------------------------------------
// 3D Lunar Horizon Viewed Through the Rocket Cockpit Windows
// ---------------------------------------------------------------------------
function CockpitWindowScene({ isSunsetAlert }) {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(160, 90, 72, 48);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Crater basin in mid-ground + ridges in distance
      const craterDist = Math.hypot(x + 8, z + 18);
      const craterRim =
        craterDist < 9
          ? -Math.cos((craterDist / 9) * Math.PI) * 1.4
          : Math.sin(x * 0.08) * Math.cos(z * 0.08) * 1.8;
      const ridge = z < -22 ? Math.pow((-z - 22) * 0.12, 1.5) * 1.6 : 0;
      pos.setY(i, craterRim + ridge - 3.2);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const sunLightRef = useRef();

  useFrame(({ clock, scene }) => {
    const t = clock.getElapsedTime();
    const targetSky = new THREE.Color(isSunsetAlert ? "#3b130e" : "#050914");
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetSky, 0.06);
    }
    if (scene.fog) {
      scene.fog.color.lerp(
        new THREE.Color(isSunsetAlert ? "#9a3412" : "#0b1329"),
        0.06
      );
    }
    if (sunLightRef.current) {
      sunLightRef.current.intensity = isSunsetAlert
        ? 2.2 + Math.sin(t * 4) * 0.3
        : 1.4;
    }
  });

  return (
    <>
      <color attach="background" args={["#050914"]} />
      <fogExp2 attach="fog" args={["#0b1329", 0.015]} />

      <ambientLight
        intensity={isSunsetAlert ? 0.45 : 0.55}
        color={isSunsetAlert ? "#fdba74" : "#cbd5e1"}
      />
      <directionalLight
        ref={sunLightRef}
        position={isSunsetAlert ? [0, 2, -45] : [18, 22, 10]}
        color={isSunsetAlert ? "#f97316" : "#f8fafc"}
        intensity={1.6}
      />

      <Stars radius={90} depth={40} count={1400} factor={3} fade />

      {/* Earth glowing in the lunar sky */}
      <Earth radius={3.2} spin={0.04} position={[-14, 9, -38]} />

      {/* Shackleton Crater terrain outside the window */}
      <mesh geometry={terrainGeo} position={[0, 0, -18]}>
        <meshStandardMaterial
          color={isSunsetAlert ? "#8c4a32" : "#64748b"}
          roughness={0.92}
          metalness={0.08}
          flatShading
        />
      </mesh>
    </>
  );
}

// ---------------------------------------------------------------------------
// Interactive Rocket Cockpit Power Control System Situational Task
// ---------------------------------------------------------------------------
export default function LunarCockpitTask({ t, onCompleteCockpitTask, onPlaySfx }) {
  // Steps: "stable" -> "alert" -> "chilly" -> "choice" -> "outcomeA" | "outcomeB"
  const [step, setStep] = useState("stable");
  const [chosenOption, setChosenOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null); // "A" | "B" | null

  const ct = t.cockpitTask;
  const isSunsetAlert = step === "alert" || step === "chilly" || step === "choice";
  const isChilly = step === "chilly" || step === "choice";
  const isOutcome = step === "outcomeA" || step === "outcomeB";

  // Resource percentages shown in the Top-Right 4 Resources panel
  const displayedStats = useMemo(() => {
    if (step === "outcomeA") {
      return { power: 85, oxygen: 90, shielding: 90, food: 100 };
    }
    if (step === "outcomeB") {
      return { power: 70, oxygen: 100, shielding: 100, food: 85 };
    }
    return { power: 100, oxygen: 100, shielding: 100, food: 100 };
  }, [step]);

  // Preview deltas when hovering Choice A or Choice B
  const previewStats = useMemo(() => {
    if (step !== "choice" || !hoveredOption) return null;
    if (hoveredOption === "A") {
      return { power: 85, oxygen: 90, shielding: 90, food: 100 };
    }
    return { power: 70, oxygen: 100, shielding: 100, food: 85 };
  }, [step, hoveredOption]);

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
    setHoveredOption(null);
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
    onCompleteCockpitTask(chosenOption || "A");
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
    <div className="fixed inset-0 z-40 bg-slate-950 overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Live 3D Lunar Crater & Sunset Window Viewport */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
          <CockpitWindowScene isSunsetAlert={isSunsetAlert} />
        </Canvas>
        {/* Sunset horizon atmospheric glow */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            isSunsetAlert
              ? "opacity-100 bg-gradient-to-t from-orange-600/35 via-amber-500/10 to-transparent"
              : "opacity-0"
          }`}
        />
      </div>

      {/* 2. SVG Spacecraft Cockpit Structural Canopy & Frame Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 z-10 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
      >
        {/* Upper & side metallic canopy ribs */}
        <path
          d="M0,0 L1600,0 L1600,110 C1250,45 950,35 650,90 L560,560 L0,620 Z"
          fill="rgba(15, 23, 42, 0.88)"
          stroke="rgba(148, 163, 184, 0.25)"
          strokeWidth="3"
        />
        {/* Curved window mullions */}
        <path
          d="M660,70 C740,240 760,420 740,600"
          fill="none"
          stroke="rgba(51, 65, 85, 0.9)"
          strokeWidth="22"
        />
        <path
          d="M1040,52 C1000,240 990,420 1010,600"
          fill="none"
          stroke="rgba(51, 65, 85, 0.9)"
          strokeWidth="26"
        />
        {/* Lower dashboard console */}
        <path
          d="M0,580 L640,545 C920,515 1280,520 1600,565 L1600,900 L0,900 Z"
          fill="rgba(15, 23, 42, 0.95)"
          stroke="rgba(100, 116, 139, 0.4)"
          strokeWidth="4"
        />
      </svg>

      {/* 3. Top Cockpit Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-5">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400/40 shadow-lg">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-display text-xs sm:text-sm font-bold tracking-wider uppercase text-cyan-200">
            {ct.badge}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="font-display text-sm sm:text-lg font-bold tracking-[0.2em] uppercase text-slate-200">
            {ct.systemTitle}
          </div>
          {isSunsetAlert && (
            <div className="mt-1 flex items-center gap-2 px-4 py-1 rounded-full bg-orange-500/20 border border-orange-400/70 text-orange-300 font-display text-base sm:text-2xl font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(249,115,22,0.5)] animate-pulse">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span>{ct.alertTitle}</span>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-xs font-mono text-slate-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>TELEMETRY ONLINE</span>
        </div>
      </div>

      {/* 4. Middle Section: Left Cockpit Tactical Monitor + Right 4 Resources Gauge Card */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-8 py-2 items-center">
        {/* Left Primary Cockpit Tactical Screen (Cols 1-5) */}
        <div className="lg:col-span-5 bg-slate-950/90 border-2 border-slate-600/80 rounded-3xl p-4 sm:p-5 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Monitor Top Telemetry Readout */}
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300/90 border-b border-white/10 pb-2 mb-3">
            <div>
              <div>OXYGEN LEVEL: {displayedStats.oxygen}%</div>
              <div>SEISMIC ACTIVITY: LOW</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/40 text-cyan-200">
                EXT TEMP: {isSunsetAlert ? "-130°C" : "-25°C"}
              </span>
            </div>
          </div>

          {/* Monitor Screen Body */}
          {isSunsetAlert ? (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-950/90 to-slate-950/95 border-2 border-rose-500/80 text-center shadow-[0_0_30px_rgba(244,63,94,0.45)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-400/60 text-rose-300 font-mono text-xs font-extrabold mb-2">
                <BatteryWarning className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>CRITICAL BATTERY: 4%</span>
              </div>

              <div className="my-2 flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-9 h-9 text-rose-400" />
                </div>
              </div>

              <div className="font-display text-base sm:text-lg font-extrabold tracking-wide text-rose-200 uppercase">
                WARNING: SUNSET APPROACHING
              </div>
              <div className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-2">
                SHACKLETON CRATER
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-400/50 text-[11px] sm:text-xs font-bold text-rose-100 uppercase tracking-wide">
                Power reserves dangerously low • Manage reserve heaters & life support immediately
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-400/40 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-extrabold uppercase mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>LUNAR BASE ALPHA • SYSTEMS STABLE</span>
              </div>

              {/* Stylized Crater & Rover Radar Graphic */}
              <div className="relative h-28 rounded-xl bg-slate-900/90 border border-cyan-500/25 flex items-center justify-center overflow-hidden mb-3">
                <div className="w-24 h-24 rounded-full border border-emerald-400/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border border-emerald-400/50 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-300">
                  SHACKLETON RIM SECTOR 01
                </div>
                <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-300">
                  GRID LOCK: OK
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-1.5 rounded bg-slate-800/80 text-emerald-300">
                  PWR: {displayedStats.power}%
                </div>
                <div className="p-1.5 rounded bg-slate-800/80 text-cyan-300">
                  O₂: {displayedStats.oxygen}%
                </div>
                <div className="p-1.5 rounded bg-slate-800/80 text-indigo-300">
                  SHD: {displayedStats.shielding}%
                </div>
              </div>
            </div>
          )}

          {/* Lower Sub-Monitors (Pie / Waveform / Bars) */}
          <div className="grid grid-cols-3 gap-2.5 mt-3">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">CELL LOAD</span>
              <div className="flex items-end gap-1 h-8 mt-1">
                {[65, 85, 45, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      isSunsetAlert ? "bg-rose-400" : "bg-cyan-400"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">THERMAL</span>
              <div className="flex items-center justify-center h-8 text-xs font-mono font-bold text-amber-300">
                <ThermometerSnowflake className="w-4 h-4 mr-1 text-sky-300" />
                {isSunsetAlert ? "-130°C" : "21°C"}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">GRID STATUS</span>
              <div
                className={`text-xs font-mono font-extrabold mt-2 ${
                  isSunsetAlert ? "text-rose-400 animate-pulse" : "text-emerald-400"
                }`}
              >
                {isSunsetAlert ? "ALERT" : "NOMINAL"}
              </div>
            </div>
          </div>
        </div>

        {/* Center Viewport Spacer (Cols 6-8) */}
        <div className="hidden lg:block lg:col-span-3" />

        {/* Right 4 Resources Panel (Cols 9-12) */}
        <div className="lg:col-span-4 lg:justify-self-end w-full max-w-sm bg-slate-900/85 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">
            4 RESOURCES
          </div>
          <div className="flex flex-col gap-3">
            {resourceRows.map((r) => {
              const currentVal = displayedStats[r.key];
              const previewVal = previewStats ? previewStats[r.key] : null;
              const shownVal = previewVal !== null ? previewVal : currentVal;
              const isDropping = previewVal !== null && previewVal < currentVal;

              return (
                <div key={r.key}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold mb-1">
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
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
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
      <div className="relative z-20 px-4 sm:px-8 pb-4 sm:pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
          {/* Speech Bubble */}
          <div className="flex-1 w-full bg-white text-slate-900 rounded-3xl px-6 py-4 sm:py-5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans font-bold text-sm sm:text-lg leading-snug text-center sm:text-left">
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

          {/* Expressive Dr. Farah Character Badge with Status Tablet */}
          <div className="relative shrink-0 flex flex-col items-center">
            {isChilly && (
              <div className="absolute -top-3 -left-3 px-2 py-0.5 rounded-full bg-sky-200 text-slate-900 text-[10px] font-extrabold shadow animate-bounce">
                ❄️ Brrr! -130°C
              </div>
            )}
            <DrFarahPortrait
              mood={isSunsetAlert ? "alert" : "happy"}
              size="lg"
            />
            <div
              className={`mt-1.5 px-3 py-1 rounded-lg border text-[10px] font-mono font-extrabold uppercase flex items-center gap-1 shadow ${
                isSunsetAlert
                  ? "bg-rose-950/90 border-rose-400 text-rose-300"
                  : "bg-emerald-950/90 border-emerald-400 text-emerald-300"
              }`}
            >
              {isSunsetAlert ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>ALERT TABLET</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ALL STABLE</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
