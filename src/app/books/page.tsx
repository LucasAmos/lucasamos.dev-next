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
    images: ["https://www.lucasamos.dev/images/books.jpg"]
  }
};

export default async function Books(): Promise<React.JSX.Element> {
  const client = new Sanity();
  const year = new Date().getFullYear();

  const { isEnabled } = await draftMode();
  const { books, finished, inprogress } = await client.getDetailedBooksReadThisYear(
    year,
    isEnabled
  );
  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        So far this year I have finished <span className="text-t-violet"> {finished} </span>
        {finished == 1 ? "book" : "books"} and I am currently reading{" "}
        <span className="text-t-violet"> {inprogress} </span> {inprogress == 1 ? "book" : "books"}
      </h1>

      <BooksView books={books} />

      <BookYearLinks year={2018} route="/books/year" />
    </>
  );
}
