import { MetadataRoute } from "next";
import { Sanity } from "../sanity/client";

const client = new Sanity();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await client.getSitemap();

    if (!paths) return [];

    const baseUrl = process.env.VERCEL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    return paths.map((path) => ({
      url: new URL(path.href!, baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      priority: 1
    }));
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [];
  }
}
