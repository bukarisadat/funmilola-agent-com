import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { propertyEnquiryMessage, propertyUrl, type Property } from "@/lib/properties";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  /** When present, WhatsApp messages are prefilled with this property's details. */
  property?: Property;
  className?: string;
}

function buildMessage(
  property: Property | undefined,
  fields: { name?: string; phone?: string; note?: string },
  /** Only true in click handlers — window.location is unavailable during SSR. */
  withLink = false,
) {
  if (property)
    return propertyEnquiryMessage(property, {
      ...fields,
      url: withLink ? propertyUrl(property.id) : undefined,
    });
  const lines = ["Hello Funmilola Real Estate, I'd like to enquire about a property in Accra."];
  if (fields.name) lines.push("", `My name is ${fields.name}.`);
  if (fields.phone) lines.push(`You can reach me on ${fields.phone}.`);
  if (fields.note) lines.push("", fields.note);
  return lines.join("\n");
}

const inputClass =
  "h-12 w-full rounded-2xl border border-border bg-card/80 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15";

export function InquiryForm({ propertyId, propertyTitle, property, className }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!name || !phone) {
      toast.error("Please add your name and phone number.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      property_id: propertyId ?? null,
      name,
      phone,
      email: String(data.get("email") ?? "").trim() || null,
      message: String(data.get("message") ?? "").trim() || null,
    });
    setLoading(false);

    if (error) {
      toast.error("We couldn't send that. Please call us instead.");
      return;
    }
    setSent(true);
    toast.success("Thank you! Opening WhatsApp so an agent can reply instantly.");

    const link = whatsappLink(
      buildMessage(
        property,
        { name, phone, note: String(data.get("message") ?? "").trim() || undefined },
        true,
      ),
    );
    form.reset();
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className={cn("glass-panel rounded-3xl p-6 md:p-8", className)}>
      <h3 className="font-display text-xl font-bold">
        {propertyTitle ? "Enquire about this property" : "Send us a message"}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {propertyTitle
          ? `Tell us when you'd like to inspect ${propertyTitle}.`
          : "Leave your details and an agent will get back to you the same day."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Your full name" className={inputClass} autoComplete="name" />
        <input
          name="phone"
          placeholder="Phone / WhatsApp number"
          className={inputClass}
          autoComplete="tel"
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email (optional)"
        className={cn(inputClass, "mt-3")}
        autoComplete="email"
      />
      <textarea
        name="message"
        rows={4}
        placeholder={propertyTitle ? `I'm interested in ${propertyTitle}...` : "How can we help?"}
        className={cn(inputClass, "mt-3 h-auto py-3")}
      />

      <Button type="submit" variant="whatsapp" size="lg" className="mt-5 w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {sent ? "Send another message" : "Send enquiry via WhatsApp"}
      </Button>

      <Button asChild variant="outline" size="lg" className="mt-3 w-full border-whatsapp/40 text-whatsapp hover:border-whatsapp hover:text-whatsapp">
        <a
          href={whatsappLink(buildMessage(property, {}))}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="size-4" />
          {property ? "Chat about this property" : "Chat with an agent now"}
        </a>
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {property
          ? "WhatsApp opens with this property's name, location and price already filled in."
          : "WhatsApp opens with your message already filled in."}
      </p>
    </form>
  );
}
