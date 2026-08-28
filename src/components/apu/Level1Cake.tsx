import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cake } from "lucide-react";
import { Stage, Particles, Burst, NeonButton } from "./Fx";
import { Photo } from "./Photo";
import { heroPhoto } from "@/data/memories";
import { sfx } from "@/lib/apu-audio";

export function Level1Cake({ onComplete }: { onComplete: () => void }) {
  const [pos, setPos] = useState({ x: 50, y: 55 });
  const [misses, setMisses] = useState(0);
  const [caught, setCaught] = useState(false);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const speed = Math.max(520, 1500 - misses * 130);

  useEffect(() => {
    if (caught) return;
    const t = setInterval(() => {
      setPos({ x: 12 + Math.random() * 76, y: 22 + Math.random() * 58 });
    }, speed);
    return () => clearInterval(t);
  }, [speed, caught]);

  const catchIt = (e: React.MouseEvent | React.TouchEvent) => {
    if (caught) return;
    const point = "touches" in e ? e.changedTouches[0] : (e as React.MouseEvent);
    setBurst({ x: point?.clientX ?? window.innerWidth / 2, y: point?.clientY ?? window.innerHeight / 2 });
    setCaught(true);
    setShake(true);
    sfx.boom();
    setTimeout(() => setShake(false), 700);
  };

  return (
    <Stage className={shake ? "shake bg-[image:var(--gradient-void)]" : "bg-[image:var(--gradient-void)]"}>
      <Particles count={34} />
      <div ref={wrap} className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-cyan)] uppercase">Level 01</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight glow-text sm:text-5xl">
          CATCH THE BIRTHDAY
        </h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {caught
            ? "Reflexes: unreasonably good."
            : misses === 0
              ? "Catch it before it disappears."
              : `it's getting faster. failed attempts: ${misses}`}
        </p>
      </div>

      {!caught && (
        <motion.button
          aria-label="Catch the birthday cake"
          onClick={catchIt}
          animate={{ left: `${pos.x}%`, top: `${pos.y}%`, rotate: [0, 8, -8, 0] }}
          transition={{ left: { duration: 0.45 }, top: { duration: 0.45 }, rotate: { duration: 1.4, repeat: Infinity } }}
          className="absolute z-20 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full sm:size-20"
          style={{
            background: "radial-gradient(circle, color-mix(in oklch, var(--neon-pink) 45%, transparent), transparent 70%)",
            boxShadow: "var(--shadow-glow-pink)",
          }}
        >
          <Cake className="size-8 text-[var(--neon-pink)] sm:size-10" />
        </motion.button>
      )}

      {!caught && (
        <button
          aria-label="Missed"
          className="absolute inset-0 z-10"
          onClick={() => {
            sfx.funny();
            setMisses((m) => m + 1);
            setPos({ x: 12 + Math.random() * 76, y: 22 + Math.random() * 58 });
          }}
        />
      )}

      {burst && <Burst x={burst.x} y={burst.y} count={48} />}

      <AnimatePresence>
        {caught && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 mt-10 flex flex-col items-center gap-6"
          >
            <motion.h3
              animate={{ opacity: [0.4, 1, 0.7, 1] }}
              transition={{ duration: 0.8 }}
              className="font-display text-2xl font-bold tracking-[0.25em] text-[var(--neon-cyan)] uppercase glow-text sm:text-4xl"
            >
              Access Granted
            </motion.h3>
            <motion.div
              initial={{ clipPath: "inset(50% 0 50% 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass overflow-hidden rounded-3xl p-2 glow-ring"
            >
              <Photo src={heroPhoto} eager className="h-56 w-44 rounded-2xl sm:h-72 sm:w-56" />
            </motion.div>
            <NeonButton
              onClick={() => {
                sfx.click();
                onComplete();
              }}
            >
              Continue
            </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}
