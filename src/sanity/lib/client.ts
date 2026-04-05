import { createClient, SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-12-01",
  useCdn: true,
  stega: {
    studioUrl: "http://localhost:3333"
  }
});
