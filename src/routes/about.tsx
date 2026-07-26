import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, HeartHandshake, KeyRound, Video } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Funmilola Real Estate Agency | Accra Property Experts" },
      {
        name: "description",
        content:
          "Meet Funmilola Real Estate Agency: over a decade helping families buy and rent homes across Accra with honest pricing and real video tours.",
      },
      { property: "og:title", content: "About Funmilola Real Estate Agency" },
      {
        property: "og:description",
        content: "A decade of trusted property sales and rentals across Greater Accra.",
      },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "2013", title: "The first key", text: "Funmilola hands over her first family home in Kasoa." },
  { year: "2017", title: "Team of agents", text: "A dedicated inspection team is formed to film every property." },
  { year: "2021", title: "Video first", text: "Short-form video tours take the agency to a 147K community." },
  { year: "2026", title: "Accra wide", text: "From Fetteh to the West Hills Axis, hundreds of homes matched." },
];

const VALUES = [
  { icon: Video, title: "Show, don't tell", text: "Every property is filmed as it truly is, no filters, no surprises." },
  { icon: HeartHandshake, title: "Client first", text: "We negotiate for you and never push a home that doesn't fit." },
  { icon: KeyRound, title: "Safe handover", text: "Documentation, inspection and handover guided by our team." },
  { icon: Award, title: "Local expertise", text: "Deep knowledge of Kasoa, Fetteh, Tuba and the West Hills corridor." },
];

function AboutPage() {
  return (
    <PageShell>
      <section className="bg-[image:var(--gradient-sky)] pb-16 pt-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Our story
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              The agency Accra trusts with its keys
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {SITE.name} started with a simple promise: show people the house exactly as it is, then
              help them own it. Today we film, verify and match hundreds of homes every year across
              Greater Accra.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 100}>
                <div className="glass-panel h-full rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
                  <value.icon className="size-6 text-accent" />
                  <h3 className="mt-4 font-display text-base font-bold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold">Milestones</h2>
          </Reveal>
          <ol className="mt-10 space-y-8 border-l border-white/15 pl-8">
            {TIMELINE.map((item, index) => (
              <Reveal key={item.year} delay={index * 130}>
                <li className="relative">
                  <span className="absolute -left-[2.6rem] top-1.5 grid size-5 place-items-center rounded-full bg-accent text-[0.6rem] font-bold text-accent-foreground">
                    •
                  </span>
                  <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary-glow">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-foreground/70">{item.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { value: 500, suffix: "+", label: "Homes sold" },
              { value: 320, suffix: "+", label: "Families housed" },
              { value: 2700000, suffix: "", label: "Video likes" },
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 120} className="text-center">
                <p className="font-display text-3xl font-extrabold text-primary-glow">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-foreground/60">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y text-center">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold">Let's find your home</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Browse the current listings or speak to an agent today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/listings">See listings</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
