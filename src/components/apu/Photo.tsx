import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  onDoubleClick?: () => void;
}

/**
 * Image with a graceful neon placeholder when the file isn't there yet.
 * Drop the real file at the same path later and it just works.
 */
export function Photo({ src, alt = "A memory of Apu", className, eager, onDoubleClick }: PhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        onDoubleClick={onDoubleClick}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-[image:var(--gradient-void)] text-center",
          className,
        )}
        aria-label={alt}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklch,var(--neon-violet)_22%,transparent)_10px_11px)]" />
        <ImageOff className="size-5 text-[var(--neon-cyan)] opacity-70" aria-hidden />
        <span className="px-2 font-mono text-[9px] leading-tight tracking-widest text-muted-foreground uppercase">
          {src.replace("/photos/", "")}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onDoubleClick={onDoubleClick}
      onError={() => setFailed(true)}
      className={cn("object-cover select-none", className)}
    />
  );
}
