import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Music2, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SITE, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-5 max-w-sm text-sm text-ink-foreground/70">
            {SITE.tagline}. Verified homes, honest pricing and flexible payment plans across Greater
            Accra.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="glass-dark grid size-10 place-items-center rounded-full transition-transform hover:-translate-y-1"
            >
              <Music2 className="size-4" />
            </a>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="glass-dark grid size-10 place-items-center rounded-full transition-transform hover:-translate-y-1"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={SITE.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="glass-dark grid size-10 place-items-center rounded-full transition-transform hover:-translate-y-1"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink-foreground/60">
            Explore
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-foreground/80">
            <li>
              <Link to="/listings" className="hover:text-primary-glow">
                All listings
              </Link>
            </li>
            <li>
              <Link to="/listings" search={{ type: "sale" }} className="hover:text-primary-glow">
                Houses for sale
              </Link>
            </li>
            <li>
              <Link to="/listings" search={{ type: "rent" }} className="hover:text-primary-glow">
                Houses for rent
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary-glow">
                About the agency
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-primary-glow">
                Agency login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink-foreground/60">
            Talk to us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-foreground/80">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-accent" />
              <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-accent" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              {SITE.address}
            </li>
            <li>
              <a
                href={whatsappLink("Hello Funmilola Real Estate, I saw your website.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-whatsapp"
              >
                Chat on WhatsApp →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
