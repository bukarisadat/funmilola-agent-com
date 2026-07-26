import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useAdminSession } from "@/hooks/use-admin-session";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Agent Sign In | Funmilola Real Estate Agency" },
      {
        name: "description",
        content:
          "Secure sign in for Funmilola Real Estate Agency staff to manage property listings and video tours.",
      },
      { property: "og:title", content: "Agent Sign In | Funmilola Real Estate" },
      { property: "og:description", content: "Staff access to the listings dashboard." },
    ],
  }),
  component: AuthPage,
});

const inputClass =
  "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15";

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAdminSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) void navigate({ to: "/admin" });
  }, [session, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!email || password.length < 6) {
      toast.error("Enter an email and a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth` },
          });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    if (result.data.session) {
      try {
        await claimFirstAdmin();
      } catch {
        /* already claimed */
      }
      void navigate({ to: "/admin" });
    } else {
      toast.success("Check your inbox to confirm your email.");
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try email instead.");
      return;
    }
    if (result.redirected) return;
    try {
      await claimFirstAdmin();
    } catch {
      /* already claimed */
    }
    void navigate({ to: "/admin" });
  }

  return (
    <PageShell>
      <section className="flex min-h-[80vh] items-center bg-[image:var(--gradient-sky)] px-4 pb-20 pt-32">
        <Reveal variant="scale" className="mx-auto w-full max-w-md">
          <div className="glass-panel rounded-3xl p-8">
            <Logo className="mx-auto" showText={false} />
            <h1 className="mt-6 text-center font-display text-2xl font-extrabold">
              {mode === "signin" ? "Agent sign in" : "Create agent account"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Staff access to manage listings and video tours.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-3">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                className={inputClass}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className={inputClass}
              />
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" size="lg" className="w-full" onClick={handleGoogle}>
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 11v2.6h6.2c-.25 1.6-1.9 4.7-6.2 4.7A6.3 6.3 0 0 1 12 5.7c2 0 3.3.85 4.05 1.58l2.1-2.02A9 9 0 1 0 21 12c0-.6-.07-1-.15-1z"
                />
              </svg>
              Continue with Google
            </Button>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className={cn(
                "mt-6 w-full text-center text-sm font-semibold text-primary transition-opacity hover:opacity-80",
              )}
            >
              {mode === "signin"
                ? "No account yet? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
