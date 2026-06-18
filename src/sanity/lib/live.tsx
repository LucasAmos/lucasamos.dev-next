import { defineLive } from "next-sanity/live";
import { Sanity } from "../../sanity/client";

export const { sanityFetch, SanityLive } = defineLive({
  client: new Sanity().client.withConfig({ apiVersion: "2026-02-01" }),
  serverToken: process.env.SANITY_API_TOKEN,
  browserToken: process.env.SANITY_API_TOKEN
});
