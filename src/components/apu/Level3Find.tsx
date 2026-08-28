import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stage, NeonButton, Particles } from "./Fx";
import { Photo } from "./Photo";
import { memories, heroPhoto } from "@/data/memories";
import { sfx } from "@/lib/apu-audio";

const FUNNY_REACTIONS = ["nope 💀", "wrong human", "not her", "close... no", "keep looking"];

export function Level3Find({ onComplete }: { onComplete: () => void }) {
  const [seconds, setSeconds] = useState(10);
  const [found, setFound] = useState(false);
  const [reveal, setReveal] = useState<{ id: string; x: number; y: number } | null>(null);
  const [reaction, setReaction] = useState<{ x: number; y: number; text: string } | null>(null);
  const [expired, setExpired] = useState(false);

  const tiles = useMemo(() => {
    const pool = memories.slice(0, 11).map((m) => ({ image: m.image, correct: false }));
    pool.push({ image: heroPhoto, correct: true });
    // shuffle + scatter positions
    const shuffled = pool
      .map((t) => ({ ...t, key: Math.random() }))
      .sort((a, b) => a.key - b.key)
      .map((t, i) => ({
        ...t,
        x: 8 + ((i * 37) % 84),
        y: 10 + ((i * 53) % 76),
        rot: -14 + Math.random() * 28,
      }));
    return shuffled;
  }, []);

  useEffect(() => {
    if (found || expired) return;
    if (seconds <= 0) {
      setExpired(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, found, expired]);

  const relatedPhotos = memories.slice(0, 8);

  return (
    <Stage className="bg-black">
      <Particles count={20} />
      {!found && (
        <div className="relative z-10 mb-6 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-cyan)] uppercase">
            Level 03
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight glow-text sm:text-4xl">
            FIND APU
          </h2>
          <p className="mt-2 font-mono text-sm text-[var(--neon-pink)]">
            {expired ? "time's up — try the real one" : `${seconds}s remaining`}
          </p>
        </div>
      )}

      {!found && (
        <div className="relative z-10 h-[52vh] w-full max-w-2xl sm:h-[58vh]">
          {tiles.map((t, idx) => (
            <motion.button
              key={idx}
              aria-label={t.correct ? "Apu" : "Not Apu"}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1, rotate: t.rot }}
              whileHover={{ scale: 1.08, zIndex: 5 }}
              transition={{ delay: idx * 0.03 }}
              className="glass absolute size-14 overflow-hidden rounded-lg sm:size-20"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              onClick={(e) => {
                if (t.correct) {
                  sfx.unlock();
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setReveal({
                    id: "hero",
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                  setTimeout(() => setFound(true), 900);
                } else {
                  sfx.funny();
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setReaction({
                    x: rect.left,
                    y: rect.top - 10,
                    text: FUNNY_REACTIONS[Math.floor(Math.random() * FUNNY_REACTIONS.length)]!,
                  });
                  setTimeout(() => setReaction(null), 700);
                }
              }}
            >
              <Photo src={t.image} className="size-full" />
            </motion.button>
          ))}

          <AnimatePresence>
            {reaction && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none fixed z-40 font-mono text-xs text-[var(--neon-amber)]"
                style={{ left: reaction.x, top: reaction.y }}
              >
                {reaction.text}
              </motion.div>
            )}
          </AnimatePresence>

          {reveal && (
            <motion.div
              initial={{ position: "fixed", left: reveal.x, top: reveal.y, scale: 0.3, opacity: 1 }}
              animate={{ scale: 6, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none fixed z-30 size-14 overflow-hidden rounded-lg sm:size-20"
              style={{ left: reveal.x, top: reveal.y, translateX: "-50%", translateY: "-50%" }}
            >
              <Photo src={heroPhoto} className="size-full" />
            </motion.div>
          )}

          {expired && (
            <div className="absolute inset-x-0 -bottom-2 z-10 flex justify-center">
              <NeonButton
                variant="pink"
                onClick={() => {
                  setExpired(false);
                  setSeconds(10);
                }}
              >
                Try again
              </NeonButton>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {found && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
          >
            <h3 className="mb-6 font-display text-2xl font-bold tracking-[0.2em] text-[var(--neon-cyan)] uppercase glow-text sm:text-4xl">
              found her
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {relatedPhotos.map((m, idx) => (
                <motion.div
                  key={m.image}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass overflow-hidden rounded-xl p-1 glow-ring"
                >
                  <Photo
                    src={m.image}
                    alt={m.caption}
                    className="aspect-square w-full rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              Memory fragment 03 unlocked.
            </p>
            <div className="mt-6">
              <NeonButton
                onClick={() => {
                  sfx.click();
                  onComplete();
                }}
              >
                Continue
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}
