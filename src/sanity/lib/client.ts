import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-07-09",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});
