import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-12-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});
