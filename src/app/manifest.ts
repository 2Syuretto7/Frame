import type { MetadataRoute } from "next";

/** Makes Frame installable on phone, tablet and laptop. Offline support arrives in Milestone 10. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Frame",
    short_name: "Frame",
    description: "A personal university for learning game development.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
