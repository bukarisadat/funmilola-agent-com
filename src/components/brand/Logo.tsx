import { Link } from "@tanstack/react-router";
import logo from "@/assets/funmilola-logo.png";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

interface LogoProps {
  className?: string;
  showText?: boolean;
  inverted?: boolean;
}

export function Logo({ className, showText = true, inverted = false }: LogoProps) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label={SITE.name}>
      <span className="relative inline-flex shrink-0">
        <span className="absolute inset-0 rounded-full bg-primary/30 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
        <img
          src={logo}
          alt="Funmilola Real Estate logo"
          width={512}
          height={512}
          className="relative size-11 rounded-full ring-1 ring-primary/25 transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      {showText && (
        <span className="leading-tight">
          <span
            className={cn(
              "block font-display text-[0.95rem] font-bold tracking-tight",
              inverted ? "text-ink-foreground" : "text-foreground",
            )}
          >
            Funmilola
          </span>
          <span
            className={cn(
              "block text-[0.65rem] font-semibold uppercase tracking-[0.22em]",
              inverted ? "text-ink-foreground/70" : "text-muted-foreground",
            )}
          >
            Real Estate
          </span>
        </span>
      )}
    </Link>
  );
}
