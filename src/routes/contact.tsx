import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { InquiryForm } from "@/components/property/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Funmilola Real Estate Agency | Accra, Ghana" },
      {
        name: "description",
        content:
          "Call +233-242-932-560 or message Funmilola Real Estate Agency on WhatsApp to buy or rent a house in Accra, Ghana.",
      },
      { property: "og:title", content: "Contact Funmilola Real Estate Agency" },
      {
        property: "og:description",
        content: "Call, WhatsApp or send an enquiry. Our Accra agents reply the same day.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <section className="bg-[image:var(--gradient-sky)] pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Contact
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Talk to an Accra agent
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              {SITE.tagline}. Reach us on the phone, on WhatsApp, or through the form, whichever is
              easiest for you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="glass-panel flex items-center gap-4 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-base font-bold">{SITE.phone}</span>
                  <span className="block text-xs text-muted-foreground">
                    Call us, Mon to Sun, 8am – 8pm
                  </span>
                </span>
              </a>

              <a
                href={whatsappLink("Hello Funmilola Real Estate, I'd like to enquire about a property.")}
                target="_blank"
                rel="noreferrer"
                className="glass-panel flex items-center gap-4 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-whatsapp text-whatsapp-foreground">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-base font-bold">WhatsApp chat</span>
                  <span className="block text-xs text-muted-foreground">
                    Fastest way to reach an agent
                  </span>
                </span>
              </a>

              <div className="glass-panel rounded-3xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <p className="flex items-start gap-3 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    {SITE.address}
                  </p>
                  <p className="flex items-start gap-3 text-sm">
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    {SITE.email}
                  </p>
                  <p className="flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    Open every day, including weekends
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button asChild variant="secondary" size="icon">
                    <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                      <Music2 className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="icon">
                    <a
                      href={SITE.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="icon">
                    <a
                      href={SITE.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="glass-panel overflow-hidden rounded-3xl p-2">
                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <iframe
                    title="Map of Accra, Ghana"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.35%2C5.50%2C0.05%2C5.72&layer=mapnik&marker=5.6037%2C-0.1870"
                    className="h-72 w-full animate-fade-in border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/10" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <InquiryForm />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
