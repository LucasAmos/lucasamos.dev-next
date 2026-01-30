import { createClient, FilteredResponseQueryOptions, SanityClient } from "next-sanity";

import {
  ALIASES_QUERYResult,
  BOOKS_THIS_YEAR_QUERYResult,
  BOOKS_BY_YEAR_QUERYResult,
  BOOKS_THIS_YEAR_MULTI_QUERYResult,
  BOOKS_BY_YEAR_AND_CATEGORY_QUERYResult,
  BOOKS_BY_CATEGORY_QUERYResult,
  REWRITES_QUERYResult,
} from "../../sanity.types";
import { BOOKS_THIS_YEAR_QUERY, BOOKS_THIS_YEAR_MULTI_QUERY } from "./queries/booksThisYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";
import { BOOKS_BY_YEAR_AND_CATEGORY_QUERY } from "./queries/booksByCategoryAndYear";
import { BOOKS_BY_CATEGORY_QUERY } from "./queries/booksByCategory";
import { ALIASES_QUERY } from "./queries/aliases";
import { REWRITES_QUERY } from "./queries";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
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
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2024-12-01",
      useCdn: true,
      token: process.env.SANITY_API_TOKEN,
      stega: {
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
      },
    });
  }

  public static getQueryConfig(draftModeEnabled: boolean): FilteredResponseQueryOptions {
    return draftModeEnabled
      ? {
          perspective: "drafts",
          useCdn: false,
          stega: true,
        }
      : {
          perspective: "published",
          useCdn: true,
          stega: false,
        };
  }
  async getBooksReadThisYear(year: number, draftModeEnabled: boolean) {
    const books: BOOKS_THIS_YEAR_QUERYResult = await this.client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
      },
      Sanity.getQueryConfig(draftModeEnabled)
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
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getDetailedBooksReadThisYear(
    year: number,
    draftModeEnabled: boolean
  ): Promise<BOOKS_THIS_YEAR_MULTI_QUERYResult> {
    return client.fetch(
      BOOKS_THIS_YEAR_MULTI_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );
  }

  async getBooksReadByYearAndCategory(year: number, category: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_YEAR_AND_CATEGORY_QUERYResult = await client.fetch(
      BOOKS_BY_YEAR_AND_CATEGORY_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
        category,
        slug: category,
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getBooksReadByCategory(category: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_CATEGORY_QUERYResult = await client.fetch(
      BOOKS_BY_CATEGORY_QUERY,
      {
        category,
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getAliases(draftModeEnabled: boolean) {
    const books: ALIASES_QUERYResult = await this.client.fetch(ALIASES_QUERY, undefined, {
      ...Sanity.getQueryConfig(draftModeEnabled),
      next: {
        revalidate: 60,
      },
    });

    return books;
  }

  async getRewrites(draftModeEnabled: boolean) {
    const rewrites: REWRITES_QUERYResult = await this.client.fetch(REWRITES_QUERY, undefined, {
      ...Sanity.getQueryConfig(draftModeEnabled),
      next: {
        revalidate: 60,
      },
    });
    return rewrites;
  }
}
