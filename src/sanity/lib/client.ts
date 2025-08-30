import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "gbwgfnxi",
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-07-09",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
