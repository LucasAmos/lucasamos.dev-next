import { client } from "../../../../sanity/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    token: process.env.SANITY_API_TOKEN,
  }),
});
