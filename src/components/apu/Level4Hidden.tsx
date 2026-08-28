import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stage, NeonButton } from "./Fx";
import { Photo } from "./Photo";
import { hiddenMemories } from "@/data/memories";
import { sfx } from "@/lib/apu-audio";

export function Level4Hidden({ onComplete }: { onComplete: () => void }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [found, setFound] = useState<Set<number>>(new Set());
  const wrap = useRef<HTMLDivElement>(null);
  const foundRef = useRef(found);
  foundRef.current = found;

  const update = useCallback((clientX: number, clientY: number) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });

    hiddenMemories.forEach((h, i) => {
      if (foundRef.current.has(i)) return;
      const d = Math.hypot(h.x - x, h.y - y);
      if (d < 9) {
        sfx.pop();
        setFound((prev) => new Set(prev).add(i));
      }
    });
  }, []);

  const allFound = found.size >= hiddenMemories.length;

  return (
    <Stage className="!p-0 bg-black">
      <div
        ref={wrap}
        className="relative h-[100dvh] w-full touch-none select-none"
        onPointerMove={(e) => update(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) update(t.clientX, t.clientY);
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-8 z-20 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--neon-cyan)] uppercase">
            Level 04
          </p>
          <h2 className="mt-3 px-4 font-display text-xl font-bold tracking-tight text-foreground/90 sm:text-3xl">
            Some memories don&apos;t want to be found.
          </h2>
          <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {found.size} / {hiddenMemories.length} discovered — move to search
          </p>
        </div>

        {/* hidden layer, only visible through the spotlight mask */}
        <div className="absolute inset-0">
          {hiddenMemories.map((h, i) => (
            <div
              key={i}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <div className="glass size-16 overflow-hidden rounded-xl p-0.5 sm:size-24">
                <Photo src={h.image} className="size-full rounded-lg" />
              </div>
              <span className="glass max-w-[9rem] rounded-full px-3 py-1 text-center text-[10px] text-[var(--neon-amber)]">
                {h.text}
              </span>
            </div>
          ))}
        </div>

        {/* darkness with a spotlight cutout following the pointer */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle 130px at ${pos.x}% ${pos.y}%, transparent 0%, transparent 55%, rgba(6,6,10,0.985) 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle 130px at ${pos.x}% ${pos.y}%, transparent 60%, black 100%)`,
            mixBlendMode: "multiply",
          }}
        />

        {/* discovery pop-ins */}
        <AnimatePresence>
          {[...found].map((i) => {
            const h = hiddenMemories[i];
            if (!h) return null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-none absolute z-15 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: 90,
                  height: 90,
                  boxShadow: "0 0 60px 20px var(--neon-cyan)",
                }}
              />
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {allFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/70 px-5 text-center backdrop-blur-sm"
            >
              <h3 className="font-display text-2xl font-bold tracking-[0.2em] text-[var(--neon-cyan)] uppercase glow-text sm:text-4xl">
                Memory Fragment 04 Unlocked
              </h3>
              <NeonButton
                onClick={() => {
                  sfx.unlock();
                  onComplete();
                }}
              >
                Continue
              </NeonButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
}
