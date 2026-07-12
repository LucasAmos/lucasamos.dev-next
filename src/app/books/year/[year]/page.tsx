import React from "react";
import { Metadata } from "next";
import { Sanity } from "../../../../sanity/client";
import BooksView from "../../../../components/books";
import BookYearLinks from "../../../../components/books/yearLinks";
import { generateYears } from "../../../../utils/years";

export const revalidate = 300;

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

type Params = {
  params: Promise<{
    year: number;
  }>;
};

export default async function Books(props: Params): Promise<React.JSX.Element> {
  const { year } = await props.params;

  const client = new Sanity();

  const books = await client.getBooksReadByYear(year);

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        In <span className="text-t-violet"> {year}</span> I read{" "}
        <span className="text-t-violet"> {books.length}</span>{" "}
        {books.length == 1 ? "book" : "books"}
      </h1>
      <BooksView books={books} />
      <BookYearLinks year={2018} route="/books/year" />
    </>
  );
}

export async function generateStaticParams() {
  return generateYears(2018).map((year) => ({ year: year.toString() }));
}
