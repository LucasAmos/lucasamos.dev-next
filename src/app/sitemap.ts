import { MetadataRoute } from "next";
import { Sanity } from "../sanity/client";
import { getSortedPostsData } from "../lib/posts";
import { generateYears } from "../utils/years";

const client = new Sanity();

const baseUrl = process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const bookyears = generateYears(2018).map((year) => {
  return {
    url: new URL(`books/year/${year}`, baseUrl).toString()
  };
});

const staticPaths = [
  ...bookyears,
  {
    url: new URL("contact", baseUrl).toString()
  },
  {
    url: new URL("books", baseUrl).toString()
  }
];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const staticPosts = getSortedPostsData().map((post) => {
      return {
        url: new URL(`posts/${post.slug!}`, baseUrl).toString(),
        lastModified: new Date(post.date)
      };
    });

    const sitemap = await client.getSitemap();

    const sanityPaths = sitemap.map((path) => ({
      url: new URL(path.href!, baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      priority: 1
    }));
    const paths = [...sanityPaths, ...staticPaths, ...staticPosts];

    if (!paths) return [];

    return paths;
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [];
  }
}
