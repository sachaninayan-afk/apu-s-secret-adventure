import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Custom cursor + particle trail (desktop only)                       */
/* ------------------------------------------------------------------ */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let x = rx;
    let y = ry;
    let raf = 0;
    let last = 0;

    const trail = (px: number, py: number) => {
      const el = document.createElement("span");
      el.className = "pointer-events-none fixed z-[95] size-1.5 rounded-full";
      el.style.left = `${px}px`;
      el.style.top = `${py}px`;
      el.style.background = "var(--neon-pink)";
      el.style.filter = "blur(1px)";
      el.style.transition = "opacity .6s linear, transform .6s ease-out";
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.opacity = "0";
        el.style.transform = `translate(${(Math.random() - 0.5) * 26}px, ${20 + Math.random() * 20}px) scale(0.2)`;
      });
      setTimeout(() => el.remove(), 700);
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const now = performance.now();
      if (now - last > 55) {
        last = now;
        trail(x, y);
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -ml-1 -mt-1 size-2 rounded-full bg-[var(--neon-cyan)] mix-blend-screen"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] -ml-5 -mt-5 size-10 rounded-full border border-[var(--neon-violet)] opacity-70 mix-blend-screen"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient drifting particles                                          */
/* ------------------------------------------------------------------ */
export function Particles({ count = 40, className }: { count?: number; className?: string }) {
  const [seeds] = useState(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 1 + Math.random() * 2.5,
      d: 8 + Math.random() * 16,
      delay: Math.random() * -20,
      hue: Math.random(),
    })),
  );

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {seeds.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: p.hue > 0.6 ? "var(--neon-cyan)" : p.hue > 0.3 ? "var(--neon-pink)" : "var(--neon-violet)",
            boxShadow: "0 0 10px currentColor",
          }}
          animate={{ y: [0, -60, 0], opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Burst — one-shot particle explosion at a point                      */
/* ------------------------------------------------------------------ */
export function Burst({ x, y, colorful = true, count = 34 }: { x: number; y: number; colorful?: boolean; count?: number }) {
  const [bits] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      a: (i / count) * Math.PI * 2 + Math.random(),
      r: 80 + Math.random() * 220,
      s: 3 + Math.random() * 7,
      c: colorful
        ? ["var(--neon-pink)", "var(--neon-cyan)", "var(--neon-violet)", "var(--neon-amber)"][i % 4]
        : "var(--neon-cyan)",
    })),
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: x, top: y, width: b.s, height: b.s, background: b.c, boxShadow: `0 0 14px ${b.c}` }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(b.a) * b.r,
            y: Math.sin(b.a) * b.r + 60,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 1 + Math.random() * 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fragment unlocked banner                                            */
/* ------------------------------------------------------------------ */
export function FragmentBanner({ n, show }: { n: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4"
        >
          <div className="glass rounded-full px-6 py-3 text-center font-mono text-xs tracking-[0.3em] text-[var(--neon-cyan)] uppercase glow-ring">
            memory fragment {String(n).padStart(2, "0")} / 05 unlocked
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */
export function Typewriter({
  text,
  speed = 34,
  onDone,
  className,
  onChar,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
  onChar?: () => void;
}) {
  const [i, setI] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setI(0);
    doneRef.current = false;
  }, [text]);

  useEffect(() => {
    if (i >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => {
      setI((v) => v + 1);
      onChar?.();
    }, speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone, onChar]);

  return (
    <span className={className}>
      {text.slice(0, i)}
      <span className="caret text-[var(--neon-cyan)]">▍</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cinematic section shell                                             */
/* ------------------------------------------------------------------ */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(14px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "grain scanlines relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 py-20",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Neon button                                                         */
/* ------------------------------------------------------------------ */
export function NeonButton({
  children,
  onClick,
  className,
  variant = "violet",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "violet" | "pink" | "ghost";
  ariaLabel?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "glass relative overflow-hidden rounded-full px-7 py-3.5 font-mono text-xs tracking-[0.25em] uppercase transition-colors",
        variant === "violet" && "text-[var(--neon-violet)] hover:text-foreground glow-ring",
        variant === "pink" && "text-[var(--neon-pink)] hover:text-foreground",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
