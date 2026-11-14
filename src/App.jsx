import React, { useCallback, useMemo, useState } from "react";
import MarsScene from "./components/MarsScene";
import TitleScene from "./components/three/TitleScene";
import TitleScreen from "./components/TitleScreen";
import StartScreen from "./components/StartScreen";
import LaunchCutscene from "./components/cutscenes/LaunchCutscene";
import ReturnCutscene from "./components/cutscenes/ReturnCutscene";
import HUD from "./components/HUD";
import IntroGreetingModal from "./components/IntroGreetingModal";
import LunarCockpitTask from "./components/LunarCockpitTask";
import StructureInteractModal from "./components/StructureInteractModal";
import {
  QuizModal,
  LeaderboardModal,
  CertificateModal,
} from "./components/QuizAndCertificate";
import {
  SettingsModal,
  CreditsModal,
  LoseModal,
  NasaDataModal,
} from "./components/Modals";
import { TRANSLATIONS } from "./data/translations";
import { FLOW_TRANSLATIONS } from "./data/flowTranslations";
import { INITIAL_STATS, OUTPOST_STRUCTURES, RESOURCE_KEYS } from "./data/sols";
import { spaceAudio } from "./utils/sound";

export default function App() {
  const [lang, setLang] = useState("en");
  const [soundOn, setSoundOn] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [cameraSensitivity, setCameraSensitivity] = useState(1.0);
  const [graphicsQuality, setGraphicsQuality] = useState("high");

  const [planet, setPlanet] = useState("lunar");
  // Flow phases: title -> select -> launchCutscene -> intro -> playing -> returnCutscene -> quiz -> leaderboard -> certificate (or lost)
  const [phase, setPhase] = useState("title");

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
  const [showCredits, setShowCredits] = useState(false);
  const [showNasa, setShowNasa] = useState(false);

  const t = useMemo(
    () => ({
      ...TRANSLATIONS[lang],
      ...FLOW_TRANSLATIONS[lang],
    }),
    [lang]
  );

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

  const handleChangeVolume = (nextVol) => {
    setVolume(nextVol);
    spaceAudio.setVolume(nextVol);
  };

  const resetMission = (targetPhase = "title") => {
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

  const handleTitleStart = () => {
    if (soundOn) spaceAudio.startAmbient();
    playSfx("click");
    setPhase("select");
  };

  const handleSelectPlanetAndLaunch = (selectedPlanet = "lunar") => {
    setPlanet(selectedPlanet);
    if (soundOn) spaceAudio.startAmbient();
    playSfx("success");
    resetMission("launchCutscene");
  };

  const handleLaunchCutsceneComplete = useCallback(() => {
    playSfx("success");
    setPhase("intro");
  }, [playSfx]);

  const handleStartExploration = () => {
    playSfx("click");
    if (planet === "lunar") {
      // On the Moon, complete the Rocket Cockpit Situational Task first before exiting to the basecamp
      setPhase("cockpitTask");
    } else {
      setPhase("playing");
    }
  };

  const handleCompleteCockpitTask = (choiceKey) => {
    if (choiceKey === "A") {
      setStats({ power: 85, oxygen: 90, shielding: 90, food: 100 });
    } else {
      setStats({ power: 70, oxygen: 100, shielding: 100, food: 85 });
    }
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

  const handleStartReturnCutscene = () => {
    playSfx("victory");
    setShowUpgradeModal(false);
    setPhase("returnCutscene");
  };

  const handleReturnCutsceneComplete = useCallback(() => {
    playSfx("success");
    setPhase("quiz");
  }, [playSfx]);

  const isRoverPaused =
    phase !== "playing" || Boolean(interactionMode) || showUpgradeModal;

  const showTitleScene =
    phase === "title" ||
    phase === "select" ||
    (phase === "intro" && planet === "lunar");
  const showOutpostScene =
    (phase === "intro" && planet === "mars") ||
    phase === "playing" ||
    phase === "lost" ||
    phase === "quiz" ||
    phase === "leaderboard" ||
    phase === "certificate";

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* 1. Earth Stratosphere & Flying Rocket Scene (No Basecamp Spoilers!) */}
      {showTitleScene && <TitleScene graphicsQuality={graphicsQuality} />}

      {/* 2. Post-Selection 3-2-1 Liftoff Rocket Launch Cutscene */}
      {phase === "launchCutscene" && (
        <LaunchCutscene
          t={t}
          planet={planet}
          graphicsQuality={graphicsQuality}
          onComplete={handleLaunchCutsceneComplete}
        />
      )}

      {/* 3. Mission Completion Return-to-Earth Cutscene */}
      {phase === "returnCutscene" && (
        <ReturnCutscene
          t={t}
          planet={planet}
          graphicsQuality={graphicsQuality}
          onComplete={handleReturnCutsceneComplete}
        />
      )}

      {/* 4. 3D Open-World Lunar / Mars Outpost Scene (Mounted only after arriving at planet!) */}
      {showOutpostScene && (
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
          cameraSensitivity={cameraSensitivity}
          graphicsQuality={graphicsQuality}
          onProximityChange={setNearbyStructure}
          onSelectStructure={handleOpenStructureMenu}
        />
      )}

      {/* Main Title Screen Overlay */}
      {phase === "title" && (
        <TitleScreen
          t={t}
          onStart={handleTitleStart}
          onOpenSettings={() => {
            playSfx("click");
            setShowSettings(true);
          }}
          onOpenCredits={() => {
            playSfx("click");
            setShowCredits(true);
          }}
        />
      )}

      {/* Select Your 6-Day Outpost Mission Screen */}
      {phase === "select" && (
        <StartScreen
          t={t}
          onStartMission={handleSelectPlanetAndLaunch}
          onBack={() => {
            playSfx("click");
            setPhase("title");
          }}
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

      {/* Planet-Specific Dr. Farah Bubble-Chat Introduction */}
      {phase === "intro" && (
        <IntroGreetingModal
          t={t}
          planet={planet}
          onStartExploration={handleStartExploration}
          onPlaySfx={playSfx}
        />
      )}

      {/* Moon Pre-Basecamp Rocket Cockpit Situational Task */}
      {phase === "cockpitTask" && (
        <LunarCockpitTask
          t={t}
          onCompleteCockpitTask={handleCompleteCockpitTask}
          onPlaySfx={playSfx}
        />
      )}

      {/* Top HUD Bar */}
      {showOutpostScene && phase !== "intro" && (
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

      {/* Unified [E] Structure Interaction Menu, Task Modal, Fact Modal & Upgrade Celebration */}
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
          onStartQuiz={handleStartReturnCutscene}
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

      {/* Streamlined 4-Question Debrief Quiz */}
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
            resetMission("title");
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
            resetMission("title");
          }}
          onOpenNasa={() => {
            playSfx("click");
            setShowNasa(true);
          }}
        />
      )}

      {/* Settings Modal (Audio Volume, Camera Sensitivity, Graphics Quality, Language) */}
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
          volume={volume}
          onChangeVolume={handleChangeVolume}
          cameraSensitivity={cameraSensitivity}
          onChangeSensitivity={setCameraSensitivity}
          graphicsQuality={graphicsQuality}
          onChangeGraphics={(q) => {
            playSfx("click");
            setGraphicsQuality(q);
          }}
          onClose={() => {
            playSfx("click");
            setShowSettings(false);
          }}
        />
      )}

      {/* Credits Modal */}
      {showCredits && (
        <CreditsModal
          t={t}
          onClose={() => {
            playSfx("click");
            setShowCredits(false);
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
