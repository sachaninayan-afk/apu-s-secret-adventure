import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Heart, Lock } from "lucide-react";
import { Stage, Particles } from "./Fx";
import { sfx } from "@/lib/apu-audio";

export type DoorChoice = "chaos" | "memories" | "secret";

const DOORS: { id: DoorChoice; label: string; sub: string; icon: typeof Flame; color: string }[] = [
  {
    id: "chaos",
    label: "Chaos",
    sub: "funny & embarrassing",
    icon: Flame,
    color: "var(--neon-amber)",
  },
  {
    id: "memories",
    label: "Memories",
    sub: "beautiful moments",
    icon: Heart,
    color: "var(--neon-pink)",
  },
  { id: "secret", label: "Secret", sub: "???", icon: Lock, color: "var(--neon-violet)" },
];

export function Level5Doors({ onChoose }: { onChoose: (d: DoorChoice) => void }) {
  const [opening, setOpening] = useState<DoorChoice | null>(null);

  const choose = (d: DoorChoice) => {
    if (opening) return;
    sfx.whoosh();
    setOpening(d);
    setTimeout(() => onChoose(d), 950);
  };

  return (
    <Stage className="bg-[image:var(--gradient-void)]">
      <Particles count={26} />
      <div className="relative z-10 mb-10 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-cyan)] uppercase">
          Level 05
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight glow-text sm:text-4xl">
          Choose a Door
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          pick one. any one. there is no wrong choice.
        </p>
      </div>

      <div className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {DOORS.map((d) => {
          const Icon = d.icon;
          const isOpening = opening === d.id;
          const isOther = opening && opening !== d.id;
          return (
            <motion.button
              key={d.id}
              aria-label={`Door: ${d.label}`}
              onClick={() => choose(d.id)}
              animate={isOther ? { opacity: 0.15, scale: 0.94 } : { opacity: 1, scale: 1 }}
              whileHover={opening ? { scale: 1 } : { scale: 1.03, y: -4 }}
              className="glass relative flex h-64 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl p-6"
              style={{ boxShadow: isOpening ? `0 0 60px ${d.color}` : undefined }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2 origin-left bg-[image:var(--gradient-void)]"
                style={{ borderRight: `1px solid ${d.color}` }}
                animate={isOpening ? { rotateY: -110 } : { rotateY: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2 origin-right bg-[image:var(--gradient-void)]"
                style={{ borderLeft: `1px solid ${d.color}` }}
                animate={isOpening ? { rotateY: 110 } : { rotateY: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <Icon className="size-9" style={{ color: d.color }} />
                <span className="font-display text-xl font-bold uppercase tracking-wide">
                  {d.label}
                </span>
                <span className="text-xs text-muted-foreground">{d.sub}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black"
          />
        )}
      </AnimatePresence>
    </Stage>
  );
}
