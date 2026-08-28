import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CustomCursor } from "./Fx";
import { Hud } from "./Hud";
import { Intro } from "./Intro";
import { Level1Cake } from "./Level1Cake";
import { Level2Quiz } from "./Level2Quiz";
import { Level3Find } from "./Level3Find";
import { Level4Hidden } from "./Level4Hidden";
import { Level5Doors, type DoorChoice } from "./Level5Doors";
import { PathChaos, PathMemories, PathSecret } from "./Paths";
import { FinalUnlock } from "./FinalUnlock";
import { Finale } from "./Finale";
import { sfx, startMusic } from "@/lib/apu-audio";

type Stage =
  "intro" | "level1" | "level2" | "level3" | "level4" | "doors" | "path" | "final" | "finale";

const FRAGMENTS: Record<Stage, number> = {
  intro: 0,
  level1: 0,
  level2: 1,
  level3: 2,
  level4: 3,
  doors: 4,
  path: 4,
  final: 5,
  finale: 5,
};

export function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [door, setDoor] = useState<DoorChoice | null>(null);
  const [egg, setEgg] = useState<string | null>(null);
  const musicStarted = useRef(false);

  const beginMusicOnce = () => {
    if (musicStarted.current) return;
    musicStarted.current = true;
    startMusic("dark");
  };

  // keyboard easter egg
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a") {
        sfx.pop();
        setEgg("you found the secret keystroke. she's going to love this. 🤫");
        setTimeout(() => setEgg(null), 2600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black">
      <CustomCursor />
      {stage !== "intro" && <Hud fragments={FRAGMENTS[stage]} />}

      {/* suspicious easter-egg button, appears after the intro */}
      {stage !== "intro" && (
        <button
          aria-label="???"
          onClick={() => {
            sfx.deny();
            setEgg("this button does nothing. it never did. 😌");
            setTimeout(() => setEgg(null), 2200);
          }}
          className="glass fixed bottom-4 left-4 z-[75] rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase opacity-40 transition-opacity hover:opacity-90"
        >
          do not click
        </button>
      )}

      <AnimatePresence>
        {egg && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass fixed bottom-16 left-1/2 z-[76] -translate-x-1/2 rounded-full px-4 py-2 text-center text-xs text-[var(--neon-amber)]"
          >
            {egg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <Intro
            key="intro"
            onStart={() => {
              beginMusicOnce();
              setStage("level1");
            }}
          />
        )}

        {stage === "level1" && <Level1Cake key="level1" onComplete={() => setStage("level2")} />}

        {stage === "level2" && <Level2Quiz key="level2" onComplete={() => setStage("level3")} />}

        {stage === "level3" && <Level3Find key="level3" onComplete={() => setStage("level4")} />}

        {stage === "level4" && <Level4Hidden key="level4" onComplete={() => setStage("doors")} />}

        {stage === "doors" && (
          <Level5Doors
            key="doors"
            onChoose={(d) => {
              setDoor(d);
              setStage("path");
            }}
          />
        )}

        {stage === "path" && door === "chaos" && (
          <PathChaos key="chaos" onComplete={() => setStage("final")} />
        )}
        {stage === "path" && door === "memories" && (
          <PathMemories key="memories" onComplete={() => setStage("final")} />
        )}
        {stage === "path" && door === "secret" && (
          <PathSecret key="secret" onComplete={() => setStage("final")} />
        )}

        {stage === "final" && <FinalUnlock key="final" onComplete={() => setStage("finale")} />}

        {stage === "finale" && <Finale key="finale" />}
      </AnimatePresence>
    </div>
  );
}
