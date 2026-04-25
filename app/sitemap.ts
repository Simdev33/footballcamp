import type { MetadataRoute } from "next"

const SITE_URL = "https://kickoffcamps.hu"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/rolunk", priority: 0.8, changeFrequency: "monthly" },
    { path: "/taborok", priority: 0.9, changeFrequency: "weekly" },
    { path: "/klubok", priority: 0.7, changeFrequency: "monthly" },
    { path: "/klubok/benfica", priority: 0.7, changeFrequency: "monthly" },
    { path: "/partnerprogram", priority: 0.7, changeFrequency: "monthly" },
    { path: "/galeria", priority: 0.6, changeFrequency: "monthly" },
    { path: "/hirek", priority: 0.7, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/gyik", priority: 0.6, changeFrequency: "monthly" },
    { path: "/kapcsolat", priority: 0.8, changeFrequency: "monthly" },
    { path: "/jelentkezes", priority: 0.9, changeFrequency: "monthly" },
    { path: "/egeszsegugyi-nyilatkozat", priority: 0.3, changeFrequency: "yearly" },
    { path: "/adatkezelesi-tajekoztato", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/aszf", priority: 0.3, changeFrequency: "yearly" },
  ]

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
