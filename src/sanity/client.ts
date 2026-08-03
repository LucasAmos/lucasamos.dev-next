import { createClient, FilteredResponseQueryOptions, SanityClient } from "next-sanity";
import * as Sentry from "@sentry/nextjs";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";

import { ABOUT_PAGE_QUERY } from "./queries/aboutPage";
import { ALIASES_QUERY } from "./queries/aliases";
import { AUTHORS_AND_BOOKS_QUERY } from "./queries/authorsAndBooks";
import { AUTHORS_QUERY } from "./queries/authors";
import { BOOKS_BY_AUTHOR_QUERY, CV_PAGE_QUERY } from "./queries";
import { BOOKS_BY_CATEGORY_QUERY } from "./queries/booksByCategory";
import { BOOKS_BY_YEAR_AND_CATEGORY_QUERY } from "./queries/booksByCategoryAndYear";
import { BOOKS_BY_YEAR_QUERY } from "./queries/booksByYear";
import { BOOKS_THIS_YEAR_QUERY, BOOKS_THIS_YEAR_MULTI_QUERY } from "./queries/booksThisYear";
import { CATEGORIES_QUERY } from "./queries/categories";
import { SITEMAP_QUERY } from "./queries/sitemap";
import {
  ABOUT_PAGE_QUERY_RESULT,
  ALIASES_QUERY_RESULT,
  AUTHORS_AND_BOOKS_QUERY_RESULT,
  AUTHORS_QUERY_RESULT,
  BOOKS_BY_AUTHOR_QUERY_RESULT,
  BOOKS_BY_CATEGORY_QUERY_RESULT,
  BOOKS_BY_YEAR_AND_CATEGORY_QUERY_RESULT,
  BOOKS_BY_YEAR_QUERY_RESULT,
  BOOKS_THIS_YEAR_MULTI_QUERY_RESULT,
  BOOKS_THIS_YEAR_QUERY_RESULT,
  CATEGORIES_QUERY_RESULT,
  CV_PAGE_QUERY_RESULT,
  REDIRECTS_QUERY_RESULT,
  SITEMAP_QUERY_RESULT
} from "../../sanity.types";
import { REDIRECTS_QUERY } from "./queries/redirects";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-12-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }
});

const getCachedAliases = unstable_cache(
  async () => {
    Sentry.metrics.count("aliases.get", 1);
    return sanityClient.fetch<ALIASES_QUERY_RESULT>(ALIASES_QUERY);
  },
  ["sanity-aliases"],
  {
    revalidate: 300,
    tags: ["aliases"]
  }
);

let cachedRedirects: REDIRECTS_QUERY_RESULT | null = null;
let cacheExpiresAt = 0;
let inFlight: Promise<REDIRECTS_QUERY_RESULT> | null = null;

const getCachedRedirects = async (): Promise<REDIRECTS_QUERY_RESULT> => {
  const now = Date.now();

  if (cachedRedirects && now < cacheExpiresAt) {
    return cachedRedirects;
  }

  if (inFlight) {
    return inFlight;
  }

  console.log("***redirect cache called");

  inFlight = sanityClient
    .fetch<REDIRECTS_QUERY_RESULT>(REDIRECTS_QUERY)
    .then((result) => {
      cachedRedirects = result;
      cacheExpiresAt = Date.now() + 100_000; // 5 minutes
      return result;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

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
          stega: false
        };
  }

  async query<T>(query: string, params?: object): Promise<T> {
    return this.client.fetch(query, params, await Sanity.getQueryConfig());
  }

  async getBooksReadThisYear(year: number) {
    return this.query<BOOKS_THIS_YEAR_QUERY_RESULT>(BOOKS_THIS_YEAR_QUERY, {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-31-12`
    });
  }

  async getBooksReadByYear(year: number) {
    return this.query<BOOKS_BY_YEAR_QUERY_RESULT>(BOOKS_BY_YEAR_QUERY, {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-31-12`
    });
  }

  async getDetailedBooksReadThisYear(year: number) {
    return this.query<BOOKS_THIS_YEAR_MULTI_QUERY_RESULT>(BOOKS_THIS_YEAR_MULTI_QUERY, {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-31-12`
    });
  }

  async getBooksReadByYearAndCategory(year: number, category: string) {
    return this.query<BOOKS_BY_YEAR_AND_CATEGORY_QUERY_RESULT>(BOOKS_BY_YEAR_AND_CATEGORY_QUERY, {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-31-12`,
      category,
      slug: category
    });
  }

  async getBooksReadByCategory(category: string) {
    return this.query<BOOKS_BY_CATEGORY_QUERY_RESULT>(BOOKS_BY_CATEGORY_QUERY, {
      category
    });
  }

  async getAliases() {
    return getCachedAliases();
  }

  async getBooksReadByAuthor(slug: string) {
    return this.query<BOOKS_BY_AUTHOR_QUERY_RESULT>(BOOKS_BY_AUTHOR_QUERY, {
      slug
    });
  }

  async getAbout() {
    return this.query<ABOUT_PAGE_QUERY_RESULT>(ABOUT_PAGE_QUERY);
  }

  async getCV() {
    return (await this.query<CV_PAGE_QUERY_RESULT>(CV_PAGE_QUERY))[0];
  }

  async getSitemap() {
    return this.client.fetch<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY);
  }

  async getStaticAuthors() {
    return this.client.fetch<AUTHORS_QUERY_RESULT>(AUTHORS_QUERY);
  }

  async getStaticCategories() {
    return this.client.fetch<CATEGORIES_QUERY_RESULT>(CATEGORIES_QUERY);
  }

  async getAuthorsAndBooks() {
    return this.query<AUTHORS_AND_BOOKS_QUERY_RESULT>(AUTHORS_AND_BOOKS_QUERY);
  }

  async getRedirects() {
    // return getCachedRedirects();
    return this.client.fetch(REDIRECTS_QUERY, undefined, {
      perspective: "published",
      useCdn: true,
      stega: false,
      next: {
        revalidate: 3600
      }
    });
  }
}
