import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { Stage, Particles, NeonButton } from "./Fx";
import { Photo } from "./Photo";
import { memories, quizQuestions } from "@/data/memories";
import { sfx } from "@/lib/apu-audio";

export function Level2Quiz({ onComplete }: { onComplete: () => void }) {
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [justAnswered, setJustAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const q = quizQuestions[i];
  const revealPhotos = memories.filter((m) => m.category === "memories").slice(0, 4);

  const submit = () => {
    if (!value.trim()) {
      sfx.deny();
      setShake(true);
      setTimeout(() => setShake(false), 400);
      // playful vibration
      if ("vibrate" in navigator) navigator.vibrate?.(60);
      return;
    }
    sfx.success();
    setJustAnswered(true);
    setTimeout(() => {
      setJustAnswered(false);
      setValue("");
      if (i + 1 < quizQuestions.length) {
        setI((v) => v + 1);
      } else {
        setDone(true);
      }
    }, 950);
  };

  return (
    <Stage className="bg-[image:var(--gradient-void)]">
      <Particles count={30} />
      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-cyan)] uppercase">
          Level 02
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight glow-text sm:text-4xl">
          Friendship Quiz
        </h2>

        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
              className="mt-10"
            >
              <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Question {i + 1} / {quizQuestions.length}
              </p>
              <p className="mb-6 text-lg text-foreground sm:text-xl">{q?.q}</p>

              <AnimatePresence mode="wait">
                {!justAnswered ? (
                  <motion.div
                    key="input"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={shake ? "shake" : ""}
                  >
                    <input
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      placeholder={q?.hint}
                      className="glass w-full rounded-2xl px-5 py-3.5 text-center text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:glow-ring"
                    />
                    <div className="mt-6">
                      <NeonButton onClick={submit}>Lock it in</NeonButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto grid size-16 place-items-center rounded-full"
                    style={{
                      background: "var(--gradient-neon)",
                      boxShadow: "var(--shadow-glow-pink)",
                    }}
                  >
                    <Check className="size-8 text-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            <p className="mb-6 text-sm text-muted-foreground">
              Every answer was correct. Obviously.
            </p>
            <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
              {revealPhotos.map((m, idx) => (
                <motion.div
                  key={m.image}
                  initial={{ opacity: 0, y: 24, rotate: idx % 2 ? 4 : -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            <div className="mt-8">
              <NeonButton
                onClick={() => {
                  sfx.unlock();
                  onComplete();
                }}
              >
                Continue
              </NeonButton>
            </div>
          </motion.div>
        )}
      </div>
    </Stage>
  );
}
