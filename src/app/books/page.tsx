import React from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import BooksView from "../../components/books";
import { Sanity } from "../../sanity/client";
import BookYearLinks from "../../components/books/yearLinks";

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
  const client = new Sanity();
  const year = new Date().getFullYear();

  const { isEnabled } = await draftMode();
  const books = await client.getBooksReadThisYear(year, isEnabled);

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        So far this year I have read <span className="text-terf-violet"> {books.length} </span>
        {books.length == 1 ? "book" : "books"}
      </h1>
      <BooksView books={books} />

      <BookYearLinks route="books" year={2018} />
    </>
  );
}
