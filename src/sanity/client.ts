import { createClient, FilteredResponseQueryOptions, SanityClient } from "next-sanity";
import * as Sentry from "@sentry/nextjs";
import { draftMode } from "next/headers";

import { BOOKS_THIS_YEAR_QUERY, BOOKS_THIS_YEAR_MULTI_QUERY } from "./queries/booksThisYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";
import { BOOKS_BY_YEAR_AND_CATEGORY_QUERY } from "./queries/booksByCategoryAndYear";
import { BOOKS_BY_CATEGORY_QUERY } from "./queries/booksByCategory";
import { ALIASES_QUERY } from "./queries/aliases";
import { BOOKS_BY_AUTHOR_QUERY, CV_PAGE_QUERY } from "./queries";
import { ABOUT_PAGE_QUERY } from "./queries/aboutPage";
import { AUTHORS_QUERY } from "./queries/authors";
import { CATEGORIES_QUERY } from "./queries/categories";
import { SITEMAP_QUERY } from "./queries/sitemap";
import {
  ABOUT_PAGE_QUERY_RESULT,
  ALIASES_QUERY_RESULT,
  SITEMAP_QUERY_RESULT
} from "../../sanity.types";

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
  public static async getQueryConfig(): Promise<FilteredResponseQueryOptions> {
    const { isEnabled } = await draftMode();

    return isEnabled
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
    const books = await client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );
    return books;
  }

  async getBooksReadByYear(year: number) {
    const books = await client.fetch(
      BOOKS_BY_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );

    return books;
  }

  async getDetailedBooksReadThisYear(year: number) {
    return client.fetch(
      BOOKS_THIS_YEAR_MULTI_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );
  }

  async getBooksReadByYearAndCategory(year: number, category: string) {
    const books = await client.fetch(
      BOOKS_BY_YEAR_AND_CATEGORY_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
        category,
        slug: category
      },
      await Sanity.getQueryConfig()
    );

    return books;
  }

  async getBooksReadByCategory(category: string) {
    const books = await client.fetch(
      BOOKS_BY_CATEGORY_QUERY,
      {
        category
      },
      await Sanity.getQueryConfig()
    );

    return books;
  }

  async getAliases(): Promise<ALIASES_QUERY_RESULT> {
    const aliases = await client.fetch(ALIASES_QUERY, undefined, await Sanity.getQueryConfig());
    Sentry.metrics.count("aliases.get", 1);
    return aliases;
  }

  async getBooksReadByAuthor(slug: string) {
    const books = await client.fetch(
      BOOKS_BY_AUTHOR_QUERY,
      {
        slug
      },
      await Sanity.getQueryConfig()
    );

    return books;
  }

  async getAbout(): Promise<ABOUT_PAGE_QUERY_RESULT> {
    return client.fetch(ABOUT_PAGE_QUERY, undefined, await Sanity.getQueryConfig());
  }

  async getCV() {
    const results = await client.fetch(CV_PAGE_QUERY, undefined, await Sanity.getQueryConfig());
    return results[0];
  }

  async getSitemap(): Promise<SITEMAP_QUERY_RESULT> {
    return client.fetch(SITEMAP_QUERY, undefined);
  }

  async getStaticAuthors() {
    return client.fetch(AUTHORS_QUERY, undefined);
  }

  async getStaticCategories() {
    return client.fetch(CATEGORIES_QUERY, undefined);
  }
}
