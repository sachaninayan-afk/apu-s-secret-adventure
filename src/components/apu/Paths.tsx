import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stage, NeonButton, Particles, Typewriter } from "./Fx";
import { Photo } from "./Photo";
import { memories, chaosCaptions, finalMessage } from "@/data/memories";
import { sfx, startMusic } from "@/lib/apu-audio";

/* ------------------------------------------------------------------ */
/* CHAOS PATH                                                          */
/* ------------------------------------------------------------------ */
export function PathChaos({ onComplete }: { onComplete: () => void }) {
  const photos = memories.filter((m) => m.category === "chaos");
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitching(true);
      sfx.glitch();
      setTimeout(() => setGlitching(false), 180);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <Stage className="bg-black">
      <Particles count={20} />
      <div className={`relative z-10 w-full max-w-3xl text-center ${glitching ? "glitch" : ""}`}>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-2xl font-bold tracking-[0.15em] text-destructive uppercase glow-text sm:text-4xl"
        >
          {chaosCaptions[0]}
        </motion.h2>
        <p className="mt-4 font-mono text-xs tracking-[0.3em] text-[var(--neon-amber)] uppercase">
          system warning: too much sass detected
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((m, i) => (
            <motion.div
              key={m.image}
              initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
              animate={{ opacity: 1, rotate: i % 2 ? 6 : -6, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.06 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 160 }}
              className="glass overflow-hidden rounded-xl p-1"
            >
              <Photo src={m.image} alt={m.caption} className="aspect-square w-full rounded-lg" />
              <p className="px-1 py-1.5 text-[10px] text-muted-foreground">{m.caption}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 space-y-1 font-mono text-[11px] text-muted-foreground/70">
          {chaosCaptions.slice(1).map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>

        <div className="mt-8">
          <NeonButton
            variant="pink"
            onClick={() => {
              sfx.click();
              onComplete();
            }}
          >
            Continue
          </NeonButton>
        </div>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* MEMORIES PATH                                                       */
/* ------------------------------------------------------------------ */
export function PathMemories({ onComplete }: { onComplete: () => void }) {
  const photos = memories.filter((m) => m.category === "memories");

  return (
    <Stage className="bg-[image:var(--gradient-warm)]">
      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-amber)] uppercase">
          a softer room
        </p>
        <h2 className="mt-3 font-serif text-3xl italic text-foreground sm:text-5xl">
          every good year, together.
        </h2>

        <div className="mt-10 space-y-6">
          {photos.map((m, i) => (
            <motion.div
              key={m.image}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl p-4"
            >
              <Photo
                src={m.image}
                alt={m.caption}
                className="max-h-72 w-full rounded-2xl object-cover"
              />
              <p className="font-serif text-lg text-foreground/90 italic">{m.caption}</p>
              {m.date && (
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                  {m.date}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <NeonButton
            onClick={() => {
              sfx.click();
              onComplete();
            }}
          >
            Continue
          </NeonButton>
        </div>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* SECRET PATH                                                         */
/* ------------------------------------------------------------------ */
const SECRET_LINES = ["Okay... enough jokes.", "There is something I actually wanted to tell you."];

export function PathSecret({ onComplete }: { onComplete: () => void }) {
  const [line, setLine] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    startMusic("warm");
  }, []);

  return (
    <Stage className="bg-black">
      <div className="relative z-10 w-full max-w-lg text-center">
        {!showMessage ? (
          <div className="space-y-6 font-serif text-xl text-foreground/90 italic sm:text-2xl">
            {SECRET_LINES.slice(0, line + 1).map((l, i) =>
              i === line ? (
                <p key={l}>
                  <Typewriter
                    text={l}
                    speed={45}
                    onDone={() =>
                      setTimeout(() => {
                        if (line + 1 < SECRET_LINES.length) setLine((v) => v + 1);
                        else setShowMessage(true);
                      }, 900)
                    }
                  />
                </p>
              ) : (
                <p key={l} className="opacity-60">
                  {l}
                </p>
              ),
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
          >
            <p className="mb-8 font-mono text-xs tracking-[0.4em] text-[var(--neon-pink)] uppercase">
              a message for you
            </p>
            <div className="space-y-3">
              {finalMessage.slice(0, 4).map((l, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.5, duration: 0.7 }}
                  className="font-serif text-base text-foreground/90 italic sm:text-lg"
                >
                  {l}
                </motion.p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + finalMessage.slice(0, 4).length * 0.5 + 0.6 }}
              className="mt-10"
            >
              <NeonButton
                variant="pink"
                onClick={() => {
                  sfx.click();
                  onComplete();
                }}
              >
                Continue
              </NeonButton>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Stage>
  );
}
