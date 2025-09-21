import React from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { Sanity } from "../../../sanity/client";
import BooksView from "../../../components/books";
import BookYearLinks from "../../../components/books/yearLinks";

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

type Params = {
  params: Promise<{
    year: string;
  }>;
};

export default async function Books(props: Params): Promise<JSX.Element> {
  const { year } = await props.params;

  const client = new Sanity();

  const { isEnabled } = await draftMode();
  const books = await client.getBooksReadByYear(year, isEnabled);

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        In <span className="text-terf-violet"> {year}</span> I read{" "}
        <span className="text-terf-violet"> {books.length}</span>{" "}
        {books.length == 1 ? "book" : "books"}
      </h1>
      <BooksView books={books} />
      <BookYearLinks year={2008} />
    </>
  );
}
