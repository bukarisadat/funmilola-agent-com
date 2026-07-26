import { useEffect, useState } from "react";
import logo from "@/assets/funmilola-logo.png";
import { cn } from "@/lib/utils";

/** Branded intro loader shown once per browser session. */
export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("funmilola-intro") === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";
    const leaveTimer = setTimeout(() => setLeaving(true), 1500);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("funmilola-intro", "1");
      } catch {
        /* ignore */
      }
    }, 2200);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[image:var(--gradient-sky)] transition-all duration-700",
        leaving && "pointer-events-none scale-105 opacity-0",
      )}
    >
      <div className="relative flex size-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <span className="absolute inset-0 animate-ring-spin rounded-full border-2 border-transparent border-t-accent" />
        <img
          src={logo}
          alt="Funmilola Real Estate"
          width={256}
          height={256}
          className="size-24 animate-scale-in rounded-full"
        />
      </div>
      <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.34em] text-primary">
        Funmilola
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Accra · Ghana</p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-border">
        <div className="h-full w-1/2 animate-marquee bg-accent" />
      </div>
    </div>
  );
}
