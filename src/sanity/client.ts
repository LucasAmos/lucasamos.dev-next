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
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
      }
    });
  }

  public getClient() {
    return this.client;
  }

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
    return this.client.fetch(
      BOOKS_THIS_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );
  }

  async getBooksReadByYear(year: number) {
    return this.client.fetch(
      BOOKS_BY_YEAR_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );
  }

  async getDetailedBooksReadThisYear(year: number) {
    return this.client.fetch(
      BOOKS_THIS_YEAR_MULTI_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`
      },
      await Sanity.getQueryConfig()
    );
  }

  async getBooksReadByYearAndCategory(year: number, category: string) {
    return this.client.fetch(
      BOOKS_BY_YEAR_AND_CATEGORY_QUERY,
      {
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-31-12`,
        category,
        slug: category
      },
      await Sanity.getQueryConfig()
    );
  }

  async getBooksReadByCategory(category: string) {
    return this.client.fetch(
      BOOKS_BY_CATEGORY_QUERY,
      {
        category
      },
      await Sanity.getQueryConfig()
    );
  }

  async getAliases() {
    Sentry.metrics.count("aliases.get", 1);
    return this.client.fetch(ALIASES_QUERY, undefined, await Sanity.getQueryConfig());
  }

  async getBooksReadByAuthor(slug: string) {
    return this.client.fetch(
      BOOKS_BY_AUTHOR_QUERY,
      {
        slug
      },
      await Sanity.getQueryConfig()
    );
  }

  async getAbout() {
    return this.client.fetch(ABOUT_PAGE_QUERY, undefined, await Sanity.getQueryConfig());
  }

  async getCV() {
    const results = await this.client.fetch(
      CV_PAGE_QUERY,
      undefined,
      await Sanity.getQueryConfig()
    );
    return results[0];
  }

  async getSitemap() {
    return this.client.fetch(SITEMAP_QUERY, undefined);
  }

  async getStaticAuthors() {
    return this.client.fetch(AUTHORS_QUERY, undefined);
  }

  async getStaticCategories() {
    return this.client.fetch(CATEGORIES_QUERY, undefined);
  }
}
