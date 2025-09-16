import React from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { BOOKS_THIS_YEAR_QUERY } from "../../sanity/queries/booksThisYear";
import { client } from "../../sanity/client";
import Link from "next/link";

import BooksView from "../../components/books";
import { BOOKS_THIS_YEAR_QUERYResult } from "../../../sanity.types";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Lucas Amos - What I'm reading",
  description: "What I'm reading",
  openGraph: {
    title: "Lucas Amos - What I'm reading",
    description: "What I'm reading",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/lucas.JPG"],
  },
};

function generateYears(start: number): number[] {
  const years: any = [];
  const currentYear = new Date().getFullYear();

  let year = currentYear - 1;
  while (year >= start) {
    years.push(year);
    year = year - 1;
  }
  return years;
}

export default async function Books(): Promise<JSX.Element> {
  const year = new Date().getFullYear();

  const { isEnabled } = await draftMode();
  const books: BOOKS_THIS_YEAR_QUERYResult = await client.fetch(
    BOOKS_THIS_YEAR_QUERY,
    {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-12-12`,
    },
    isEnabled
      ? {
          perspective: "drafts",
          useCdn: false,
          stega: true,
        }
      : undefined
  );

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">What I've read this year</h1>
      <BooksView books={books} />

      <h2 className="mb-5 mt-5 font-Inter text-xl">Past years</h2>
      {generateYears(2008).map((year) => {
        return (
          <div key={year}>
            <Link href={`books/${year}`}>{year}</Link>
          </div>
        );
      })}
    </>
  );
}
