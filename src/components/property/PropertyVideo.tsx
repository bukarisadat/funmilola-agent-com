import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { videoUrlQuery } from "@/lib/properties";
import { cn } from "@/lib/utils";

interface PropertyVideoProps {
  videoPath: string | null;
  poster: string;
  title: string;
  className?: string;
  /** autoplay muted loop on hover (card feed) vs full controls (detail page) */
  mode?: "feed" | "full";
}

export function PropertyVideo({
  videoPath,
  poster,
  title,
  className,
  mode = "feed",
}: PropertyVideoProps) {
  const { data: src } = useQuery(videoUrlQuery(videoPath));
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (mode === "feed") return;
    setPlaying(false);
  }, [src, mode]);

  if (!src) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <img
          src={poster}
          alt={title}
          loading="lazy"
          width={720}
          height={1280}
          className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-ink", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        loop={mode === "feed"}
        muted={mode === "feed"}
        controls={mode === "full" && playing}
        preload="metadata"
        className="size-full object-cover"
        onMouseEnter={() => {
          if (mode === "feed") void videoRef.current?.play();
        }}
        onMouseLeave={() => {
          if (mode === "feed") videoRef.current?.pause();
        }}
      />
      {(mode === "full" ? !playing : true) && (
        <button
          type="button"
          aria-label={`Play video of ${title}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setPlaying(true);
            const el = videoRef.current;
            if (!el) return;
            if (mode === "full") el.muted = false;
            void el.play();
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            mode === "feed" && "opacity-90 group-hover:opacity-0",
          )}
        >
          <span className="glass-dark flex size-14 items-center justify-center rounded-full text-ink-foreground">
            <Play className="size-5 translate-x-px fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
