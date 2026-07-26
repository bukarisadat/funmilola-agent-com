import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BedDouble, CalendarClock, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PropertyVideo } from "@/components/property/PropertyVideo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { InquiryForm } from "@/components/property/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import {
  fallbackImage,
  formatPrice,
  listingLabel,
  propertiesQuery,
  propertyQuery,
} from "@/lib/properties";
import { SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/property/$propertyId")({
  loader: async ({ context, params }) => {
    const property = await context.queryClient.ensureQueryData(propertyQuery(params.propertyId));
    if (!property) throw notFound();
    void context.queryClient.ensureQueryData(propertiesQuery);
    return property;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.title}, ${loaderData.location} | Funmilola Real Estate`
          : "Property | Funmilola Real Estate",
      },
      {
        name: "description",
        content: loaderData
          ? `${listingLabel(loaderData.listing_type)} — ${loaderData.title} at ${loaderData.location} for ${formatPrice(loaderData.price, loaderData.currency)}. Watch the video tour.`
          : "Property details and video tour from Funmilola Real Estate Agency in Accra.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.title}, ${loaderData.location}` : "Property listing",
      },
      {
        property: "og:description",
        content: loaderData
          ? `${listingLabel(loaderData.listing_type)} at ${formatPrice(loaderData.price, loaderData.currency)} in ${loaderData.location}.`
          : "Video tour of an Accra property.",
      },
    ],
  }),
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const { data: property } = useSuspenseQuery(propertyQuery(propertyId));
  const { data: all } = useSuspenseQuery(propertiesQuery);

  if (!property) return null;

  const similar = all.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <PageShell>
      <section className="bg-[image:var(--gradient-sky)] pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to listings
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal variant="scale">
              <div className="glass-panel overflow-hidden rounded-3xl p-2">
                <PropertyVideo
                  videoPath={property.video_url}
                  poster={property.thumbnail_url ?? fallbackImage(property.id)}
                  title={property.title}
                  mode="full"
                  className="aspect-[4/5] w-full rounded-[1.4rem] sm:aspect-video"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em]",
                  property.listing_type === "sale"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {listingLabel(property.listing_type)}
              </span>

              <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                {property.location}
              </p>

              <p className="animate-price-pulse mt-6 inline-block rounded-full bg-accent px-6 py-3 font-display text-2xl font-extrabold text-accent-foreground">
                {formatPrice(property.price, property.currency)}
                {property.listing_type === "rent" && (
                  <span className="ml-1 text-sm font-semibold opacity-80">/month</span>
                )}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="glass-panel rounded-2xl p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <BedDouble className="size-4 text-primary" />
                    Bedrooms
                  </p>
                  <p className="mt-1 font-display text-lg font-bold">
                    {property.bedrooms ?? "Ask our agent"}
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <CalendarClock className="size-4 text-primary" />
                    Payment plan
                  </p>
                  <p className="mt-1 font-display text-lg font-bold">
                    {property.payment_plan ?? "Flexible"}
                  </p>
                </div>
              </div>

              {property.description && (
                <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <a
                    href={whatsappLink(
                      `Hello Funmilola Real Estate, I'm interested in "${property.title}" at ${property.location}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp about this home
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${SITE.phoneRaw}`}>
                    <Phone className="size-4" />
                    {SITE.phone}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <InquiryForm propertyId={property.id} propertyTitle={property.title} />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-2xl font-extrabold">You may also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {similar.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
