import { createClient, SanityClient } from "next-sanity";

import { BOOKS_THIS_YEAR_QUERYResult, BOOKS_BY_YEAR_QUERYResult } from "../../sanity.types";
import { BOOKS_THIS_YEAR_QUERY } from "./queries/booksThisYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-12-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});

export class Sanity {
  client: SanityClient;
  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      apiVersion: "2024-12-01",
      useCdn: true,
      token: process.env.SANITY_API_TOKEN,
      stega: {
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
      },
    });
  }
  async getBooksReadThisYear(year: number, draftModeEnabled: boolean) {
    const books: BOOKS_THIS_YEAR_QUERYResult = await this.client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-12-12`,
      },
      draftModeEnabled
        ? {
            perspective: "drafts",
            useCdn: false,
            stega: true,
          }
        : undefined
    );
    return books;
  }

  async getBooksReadByYear(year: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_YEAR_QUERYResult = await client.fetch(
      BOOKS_BY_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
      },
      draftModeEnabled
        ? {
            perspective: "drafts",
            useCdn: false,
            stega: true,
          }
        : undefined
    );

    return books;
  }
}
