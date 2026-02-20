import React from "react";
import { Sanity } from "../../../../sanity/client";
import { draftMode } from "next/headers";
import BooksView from "../../../../components/books";
export const revalidate = 0;

import { notFound } from "next/navigation";
export default async function Books(props: any): Promise<React.JSX.Element> {
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
