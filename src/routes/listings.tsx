import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { propertiesQuery, type ListingType } from "@/lib/properties";
import { cn } from "@/lib/utils";

interface ListingSearch {
  type?: ListingType | "all";
  q?: string;
}

export const Route = createFileRoute("/listings")({
  validateSearch: (search: Record<string, unknown>): ListingSearch => ({
    type: search.type === "sale" || search.type === "rent" ? search.type : undefined,
    q: typeof search.q === "string" && search.q.length ? search.q : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery),
  head: () => ({
    meta: [
      { title: "Property Listings in Accra | Funmilola Real Estate" },
      {
        name: "description",
        content:
          "Browse video tours of houses and apartments for sale or rent in Accra — filter by location, price range and listing type.",
      },
      { property: "og:title", content: "Property Listings in Accra | Funmilola Real Estate" },
      {
        property: "og:description",
        content: "Filter verified Accra homes for sale and rent by location and price.",
      },
    ],
  }),
  component: ListingsPage,
});

const PRICE_BANDS = [
  { label: "Any price", value: "any" },
  { label: "Under 100K", value: "0-100000" },
  { label: "100K – 500K", value: "100000-500000" },
  { label: "500K+", value: "500000-999999999" },
] as const;

function ListingsPage() {
  const { data: properties } = useSuspenseQuery(propertiesQuery);
  const search = Route.useSearch();

  const [type, setType] = useState<"all" | ListingType>(search.type ?? "all");
  const [location, setLocation] = useState("all");
  const [band, setBand] = useState<string>("any");
  const [query, setQuery] = useState(search.q ?? "");

  const locations = useMemo(
    () => Array.from(new Set(properties.map((p) => p.location))).sort(),
    [properties],
  );

  const filtered = useMemo(() => {
    const [min, max] = band === "any" ? [0, Infinity] : band.split("-").map(Number);
    return properties.filter((p) => {
      if (type !== "all" && p.listing_type !== type) return false;
      if (location !== "all" && p.location !== location) return false;
      if (p.price < min || p.price > max) return false;
      if (query) {
        const needle = query.toLowerCase();
        if (!`${p.title} ${p.location}`.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [properties, type, location, band, query]);

  const activeFilters = (type !== "all" ? 1 : 0) + (location !== "all" ? 1 : 0) + (band !== "any" ? 1 : 0);

  return (
    <PageShell>
      <section className="bg-[image:var(--gradient-sky)] pb-12 pt-32">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Listings
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Homes across Greater Accra
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Every listing is filmed by our agents. Tap a card to watch the full tour and see the
              payment plan.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="glass-panel mt-8 rounded-3xl p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-full bg-secondary p-1">
                  {(["all", "sale", "rent"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all",
                        type === option
                          ? "bg-accent text-accent-foreground shadow-[var(--shadow-accent)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option === "all" ? "All" : option === "sale" ? "For sale" : "For rent"}
                    </button>
                  ))}
                </div>

                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:border-primary"
                >
                  <option value="all">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <select
                  value={band}
                  onChange={(event) => setBand(event.target.value)}
                  className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:border-primary"
                >
                  {PRICE_BANDS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title or area"
                  className="h-11 min-w-[12rem] flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                />

                {(activeFilters > 0 || query) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setType("all");
                      setLocation("all");
                      setBand("any");
                      setQuery("");
                    }}
                  >
                    <X className="size-4" />
                    Clear
                  </Button>
                )}
              </div>
              <p className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
                <SlidersHorizontal className="size-3.5" />
                {filtered.length} of {properties.length} listings shown
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-14 text-center">
              <p className="font-display text-lg font-bold">No homes match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening the price range, or{" "}
                <Link to="/contact" className="font-semibold text-primary">
                  tell us what you're looking for
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property, index) => (
                <Reveal key={property.id} delay={(index % 6) * 80}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
