import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stage, Typewriter, NeonButton, Particles } from "./Fx";
import { sfx } from "@/lib/apu-audio";

const LINES = [
  "> INITIALIZING...",
  "> SEARCHING MEMORY DATABASE...",
  "> SCANNING SUBJECT...",
  "> SUBJECT FOUND: APU",
];

export function Intro({ onStart }: { onStart: () => void }) {
  const [step, setStep] = useState(0);
  const [denied, setDenied] = useState(false);

  const next = useCallback(() => setStep((s) => s + 1), []);

  useEffect(() => {
    if (step === LINES.length) {
      const t = setTimeout(() => {
        sfx.glitch();
        setDenied(true);
      }, 500);
      return () => clearTimeout(t);
    }
    return;
  }, [step]);

  useEffect(() => {
    if (!denied) return;
    const t = setInterval(() => sfx.glitch(), 2400);
    return () => clearInterval(t);
  }, [denied]);

  return (
    <Stage className="bg-black">
      <Particles count={26} />
      <div className="relative z-10 w-full max-w-xl font-mono text-sm sm:text-base">
        {LINES.slice(0, step).map((l) => (
          <p key={l} className="text-[var(--neon-cyan)]/80">
            {l}
          </p>
        ))}
        {step < LINES.length && (
          <p className="text-[var(--neon-cyan)]">
            <Typewriter text={LINES[step]!} onDone={() => setTimeout(next, 380)} onChar={sfx.type} />
          </p>
        )}

        <AnimatePresence>
          {denied && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 space-y-5"
            >
              <motion.h1
                animate={{ x: [0, -3, 3, -2, 0], opacity: [1, 0.6, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.8 }}
                className="font-display text-3xl font-bold tracking-[0.2em] text-destructive uppercase sm:text-5xl"
                style={{ textShadow: "0 0 24px color-mix(in oklch, var(--destructive) 60%, transparent)" }}
              >
                Access Denied
              </motion.h1>
              <p className="max-w-md text-sm text-muted-foreground">
                “You are not authorized to access Apu&apos;s memories.”
              </p>
              <NeonButton
                onClick={() => {
                  sfx.unlock();
                  onStart();
                }}
              >
                [ Prove you are Apu ]
              </NeonButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
}
