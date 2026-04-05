import { createClient, FilteredResponseQueryOptions, SanityClient } from "next-sanity";
import * as Sentry from "@sentry/nextjs";
import { draftMode } from "next/headers";

import { BOOKS_THIS_YEAR_QUERY, BOOKS_THIS_YEAR_MULTI_QUERY } from "./queries/booksThisYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";
import { BOOKS_BY_YEAR_AND_CATEGORY_QUERY } from "./queries/booksByCategoryAndYear";
import { BOOKS_BY_CATEGORY_QUERY } from "./queries/booksByCategory";
import { ALIASES_QUERY } from "./queries/aliases";
import { BOOKS_BY_AUTHOR_QUERY, CV_QUERY } from "./queries";
import { ABOUT_QUERY } from "./queries/about";

import { ABOUT_QUERY_RESULT } from "../../sanity.types";

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

  async getBooksReadThisYear(year: number) {
    const { isEnabled } = await draftMode();
    const books = await client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(isEnabled)
    );
    return books;
  }

  async getBooksReadByYear(year: string) {
    const { isEnabled } = await draftMode();
    const books = await client.fetch(
      BOOKS_BY_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(isEnabled)
    );

    return books;
  }

  async getDetailedBooksReadThisYear(year: number) {
    const { isEnabled } = await draftMode();

    return client.fetch(
      BOOKS_THIS_YEAR_MULTI_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      Sanity.getQueryConfig(isEnabled)
    );
  }

  async getBooksReadByYearAndCategory(year: number, category: string) {
    const { isEnabled } = await draftMode();

    const books = await client.fetch(
      BOOKS_BY_YEAR_AND_CATEGORY_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
        category,
        slug: category
      },
      Sanity.getQueryConfig(isEnabled)
    );

    return books;
  }

  async getBooksReadByCategory(category: string) {
    const { isEnabled } = await draftMode();
    const books = await client.fetch(
      BOOKS_BY_CATEGORY_QUERY,
      {
        category
      },
      Sanity.getQueryConfig(isEnabled)
    );

    return books;
  }

  async getAliases() {
    const { isEnabled } = await draftMode();
    const aliases = await client.fetch(ALIASES_QUERY, undefined, Sanity.getQueryConfig(isEnabled));
    Sentry.metrics.count("aliases.get", 1);
    return aliases;
  }

  async getBooksReadByAuthor(slug: string) {
    const { isEnabled } = await draftMode();

    const books = await client.fetch(
      BOOKS_BY_AUTHOR_QUERY,
      {
        slug
      },
      Sanity.getQueryConfig(isEnabled)
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

  async getCV() {
    const { isEnabled } = await draftMode();
    const results = await client.fetch(CV_QUERY, undefined, Sanity.getQueryConfig(isEnabled));
    return results[0];
  }
}
