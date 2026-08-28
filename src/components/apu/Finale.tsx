import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { Stage, NeonButton, Burst } from "./Fx";
import { Photo } from "./Photo";
import { heroPhoto } from "@/data/memories";
import { sfx, startMusic, stopMusic } from "@/lib/apu-audio";

type Phase = "countdown" | "explosion" | "reveal" | "next";

export function Finale() {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [n, setN] = useState(3);
  const [bursts, setBursts] = useState<{ x: number; y: number }[]>([]);
  const [loved, setLoved] = useState(false);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (n <= 0) {
      sfx.boom();
      setPhase("explosion");
      setBursts(
        Array.from({ length: 8 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.7,
        })),
      );
      const t = setTimeout(() => {
        stopMusic();
        startMusic("party");
        setPhase("reveal");
      }, 1100);
      return () => clearTimeout(t);
    }
    sfx.pop();
    const t = setTimeout(() => setN((v) => v - 1), 750);
    return () => clearTimeout(t);
  }, [n, phase]);

  return (
    <Stage className="bg-black">
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key={n}
            initial={{ opacity: 0, scale: 1.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 font-display text-8xl font-bold text-[var(--neon-pink)] glow-text sm:text-9xl"
          >
            {n}
          </motion.div>
        )}

        {phase === "explosion" && (
          <motion.div
            key="boom"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 bg-white"
          >
            {bursts.map((b, i) => (
              <Burst key={i} x={b.x} y={b.y} count={60} />
            ))}
          </motion.div>
        )}

        {(phase === "reveal" || phase === "next") && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center"
          >
            <FloatingHearts />
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-bold tracking-tight glow-text sm:text-6xl"
            >
              🎂 HAPPY BIRTHDAY, APU ❤️
            </motion.h1>
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base"
            >
              Another year of being chaotic, lovable, impossible, hilarious, and completely
              irreplaceable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="glass mt-8 overflow-hidden rounded-3xl p-2 glow-ring"
            >
              <Photo
                src={heroPhoto}
                eager
                onDoubleClick={() => {
                  sfx.pop();
                  setLoved(true);
                  setTimeout(() => setLoved(false), 900);
                }}
                className="h-64 w-52 rounded-2xl sm:h-80 sm:w-64"
              />
            </motion.div>
            <AnimatePresence>
              {loved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.4, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute"
                  style={{ top: "45%" }}
                >
                  <Heart className="size-10 fill-[var(--neon-pink)] text-[var(--neon-pink)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "reveal" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-9"
              >
                <NeonButton
                  variant="pink"
                  onClick={() => {
                    sfx.unlock();
                    setBursts(
                      Array.from({ length: 4 }, () => ({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight * 0.6,
                      })),
                    );
                    setPhase("next");
                  }}
                >
                  [ Enter the Next Year ]
                </NeonButton>
              </motion.div>
            )}

            {phase === "next" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-9">
                {bursts.map((b, i) => (
                  <Burst key={`n${i}`} x={b.x} y={b.y} count={40} />
                ))}
                <p className="font-mono text-xs tracking-[0.3em] text-[var(--neon-cyan)] uppercase">
                  more memories loading... ❤️
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}

function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 14 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 4,
      dur: 6 + Math.random() * 5,
      s: 10 + Math.random() * 14,
    })),
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{ left: `${h.x}%` }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: -520, opacity: [0, 0.8, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
        >
          <Heart
            style={{ width: h.s, height: h.s }}
            className="fill-[var(--neon-pink)] text-[var(--neon-pink)] opacity-70"
          />
        </motion.div>
      ))}
    </div>
  );
}
