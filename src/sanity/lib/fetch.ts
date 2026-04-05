import { draftMode } from "next/headers";
import { client } from "./client";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  stega: stegaOverride,
  perspective: perspectiveOverride
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
  stega?: boolean;
  perspective?: "published" | "drafts" | "raw";
}): Promise<{ data: T }> {
  const isDraftMode = (await draftMode()).isEnabled;
  const perspective = perspectiveOverride ?? (isDraftMode ? "drafts" : "published");
  const stega = stegaOverride ?? isDraftMode;
  const useCdn = !isDraftMode;

  const data = await client.withConfig({ useCdn, stega }).fetch<T>(query, params, {
    token: isDraftMode ? process.env.SANITY_API_TOKEN : undefined,
    perspective,
    next: {
      revalidate: isDraftMode ? 0 : tags.length ? false : revalidate,
      tags: isDraftMode ? [] : tags
    }
  });

  return { data };
}
