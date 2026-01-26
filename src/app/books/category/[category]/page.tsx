import React from "react";
import type { Metadata, ResolvingMetadata } from "next";

import { Sanity } from "../../../../sanity/client";
import { draftMode } from "next/headers";
import BooksView from "../../../../components/books";
export const revalidate = 0;
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  return {
    title: `Lucas Amos: ${category} books I have read`,
    description: `Lucas Amos: ${category} books I have read`,
    openGraph: {
      authors: ["Lucas Amos"],
      description: `Lucas Amos: ${category} books I have read`,
      title: `Lucas Amos: ${category} books I have read`,
    },
  };
}

export default async function Books(props: any): Promise<JSX.Element> {
  const { category } = await props.params;

  const client = new Sanity();

  const { isEnabled } = await draftMode();
  const { books, category: categoryDetails } = await client.getBooksReadByCategory(
    category,
    isEnabled
  );

  if (!categoryDetails.length) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        I have read{" "}
        <span className="text-t-violet">
          {books.length} {categoryDetails[0]?.name}
        </span>{" "}
        {books.length == 1 ? "book" : "books"}
      </h1>
      <BooksView books={books} />
    </>
  );
}
