import React, { useState } from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { BOOKS_QUERY } from "../../sanity/queries/books";
import { client } from "../../sanity/client";

import BooksView from "../../components/books";
import { BOOKS_QUERYResult } from "../../../sanity.types";

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

export default async function Books(): Promise<JSX.Element> {
  const year = new Date().getFullYear();

  const { isEnabled } = await draftMode();
  const books: BOOKS_QUERYResult = await client.fetch(
    BOOKS_QUERY,
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
    </>
  );
}
