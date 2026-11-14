import React, { useMemo, useState } from "react";
import MarsScene from "./components/MarsScene";
import StartScreen from "./components/StartScreen";
import HUD from "./components/HUD";
import SolCard from "./components/SolCard";
import { QuizModal, CertificateModal } from "./components/QuizAndCertificate";
import { SettingsModal, LoseModal, NasaDataModal } from "./components/Modals";
import { TRANSLATIONS } from "./data/translations";
import { INITIAL_STATS, RESOURCE_KEYS, SOL_DATA } from "./data/sols";
import { spaceAudio } from "./utils/sound";

export default function App() {
  const [lang, setLang] = useState("en");
  const [soundOn, setSoundOn] = useState(true);
  const [phase, setPhase] = useState("start"); // start | intro | playing | lost | victory | quiz | certificate
  const [currentSol, setCurrentSol] = useState(1);
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [panelsDusty, setPanelsDusty] = useState(false);
  const [depletedResource, setDepletedResource] = useState(null);

  const [focusModule, setFocusModule] = useState("habitat");
  const [selectedModule, setSelectedModule] = useState(null);
  const [camResetTick, setCamResetTick] = useState(0);
  const [roverMode, setRoverMode] = useState(false);
  const [dpadInput, setDpadInput] = useState({ up: false, down: false, left: false, right: false });

  const [showSettings, setShowSettings] = useState(false);
  const [showNasa, setShowNasa] = useState(false);

  const t = TRANSLATIONS[lang];
  const solConfig = useMemo(
    () => SOL_DATA.find((s) => s.id === currentSol) || null,
    [currentSol]
  );

  const capMood = useMemo(() => {
    const minVal = Math.min(...Object.values(stats));
    if (minVal <= 20) return "alert";
    if (minVal <= 35) return "worried";
    return "happy";
  }, [stats]);

  const playSfx = (type) => {
    if (!soundOn) return;
    if (type === "click") spaceAudio.playClick();
    if (type === "success") spaceAudio.playSuccess();
    if (type === "alert") spaceAudio.playAlert();
    if (type === "victory") spaceAudio.playVictory();
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    spaceAudio.setEnabled(next);
    if (next) spaceAudio.playClick();
  };

  const resetMission = (targetPhase = "intro") => {
    setStats({ ...INITIAL_STATS });
    setCurrentSol(1);
    setPanelsDusty(false);
    setDepletedResource(null);
    setFocusModule("habitat");
    setSelectedModule(null);
    setRoverMode(false);
    setPhase(targetPhase);
  };

  const handleStartMars = () => {
    if (soundOn) spaceAudio.startAmbient();
    playSfx("success");
    resetMission("intro");
  };

  const handleStartSol1 = () => {
    playSfx("click");
    setCurrentSol(1);
    setFocusModule(SOL_DATA[0].focusModule);
    setPhase("playing");
  };

  const handleChoice = (choiceKey) => {
    if (!solConfig) return;
    const chosen = choiceKey === "A" ? solConfig.choiceA : solConfig.choiceB;

    const nextStats = { ...stats };
    for (const [k, delta] of Object.entries(chosen.effects)) {
      nextStats[k] = Math.max(0, Math.min(100, nextStats[k] + delta));
    }

    if (currentSol === 4 && typeof chosen.cleanPanels === "boolean") {
      setPanelsDusty(!chosen.cleanPanels);
    }

    setStats(nextStats);

    // Check lose condition (any gauge hits 0%)
    const zeroKey = RESOURCE_KEYS.find((k) => nextStats[k] <= 0);
    if (zeroKey) {
      playSfx("alert");
      setDepletedResource(zeroKey);
      setPhase("lost");
      return;
    }

    // Advance to next Sol or Victory
    if (currentSol < 6) {
      playSfx("success");
      const nextSol = currentSol + 1;
      setCurrentSol(nextSol);
      if (nextSol === 4) {
        setPanelsDusty(true);
      }
      const nextConfig = SOL_DATA.find((s) => s.id === nextSol);
      if (nextConfig) {
        setFocusModule(nextConfig.focusModule);
      }
    } else {
      playSfx("victory");
      setFocusModule("habitat");
      setPhase("victory");
    }
  };

  const handleSelectModule = (modId) => {
    setSelectedModule(modId);
    if (modId) {
      playSfx("click");
      setFocusModule(modId);
    }
  };

  const handleResetCam = () => {
    playSfx("click");
    setFocusModule("habitat");
    setSelectedModule(null);
    setCamResetTick((n) => n + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* 3D Open-World Jezero Crater Scene */}
      <MarsScene
        phase={phase}
        stats={stats}
        currentSol={currentSol}
        panelsDusty={panelsDusty}
        focusModule={focusModule}
        selectedModule={selectedModule}
        onSelectModule={handleSelectModule}
        camResetTick={camResetTick}
        roverMode={roverMode}
        dpadInput={dpadInput}
        moduleLabels={t.modules}
      />

      {/* Start Screen */}
      {phase === "start" && (
        <StartScreen
          t={t}
          onStartMars={handleStartMars}
          onOpenSettings={() => {
            playSfx("click");
            setShowSettings(true);
          }}
          onOpenNasa={() => {
            playSfx("click");
            setShowNasa(true);
          }}
        />
      )}

      {/* Active Gameplay HUD & Mission Card */}
      {phase !== "start" && (
        <HUD
          t={t}
          currentSol={currentSol}
          stats={stats}
          roverMode={roverMode}
          onToggleRoverMode={() => {
            playSfx("click");
            setRoverMode((r) => !r);
          }}
          onResetCam={handleResetCam}
          onOpenSettings={() => {
            playSfx("click");
            setShowSettings(true);
          }}
          onOpenNasa={() => {
            playSfx("click");
            setShowNasa(true);
          }}
          onDpadChange={setDpadInput}
        />
      )}

      {(phase === "intro" || phase === "playing" || phase === "victory") && (
        <SolCard
          t={t}
          phase={phase}
          currentSol={currentSol}
          solConfig={solConfig}
          capMood={capMood}
          onStartSol1={handleStartSol1}
          onChoose={handleChoice}
          onGoToQuiz={() => {
            playSfx("click");
            setPhase("quiz");
          }}
        />
      )}

      {/* Lose Modal */}
      {phase === "lost" && (
        <LoseModal
          t={t}
          depletedResource={depletedResource}
          onRetry={() => {
            playSfx("click");
            resetMission("playing");
            setFocusModule(SOL_DATA[0].focusModule);
          }}
        />
      )}

      {/* 4-Question Cadet Debrief Quiz */}
      {phase === "quiz" && (
        <QuizModal
          t={t}
          onPlaySfx={playSfx}
          onComplete={() => setPhase("certificate")}
        />
      )}

      {/* Personalized Cadet Certificate */}
      {phase === "certificate" && (
        <CertificateModal
          t={t}
          stats={stats}
          onPlayAgain={() => {
            playSfx("click");
            resetMission("start");
          }}
          onOpenNasa={() => {
            playSfx("click");
            setShowNasa(true);
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          t={t}
          lang={lang}
          onChangeLang={(nextLang) => {
            playSfx("click");
            setLang(nextLang);
          }}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onClose={() => {
            playSfx("click");
            setShowSettings(false);
          }}
        />
      )}

      {/* NASA Science & Data Modal */}
      {showNasa && (
        <NasaDataModal
          t={t}
          onClose={() => {
            playSfx("click");
            setShowNasa(false);
          }}
        />
      )}
    </div>
  );
}
