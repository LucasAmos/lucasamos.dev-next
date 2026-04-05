import { createClient, FilteredResponseQueryOptions, SanityClient } from "next-sanity";
import * as Sentry from "@sentry/nextjs";
import { draftMode } from "next/headers";

import {
  ABOUT_QUERY_RESULT,
  ALIASES_QUERY_RESULT,
  BOOKS_BY_AUTHOR_QUERY_RESULT,
  BOOKS_BY_CATEGORY_QUERY_RESULT,
  BOOKS_BY_YEAR_AND_CATEGORY_QUERY_RESULT,
  BOOKS_BY_YEAR_QUERY_RESULT,
  BOOKS_THIS_YEAR_MULTI_QUERY_RESULT,
  BOOKS_THIS_YEAR_QUERY_RESULT,
  CV_QUERY_RESULT
} from "../../sanity.types";
import { BOOKS_THIS_YEAR_QUERY, BOOKS_THIS_YEAR_MULTI_QUERY } from "./queries/booksThisYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";
import { BOOKS_BY_YEAR_AND_CATEGORY_QUERY } from "./queries/booksByCategoryAndYear";
import { BOOKS_BY_CATEGORY_QUERY } from "./queries/booksByCategory";
import { ALIASES_QUERY } from "./queries/aliases";
import { BOOKS_BY_AUTHOR_QUERY, CV_QUERY } from "./queries";
import { ABOUT_QUERY } from "./queries/about";

export const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-12-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }
});

export class Sanity {
  public static getQueryConfig(draftModeEnabled: boolean): FilteredResponseQueryOptions {
    return draftModeEnabled
      ? {
          perspective: "drafts",
          useCdn: false,
          stega: true
        }
      : {
          perspective: "published",
          useCdn: true,
          stega: false,
          next: {
            revalidate: 60
          }
        };
  }

  async getBooksReadThisYear(year: number, draftModeEnabled: boolean) {
    const books: BOOKS_THIS_YEAR_QUERY_RESULT = await client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );
    return books;
  }

  async getBooksReadByYear(year: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_YEAR_QUERY_RESULT = await client.fetch(
      BOOKS_BY_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getDetailedBooksReadThisYear(
    year: number,
    draftModeEnabled: boolean
  ): Promise<BOOKS_THIS_YEAR_MULTI_QUERY_RESULT> {
    return client.fetch(
      BOOKS_THIS_YEAR_MULTI_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );
  }

  async getBooksReadByYearAndCategory(year: number, category: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_YEAR_AND_CATEGORY_QUERY_RESULT = await client.fetch(
      BOOKS_BY_YEAR_AND_CATEGORY_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
        category,
        slug: category
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getBooksReadByCategory(category: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_CATEGORY_QUERY_RESULT = await client.fetch(
      BOOKS_BY_CATEGORY_QUERY,
      {
        category
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getAliases(draftModeEnabled: boolean) {
    const aliases: ALIASES_QUERY_RESULT = await client.fetch(
      ALIASES_QUERY,
      undefined,
      Sanity.getQueryConfig(draftModeEnabled)
    );

    Sentry.metrics.count("aliases.get", 1);
    return aliases;
  }

  async getBooksReadByAuthor(slug: string, draftModeEnabled: boolean) {
    const books: BOOKS_BY_AUTHOR_QUERY_RESULT = await client.fetch(
      BOOKS_BY_AUTHOR_QUERY,
      {
        slug
      },
      Sanity.getQueryConfig(draftModeEnabled)
    );

    return books;
  }

  async getAbout() {
    const { isEnabled } = await draftMode();

    const about: ABOUT_QUERY_RESULT = await client.fetch(
      ABOUT_QUERY,
      undefined,
      Sanity.getQueryConfig(isEnabled)
    );

    return about[0];
  }

  async getCV(draftModeEnabled: boolean): Promise<CV_QUERY_RESULT[number]> {
    const results = await client.fetch(
      CV_QUERY,
      undefined,
      Sanity.getQueryConfig(draftModeEnabled)
    );
    return results[0];
  }
}
