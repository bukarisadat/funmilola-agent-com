import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";

export type ListingType = "sale" | "rent";

export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  listing_type: ListingType;
  bedrooms: number | null;
  payment_plan: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const CURRENCIES = [
  { value: "GHS", label: "GH₵ (Ghana Cedi)", symbol: "GH₵" },
  { value: "USD", label: "$ (US Dollar)", symbol: "$" },
  { value: "EUR", label: "€ (Euro)", symbol: "€" },
  { value: "GBP", label: "£ (Pound)", symbol: "£" },
] as const;

const FALLBACKS = [prop1, prop2, prop3, prop4];

export function fallbackImage(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return FALLBACKS[sum % FALLBACKS.length];
}

export function currencySymbol(code: string) {
  return CURRENCIES.find((c) => c.value === code)?.symbol ?? code;
}

export function formatPrice(price: number, currency: string) {
  const value = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
  return `${currencySymbol(currency)}${value}`;
}

export function listingLabel(type: ListingType) {
  return type === "sale" ? "For Sale" : "For Rent";
}

export async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Property[];
}

export async function fetchProperty(id: string) {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Property | null;
}

export const propertiesQuery = queryOptions({
  queryKey: ["properties"],
  queryFn: fetchProperties,
  staleTime: 30_000,
});

export const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
  });

/** Videos live in a private bucket — resolve a short-lived playable URL. */
export async function resolveVideoUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data, error } = await supabase.storage
    .from("property-videos")
    .createSignedUrl(path, 60 * 60 * 6);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export const videoUrlQuery = (path: string | null) =>
  queryOptions({
    queryKey: ["video-url", path],
    queryFn: () => resolveVideoUrl(path),
    enabled: !!path,
    staleTime: 60 * 60 * 1000,
  });

/** Prefilled WhatsApp message describing a specific property. */
export function propertyEnquiryMessage(
  property: Pick<Property, "title" | "location" | "price" | "currency" | "listing_type" | "id">,
  options: { name?: string; phone?: string; note?: string; url?: string } = {},
) {
  const lines = [
    `Hello Funmilola Real Estate, I'm interested in this property:`,
    ``,
    `🏠 ${property.title}`,
    `📍 ${property.location}`,
    `🏷️ ${listingLabel(property.listing_type)} — ${formatPrice(property.price, property.currency)}${
      property.listing_type === "rent" ? " /month" : ""
    }`,
  ];

  const link =
    options.url ??
    (typeof window !== "undefined" ? `${window.location.origin}/property/${property.id}` : undefined);
  if (link) lines.push(`🔗 ${link}`);

  if (options.name) lines.push(``, `My name is ${options.name}.`);
  if (options.phone) lines.push(`You can reach me on ${options.phone}.`);
  if (options.note) lines.push(``, options.note);
  lines.push(``, `Please share more details and inspection times.`);

  return lines.join("\n");
}
