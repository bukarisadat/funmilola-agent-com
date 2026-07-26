import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import {
  CURRENCIES,
  fallbackImage,
  formatPrice,
  listingLabel,
  propertiesQuery,
  type Property,
} from "@/lib/properties";
import { useAdminSession } from "@/hooks/use-admin-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Listings Dashboard | Funmilola Real Estate Agency" },
      {
        name: "description",
        content:
          "Internal dashboard for Funmilola Real Estate Agency agents to publish listings, upload video tours and review client enquiries.",
      },
      { property: "og:title", content: "Listings Dashboard | Funmilola Real Estate" },
      { property: "og:description", content: "Manage Accra property listings and enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15";

interface InquiryRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  created_at: string;
  property_id: string | null;
}

function AdminPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminSession();
  const [tab, setTab] = useState<"listings" | "inquiries">("listings");
  const [editing, setEditing] = useState<Property | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const queryClient = useQueryClient();
  const { data: properties = [] } = useQuery({ ...propertiesQuery, enabled: !!session });
  const { data: inquiries = [] } = useQuery({
    queryKey: ["inquiries"],
    enabled: !!session && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as InquiryRow[];
    },
  });

  async function handleDelete(property: Property) {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", property.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing deleted.");
    void queryClient.invalidateQueries({ queryKey: ["properties"] });
  }

  if (loading) {
    return (
      <PageShell>
        <div className="grid min-h-[70vh] place-items-center pt-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 pb-24 pt-36 text-center">
          <h1 className="font-display text-2xl font-extrabold">Awaiting approval</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but hasn't been granted agency admin access yet. Ask the
            agency owner to approve you.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="size-4" />
              Sign out
            </Button>
            <Button asChild variant="hero">
              <Link to="/listings">Browse listings</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Dashboard
            </span>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Manage listings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {session?.user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="accent"
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
            >
              <Plus className="size-4" />
              New listing
            </Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-8 flex w-fit rounded-full bg-secondary p-1">
          {(["listings", "inquiries"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all",
                tab === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "listings" ? `Listings (${properties.length})` : `Enquiries (${inquiries.length})`}
            </button>
          ))}
        </div>

        {(creating || editing) && (
          <div className="mt-8">
            <PropertyForm
              property={editing}
              onDone={() => {
                setCreating(false);
                setEditing(null);
                void queryClient.invalidateQueries({ queryKey: ["properties"] });
              }}
            />
          </div>
        )}

        {tab === "listings" ? (
          <div className="mt-8 grid gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="glass-panel flex flex-wrap items-center gap-4 rounded-2xl p-4"
              >
                <img
                  src={property.thumbnail_url ?? fallbackImage(property.id)}
                  alt={property.title}
                  loading="lazy"
                  className="size-16 rounded-xl object-cover"
                />
                <div className="min-w-[12rem] flex-1">
                  <p className="font-display text-sm font-bold">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.location} · {listingLabel(property.listing_type)} ·{" "}
                    {formatPrice(property.price, property.currency)}
                    {property.video_url ? " · video ✓" : " · no video"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCreating(false);
                      setEditing(property);
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(property)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {inquiries.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No enquiries yet.
              </p>
            )}
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm font-bold">{inquiry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="mt-1 text-sm text-primary">
                  <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
                  {inquiry.email ? ` · ${inquiry.email}` : ""}
                </p>
                {inquiry.message && (
                  <p className="mt-2 text-sm text-muted-foreground">{inquiry.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function PropertyForm({
  property,
  onDone,
}: {
  property: Property | null;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoPath, setVideoPath] = useState<string | null>(property?.video_url ?? null);

  async function handleVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("property-videos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setVideoPath(path);
    toast.success("Video uploaded.");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      title: String(data.get("title") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
      price: Number(data.get("price") ?? 0),
      currency: String(data.get("currency") ?? "GHS"),
      listing_type: String(data.get("listing_type") ?? "sale"),
      bedrooms: data.get("bedrooms") ? Number(data.get("bedrooms")) : null,
      payment_plan: String(data.get("payment_plan") ?? "").trim() || null,
      description: String(data.get("description") ?? "").trim() || null,
      featured: data.get("featured") === "on",
      video_url: videoPath,
    };

    if (!payload.title || !payload.location || !payload.price) {
      toast.error("Title, location and price are required.");
      return;
    }

    setSaving(true);
    const { error } = property
      ? await supabase.from("properties").update(payload).eq("id", property.id)
      : await supabase.from("properties").insert(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(property ? "Listing updated." : "Listing published.");
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel animate-scale-in rounded-3xl p-6">
      <h2 className="font-display text-lg font-bold">
        {property ? "Edit listing" : "New listing"}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="title" defaultValue={property?.title} placeholder="Title" className={inputClass} />
        <input
          name="location"
          defaultValue={property?.location}
          placeholder="Location (e.g. Kasoa)"
          className={inputClass}
        />
        <input
          name="price"
          type="number"
          min={0}
          defaultValue={property?.price}
          placeholder="Price"
          className={inputClass}
        />
        <select name="currency" defaultValue={property?.currency ?? "GHS"} className={inputClass}>
          {CURRENCIES.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
        <select
          name="listing_type"
          defaultValue={property?.listing_type ?? "sale"}
          className={inputClass}
        >
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <input
          name="bedrooms"
          type="number"
          min={0}
          defaultValue={property?.bedrooms ?? undefined}
          placeholder="Bedrooms"
          className={inputClass}
        />
        <input
          name="payment_plan"
          defaultValue={property?.payment_plan ?? undefined}
          placeholder="Payment plan (e.g. 12 months)"
          className={cn(inputClass, "sm:col-span-2")}
        />
      </div>
      <textarea
        name="description"
        defaultValue={property?.description ?? undefined}
        rows={4}
        placeholder="Description"
        className={cn(inputClass, "mt-3 h-auto py-3")}
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="featured" defaultChecked={property?.featured} />
          Featured on homepage
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {videoPath ? "Replace video tour" : "Upload video tour"}
          <input type="file" accept="video/*" className="hidden" onChange={handleVideo} />
        </label>
        {videoPath && <span className="text-xs text-muted-foreground">Video attached ✓</span>}
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" variant="hero" disabled={saving || uploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {property ? "Save changes" : "Publish listing"}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
