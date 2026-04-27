import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Electra 2026 - AI Election Co-Pilot",
    short_name: "Electra 2026",
    description:
      "An offline-first election co-pilot with a Socratic myth buster, EVM simulator, and confidence journey.",
    start_url: "/",
    display: "standalone",
    background_color: "#08111f",
    theme_color: "#1a56db",
    orientation: "portrait",
    lang: "en",
    icons: [
      {
        src: "/pwa/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/pwa/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
