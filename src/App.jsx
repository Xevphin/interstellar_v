import React, { useCallback, useMemo, useState } from "react";
import MarsScene from "./components/MarsScene";
import StartScreen from "./components/StartScreen";
import HUD from "./components/HUD";
import IntroGreetingModal from "./components/IntroGreetingModal";
import StructureInteractModal from "./components/StructureInteractModal";
import {
  QuizModal,
  LeaderboardModal,
  CertificateModal,
} from "./components/QuizAndCertificate";
import { SettingsModal, LoseModal, NasaDataModal } from "./components/Modals";
import { TRANSLATIONS } from "./data/translations";
import { INITIAL_STATS, OUTPOST_STRUCTURES, RESOURCE_KEYS } from "./data/sols";
import { spaceAudio } from "./utils/sound";

export default function App() {
  const [lang, setLang] = useState("en");
  const [soundOn, setSoundOn] = useState(true);
  const [planet, setPlanet] = useState("lunar");
  const [phase, setPhase] = useState("start"); // start | intro | playing | lost | quiz | leaderboard | certificate

  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskTimeBonus, setTaskTimeBonus] = useState(0);
  const [panelsDusty, setPanelsDusty] = useState(true);
  const [depletedResource, setDepletedResource] = useState(null);

  // Unified Structure Interaction State
  const [nearbyStructure, setNearbyStructure] = useState(null);
  const [activeStructure, setActiveStructure] = useState(null);
  const [interactionMode, setInteractionMode] = useState(null); // null | "menu" | "task" | "fact"
  const [timeoutBanner, setTimeoutBanner] = useState(false);

  // Rover Upgrade & Camera State
  const [roverMode, setRoverMode] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dpadInput, setDpadInput] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const [targetTeleport, setTargetTeleport] = useState(null);

  // Post-Mission Quiz & Leaderboard State
  const [quizResults, setQuizResults] = useState({
    correctCount: 0,
    totalQuestions: 4,
    quizTimeBonus: 0,
  });
  const [commanderName, setCommanderName] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [showNasa, setShowNasa] = useState(false);

  const t = TRANSLATIONS[lang];
  const roverUpgraded = completedTasks.length >= OUTPOST_STRUCTURES.length;
  const currentSol = Math.min(6, completedTasks.length + 1);

  const drFarahMood = useMemo(() => {
    const minVal = Math.min(...Object.values(stats));
    if (minVal <= 20) return "alert";
    if (minVal <= 35) return "worried";
    return "happy";
  }, [stats]);

  const playSfx = useCallback(
    (type) => {
      if (!soundOn) return;
      if (type === "click") spaceAudio.playClick();
      if (type === "success") spaceAudio.playSuccess();
      if (type === "alert") spaceAudio.playAlert();
      if (type === "victory") spaceAudio.playVictory();
    },
    [soundOn]
  );

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    spaceAudio.setEnabled(next);
    if (next) spaceAudio.playClick();
  };

  const resetMission = (targetPhase = "intro") => {
    setStats({ ...INITIAL_STATS });
    setCompletedTasks([]);
    setTaskTimeBonus(0);
    setPanelsDusty(true);
    setDepletedResource(null);
    setNearbyStructure(null);
    setActiveStructure(null);
    setInteractionMode(null);
    setShowUpgradeModal(false);
    setTimeoutBanner(false);
    setRoverMode(true);
    setPhase(targetPhase);
  };

  const handleStartMission = (selectedPlanet = "lunar") => {
    setPlanet(selectedPlanet);
    if (soundOn) spaceAudio.startAmbient();
    playSfx("success");
    resetMission("intro");
  };

  const handleStartExploration = () => {
    playSfx("click");
    setPhase("playing");
  };

  const handleOpenStructureMenu = useCallback(
    (structure) => {
      if (!structure) return;
      playSfx("click");
      setActiveStructure(structure);
      setInteractionMode("menu");
      setTimeoutBanner(false);
    },
    [playSfx]
  );

  const handleCloseInteraction = useCallback(() => {
    playSfx("click");
    setInteractionMode(null);
    setActiveStructure(null);
  }, [playSfx]);

  const applyTaskEffects = useCallback(
    (structure, effects, cleanPanelsFlag, remainingSeconds = 0) => {
      const nextStats = { ...stats };
      for (const [k, delta] of Object.entries(effects)) {
        nextStats[k] = Math.max(0, Math.min(100, nextStats[k] + delta));
      }

      if (structure.id === "solar" && typeof cleanPanelsFlag === "boolean") {
        setPanelsDusty(!cleanPanelsFlag);
      }

      setStats(nextStats);
      setInteractionMode(null);
      setActiveStructure(null);

      // Check Lose Condition (any gauge hits 0%)
      const zeroKey = RESOURCE_KEYS.find((k) => nextStats[k] <= 0);
      if (zeroKey) {
        playSfx("alert");
        setDepletedResource(zeroKey);
        setPhase("lost");
        return;
      }

      // Record task completion & check if all 6 tasks are now done
      const alreadyDone = completedTasks.includes(structure.id);
      const nextCompleted = alreadyDone
        ? completedTasks
        : [...completedTasks, structure.id];

      if (!alreadyDone) {
        setCompletedTasks(nextCompleted);
        setTaskTimeBonus((b) => b + Math.max(0, remainingSeconds));
      }

      if (!alreadyDone && nextCompleted.length >= OUTPOST_STRUCTURES.length) {
        playSfx("victory");
        setShowUpgradeModal(true);
      } else {
        playSfx("success");
      }
    },
    [stats, completedTasks, playSfx]
  );

  const handleChooseTaskOption = useCallback(
    (structure, choiceKey, timeLeft) => {
      if (!structure) return;
      const chosen = choiceKey === "A" ? structure.choiceA : structure.choiceB;
      setTimeoutBanner(false);
      applyTaskEffects(structure, chosen.effects, chosen.cleanPanels, timeLeft);
    },
    [applyTaskEffects]
  );

  const handleTaskTimeout = useCallback(
    (structure) => {
      if (!structure) return;
      playSfx("alert");
      setTimeoutBanner(true);
      // Apply default emergency consequence (-10% Power & Oxygen) cleanly without freezing
      applyTaskEffects(structure, { power: -10, oxygen: -10 }, false, 0);
    },
    [applyTaskEffects, playSfx]
  );

  const handleLocateNextTask = () => {
    playSfx("click");
    const nextStruct =
      OUTPOST_STRUCTURES.find((s) => !completedTasks.includes(s.id)) ||
      OUTPOST_STRUCTURES[0];
    setTargetTeleport({ ...nextStruct, tick: Date.now() });
  };

  const isRoverPaused =
    phase !== "playing" || Boolean(interactionMode) || showUpgradeModal;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* 3D Open-World Lunar / Mars Outpost Scene */}
      <MarsScene
        planet={planet}
        phase={phase}
        stats={stats}
        currentSol={currentSol}
        panelsDusty={panelsDusty}
        roverMode={roverMode}
        isPaused={isRoverPaused}
        roverUpgraded={roverUpgraded}
        dpadInput={dpadInput}
        nearbyStructure={nearbyStructure}
        completedTasks={completedTasks}
        targetTeleport={targetTeleport}
        moduleLabels={t.modules}
        interactPrompt={t.interactPrompt}
        onProximityChange={setNearbyStructure}
        onSelectStructure={handleOpenStructureMenu}
      />

      {/* Start Screen */}
      {phase === "start" && (
        <StartScreen
          t={t}
          onStartMission={handleStartMission}
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

      {/* Dr. Farah Interactive Intro Greeting Overlay */}
      {phase === "intro" && (
        <IntroGreetingModal
          t={t}
          onStartExploration={handleStartExploration}
        />
      )}

      {/* Top HUD Bar */}
      {phase !== "start" && phase !== "intro" && (
        <HUD
          t={t}
          planet={planet}
          currentSol={currentSol}
          completedTasksCount={completedTasks.length}
          roverUpgraded={roverUpgraded}
          stats={stats}
          roverMode={roverMode}
          onToggleRoverMode={() => {
            playSfx("click");
            setRoverMode((r) => !r);
          }}
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

      {/* Unified [E] Structure Interaction Menu, Task Modal (30s Timer + Dr. Farah AI Helper), Fact Modal & Upgrade Celebration */}
      {phase === "playing" && (
        <StructureInteractModal
          t={t}
          nearbyStructure={nearbyStructure}
          activeStructure={activeStructure}
          interactionMode={interactionMode}
          completedTasks={completedTasks}
          stats={stats}
          drFarahMood={drFarahMood}
          timeoutBanner={timeoutBanner}
          showUpgradeModal={showUpgradeModal}
          onOpenMenu={handleOpenStructureMenu}
          onSelectMode={(mode) => {
            playSfx("click");
            setInteractionMode(mode);
          }}
          onCloseInteraction={handleCloseInteraction}
          onChooseTaskOption={handleChooseTaskOption}
          onTaskTimeout={handleTaskTimeout}
          onDismissUpgrade={() => {
            playSfx("click");
            setShowUpgradeModal(false);
          }}
          onStartQuiz={() => {
            playSfx("click");
            setShowUpgradeModal(false);
            setPhase("quiz");
          }}
          onLocateNextTask={handleLocateNextTask}
          onPlaySfx={playSfx}
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
          }}
        />
      )}

      {/* Streamlined 4-Question Debrief Quiz (with 30s Timer, 1.-4. & a.-d. formatting) */}
      {phase === "quiz" && (
        <QuizModal
          t={t}
          onPlaySfx={playSfx}
          onComplete={(results) => {
            setQuizResults(results);
            setPhase("leaderboard");
          }}
        />
      )}

      {/* Gamified Post-Quiz Leaderboard */}
      {phase === "leaderboard" && (
        <LeaderboardModal
          t={t}
          stats={stats}
          completedTasksCount={completedTasks.length}
          quizResults={quizResults}
          taskTimeBonus={taskTimeBonus}
          commanderName={commanderName}
          onChangeCommanderName={setCommanderName}
          onOpenCertificate={() => {
            playSfx("click");
            setPhase("certificate");
          }}
          onPlayAgain={() => {
            playSfx("click");
            resetMission("start");
          }}
          onPlaySfx={playSfx}
        />
      )}

      {/* Printable & Downloadable Commander Certificate */}
      {phase === "certificate" && (
        <CertificateModal
          t={t}
          stats={stats}
          commanderName={commanderName}
          onChangeCommanderName={setCommanderName}
          onBackToLeaderboard={() => {
            playSfx("click");
            setPhase("leaderboard");
          }}
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
