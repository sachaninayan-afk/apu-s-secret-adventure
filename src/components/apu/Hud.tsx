import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Sparkle } from "lucide-react";
import { isMuted, onMuteChange, toggleMute, sfx } from "@/lib/apu-audio";

export function Hud({ fragments, total = 5 }: { fragments: number; total?: number }) {
  const [muted, setM] = useState(isMuted());
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const off = onMuteChange(setM);
    return () => {
      off();
    };
  }, []);

  const secrets = [
    "psst… she has no idea this exists 🤫",
    "star #1 of ∞. keep clicking, weirdo.",
    "fun fact: this whole thing was built in secret.",
    "you weren't supposed to find this.",
  ];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[75] flex items-center justify-between gap-3 p-4 sm:p-5">
        <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3.5 py-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">frags</span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  scale: i < fragments ? [1, 1.6, 1] : 1,
                  opacity: i < fragments ? 1 : 0.25,
                }}
                transition={{ duration: 0.5 }}
                className="block size-1.5 rounded-full"
                style={{
                  background: i < fragments ? "var(--neon-cyan)" : "var(--muted-foreground)",
                  boxShadow: i < fragments ? "0 0 10px var(--neon-cyan)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            aria-label="Secret star"
            onClick={() => {
              sfx.pop();
              setSecret(secrets[Math.floor(Math.random() * secrets.length)]!);
              setTimeout(() => setSecret(null), 2600);
            }}
            className="glass grid size-9 place-items-center rounded-full text-[var(--neon-amber)] opacity-40 transition-opacity hover:opacity-100"
          >
            <Sparkle className="size-3.5" />
          </button>
          <button
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            onClick={() => {
              toggleMute();
              sfx.click();
            }}
            className="glass grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:text-[var(--neon-pink)]"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {secret && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass fixed top-16 right-4 z-[76] max-w-[70vw] rounded-2xl px-4 py-2.5 text-xs text-[var(--neon-amber)]"
          >
            {secret}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
