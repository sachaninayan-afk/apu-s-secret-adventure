import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Heart } from "lucide-react";
import { Stage, NeonButton, Particles, Typewriter } from "./Fx";
import { Photo } from "./Photo";
import { memories, finalVideo, finalMessage } from "@/data/memories";
import { sfx, startMusic } from "@/lib/apu-audio";

type Phase = "locked" | "holding" | "matched" | "opened";

export function FinalUnlock({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [progress, setProgress] = useState(0);
  const holdRaf = useRef<number | null>(null);
  const holdStart = useRef(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  const HOLD_MS = 1700;

  const startHold = () => {
    if (phase !== "locked") return;
    setPhase("holding");
    holdStart.current = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - holdStart.current) / HOLD_MS);
      setProgress(p);
      if (p >= 1) {
        sfx.unlock();
        setPhase("matched");
        return;
      }
      holdRaf.current = requestAnimationFrame(tick);
    };
    holdRaf.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (phase !== "holding") return;
    if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
    setProgress(0);
    setPhase("locked");
  };

  useEffect(
    () => () => {
      if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
    },
    [],
  );

  useEffect(() => {
    if (phase === "opened") {
      startMusic("warm");
      const t = setInterval(() => {
        setMsgIndex((v) => (v + 1 < finalMessage.length ? v + 1 : v));
      }, 1300);
      return () => clearInterval(t);
    }
    return;
  }, [phase]);

  const revealPhotos = memories.slice(0, 6);

  return (
    <Stage className="bg-black">
      <Particles count={22} />
      <AnimatePresence mode="wait">
        {phase !== "opened" ? (
          <motion.div
            key="lock"
            exit={{ opacity: 0, filter: "blur(12px)" }}
            className="relative z-10 w-full max-w-lg text-center"
          >
            <p className="font-mono text-xs tracking-[0.35em] text-[var(--neon-cyan)] uppercase">
              <Typewriter text="ALL MEMORY FRAGMENTS RECOVERED." speed={22} />
            </p>
            <p className="mt-3 font-mono text-xs tracking-[0.35em] text-[var(--neon-pink)] uppercase">
              one final file remains locked
            </p>
            <h2 className="mt-6 font-display text-xl font-bold tracking-wide text-foreground/90 sm:text-2xl">
              FINAL_MESSAGE.mp4
            </h2>

            <div className="mt-12 flex flex-col items-center gap-5">
              <button
                aria-label="Hold to unlock"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className="glass relative grid size-32 place-items-center rounded-full select-none"
                style={{
                  boxShadow: phase === "matched" ? "var(--shadow-glow-pink)" : "var(--shadow-glow)",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 size-full -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--neon-cyan)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - (phase === "matched" ? 1 : progress))}
                    style={{ filter: "drop-shadow(0 0 6px var(--neon-cyan))" }}
                  />
                </svg>
                <Mic
                  className={`size-10 ${phase === "matched" ? "text-[var(--neon-pink)]" : "text-[var(--neon-cyan)]"}`}
                />
              </button>

              <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                {phase === "matched"
                  ? "apu detected"
                  : phase === "holding"
                    ? "voice matching..."
                    : "hold to unlock"}
              </p>
            </div>

            <AnimatePresence>
              {phase === "matched" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <NeonButton
                    variant="pink"
                    onClick={() => {
                      sfx.boom();
                      setPhase("opened");
                    }}
                  >
                    [ Open My Heart ❤️ ]
                  </NeonButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl text-center"
          >
            {!videoFailed && (
              <div className="glass mx-auto mb-8 max-w-sm overflow-hidden rounded-2xl">
                <video
                  src={finalVideo}
                  controls
                  playsInline
                  onError={() => setVideoFailed(true)}
                  className="aspect-video w-full bg-black"
                />
              </div>
            )}

            <div className="mb-8 flex flex-wrap justify-center gap-2.5">
              {revealPhotos.map((m, i) => (
                <motion.div
                  key={m.image}
                  initial={{ opacity: 0, scale: 0.5, rotate: i % 2 ? 6 : -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="glass size-20 overflow-hidden rounded-xl p-1 glow-ring sm:size-24"
                >
                  <Photo src={m.image} alt={m.caption} className="size-full rounded-lg" />
                </motion.div>
              ))}
            </div>

            <div className="space-y-2.5">
              {finalMessage.slice(0, msgIndex + 1).map((l, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-base text-foreground/90 italic sm:text-lg"
                >
                  {l}
                </motion.p>
              ))}
            </div>

            {msgIndex >= finalMessage.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10"
              >
                <NeonButton
                  variant="pink"
                  onClick={() => {
                    sfx.click();
                    onComplete();
                  }}
                >
                  <Heart className="mr-2 inline size-3.5" />
                  Continue
                </NeonButton>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}
