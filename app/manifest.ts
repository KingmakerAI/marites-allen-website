import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marites Allen — The Feng Shui Queen",
    short_name: "Marites Allen",
    description:
      "Book Feng Shui consultations, explore Destara AI, annual forecasts, and Frigga Charmed Life with Master Marites Allen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e7",
    theme_color: "#143d31",
    lang: "en",
    categories: ["lifestyle", "business"],
    icons: [
      {
        src: "/images/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/images/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/images/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}