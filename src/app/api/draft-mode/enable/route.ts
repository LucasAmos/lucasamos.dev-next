import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { Sanity } from "../../../../sanity/client";

export const { GET } = defineEnableDraftMode({
  client: new Sanity().client.withConfig({
    token: process.env.SANITY_API_TOKEN
  })
});
