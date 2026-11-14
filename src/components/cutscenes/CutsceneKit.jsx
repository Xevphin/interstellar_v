import React, { useCallback, useEffect, useRef, useState } from "react";
import { SkipForward } from "lucide-react";

// Drives a cutscene timeline from a shared start time. 3D scenes read
// `startRef` inside useFrame; the DOM overlay re-renders from `elapsed`.
export function useCutsceneTimeline(duration, onComplete) {
  const startRef = useRef(performance.now());
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let raf;
    const tick = () => {
      const e = (performance.now() - startRef.current) / 1000;
      setElapsed(e);
      if (e >= duration) {
        if (!doneRef.current) {
          doneRef.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current?.();
  }, []);

  return { elapsed, startRef, skip };
}

export const elapsedFrom = (startRef) => (performance.now() - startRef.current) / 1000;

// Linear ramp helper: 0 before a, 1 after b.
export const ramp = (e, a, b) => Math.min(1, Math.max(0, (e - a) / (b - a)));

export function CutsceneOverlay({ fade = 0, countdown, caption, onSkip, skipLabel }) {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none">
      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-[8vh] bg-black" />
      <div className="absolute bottom-0 inset-x-0 h-[8vh] bg-black" />

      {countdown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            key={countdown}
            className="font-display font-bold text-white text-8xl sm:text-[10rem] tracking-wider drop-shadow-[0_0_40px_rgba(251,146,60,0.85)] animate-pop"
          >
            {countdown}
          </span>
        </div>
      )}

      {caption && (
        <div className="absolute bottom-[11vh] inset-x-0 flex justify-center px-4">
          <div
            key={caption}
            className="px-5 py-2.5 rounded-2xl bg-slate-950/70 border border-white/15 backdrop-blur-md text-sm sm:text-lg font-bold text-sky-100 shadow-xl animate-fade-in"
          >
            {caption}
          </div>
        </div>
      )}

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="pointer-events-auto absolute top-[10vh] right-4 sm:right-6 flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/70 hover:bg-slate-800 border border-white/20 text-xs sm:text-sm font-bold text-slate-100 backdrop-blur-md transition"
        >
          <SkipForward className="w-4 h-4" />
          <span>{skipLabel}</span>
        </button>
      )}

      {/* Fade-to-black transitions */}
      <div className="absolute inset-0 bg-black" style={{ opacity: fade }} />
    </div>
  );
}
