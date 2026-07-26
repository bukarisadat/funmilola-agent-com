export const SITE = {
  name: "Funmilola Real Estate Agency",
  shortName: "Funmilola Real Estate",
  tagline: "We sell and rent houses in Accra",
  phone: "+233-242-932-560",
  phoneRaw: "+233242932560",
  whatsapp: "233242932560",
  email: "hello@funmilolarealestate.com",
  address: "Accra, Greater Accra Region, Ghana",
  socials: {
    tiktok: "https://www.tiktok.com/@funmilolarealestate",
    instagram: "https://www.instagram.com/funmilolarealestate",
    facebook: "https://www.facebook.com/funmilolarealestate",
  },
  linktree: "https://linktr.ee/funmilolarealestateagency",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
