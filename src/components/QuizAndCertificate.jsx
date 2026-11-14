import React, { useState } from "react";
import { Award, CheckCircle2, Download, Printer, RotateCcw, Sparkles } from "lucide-react";

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
  const [selected, setSelected] = useState(null);

  const questions = t.quiz.questions;
  const currentQ = questions[index];
  const isAnswered = selected !== null;
  const isCorrect = selected === currentQ.correct;

  const handleSelect = (optIdx) => {
    if (isAnswered) return;
    setSelected(optIdx);
    if (optIdx === currentQ.correct) {
      onPlaySfx("success");
    } else {
      onPlaySfx("click");
    }
  };

  const handleNext = () => {
    onPlaySfx("click");
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      onPlaySfx("victory");
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-400/35 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            {t.quiz.questionLabel} {index + 1} / {questions.length}
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold text-white mb-1">{t.quiz.title}</h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-5">{t.quiz.subtitle}</p>

        <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 mb-4">
          <p className="font-bold text-base sm:text-lg text-slate-100">{currentQ.q}</p>
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          {currentQ.options.map((opt, idx) => {
            let style =
              "bg-slate-800/80 hover:bg-slate-700/80 border-white/15 text-slate-100";
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
                className={`text-left p-3.5 rounded-2xl border font-semibold text-sm sm:text-base transition flex items-center justify-between gap-2 ${style}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correct && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className={`p-3.5 rounded-2xl border mb-5 text-sm font-semibold ${
              isCorrect
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "bg-amber-500/15 border-amber-400/40 text-amber-200"
            }`}
          >
            {isCorrect ? currentQ.feedbackCorrect : currentQ.feedbackWrong}
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

export function CertificateModal({ t, stats, onPlayAgain, onOpenNasa }) {
  const [cadetName, setCadetName] = useState("");
  const badgeKey = getHighestBadgeKey(stats);
  const badgeTitle = t.certificate.badges[badgeKey];
  const displayName = cadetName.trim() || t.certificate.defaultName;

  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 10;
    ctx.strokeRect(32, 32, 1136, 736);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 700);

    // Header
    ctx.fillStyle = "#fdba74";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t.gameTitle.toUpperCase(), 600, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(t.certificate.heading, 600, 190);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText(t.certificate.presentedTo, 600, 265);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(displayName, 600, 340);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "26px sans-serif";
    ctx.fillText(t.certificate.completedLine, 600, 410);

    // Badge
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`${t.certificate.badgeLabel}: ${badgeTitle}`, 600, 490);

    // Stats Row
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
    ctx.fillText("NASA Perseverance (MOXIE & MEDA) • NASA DONKI • NASA OSDR", 600, 690);

    const link = document.createElement("a");
    link.download = `jezero6-certificate-${displayName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl my-auto flex flex-col gap-4">
        {/* Printable Certificate Card */}
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
            value={cadetName}
            onChange={(e) => setCadetName(e.target.value)}
            placeholder={t.certificate.namePlaceholder}
            maxLength={28}
            className="w-full max-w-sm mx-auto text-center font-display text-2xl sm:text-3xl font-bold text-cyan-300 bg-slate-800/70 border border-cyan-400/40 focus:border-cyan-300 rounded-2xl px-4 py-2 outline-none mb-3"
          />

          <p className="text-sm sm:text-base text-slate-200 mb-5">
            {t.certificate.completedLine}
          </p>

          {/* Highest Stat Specialty Badge */}
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-amber-400/15 border border-amber-300/40 mb-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200/80">
              {t.certificate.badgeLabel}
            </div>
            <div className="font-display text-lg sm:text-xl font-bold text-amber-300">
              🏅 {badgeTitle}
            </div>
          </div>

          {/* Final 4 Resource Percentages */}
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

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
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
