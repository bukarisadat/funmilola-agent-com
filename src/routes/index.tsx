import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Home, Phone, Search, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-accra-villa.jpg";
import { PageShell } from "@/components/layout/PageShell";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/button";
import { propertiesQuery, type Property } from "@/lib/properties";
import { SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery),
  head: () => ({
    meta: [
      { title: "Funmilola Real Estate Agency | Buy & Rent Houses in Accra" },
      {
        name: "description",
        content:
          "Video tours of houses for sale and for rent across Accra, Ghana. Flexible payment plans. Call +233-242-932-560.",
      },
      { property: "og:title", content: "Funmilola Real Estate Agency | Houses in Accra" },
      {
        property: "og:description",
        content: "We sell and rent houses in Accra. Watch video tours of verified properties.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: properties } = useSuspenseQuery(propertiesQuery);
  const featured = properties.slice(0, 6);

  return (
    <PageShell>
      <Hero />
      <TrustStrip />
      <FeaturedListings featured={featured} total={properties.length} />
      <StatsBand />
      <CtaBand />
    </PageShell>
  );
}

function Hero() {
  const [offset, setOffset] = useState(0);
  const [mode, setMode] = useState<"sale" | "rent">("sale");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="absolute inset-0 -z-20 scale-110"
        style={{ transform: `translate3d(0, ${offset * 0.35}px, 0) scale(1.12)` }}
      >
        <img
          src={heroImage}
          alt="Luxury modern villa in Accra at golden hour"
          width={1920}
          height={1280}
          className="size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]" />

      <div
        className="mx-auto w-full max-w-7xl px-4 pb-24 pt-36"
        style={{ transform: `translate3d(0, ${offset * -0.08}px, 0)` }}
      >
        <Reveal>
          <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-foreground">
            <Sparkles className="size-3.5 text-primary-glow" />
            Accra · Ghana
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-ink-foreground sm:text-6xl lg:text-7xl">
            We sell and rent{" "}
            <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              houses in Accra
            </span>
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-6 max-w-xl text-base text-ink-foreground/80 sm:text-lg">
            Real video tours, verified owners and flexible payment plans, from Kasoa to the West
            Hills Axis. Find your next home without the guesswork.
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="glass-panel mt-10 max-w-2xl rounded-3xl p-3">
            <div className="flex gap-2 p-1">
              {(["sale", "rent"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300",
                    mode === option
                      ? "bg-accent text-accent-foreground shadow-[var(--shadow-accent)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option === "sale" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search area: Kasoa, West Hills, Fetteh…"
                  className="h-12 w-full rounded-full border border-border bg-card/80 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
              <Button asChild variant="hero" size="lg" className="sm:w-auto">
                <Link to="/listings" search={{ type: mode, q: query || undefined }}>
                  Search homes
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={420}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a href={whatsappLink("Hi Funmilola Real Estate, I'd like help finding a house.")} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href={`tel:${SITE.phoneRaw}`}>
                <Phone className="size-4" />
                {SITE.phone}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const TRUST = [
  { icon: BadgeCheck, title: "Verified listings", text: "Every home is inspected and filmed by our own agents." },
  { icon: ShieldCheck, title: "Safe documentation", text: "Land title and tenancy paperwork guided end to end." },
  { icon: Home, title: "Payment plans", text: "Up to 2 years spread payment on selected properties." },
];

function TrustStrip() {
  return (
    <section className="relative z-10 -mt-14">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {TRUST.map((item, index) => (
          <Reveal key={item.title} delay={index * 110}>
            <div className="glass-panel h-full rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
              <item.icon className="size-6 text-accent" />
              <h3 className="mt-4 font-display text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedListings({
  featured,
  total,
}: {
  featured: Property[];
  total: number;
}) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Featured tours
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Fresh homes on the market
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              {total} live {total === 1 ? "listing" : "listings"}. Hover a card to preview the tour.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/listings">
              Browse all listings
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        {featured.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No listings yet. The agency will publish video tours here shortly.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, index) => (
              <Reveal key={property.id} delay={index * 90}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="bg-ink py-20 text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: 500, suffix: "+", label: "Properties sold" },
          { value: 147, suffix: "K", label: "Community followers" },
          { value: 12, suffix: "+", label: "Years in Accra" },
          { value: 98, suffix: "%", label: "Happy clients" },
        ].map((stat, index) => (
          <Reveal key={stat.label} delay={index * 120} className="text-center sm:text-left">
            <p className="font-display text-4xl font-extrabold text-primary-glow sm:text-5xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-ink-foreground/60">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="section-y bg-[image:var(--gradient-sky)]">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Ready to move into your own home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Send us a message on WhatsApp or call directly. Our agents answer every day, including
            weekends.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="whatsapp" size="xl">
              <a
                href={whatsappLink("Hello! I'd like to speak to an agent about a property in Accra.")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp an agent
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Visit our contact page</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
