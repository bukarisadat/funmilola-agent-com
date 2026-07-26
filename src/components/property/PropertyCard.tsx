import { Link } from "@tanstack/react-router";
import { BedDouble, MapPin } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { PropertyVideo } from "./PropertyVideo";
import { fallbackImage, formatPrice, listingLabel, type Property } from "@/lib/properties";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

/** Glass listing card with cursor-following 3D tilt. */
export function PropertyCard({ property, className }: PropertyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(1100px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-8px) scale(1.015)`;
  };

  const reset = () => {
    const node = cardRef.current;
    if (node) node.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "tilt-card group relative rounded-3xl p-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <Link
        to="/property/$propertyId"
        params={{ propertyId: property.id }}
        className="glass-panel block overflow-hidden rounded-3xl"
      >
        <div className="relative">
          <PropertyVideo
            videoPath={property.video_url}
            poster={property.thumbnail_url ?? fallbackImage(property.id)}
            title={property.title}
            className="aspect-[9/13] w-full"
          />

          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em]",
              property.listing_type === "sale"
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground",
            )}
          >
            {listingLabel(property.listing_type)}
          </span>

          <span className="animate-price-pulse absolute bottom-4 left-4 rounded-full bg-accent px-4 py-2 font-display text-sm font-bold text-accent-foreground">
            {formatPrice(property.price, property.currency)}
          </span>

          {property.payment_plan && property.listing_type === "sale" && (
            <span className="glass-dark absolute right-4 top-4 max-w-[8rem] rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink-foreground">
              {property.payment_plan}
            </span>
          )}
        </div>

        <div className="space-y-2 p-5">
          <h3 className="font-display text-base font-bold leading-snug text-foreground">
            {property.title}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            {property.location}
          </p>
          <div className="flex items-center justify-between pt-1 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4 text-primary" />
              {property.bedrooms ? `${property.bedrooms} bedroom${property.bedrooms > 1 ? "s" : ""}` : "Ask us"}
            </span>
            <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">
              View →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
