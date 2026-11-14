import React, { useEffect, useRef, useState } from "react";
import DrFarahAvatar from "./DrFarahAvatar";

/**
 * Interactive 2.5D First-Person POV Spacesuit & Power Systems Cockpit Simulation
 * - Ported from lunar_outpost_power_systems_pov_simulation.html
 * - Kid-friendly labels (ages 7–12), brighter Moon exterior, 4 Resources HUD preserved
 * - Sudden Critical Situation -> Choice A (Safe) or Choice B (Overload consequence!)
 * - Choice B trips the Mini Reactor, Air & Heaters, and spikes the Power Dial to 145V,
 *   highlighting the console buttons with a simple Dr. Farah AI bubble guide to fix it
 *   and go straight to the Lunar Basecamp.
 */
export default function LunarCockpitTask({ t, onCompleteCockpitTask, onPlaySfx }) {
  const isMs = t?.langLabel === "BM";
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Flow stage: "calm" -> "choice" -> "repair" (if Choice B picked) -> "resolved"
  const [stage, setStage] = useState("calm");
  const [pickedChoice, setPickedChoice] = useState(null); // "A" | "B"
  const [hoveredChoice, setHoveredChoice] = useState(null); // "A" | "B" | null
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [toast, setToast] = useState(null);

  // React state mirrors for the interactive console buttons & slider
  const [solarOnline, setSolarOnline] = useState(true);
  const [reactorOnline, setReactorOnline] = useState(true);
  const [moxieOnline, setMoxieOnline] = useState(true);
  const [voltageSet, setVoltageSet] = useState(120);
  const [telemetry, setTelemetry] = useState({
    netKw: 48.5,
    batteryPct: 95.0,
    heaterTempC: 22,
    alertLevel: "NOMINAL",
  });

  // Mutable simulation state shared with the 60fps Canvas loop
  const simRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 720,
    time: 0,
    lastFrame: performance.now(),
    missionSeconds: 18 * 3600 + 9 * 60 + 44,
    mouseX: 0,
    mouseY: 0,
    camX: 0,
    camY: 0,
    solarOnline: true,
    reactorOnline: true,
    moxieOnline: true,
    voltageSet: 120.0,
    solarKw: 28.5,
    reactorKw: 20.0,
    loadKw: 42.8,
    batteryPct: 95.0,
    coreTempK: 760,
    eventActive: false,
    eventType: "NONE", // "NONE" | "ECLIPSE" | "FLARE"
    sunIntensity: 1.0,
    alertLevel: "NOMINAL", // "NOMINAL" | "CAUTION" | "WARNING"
    stage: "calm",
    handTargetX: 0.62,
    handTargetY: 0.72,
    handCurrentX: 0.62,
    handCurrentY: 0.72,
    handPinch: 0,
    handActionTimer: 0,
    waveAC: new Array(90).fill(0),
    particles: Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.008,
      vy: -0.003 - Math.random() * 0.007,
      size: 0.9 + Math.random() * 1.8,
      alpha: 0.18 + Math.random() * 0.45,
    })),
    hotspots: [],
  });

  // Keep stage synced into simRef
  useEffect(() => {
    simRef.current.stage = stage;
  }, [stage]);

  // --- WEB AUDIO SYNTHESIZER ---
  const ensureAudio = () => {
    if (!audioRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const humGain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.value = 54;
      osc2.type = "sine";
      osc2.frequency.value = 108;
      filter.type = "lowpass";
      filter.frequency.value = 135;
      humGain.gain.value = 0.04;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(humGain);
      humGain.connect(ctx.destination);
      osc1.start();
      osc2.start();

      audioRef.current = { ctx, humGain, enabled: true };
    }
    if (audioRef.current.ctx.state === "suspended") {
      audioRef.current.ctx.resume();
    }
    return audioRef.current;
  };

  const playClickTone = (freq = 540, duration = 0.045) => {
    onPlaySfx?.("click");
    const eng = audioRef.current;
    if (!eng || !eng.enabled) return;
    const now = eng.ctx.currentTime;
    const osc = eng.ctx.createOscillator();
    const gain = eng.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.35, now + duration);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(eng.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  };

  const playCautionChime = () => {
    onPlaySfx?.("alert");
    const eng = audioRef.current;
    if (!eng || !eng.enabled) return;
    const now = eng.ctx.currentTime;
    [660, 520].forEach((freq, idx) => {
      const osc = eng.ctx.createOscillator();
      const gain = eng.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.09, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.12);
      osc.connect(gain);
      gain.connect(eng.ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.12);
    });
  };

  const toggleSuitAudio = () => {
    if (!audioEnabled) {
      ensureAudio();
      if (audioRef.current) audioRef.current.enabled = true;
      setAudioEnabled(true);
      playClickTone(680, 0.06);
    } else {
      if (audioRef.current) {
        audioRef.current.enabled = false;
        audioRef.current.ctx.suspend();
      }
      setAudioEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current?.ctx) {
        audioRef.current.ctx.close().catch(() => {});
      }
    };
  }, []);

  const showToastMsg = (msg, isWarning = true) => {
    setToast({ msg, isWarning });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Move POV spacesuit right hand toward clicked control
  const moveHandTo = (normX, normY, pinch = 1.0) => {
    const s = simRef.current;
    s.handTargetX = normX;
    s.handTargetY = normY;
    s.handPinch = pinch;
    s.handActionTimer = 0.65;
  };

  // --- SUDDEN CRITICAL SITUATION AUTO-TRIGGER ---
  const triggerCriticalSituation = () => {
    const s = simRef.current;
    s.eventActive = true;
    s.eventType = "ECLIPSE";
    s.alertLevel = "WARNING";
    setStage("choice");
    playCautionChime();
    showToastMsg(
      isMs
        ? "AMARAN KECEMASAN: Bayang Kawah -130°C! Bateri sedang menurun!"
        : "CRITICAL ALERT: -130°C Crater Shadow! Solar power is dropping fast!",
      true
    );
  };

  useEffect(() => {
    if (stage !== "calm") return;
    const timer = setTimeout(() => {
      triggerCriticalSituation();
    }, 4500);
    return () => clearTimeout(timer);
  }, [stage]);

  // --- INTERACTIVE HARDWARE CONTROLS ---
  const handleToggleSolar = () => {
    const s = simRef.current;
    const next = !s.solarOnline;
    s.solarOnline = next;
    setSolarOnline(next);
    playClickTone(next ? 640 : 380);
    moveHandTo(0.43, 0.72, 1.0);
    showToastMsg(
      next
        ? isMs
          ? "PANEL SURIA DIHIDUPKAN!"
          : "SOLAR PANELS TURNED ON!"
        : isMs
        ? "PANEL SURIA DIMATIKAN!"
        : "SOLAR PANELS TURNED OFF!",
      !next
    );
  };

  const handleToggleReactor = () => {
    const s = simRef.current;
    const next = !s.reactorOnline;
    s.reactorOnline = next;
    setReactorOnline(next);
    playClickTone(next ? 720 : 340);
    moveHandTo(0.52, 0.72, 1.0);
    showToastMsg(
      next
        ? isMs
          ? "REAKTOR MINI DIHIDUPKAN!"
          : "MINI REACTOR TURNED ON!"
        : isMs
        ? "REAKTOR MINI DIMATIKAN!"
        : "MINI REACTOR TURNED OFF!",
      !next
    );
  };

  const handleToggleMoxie = () => {
    const s = simRef.current;
    const next = !s.moxieOnline;
    s.moxieOnline = next;
    setMoxieOnline(next);
    playClickTone(next ? 590 : 410);
    moveHandTo(0.61, 0.72, 1.0);
    showToastMsg(
      next
        ? isMs
          ? "UDARA & PEMANAS DIHIDUPKAN!"
          : "AIR & HEATERS TURNED ON!"
        : isMs
        ? "UDARA & PEMANAS DIMATIKAN!"
        : "AIR & HEATERS TURNED OFF!",
      !next
    );
  };

  const handleVoltageChange = (val) => {
    const num = parseFloat(val);
    const s = simRef.current;
    s.voltageSet = num;
    setVoltageSet(num);
    const normSlider = (num - 80) / 70;
    moveHandTo(0.68 + normSlider * 0.08, 0.74, 0.9);
    if (Math.random() < 0.3) playClickTone(450 + normSlider * 300, 0.02);
  };

  //Keep latest handlers in a ref so canvas hotspots always invoke fresh state
  const actionsRef = useRef({
    toggleSolar: handleToggleSolar,
    toggleReactor: handleToggleReactor,
    toggleMoxie: handleToggleMoxie,
  });
  actionsRef.current = {
    toggleSolar: handleToggleSolar,
    toggleReactor: handleToggleReactor,
    toggleMoxie: handleToggleMoxie,
  };

  // --- CHOICE A vs CHOICE B HANDLERS ---
  const handlePickChoiceA = () => {
    // Choice A: Safe balanced choice -> straight to resolved!
    playClickTone(760, 0.08);
    setPickedChoice("A");
    setHoveredChoice(null);
    const s = simRef.current;
    s.eventActive = false;
    s.eventType = "NONE";
    s.solarOnline = true;
    s.reactorOnline = true;
    s.moxieOnline = true;
    s.voltageSet = 115;
    s.batteryPct = 85;
    setSolarOnline(true);
    setReactorOnline(true);
    setMoxieOnline(true);
    setVoltageSet(115);
    setStage("resolved");
    showToastMsg(
      isMs
        ? "pilihan bijak! Kuasa dan pemanas seimbang dengan selamat."
        : "Smart choice! Heaters and life support are safely balanced.",
      false
    );
  };

  const handlePickChoiceB = () => {
    // Choice B: Blasting full heat causes a critical overload!
    // Trips Mini Reactor OFF, Air & Heaters OFF, and spikes Power Dial to 145V!
    playCautionChime();
    setPickedChoice("B");
    setHoveredChoice(null);
    const s = simRef.current;
    s.eventActive = true;
    s.eventType = "FLARE";
    s.solarOnline = true;
    s.reactorOnline = false;
    s.moxieOnline = false;
    s.voltageSet = 145;
    s.batteryPct = 70;
    setSolarOnline(true);
    setReactorOnline(false);
    setMoxieOnline(false);
    setVoltageSet(145);
    setStage("repair");
    showToastMsg(
      isMs
        ? "OH TIDAK! Pemanas penuh menyebabkan Litar Pintas! Guna butang di bawah untuk baiki!"
        : "UH OH! Full heat overloaded the circuit! Use the glowing buttons below to fix it!",
      true
    );
  };

  // Automatically check if the player fixed all 3 issues during "repair" stage
  const repairReactorFixed = reactorOnline === true;
  const repairMoxieFixed = moxieOnline === true;
  const repairVoltageFixed = voltageSet <= 120;

  useEffect(() => {
    if (stage === "repair" && repairReactorFixed && repairMoxieFixed && repairVoltageFixed) {
      const s = simRef.current;
      s.eventActive = false;
      s.eventType = "NONE";
      s.alertLevel = "NOMINAL";
      playClickTone(880, 0.1);
      setStage("resolved");
      showToastMsg(
        isMs
          ? "HEBAT! Semua sistem telah dibaiki! Anda sedia ke Kem Bulan!"
          : "AWESOME JOB! You fixed the power overload! Ready for Lunar Basecamp!",
        false
      );
    }
  }, [stage, repairReactorFixed, repairMoxieFixed, repairVoltageFixed, isMs]);

  // --- 4 RESOURCES DISPLAY LOGIC (Preserved from previous cockpit screen) ---
  const getDisplayedResources = () => {
    const activeKey = pickedChoice || hoveredChoice;
    if (activeKey === "A") {
      return [
        { key: "power", label: isMs ? "KUASA" : "POWER", val: 85, delta: -15, barColor: "bg-amber-400", textColor: "text-amber-300" },
        { key: "oxygen", label: isMs ? "OKSIGEN" : "OXYGEN", val: 90, delta: -10, barColor: "bg-cyan-400", textColor: "text-cyan-300" },
        { key: "shield", label: isMs ? "PERISAI" : "SHIELD", val: 90, delta: -10, barColor: "bg-purple-400", textColor: "text-purple-300" },
        { key: "food", label: isMs ? "MAKANAN" : "FOOD", val: 100, delta: 0, barColor: "bg-emerald-400", textColor: "text-emerald-300" },
      ];
    }
    if (activeKey === "B") {
      return [
        { key: "power", label: isMs ? "KUASA" : "POWER", val: 70, delta: -30, barColor: "bg-amber-400", textColor: "text-amber-300" },
        { key: "oxygen", label: isMs ? "OKSIGEN" : "OXYGEN", val: 100, delta: 0, barColor: "bg-cyan-400", textColor: "text-cyan-300" },
        { key: "shield", label: isMs ? "PERISAI" : "SHIELD", val: 100, delta: 0, barColor: "bg-purple-400", textColor: "text-purple-300" },
        { key: "food", label: isMs ? "MAKANAN" : "FOOD", val: 85, delta: -15, barColor: "bg-emerald-400", textColor: "text-emerald-300" },
      ];
    }
    return [
      { key: "power", label: isMs ? "KUASA" : "POWER", val: 100, delta: 0, barColor: "bg-amber-400", textColor: "text-amber-300" },
      { key: "oxygen", label: isMs ? "OKSIGEN" : "OXYGEN", val: 100, delta: 0, barColor: "bg-cyan-400", textColor: "text-cyan-300" },
      { key: "shield", label: isMs ? "PERISAI" : "SHIELD", val: 100, delta: 0, barColor: "bg-purple-400", textColor: "text-purple-300" },
      { key: "food", label: isMs ? "MAKANAN" : "FOOD", val: 100, delta: 0, barColor: "bg-emerald-400", textColor: "text-emerald-300" },
    ];
  };

  const resources = getDisplayedResources();

  // --- HTML5 CANVAS 2.5D PARALLAX RENDERING LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = simRef.current;

    const handleResize = () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = state.width * dpr;
      canvas.height = state.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e) => {
      state.mouseX = (e.clientX / state.width) * 2 - 1;
      state.mouseY = (e.clientY / state.height) * 2 - 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        state.mouseX = (e.touches[0].clientX / state.width) * 2 - 1;
        state.mouseY = (e.touches[0].clientY / state.height) * 2 - 1;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let rafId;
    let hudSyncTimer = 0;

    const drawAnimatedConduit = (x1, y1, x2, y2, color, dashOffset) => {
      ctx.save();
      ctx.strokeStyle = "#090d16";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 20]);
      ctx.lineDashOffset = -dashOffset;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    const drawExternalKilopowerUnit = (x, y) => {
      ctx.save();
      ctx.fillStyle = "#475569";
      ctx.fillRect(x - 6, y - 22, 12, 36);

      const heatRatio = Math.max(0, Math.min(1, (state.coreTempK - 320) / 600));
      ctx.fillStyle = state.reactorOnline
        ? `rgba(251, 146, 60, ${0.45 + heatRatio * 0.55})`
        : "#334155";
      ctx.beginPath();
      ctx.arc(x, y - 10, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = state.reactorOnline ? "#cbd5e1" : "#64748b";
      ctx.beginPath();
      ctx.moveTo(x - 38, y - 34);
      ctx.lineTo(x + 38, y - 34);
      ctx.lineTo(x + 12, y - 20);
      ctx.lineTo(x - 12, y - 20);
      ctx.closePath();
      ctx.fill();

      if (state.reactorOnline) {
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.45 + heatRatio * 0.5})`;
        ctx.lineWidth = 1.5;
        for (let i = -28; i <= 28; i += 14) {
          ctx.beginPath();
          ctx.moveTo(x + i, y - 33);
          ctx.lineTo(x + i * 0.35, y - 21);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const drawExternalSolarTower = (x, y, scale) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(-3, -48, 6, 62);

      const wingColor = state.solarOnline
        ? state.eventType === "FLARE"
          ? "#38bdf8"
          : "#2563eb"
        : "#334155";
      const borderColor = state.solarOnline ? "#7dd3fc" : "#64748b";

      [-1, 1].forEach((dir) => {
        ctx.fillStyle = wingColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.rect(dir * 6, -46, dir * 34, 24);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(186, 230, 253, 0.35)";
        ctx.beginPath();
        ctx.moveTo(dir * 6, -34);
        ctx.lineTo(dir * 40, -34);
        ctx.stroke();
      });

      ctx.restore();
    };

    const drawLunarExterior = (w, h, px, py) => {
      ctx.save();
      const winTop = h * 0.08 + py;
      const winBottom = h * 0.54 + py;
      const winH = winBottom - winTop;

      // Starry Lunar Sky with brighter blue-silver horizon glow
      const skyGrad = ctx.createLinearGradient(0, winTop, 0, winBottom);
      if (state.eventType === "FLARE") {
        skyGrad.addColorStop(0, "#0f172a");
        skyGrad.addColorStop(1, "#3b281d");
      } else {
        skyGrad.addColorStop(0, "#060b18");
        skyGrad.addColorStop(1, "#1e293b");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.65);

      // Blue Earth hanging in the lunar sky (kid-friendly landmark!)
      const earthX = w * 0.25 + px * 0.45;
      const earthY = winTop + winH * 0.22;
      const earthGrad = ctx.createRadialGradient(earthX - 5, earthY - 5, 3, earthX, earthY, 22);
      earthGrad.addColorStop(0, "#60a5fa");
      earthGrad.addColorStop(0.55, "#2563eb");
      earthGrad.addColorStop(1, "#1e3a8a");
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(earthX, earthY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(147, 197, 253, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Low-angle Shackleton Rim Sun
      const sunX = w * 0.78 + px * 0.6;
      const sunY = winTop + winH * 0.24;
      const sunRadius = state.eventType === "FLARE" ? 38 : 26;

      const corona = ctx.createRadialGradient(
        sunX,
        sunY,
        2,
        sunX,
        sunY,
        sunRadius * (state.eventType === "FLARE" ? 7 : 5.2)
      );
      corona.addColorStop(0, "rgba(255, 253, 245, 1)");
      corona.addColorStop(
        0.25,
        state.eventType === "FLARE"
          ? "rgba(255, 190, 100, 0.8)"
          : "rgba(224, 242, 254, 0.6)"
      );
      corona.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 7, 0, Math.PI * 2);
      ctx.fill();

      // BRIGHTER Shackleton Crater Rim Mountains (boosted silver-grey albedo!)
      const litShade = Math.round(135 * state.sunIntensity + 55);
      const darkShade = Math.round(52 * state.sunIntensity + 26);

      ctx.beginPath();
      ctx.moveTo(-80 + px, winBottom);
      ctx.lineTo(-80 + px, winTop + winH * 0.48);
      ctx.lineTo(w * 0.16 + px, winTop + winH * 0.34);
      ctx.lineTo(w * 0.33 + px, winTop + winH * 0.44);
      ctx.lineTo(w * 0.52 + px, winTop + winH * 0.29);
      ctx.lineTo(w * 0.71 + px, winTop + winH * 0.41);
      ctx.lineTo(w * 0.89 + px, winTop + winH * 0.31);
      ctx.lineTo(w + 80 + px, winTop + winH * 0.43);
      ctx.lineTo(w + 80 + px, winBottom);
      ctx.closePath();

      const mtnGrad = ctx.createLinearGradient(0, winTop + winH * 0.28, 0, winBottom);
      mtnGrad.addColorStop(
        0,
        `rgb(${Math.min(245, litShade + 30)}, ${Math.min(248, litShade + 34)}, ${Math.min(255, litShade + 42)})`
      );
      mtnGrad.addColorStop(1, `rgb(${darkShade + 18}, ${darkShade + 22}, ${darkShade + 30})`);
      ctx.fillStyle = mtnGrad;
      ctx.fill();

      // BRIGHTER Lunar Regolith Foreground Plain
      const regTop = winTop + winH * 0.52;
      const regGrad = ctx.createLinearGradient(0, regTop, 0, winBottom);
      regGrad.addColorStop(
        0,
        `rgb(${Math.min(240, litShade + 20)}, ${Math.min(244, litShade + 24)}, ${Math.min(250, litShade + 32)})`
      );
      regGrad.addColorStop(1, `rgb(${darkShade + 28}, ${darkShade + 34}, ${darkShade + 44})`);
      ctx.fillStyle = regGrad;
      ctx.fillRect(-80 + px, regTop, w + 160, winBottom - regTop + 40);

      // Craters & Bright Silver Rims on Regolith
      const craters = [
        { x: 0.22, y: 0.72, rx: 48, ry: 11 },
        { x: 0.44, y: 0.82, rx: 72, ry: 15 },
        { x: 0.68, y: 0.68, rx: 36, ry: 8 },
        { x: 0.83, y: 0.85, rx: 60, ry: 13 },
      ];
      for (const c of craters) {
        const cx = w * c.x + px * 1.25;
        const cy = winTop + winH * c.y;
        ctx.fillStyle = `rgba(30, 41, 59, ${0.45 * state.sunIntensity + 0.2})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.rx, c.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(241, 245, 249, ${0.65 * state.sunIntensity + 0.2})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.rx, c.ry, 0, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
      }

      // External Mini Reactor & Solar Towers
      const kpX = w * 0.26 + px * 1.35;
      const kpY = winTop + winH * 0.62;
      drawExternalKilopowerUnit(kpX, kpY);
      drawExternalSolarTower(w * 0.63 + px * 1.3, winTop + winH * 0.6, 0.85);
      drawExternalSolarTower(w * 0.76 + px * 1.4, winTop + winH * 0.66, 1.05);

      ctx.restore();
    };

    const drawOutpostBulkhead = (w, h, px, py) => {
      ctx.save();
      const frameColor = "#111827";
      const trimColor = "#1e293b";

      ctx.fillStyle = frameColor;
      ctx.fillRect(-60, -40, w + 120, h * 0.11 + py + 40);

      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.lineTo(w * 0.14 + px, 0);
      ctx.lineTo(w * 0.11 + px, h * 0.56 + py);
      ctx.lineTo(-60, h * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w + 60, 0);
      ctx.lineTo(w * 0.86 + px, 0);
      ctx.lineTo(w * 0.89 + px, h * 0.56 + py);
      ctx.lineTo(w + 60, h * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = trimColor;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(w * 0.14 + px, h * 0.08 + py);
      ctx.lineTo(w * 0.11 + px, h * 0.55 + py);
      ctx.moveTo(w * 0.86 + px, h * 0.08 + py);
      ctx.lineTo(w * 0.89 + px, h * 0.55 + py);
      ctx.stroke();

      ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.125 + px, h * 0.1 + py, w * 0.75, h * 0.44);

      const pulseSpeed = state.solarOnline || state.reactorOnline ? state.voltageSet / 40 : 0.2;
      const flowOffset = (state.time * 45 * pulseSpeed) % 36;
      const conduitColor =
        state.alertLevel === "WARNING"
          ? "#ef4444"
          : state.reactorOnline
          ? "#f59e0b"
          : "#38bdf8";

      drawAnimatedConduit(
        w * 0.06 + px,
        h * 0.14 + py,
        w * 0.04 + px,
        h * 0.54 + py,
        conduitColor,
        flowOffset
      );
      drawAnimatedConduit(
        w * 0.94 + px,
        h * 0.14 + py,
        w * 0.96 + px,
        h * 0.54 + py,
        "#38bdf8",
        flowOffset
      );

      ctx.restore();
    };

    const drawTelemetryScreen = (x, y, w, h, title, accent, contentFn) => {
      ctx.save();
      ctx.fillStyle = "#060a12";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(30, 41, 59, 0.65)";
      ctx.fillRect(x + 2, y + 2, w - 4, 18);

      ctx.fillStyle = accent;
      ctx.font = '700 10px "Rajdhani", sans-serif';
      ctx.fillText(title, x + 8, y + 14);

      if (Math.sin(state.time * 6) > 0) {
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x + w - 10, y + 11, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      contentFn();
      ctx.restore();
    };

    const drawSchematicLine = (a, b, active, color) => {
      ctx.save();
      ctx.strokeStyle = active ? color : "#334155";
      ctx.lineWidth = active ? 2.5 : 1.5;
      if (active) {
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -(state.time * 28) % 12;
      }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    };

    const drawPhysicalConsoleHardware = (w, h, px, deckY) => {
      const switches = [
        {
          label: isMs ? "SURIA" : "SOLAR",
          x: w * 0.43 + px,
          active: state.solarOnline,
          col: "#38bdf8",
          needsFix: false,
          fn: () => actionsRef.current.toggleSolar(),
        },
        {
          label: isMs ? "REAKTOR" : "REACTOR",
          x: w * 0.52 + px,
          active: state.reactorOnline,
          col: "#f59e0b",
          needsFix: state.stage === "repair" && !state.reactorOnline,
          fn: () => actionsRef.current.toggleReactor(),
        },
        {
          label: isMs ? "UDARA" : "AIR/HEAT",
          x: w * 0.61 + px,
          active: state.moxieOnline,
          col: "#34d399",
          needsFix: state.stage === "repair" && !state.moxieOnline,
          fn: () => actionsRef.current.toggleMoxie(),
        },
      ];

      switches.forEach((sw) => {
        const bw = 58;
        const bh = 38;

        // Highlight ring on canvas switch when repair is needed!
        if (sw.needsFix) {
          ctx.save();
          ctx.strokeStyle = "#fde047";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#fde047";
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(sw.x - bw / 2 - 4, deckY - 4, bw + 8, bh + 8, 9);
          ctx.stroke();
          ctx.restore();
        }

        ctx.fillStyle = "#090d16";
        ctx.strokeStyle = sw.active ? sw.col : sw.needsFix ? "#fde047" : "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sw.x - bw / 2, deckY, bw, bh, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = sw.active ? sw.col : "#1e293b";
        ctx.globalAlpha = sw.active ? 0.4 : 0.75;
        ctx.fillRect(sw.x - bw / 2 + 5, deckY + (sw.active ? 4 : 16), bw - 10, 18);
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = "#e2e8f0";
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText(sw.label, sw.x, deckY + bh + 12);

        state.hotspots.push({
          x: sw.x - bw / 2,
          y: deckY,
          w: bw,
          h: bh + 14,
          action: sw.fn,
        });
      });
      ctx.textAlign = "left";

      // Physical Rotary Voltage Regulator Dial
      const dialX = w * 0.72 + px;
      const dialY = deckY + 20;
      const dialR = 22;

      const dialNeedsFix = state.stage === "repair" && state.voltageSet > 120;
      if (dialNeedsFix) {
        ctx.save();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(dialX, dialY, dialR + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = dialNeedsFix ? "#fde047" : "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const normV = (state.voltageSet - 80) / 70;
      const angle = -Math.PI * 0.75 + normV * (Math.PI * 1.5);
      ctx.strokeStyle = state.voltageSet > 125 ? "#ef4444" : "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dialX, dialY);
      ctx.lineTo(
        dialX + Math.cos(angle) * (dialR - 3),
        dialY + Math.sin(angle) * (dialR - 3)
      );
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(isMs ? "DAIL-V" : "V-DIAL", dialX, dialY + dialR + 13);
      ctx.textAlign = "left";
    };

    const drawPowerConsole = (w, h, px, py) => {
      ctx.save();
      const topY = h * 0.52 + py;
      const botY = h + 40;
      const topLeftX = w * 0.09 + px;
      const topRightX = w * 0.91 + px;

      const deskGrad = ctx.createLinearGradient(0, topY, 0, h);
      deskGrad.addColorStop(0, "#1e293b");
      deskGrad.addColorStop(0.18, "#0f172a");
      deskGrad.addColorStop(1, "#060911");

      ctx.fillStyle = deskGrad;
      ctx.beginPath();
      ctx.moveTo(topLeftX, topY);
      ctx.lineTo(topRightX, topY);
      ctx.lineTo(w + 80, botY);
      ctx.lineTo(-80, botY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = state.alertLevel === "WARNING" ? "#ef4444" : "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(topLeftX, topY);
      ctx.lineTo(topRightX, topY);
      ctx.stroke();

      // SCREEN 1 (LEFT): KID-FRIENDLY POWER WAVE
      const s1X = w * 0.16 + px;
      const s1Y = topY + h * 0.035;
      const s1W = w * 0.23;
      const s1H = h * 0.19;
      drawTelemetryScreen(
        s1X,
        s1Y,
        s1W,
        s1H,
        isMs ? "GELOMBANG KUASA // TENAGA" : "POWER WAVE // ENERGY PULSE",
        "#38bdf8",
        () => {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
          ctx.lineWidth = 1;
          for (let gx = 1; gx < 5; gx++) {
            ctx.beginPath();
            ctx.moveTo(s1X + (s1W / 5) * gx, s1Y + 22);
            ctx.lineTo(s1X + (s1W / 5) * gx, s1Y + s1H - 8);
            ctx.stroke();
          }

          ctx.strokeStyle = state.alertLevel === "WARNING" ? "#f87171" : "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          const midY = s1Y + s1H * 0.56;
          for (let i = 0; i < state.waveAC.length; i++) {
            const wx = s1X + 8 + (i / (state.waveAC.length - 1)) * (s1W - 16);
            const wy = midY - state.waveAC[i] * (s1H * 0.28);
            if (i === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          ctx.fillStyle = "#94a3b8";
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillText(`SOLAR: ${state.solarKw.toFixed(1)}kW`, s1X + 10, s1Y + s1H - 10);
          ctx.fillStyle = "#fbbf24";
          ctx.fillText(`REACTOR: ${state.reactorKw.toFixed(1)}kW`, s1X + s1W * 0.5, s1Y + s1H - 10);
        }
      );

      // SCREEN 2 (CENTER): KID-FRIENDLY POWER FLOW MAP
      const s2X = w * 0.41 + px;
      const s2Y = topY + h * 0.035;
      const s2W = w * 0.24;
      const s2H = h * 0.19;
      drawTelemetryScreen(
        s2X,
        s2Y,
        s2W,
        s2H,
        isMs ? "PETA ALIRAN KUASA" : "POWER FLOW MAP",
        "#fbbf24",
        () => {
          const cx = s2X + s2W * 0.5;
          const cy = s2Y + s2H * 0.56;

          const solarNode = {
            x: s2X + s2W * 0.2,
            y: s2Y + s2H * 0.36,
            active: state.solarOnline,
            col: "#38bdf8",
            lbl: "SOLAR",
          };
          const reacNode = {
            x: s2X + s2W * 0.2,
            y: s2Y + s2H * 0.76,
            active: state.reactorOnline,
            col: "#f59e0b",
            lbl: "REACT",
          };
          const hubNode = {
            x: cx,
            y: cy,
            active: state.solarOnline || state.reactorOnline,
            col: state.voltageSet > 125 ? "#ef4444" : "#e2e8f0",
            lbl: `${Math.round(state.voltageSet)}V`,
          };
          const loadNode = {
            x: s2X + s2W * 0.82,
            y: cy,
            active: state.moxieOnline,
            col: "#34d399",
            lbl: "AIR",
          };

          drawSchematicLine(solarNode, hubNode, solarNode.active, "#38bdf8");
          drawSchematicLine(reacNode, hubNode, reacNode.active, "#f59e0b");
          drawSchematicLine(hubNode, loadNode, loadNode.active && hubNode.active, "#34d399");

          [solarNode, reacNode, hubNode, loadNode].forEach((n) => {
            ctx.fillStyle = n.active ? "#0f172a" : "#090d16";
            ctx.strokeStyle = n.active ? n.col : "#475569";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = n.active ? "#f8fafc" : "#64748b";
            ctx.font = '700 8px "JetBrains Mono", monospace';
            ctx.textAlign = "center";
            ctx.fillText(n.lbl, n.x, n.y + 3);
          });
          ctx.textAlign = "left";
        }
      );

      // SCREEN 3 (RIGHT): KID-FRIENDLY BATTERY & HEATERS
      const s3X = w * 0.67 + px;
      const s3Y = topY + h * 0.035;
      const s3W = w * 0.18;
      const s3H = h * 0.19;
      drawTelemetryScreen(
        s3X,
        s3Y,
        s3W,
        s3H,
        isMs ? "BATERI & HABA" : "BATTERY & HEAT",
        "#34d399",
        () => {
          ctx.fillStyle = "#94a3b8";
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillText(`BATTERY: ${state.batteryPct.toFixed(0)}%`, s3X + 10, s3Y + 38);

          ctx.fillStyle = "#090d16";
          ctx.fillRect(s3X + 10, s3Y + 44, s3W - 20, 12);
          ctx.fillStyle = state.batteryPct > 25 ? "#34d399" : "#ef4444";
          ctx.fillRect(s3X + 10, s3Y + 44, (s3W - 20) * (state.batteryPct / 100), 12);

          const tempRatio = Math.min(1, state.coreTempK / 1100);
          const heaterC = Math.round((state.coreTempK - 273) * 0.045);
          ctx.fillStyle = "#94a3b8";
          ctx.fillText(`HEATERS: ${heaterC}°C`, s3X + 10, s3Y + 76);

          ctx.fillStyle = "#090d16";
          ctx.fillRect(s3X + 10, s3Y + 82, s3W - 20, 12);
          ctx.fillStyle = state.voltageSet > 125 ? "#ef4444" : "#f59e0b";
          ctx.fillRect(s3X + 10, s3Y + 82, (s3W - 20) * tempRatio, 12);
        }
      );

      const deckY = topY + h * 0.255;
      drawPhysicalConsoleHardware(w, h, px, deckY);

      ctx.restore();
    };

    const drawLowGravityDust = (w, h, px, py) => {
      ctx.save();
      for (const p of state.particles) {
        const sx = p.x * w + px * p.z;
        const sy = p.y * h + py * p.z;
        const isNearScreen = sy > h * 0.45 && sy < h * 0.85;
        ctx.fillStyle = isNearScreen
          ? `rgba(125, 211, 252, ${p.alpha})`
          : `rgba(226, 232, 240, ${p.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawGlovedHand = (x, y, rotation, pinchAmount, isLeft) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      if (isLeft) ctx.scale(-1, 1);

      const glow = ctx.createRadialGradient(-10, -10, 4, 0, 0, 52);
      glow.addColorStop(0, "rgba(56, 189, 248, 0.28)");
      glow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#cbd5e1";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-18, -14, 38, 30, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#334155";
      ctx.fillRect(-16, -6, 6, 20);

      const fingerOffsets = [-11, -3, 5, 12];
      fingerOffsets.forEach((fy, idx) => {
        const isIndex = idx === 0;
        const curl = isIndex ? 1 - pinchAmount * 0.35 : 1 - pinchAmount * 0.75;
        const fLen = (isIndex ? 28 : 24) * (0.65 + 0.35 * curl);

        ctx.fillStyle = "#e2e8f0";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-16 - fLen, fy - 3, fLen, 6.5, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.roundRect(-16 - fLen, fy - 2.5, 6, 5.5, 2);
        ctx.fill();
      });

      ctx.fillStyle = "#cbd5e1";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-14, -22 + pinchAmount * 4, 18, 7, 3.5);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const drawFirstPersonSuitArms = (w, h, px, py) => {
      ctx.save();
      const leftShoulderX = w * 0.04 + px;
      const leftShoulderY = h * 1.05 + py;
      const leftWristX = w * 0.25 + px + Math.sin(state.time * 1.3) * 4;
      const leftWristY = h * 0.77 + py + Math.cos(state.time * 1.5) * 3;

      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = Math.max(44, w * 0.055);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(leftShoulderX, leftShoulderY);
      ctx.quadraticCurveTo(w * 0.13 + px, h * 0.88 + py, leftWristX, leftWristY);
      ctx.stroke();

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = Math.max(16, w * 0.02);
      ctx.beginPath();
      ctx.moveTo(leftShoulderX + 10, leftShoulderY);
      ctx.quadraticCurveTo(w * 0.14 + px, h * 0.89 + py, leftWristX + 6, leftWristY + 6);
      ctx.stroke();

      ctx.fillStyle = "#1e3a8a";
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(leftWristX, leftWristY, 26, 16, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawGlovedHand(leftWristX + 26, leftWristY - 14, -0.45, 0.2, true);

      const rightShoulderX = w * 0.94 + px;
      const rightShoulderY = h * 1.08 + py;
      const handX = w * state.handCurrentX + px;
      const handY = h * state.handCurrentY + py;

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = Math.max(48, w * 0.06);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(rightShoulderX, rightShoulderY);
      ctx.quadraticCurveTo(w * 0.82 + px, h * 0.88 + py, handX + 34, handY + 28);
      ctx.stroke();

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rightShoulderX - 22, rightShoulderY);
      ctx.quadraticCurveTo(w * 0.79 + px, h * 0.86 + py, handX + 14, handY + 20);
      ctx.stroke();

      ctx.fillStyle = "#7f1d1d";
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(handX + 30, handY + 24, 28, 17, 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawGlovedHand(handX, handY, -0.65, state.handPinch, false);
      ctx.restore();
    };

    const animate = (now) => {
      const dt = Math.min(0.05, (now - state.lastFrame) / 1000);
      state.lastFrame = now;
      state.time += dt;
      state.missionSeconds += dt;

      state.camX += (state.mouseX - state.camX) * Math.min(1, dt * 4.5);
      state.camY += (state.mouseY - state.camY) * Math.min(1, dt * 4.5);

      if (state.eventActive) {
        if (state.eventType === "FLARE") {
          state.sunIntensity += (1.55 - state.sunIntensity) * dt * 2.5;
        } else {
          // Even during crater shadow, keep the moon surface clearly visible!
          state.sunIntensity += (0.55 - state.sunIntensity) * dt * 2.5;
        }
      } else {
        state.sunIntensity += (1.0 - state.sunIntensity) * dt * 2.0;
      }

      const voltageFactor = state.voltageSet / 120.0;
      const targetSolar = state.solarOnline
        ? 28.5 * state.sunIntensity * (0.85 + 0.15 * voltageFactor)
        : 0.0;
      const targetReactor = state.reactorOnline ? 20.0 * voltageFactor : 0.0;

      state.solarKw += (targetSolar - state.solarKw) * Math.min(1, dt * 3.0);
      state.reactorKw += (targetReactor - state.reactorKw) * Math.min(1, dt * 2.2);

      const baseHabitatLoad = 26.4;
      const moxieLoad = state.moxieOnline ? 16.4 : 0.0;
      const targetLoad = (baseHabitatLoad + moxieLoad) * (0.9 + 0.1 * voltageFactor);
      state.loadKw += (targetLoad - state.loadKw) * Math.min(1, dt * 3.5);

      const totalGen = state.solarKw + state.reactorKw;
      const targetTemp = state.reactorOnline
        ? 720 + state.reactorKw * 3.4 + (state.voltageSet - 120) * 1.4
        : 315;
      state.coreTempK += (targetTemp - state.coreTempK) * Math.min(1, dt * 1.5);

      const isOverloaded =
        state.stage === "repair" ||
        state.voltageSet > 125 ||
        !state.reactorOnline ||
        !state.moxieOnline;

      if (isOverloaded || state.stage === "choice") {
        state.alertLevel = "WARNING";
      } else if (state.eventActive) {
        state.alertLevel = "CAUTION";
      } else {
        state.alertLevel = "NOMINAL";
      }

      const noise = (Math.random() - 0.5) * 0.06;
      const freq = state.alertLevel === "WARNING" ? 14 : 9;
      const amp =
        (totalGen > 1 ? 0.65 : 0.04) * (state.alertLevel === "WARNING" ? 1.35 : 1.0);
      state.waveAC.push(Math.sin(state.time * freq) * amp + noise);
      state.waveAC.shift();

      for (const p of state.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < 0.05) {
          p.y = 0.95;
          p.x = Math.random();
        }
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
      }

      if (state.handActionTimer > 0) {
        state.handActionTimer -= dt;
      } else {
        state.handTargetX = 0.61 + Math.sin(state.time * 1.1) * 0.012;
        state.handTargetY = 0.74 + Math.cos(state.time * 1.6) * 0.01;
        state.handPinch += (0.15 - state.handPinch) * dt * 3;
      }
      state.handCurrentX += (state.handTargetX - state.handCurrentX) * Math.min(1, dt * 6.5);
      state.handCurrentY += (state.handTargetY - state.handCurrentY) * Math.min(1, dt * 6.5);

      // Render 2.5D scene
      const w = state.width;
      const h = state.height;
      state.hotspots = [];
      ctx.clearRect(0, 0, w, h);

      const pxSky = -state.camX * 14;
      const pySky = -state.camY * 10;
      const pxMid = -state.camX * 28;
      const pyMid = -state.camY * 18;
      const pxConsole = -state.camX * 45;
      const pyConsole = -state.camY * 26;
      const pxHands = -state.camX * 68;
      const pyHands = -state.camY * 38;

      drawLunarExterior(w, h, pxSky, pySky);
      drawOutpostBulkhead(w, h, pxMid, pyMid);
      drawPowerConsole(w, h, pxConsole, pyConsole);
      drawLowGravityDust(w, h, pxMid, pyMid);
      drawFirstPersonSuitArms(w, h, pxHands, pyHands);

      // Sync React HUD readouts every ~150ms
      hudSyncTimer += dt;
      if (hudSyncTimer > 0.15) {
        hudSyncTimer = 0;
        setTelemetry({
          netKw: totalGen,
          batteryPct: state.batteryPct,
          heaterTempC: Math.round((state.coreTempK - 273) * 0.045),
          alertLevel: state.alertLevel,
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMs]);

  // Direct Canvas Click Handler (press switches on the 3D desk or move spacesuit hand!)
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const s = simRef.current;

    for (const spot of s.hotspots) {
      if (
        clickX >= spot.x &&
        clickX <= spot.x + spot.w &&
        clickY >= spot.y &&
        clickY <= spot.y + spot.h
      ) {
        spot.action();
        return;
      }
    }

    const normX = Math.max(0.35, Math.min(0.82, clickX / s.width));
    const normY = Math.max(0.55, Math.min(0.86, clickY / s.height));
    moveHandTo(normX, normY, 0.35);
    playClickTone(820, 0.03);
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-slate-950 select-none font-sans text-slate-100">
      {/* Main Interactive 2.5D POV Simulation Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-pointer"
      />

      {/* Subtle Visor Vignette Overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 62%, rgba(2, 6, 12, 0.65) 100%)",
        }}
      />

      {/* TOP BAR: Kid-Friendly Helmet Visor Badge + Audio + 4 Resources Panel */}
      <div className="fixed top-3 left-3 right-3 z-20 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
        {/* Left: Helmet Visor Location & Audio/Event Controls */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-lg">
            <div
              className={`w-3 h-3 rounded-full ${
                telemetry.alertLevel === "WARNING"
                  ? "bg-red-500 animate-ping"
                  : telemetry.alertLevel === "CAUTION"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
              }`}
            />
            <div>
              <div className="text-xs tracking-wider text-cyan-300 font-black uppercase">
                {isMs
                  ? "KOKPIT ROKET BULAN // BILIK KUASA"
                  : "MOON ROCKET COCKPIT // POWER ROOM"}
              </div>
              <div className="text-[11px] font-bold text-slate-300">
                {isMs
                  ? "GRAVITI: 1/6 BUMI (MUDAH MELOMPAT!)"
                  : "GRAVITY: 1/6 EARTH (SUPER BOUNCY!)"}
              </div>
            </div>
          </div>

          <button
            onClick={toggleSuitAudio}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 text-xs font-bold px-3 py-2 rounded-xl transition shadow-lg"
          >
            <span>{audioEnabled ? "🔊" : "🔇"}</span>
            <span>
              {audioEnabled
                ? isMs
                  ? "BUNYI SUIT: HIDUP"
                  : "SUIT SOUND: ON"
                : isMs
                ? "HIDUPKAN BUNYI SUIT"
                : "TURN ON SUIT SOUND"}
            </span>
          </button>

          {stage === "calm" && (
            <button
              onClick={triggerCriticalSituation}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"
            >
              <span>⚡</span>
              <span>
                {isMs ? "TERUS KE SITUASI CEMAS →" : "NEXT: SUDDEN ALERT! →"}
              </span>
            </button>
          )}
        </div>

        {/* Right: 4 RESOURCES HUD PANEL (Preserved & Kid-Friendly!) */}
        <div className="w-60 sm:w-68 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 backdrop-blur-md p-3.5 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black tracking-widest uppercase text-cyan-300">
              {isMs ? "4 SUMBER UTAMA" : "4 OUTPOST RESOURCES"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
              {pickedChoice
                ? isMs
                  ? `PILIHAN ${pickedChoice}`
                  : `CHOICE ${pickedChoice}`
                : isMs
                ? "SEDIA"
                : "LIVE"}
            </span>
          </div>
          <div className="space-y-2">
            {resources.map((res) => (
              <div key={res.key}>
                <div className="flex justify-between items-center text-xs font-black tracking-wider mb-0.5">
                  <span className="text-white">{res.label}</span>
                  <div className="flex items-center gap-1.5">
                    {res.delta !== 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 border border-rose-400/50 text-rose-200 font-extrabold">
                        {res.delta}%
                      </span>
                    )}
                    <span className={res.textColor}>{res.val}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${res.barColor}`}
                    style={{ width: `${res.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATUS TOAST BANNER */}
      {toast && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl shadow-2xl text-xs font-extrabold tracking-wide flex items-center gap-2 border-2 ${
            toast.isWarning
              ? "bg-slate-900/95 border-amber-400 text-amber-200"
              : "bg-slate-900/95 border-cyan-400 text-cyan-200"
          }`}
        >
          <span className="text-base">{toast.isWarning ? "⚠️" : "✅"}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* STAGE 1 ("calm"): Welcome Bubble from Dr. Farah */}
      {stage === "calm" && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md border-2 border-cyan-400/60 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="shrink-0">
              <DrFarahAvatar size="md" mood="happy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black uppercase tracking-wider text-cyan-300 mb-0.5">
                {isMs ? "DR. FARAH · PANDUAN KOKPIT" : "DR. FARAH · COCKPIT GUIDE"}
              </div>
              <p className="text-sm font-bold text-slate-100 leading-snug">
                {isMs
                  ? "Selamat datang ke Bilik Kawalan Kuasa! Cuba klik suis berlampu di atas meja untuk melihat tangan angkasawan anda menekannya!"
                  : "Here we are at the Power Control Room! Everything looks calm so far. Try clicking the glowing switches on the desk to see your spacesuit hand press them!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2 ("choice"): SUDDEN CRITICAL SITUATION MODAL (Choice A vs Choice B) */}
      {stage === "choice" && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-[2px] pointer-events-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#111936]/95 border-2 border-amber-400/80 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <DrFarahAvatar size="md" mood="worried" />
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-rose-200 text-xs font-black uppercase tracking-wider animate-pulse">
                  {isMs
                    ? "⚡ SITUASI KRITIKAL: AMARAN KUASA RENDAH!"
                    : "⚡ CRITICAL SITUATION: POWER DROP ALERT!"}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-amber-300 mt-1">
                  {isMs
                    ? "Matahari Terbenam di Kawah Shackleton (-130°C)!"
                    : "Sunset Approaches at Shackleton Crater (-130°C)!"}
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed mb-4 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700">
              {isMs
                ? "Brrr! Suhu di luar jatuh mendadak ke -130°C dan panel suria kita mula kehilangan cahaya! Pemanas memerlukan kuasa untuk memanaskan kem, manakala sistem udara memastikan kita boleh bernafas. Apakah pilihan anda?"
                : "Brrr! Temperatures outside just plunged to -130°C and our solar panels are losing sunlight! Our heaters need power to keep us warm, while life support keeps fresh air flowing. What should we do?"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CHOICE A (Safe) */}
              <div
                onMouseEnter={() => setHoveredChoice("A")}
                onMouseLeave={() => setHoveredChoice(null)}
                onClick={handlePickChoiceA}
                className="cursor-pointer rounded-2xl border-2 border-cyan-400/50 bg-slate-900/85 hover:bg-slate-800/90 hover:border-cyan-300 p-4 flex flex-col justify-between transition group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                      {isMs ? "PILIHAN A" : "CHOICE A"}
                    </span>
                  </div>
                  <div className="text-base font-black text-amber-300 mb-2">
                    {isMs
                      ? "A · Seimbangkan Pemanas & Udara"
                      : "A · Balance Heaters & Life Support Equally"}
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mb-3">
                    {isMs
                      ? "Kongsi kuasa bateri dengan cermat supaya semua sistem kekal stabil."
                      : "Share battery power carefully so heaters and air stay steady."}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/85 text-white text-xs font-extrabold">
                      -15% {isMs ? "Kuasa" : "Power"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/85 text-white text-xs font-extrabold">
                      -10% {isMs ? "Oksigen" : "Oxygen"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/85 text-white text-xs font-extrabold">
                      -10% {isMs ? "Perisai" : "Shield"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-full bg-amber-400 group-hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-md transition"
                >
                  {isMs ? "PILIH A" : "CHOOSE A"}
                </button>
              </div>

              {/* CHOICE B (Triggers Overload Repair!) */}
              <div
                onMouseEnter={() => setHoveredChoice("B")}
                onMouseLeave={() => setHoveredChoice(null)}
                onClick={handlePickChoiceB}
                className="cursor-pointer rounded-2xl border-2 border-amber-400/50 bg-slate-900/85 hover:bg-slate-800/90 hover:border-amber-300 p-4 flex flex-col justify-between transition group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      {isMs ? "PILIHAN B" : "CHOICE B"}
                    </span>
                  </div>
                  <div className="text-base font-black text-amber-300 mb-2">
                    {isMs
                      ? "B · Pasang Pemanas Penuh Sekarang!"
                      : "B · Blast Full Heat & Cozy Up Early"}
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mb-3">
                    {isMs
                      ? "Guna kuasa maksimum untuk panaskan bilik dengan cepat! (Awas: Risiko lebihan beban kuasa!)"
                      : "Crank the heaters to max power right away! (Warning: May overload the power switches!)"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/85 text-white text-xs font-extrabold">
                      -30% {isMs ? "Kuasa" : "Power"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/85 text-white text-xs font-extrabold">
                      -15% {isMs ? "Makanan" : "Food"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-full bg-amber-400 group-hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-md transition"
                >
                  {isMs ? "PILIH B" : "CHOOSE B"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3 ("repair"): DR. FARAH SIMPLE AI BUBBLE GUIDE TO FIX CHOICE B'S BAD CONSEQUENCE */}
      {stage === "repair" && (
        <div className="fixed top-20 left-4 z-30 max-w-md w-[92%] pointer-events-auto animate-fadeIn">
          <div className="bg-slate-950/95 border-2 border-amber-400 rounded-3xl p-4 shadow-[0_0_35px_rgba(245,158,11,0.45)]">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <DrFarahAvatar size="md" mood="worried" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-rose-200 text-[10px] font-black uppercase tracking-wider">
                    {isMs ? "⚡ LITAR PINTAS!" : "⚡ POWER OVERLOAD!"}
                  </span>
                  <span className="text-xs font-black text-cyan-300 uppercase">
                    {isMs ? "PEMBANTU AI DR. FARAH" : "DR. FARAH AI HELPER"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-snug mb-2.5">
                  {isMs
                    ? "Alamak! Pemanas penuh telah menutup suis kita! Tekan butang berlampu di bawah untuk membaikinya:"
                    : "Uh oh! Blasting full heat overloaded the circuit and tripped our switches! Use the glowing buttons below to fix it:"}
                </p>

                {/* Step-by-step kid-friendly checklist */}
                <div className="space-y-1.5 text-xs font-extrabold">
                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${
                      repairReactorFixed
                        ? "bg-emerald-950/70 border-emerald-400 text-emerald-200"
                        : "bg-amber-950/70 border-amber-400 text-amber-200 animate-pulse"
                    }`}
                  >
                    <span>{repairReactorFixed ? "✅" : "👉"}</span>
                    <span>
                      {isMs
                        ? "1. Klik butang [REAKTOR MINI] supaya HIDUP"
                        : "1. Click [MINI REACTOR] button to turn it ON"}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${
                      repairMoxieFixed
                        ? "bg-emerald-950/70 border-emerald-400 text-emerald-200"
                        : "bg-amber-950/70 border-amber-400 text-amber-200 animate-pulse"
                    }`}
                  >
                    <span>{repairMoxieFixed ? "✅" : "👉"}</span>
                    <span>
                      {isMs
                        ? "2. Klik butang [UDARA & PEMANAS] supaya HIDUP"
                        : "2. Click [AIR & HEATERS] button to turn it ON"}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${
                      repairVoltageFixed
                        ? "bg-emerald-950/70 border-emerald-400 text-emerald-200"
                        : "bg-amber-950/70 border-amber-400 text-amber-200 animate-pulse"
                    }`}
                  >
                    <span>{repairVoltageFixed ? "✅" : "👉"}</span>
                    <span>
                      {isMs
                        ? `3. Gerakkan pelaras [DAIL KUASA] ke 120V atau kurang (Sekarang: ${voltageSet}V)`
                        : `3. Slide [POWER DIAL] down to 120V or lower (Now: ${voltageSet}V)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4 ("resolved"): Celebratory Bubble & "Exit Rocket to Lunar Basecamp →" */}
      {stage === "resolved" && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl pointer-events-auto animate-fadeIn">
          <div className="bg-slate-950/95 border-2 border-emerald-400 rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(16,185,129,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="shrink-0">
                <DrFarahAvatar size="md" mood="happy" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-300 mb-0.5">
                  {pickedChoice === "A"
                    ? isMs
                      ? "✅ SISTEM STABIL & SEIMBANG!"
                      : "✅ SYSTEMS BALANCED & STABLE!"
                    : isMs
                    ? "✅ LITAR PINTAS BERJAYA DIBAIKI!"
                    : "✅ OVERLOAD FIXED! ALL SYSTEMS GREEN!"}
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                  {pickedChoice === "A"
                    ? isMs
                      ? "Bijak sekali! Kem kekal selesa dan kita menjimatkan banyak kuasa bateri. Jom keluar ke Kem Bulan!"
                      : "Steady and smart! The cabin stayed cozy and we saved plenty of battery power. Let's head out to the Lunar Basecamp!"
                    : isMs
                    ? "Kerja yang hebat membaiki suis Reaktor Mini, Udara, dan Dail Kuasa! Sekarang kita sedia untuk keluar ke Kem Bulan!"
                    : "Great job using the console switches and power dial to fix the overload! Now let's head straight out to the Lunar Basecamp!"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickTone(880, 0.08);
                onCompleteCockpitTask?.(pickedChoice || "A");
              }}
              className="shrink-0 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(52,211,153,0.6)] transition transform hover:scale-105"
            >
              {isMs
                ? "Keluar Roket ke Kem Bulan →"
                : "Exit Rocket to Lunar Basecamp →"}
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM INTERACTIVE TACTICAL DECK (Kid-Friendly Wrist Pad + Highlighted Console Buttons & Slider) */}
      <div className="fixed bottom-3 left-3 right-3 z-20 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3 pointer-events-none">
        {/* Left Forearm Wrist Pad (Kid-Friendly Diagnostics) */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/35 rounded-2xl p-3 pointer-events-auto shadow-2xl max-w-xs w-full hidden sm:block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase">
              {isMs ? "PAD PERGELANGAN TANGAN" : "ASTRONAUT WRIST PAD"}
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                telemetry.alertLevel === "WARNING"
                  ? "bg-red-500/30 text-red-200 border-red-400 animate-pulse"
                  : telemetry.alertLevel === "CAUTION"
                  ? "bg-amber-500/25 text-amber-200 border-amber-400"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
              }`}
            >
              {telemetry.alertLevel === "WARNING"
                ? isMs
                  ? "AMARAN!"
                  : "OVERLOAD!"
                : telemetry.alertLevel === "CAUTION"
                ? isMs
                  ? "AWAS"
                  : "ALERT"
                : isMs
                ? "BAIK"
                : "ALL GOOD"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <div className="text-[9px] font-bold text-slate-400">
                {isMs ? "KUASA DIBUAT" : "POWER MADE"}
              </div>
              <div className="text-xs font-black text-cyan-300">
                {telemetry.netKw.toFixed(0)} kW
              </div>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <div className="text-[9px] font-bold text-slate-400">
                {isMs ? "BATERI" : "BATTERY"}
              </div>
              <div className="text-xs font-black text-emerald-400">
                {telemetry.batteryPct.toFixed(0)}%
              </div>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <div className="text-[9px] font-bold text-slate-400">
                {isMs ? "SUHU BILIK" : "CABIN HEAT"}
              </div>
              <div className="text-xs font-black text-amber-300">
                {telemetry.heaterTempC}°C
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] font-bold text-slate-300 flex justify-between">
            <span>
              {isMs ? "UDARA O₂: " : "AIR MAKER: "}
              <strong className={moxieOnline ? "text-emerald-400" : "text-rose-400"}>
                {moxieOnline ? (isMs ? "HIDUP" : "ON") : isMs ? "MATI" : "OFF"}
              </strong>
            </span>
            <span>
              {isMs ? "REAKTOR: " : "REACTOR: "}
              <strong className={reactorOnline ? "text-cyan-300" : "text-rose-400"}>
                {reactorOnline ? (isMs ? "HIDUP" : "ON") : isMs ? "MATI" : "OFF"}
              </strong>
            </span>
          </div>
        </div>

        {/* Center/Right Console Buttons & Power Dial Slider */}
        <div
          className={`bg-slate-950/90 backdrop-blur-md border-2 rounded-2xl p-3 pointer-events-auto shadow-2xl flex flex-col sm:flex-row items-center gap-3 transition ${
            stage === "repair"
              ? "border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]"
              : "border-slate-700/80"
          }`}
        >
          {/* 3 Kid-Friendly Hardware Switch Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Button 1: SOLAR PANELS */}
            <button
              type="button"
              onClick={handleToggleSolar}
              className={`relative flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border-2 transition min-w-[96px] ${
                solarOnline
                  ? "bg-cyan-950/70 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                  : "bg-slate-900/90 border-slate-700 text-slate-400"
              }`}
            >
              <span className="text-[10px] tracking-wider uppercase font-black">
                {isMs ? "PANEL SURIA" : "SOLAR PANELS"}
              </span>
              <span
                className={`text-xs font-black mt-0.5 ${
                  solarOnline ? "text-cyan-300" : "text-slate-500"
                }`}
              >
                {solarOnline ? (isMs ? "HIDUP" : "ON") : isMs ? "MATI" : "OFF"}
              </span>
            </button>

            {/* Button 2: MINI REACTOR (Highlighted during Choice B repair!) */}
            <div className="relative">
              {stage === "repair" && !repairReactorFixed && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-lg animate-bounce">
                  {isMs ? "👇 KLIK SINI!" : "👇 CLICK ME!"}
                </div>
              )}
              <button
                type="button"
                onClick={handleToggleReactor}
                className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border-2 transition min-w-[96px] ${
                  stage === "repair" && !repairReactorFixed
                    ? "bg-rose-950/90 border-amber-300 text-amber-200 ring-4 ring-amber-400/50 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.7)]"
                    : reactorOnline
                    ? "bg-amber-950/70 border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                    : "bg-slate-900/90 border-slate-700 text-slate-400"
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-black">
                  {isMs ? "REAKTOR MINI" : "MINI REACTOR"}
                </span>
                <span
                  className={`text-xs font-black mt-0.5 ${
                    reactorOnline ? "text-amber-300" : "text-rose-400"
                  }`}
                >
                  {reactorOnline ? (isMs ? "HIDUP" : "ON") : isMs ? "MATI (OFF)" : "OFF"}
                </span>
              </button>
            </div>

            {/* Button 3: AIR & HEATERS (Highlighted during Choice B repair!) */}
            <div className="relative">
              {stage === "repair" && !repairMoxieFixed && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-lg animate-bounce">
                  {isMs ? "👇 KLIK SINI!" : "👇 CLICK ME!"}
                </div>
              )}
              <button
                type="button"
                onClick={handleToggleMoxie}
                className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border-2 transition min-w-[96px] ${
                  stage === "repair" && !repairMoxieFixed
                    ? "bg-rose-950/90 border-amber-300 text-amber-200 ring-4 ring-amber-400/50 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.7)]"
                    : moxieOnline
                    ? "bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                    : "bg-slate-900/90 border-slate-700 text-slate-400"
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-black">
                  {isMs ? "UDARA & HABA" : "AIR & HEATERS"}
                </span>
                <span
                  className={`text-xs font-black mt-0.5 ${
                    moxieOnline ? "text-emerald-300" : "text-rose-400"
                  }`}
                >
                  {moxieOnline ? (isMs ? "HIDUP" : "ON") : isMs ? "MATI (OFF)" : "OFF"}
                </span>
              </button>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-slate-700" />

          {/* POWER DIAL SLIDER (Highlighted during Choice B repair!) */}
          <div
            className={`relative flex flex-col w-full sm:w-52 p-2 rounded-xl transition ${
              stage === "repair" && !repairVoltageFixed
                ? "bg-rose-950/80 border-2 border-amber-300 ring-4 ring-amber-400/40 animate-pulse"
                : ""
            }`}
          >
            {stage === "repair" && !repairVoltageFixed && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-lg animate-bounce">
                {isMs ? "👇 TURUNKAN KE ≤120V!" : "👇 SLIDE DOWN TO ≤120V!"}
              </div>
            )}
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="font-black tracking-wider text-slate-200 uppercase">
                {isMs ? "DAIL KUASA" : "POWER DIAL"}
              </span>
              <span
                className={`font-black ${
                  voltageSet > 120 ? "text-rose-400" : "text-cyan-300"
                }`}
              >
                {voltageSet.toFixed(0)} V {voltageSet <= 120 ? "✓" : "⚠️"}
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              step="1"
              value={voltageSet}
              onChange={(e) => handleVoltageChange(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer h-2 rounded-lg bg-slate-800"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1">
              <span>80V ({isMs ? "RENDAH" : "LOW"})</span>
              <span className="text-emerald-300">120V ({isMs ? "SELAMAT" : "SAFE"})</span>
              <span className="text-rose-400">150V ({isMs ? "TINGGI" : "HIGH"})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
