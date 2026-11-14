import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Trophy,
  UserCheck,
} from "lucide-react";
import { DrFarahPortrait } from "./DrFarahAvatar";
import { DEFAULT_BENCHMARKS } from "../data/sols";

const OPTION_LETTERS = ["a.", "b.", "c.", "d."];
const STORAGE_KEY = "interstellar_v_leaderboard_v1";

function getHighestBadgeKey(stats) {
  let bestKey = "power";
  let bestVal = -1;
  for (const [k, v] of Object.entries(stats)) {
    if (v > bestVal) {
      bestVal = v;
      bestKey = k;
    }
  }
  return bestKey;
}

export function QuizModal({ t, onComplete, onPlaySfx }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // number | "timeout" | null
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizTimeBonus, setQuizTimeBonus] = useState(0);

  const questions = t.quiz.questions;
  const currentQ = questions[index];
  const isAnswered = selected !== null;
  const isCorrect = selected === currentQ.correct;

  // 30-second countdown timer per question
  useEffect(() => {
    if (isAnswered) return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSelected("timeout");
          onPlaySfx?.("alert");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [index, isAnswered, onPlaySfx]);

  const handleSelect = (optIdx) => {
    if (isAnswered) return;
    setSelected(optIdx);
    if (optIdx === currentQ.correct) {
      setCorrectCount((c) => c + 1);
      setQuizTimeBonus((b) => b + timeLeft);
      onPlaySfx?.("success");
    } else {
      onPlaySfx?.("click");
    }
  };

  const handleNext = () => {
    onPlaySfx?.("click");
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      onPlaySfx?.("victory");
      onComplete({
        correctCount,
        totalQuestions: questions.length,
        quizTimeBonus,
      });
    }
  };

  const pct = (timeLeft / 30) * 100;
  const isRed = timeLeft <= 5;
  const isAmber = timeLeft > 5 && timeLeft <= 10;

  const timerBadgeStyle = isRed
    ? "text-rose-400 border-rose-500/80 bg-rose-950/70 animate-pulse"
    : isAmber
    ? "text-amber-300 border-amber-400/80 bg-amber-950/70"
    : "text-cyan-300 border-cyan-400/40 bg-slate-800/90";

  const timerBarColor = isRed
    ? "bg-rose-500"
    : isAmber
    ? "bg-amber-400"
    : "bg-cyan-400";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto">
        {/* Header + 30s Countdown Readout */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            {t.quiz.questionLabel} {index + 1} / {questions.length}
          </span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs sm:text-sm font-extrabold ${timerBadgeStyle}`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* 30s Timer Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-300 ${timerBarColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
          {t.quiz.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">{t.quiz.subtitle}</p>

        {/* Explicitly Numbered Question (1., 2., 3., 4.) */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 mb-4">
          <p className="font-bold text-base sm:text-lg text-slate-100 leading-snug">
            <span className="text-cyan-300 font-extrabold mr-1.5">{index + 1}.</span>
            {currentQ.q}
          </p>
        </div>

        {/* Explicitly Lettered Options (a., b., c., d.) on Separate Rows */}
        <div className="flex flex-col gap-2.5 mb-5">
          {currentQ.options.map((opt, idx) => {
            let style =
              "bg-slate-800/85 hover:bg-slate-700/85 border-white/15 text-slate-100";
            if (isAnswered) {
              if (idx === currentQ.correct) {
                style = "bg-emerald-500/25 border-emerald-400 text-emerald-200";
              } else if (idx === selected) {
                style = "bg-rose-500/25 border-rose-400 text-rose-200";
              } else {
                style = "bg-slate-800/40 border-white/5 text-slate-400";
              }
            }
            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border font-semibold text-sm sm:text-base transition flex items-center justify-between gap-3 ${style}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-extrabold text-cyan-300 shrink-0">
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && idx === currentQ.correct && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className={`p-3.5 rounded-2xl border mb-4 text-xs sm:text-sm font-semibold ${
              selected === "timeout"
                ? "bg-rose-500/15 border-rose-400/40 text-rose-200"
                : isCorrect
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "bg-amber-500/15 border-amber-400/40 text-amber-200"
            }`}
          >
            {selected === "timeout"
              ? t.quiz.timeoutFeedback
              : isCorrect
              ? currentQ.feedbackCorrect
              : currentQ.feedbackWrong}
          </div>
        )}

        {isAnswered && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-display font-bold text-base shadow-lg transition"
          >
            {index + 1 < questions.length ? t.quiz.nextBtn : t.quiz.finishBtn} →
          </button>
        )}
      </div>
    </div>
  );
}

export function LeaderboardModal({
  t,
  stats,
  completedTasksCount,
  quizResults,
  taskTimeBonus,
  commanderName,
  onChangeCommanderName,
  onOpenCertificate,
  onPlayAgain,
  onPlaySfx,
}) {
  const [savedRuns, setSavedRuns] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [hasSaved, setHasSaved] = useState(false);

  // Calculate final score breakdown
  const resourceScore =
    (stats.power + stats.oxygen + stats.shielding + stats.food) * 5;
  const tasksScore = completedTasksCount * 150;
  const quizScore = (quizResults?.correctCount || 0) * 250;
  const speedBonus = ((taskTimeBonus || 0) + (quizResults?.quizTimeBonus || 0)) * 8;
  const totalScore = resourceScore + tasksScore + quizScore + speedBonus;

  const handleSaveScore = (e) => {
    e.preventDefault();
    if (hasSaved) return;
    onPlaySfx?.("success");
    const callsign = commanderName.trim() || t.certificate.defaultName;
    const newEntry = {
      id: Date.now(),
      name: callsign,
      score: totalScore,
      tasks: completedTasksCount,
      quiz: `${quizResults?.correctCount || 0}/${quizResults?.totalQuestions || 4}`,
      isPlayer: true,
    };
    const nextRuns = [newEntry, ...savedRuns].slice(0, 15);
    setSavedRuns(nextRuns);
    setHasSaved(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRuns));
    } catch {
      // Ignore storage quota errors
    }
  };

  const allEntries = useMemo(() => {
    const currentPreview = hasSaved
      ? []
      : [
          {
            id: "preview",
            name: commanderName.trim() || `${t.certificate.defaultName} (You)`,
            score: totalScore,
            tasks: completedTasksCount,
            quiz: `${quizResults?.correctCount || 0}/${quizResults?.totalQuestions || 4}`,
            isPlayer: true,
          },
        ];
    return [...DEFAULT_BENCHMARKS, ...savedRuns, ...currentPreview].sort(
      (a, b) => b.score - a.score
    );
  }, [savedRuns, hasSaved, commanderName, totalScore, completedTasksCount, quizResults, t]);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <DrFarahPortrait mood="happy" size="sm" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                <Trophy className="w-4 h-4" />
                <span>{t.leaderboard.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">{t.leaderboard.subtitle}</p>
            </div>
          </div>

          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-400/50 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
              {t.leaderboard.totalScoreLabel}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-white">
              {totalScore.toLocaleString()} <span className="text-xs text-amber-300">PTS</span>
            </div>
          </div>
        </div>

        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400">
              {t.leaderboard.breakdown.resources}
            </div>
            <div className="font-display text-lg font-bold text-cyan-300">+{resourceScore}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400">
              {t.leaderboard.breakdown.tasks} ({completedTasksCount}/6)
            </div>
            <div className="font-display text-lg font-bold text-emerald-300">+{tasksScore}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400">
              {t.leaderboard.breakdown.quiz} ({quizResults?.correctCount || 0}/4)
            </div>
            <div className="font-display text-lg font-bold text-amber-300">+{quizScore}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400">
              {t.leaderboard.breakdown.timeBonus}
            </div>
            <div className="font-display text-lg font-bold text-purple-300">+{speedBonus}</div>
          </div>
        </div>

        {/* Commander Callsign Input & Save to localStorage */}
        <form onSubmit={handleSaveScore} className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <input
            type="text"
            value={commanderName}
            onChange={(e) => onChangeCommanderName(e.target.value)}
            placeholder={t.leaderboard.namePlaceholder}
            maxLength={24}
            disabled={hasSaved}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-800 border border-cyan-400/40 focus:border-cyan-300 text-white font-bold text-sm outline-none"
          />
          <button
            type="submit"
            disabled={hasSaved}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              hasSaved
                ? "bg-emerald-500/25 border border-emerald-400/50 text-emerald-300"
                : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{hasSaved ? t.leaderboard.savedBadge : t.leaderboard.saveBtn}</span>
          </button>
        </form>

        {/* Leaderboard Table */}
        <div className="max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 mb-5">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">{t.leaderboard.rankCol}</th>
                <th className="py-2.5 px-3">{t.leaderboard.nameCol}</th>
                <th className="py-2.5 px-3 text-center">{t.leaderboard.tasksCol}</th>
                <th className="py-2.5 px-3 text-center">{t.leaderboard.quizCol}</th>
                <th className="py-2.5 px-3 text-right">{t.leaderboard.scoreCol}</th>
              </tr>
            </thead>
            <tbody>
              {allEntries.map((row, idx) => (
                <tr
                  key={row.id || row.name + idx}
                  className={`border-b border-white/5 ${
                    row.isPlayer
                      ? "bg-cyan-500/20 text-cyan-200 font-bold"
                      : "text-slate-200"
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold">
                    {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                  </td>
                  <td className="py-2.5 px-3">{row.name}</td>
                  <td className="py-2.5 px-3 text-center">{row.tasks}/6</td>
                  <td className="py-2.5 px-3 text-center">{row.quiz}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                    {row.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-400/50 text-amber-200 font-bold text-sm transition"
          >
            <Award className="w-4 h-4" />
            <span>{t.leaderboard.certificateBtn}</span>
          </button>

          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-display font-bold text-sm sm:text-base shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.leaderboard.playAgainBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CertificateModal({
  t,
  stats,
  commanderName,
  onChangeCommanderName,
  onBackToLeaderboard,
  onPlayAgain,
  onOpenNasa,
}) {
  const badgeKey = getHighestBadgeKey(stats);
  const badgeTitle = t.certificate.badges[badgeKey];
  const displayName = commanderName.trim() || t.certificate.defaultName;

  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 10;
    ctx.strokeRect(32, 32, 1136, 736);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 700);

    ctx.fillStyle = "#fdba74";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t.gameTitle.toUpperCase(), 600, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText(t.certificate.heading, 600, 190);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText(t.certificate.presentedTo, 600, 265);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(displayName, 600, 340);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "25px sans-serif";
    ctx.fillText(t.certificate.completedLine, 600, 410);

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`${t.certificate.badgeLabel}: ${badgeTitle}`, 600, 490);

    const statItems = [
      `${t.resources.power}: ${stats.power}%`,
      `${t.resources.oxygen}: ${stats.oxygen}%`,
      `${t.resources.shielding}: ${stats.shielding}%`,
      `${t.resources.food}: ${stats.food}%`,
    ];
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(statItems.join("   •   "), 600, 590);

    ctx.fillStyle = "#64748b";
    ctx.font = "18px sans-serif";
    ctx.fillText(
      "Certified by Dr. Farah • NASA Artemis / MOXIE / DONKI / OSDR",
      600,
      690
    );

    const link = document.createElement("a");
    link.download = `outpost-certificate-${displayName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl my-auto flex flex-col gap-4">
        <div
          id="printable-certificate"
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-4 border-amber-400/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Award className="w-4 h-4" />
            <span>{t.gameTitle}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            {t.certificate.heading}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mb-2">{t.certificate.presentedTo}</p>

          <input
            type="text"
            value={commanderName}
            onChange={(e) => onChangeCommanderName(e.target.value)}
            placeholder={t.certificate.namePlaceholder}
            maxLength={28}
            className="w-full max-w-sm mx-auto text-center font-display text-2xl sm:text-3xl font-bold text-cyan-300 bg-slate-800/70 border border-cyan-400/40 focus:border-cyan-300 rounded-2xl px-4 py-2 outline-none mb-3"
          />

          <p className="text-sm sm:text-base text-slate-200 mb-5">
            {t.certificate.completedLine}
          </p>

          <div className="inline-block px-5 py-2.5 rounded-2xl bg-amber-400/15 border border-amber-300/40 mb-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200/80">
              {t.certificate.badgeLabel}
            </div>
            <div className="font-display text-lg sm:text-xl font-bold text-amber-300">
              🏅 {badgeTitle}
            </div>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {t.certificate.finalStats}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: "power", icon: "⚡", color: "text-amber-300" },
              { key: "oxygen", icon: "🫁", color: "text-cyan-300" },
              { key: "shielding", icon: "🛡️", color: "text-indigo-300" },
              { key: "food", icon: "🌱", color: "text-emerald-300" },
            ].map((item) => (
              <div
                key={item.key}
                className="p-2.5 rounded-2xl bg-slate-800/70 border border-white/10"
              >
                <div className="text-xs text-slate-300 font-bold">
                  {item.icon} {t.resources[item.key]}
                </div>
                <div className={`font-display text-xl font-bold ${item.color}`}>
                  {stats[item.key]}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onBackToLeaderboard}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 font-bold text-sm shadow-lg transition"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{t.certificate.backToLeaderboard}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>{t.certificate.downloadBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-white font-bold text-sm shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t.certificate.printBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNasa}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-sky-400/30 text-sky-200 font-bold text-sm shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.nasaDataBtn}</span>
          </button>

          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.certificate.playAgainBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
