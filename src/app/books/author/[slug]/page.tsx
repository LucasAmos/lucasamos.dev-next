import React from "react";
import { Sanity } from "../../../../sanity/client";
import { draftMode } from "next/headers";
import BooksView from "../../../../components/books";
export const revalidate = 0;

import { notFound } from "next/navigation";
export default async function Books(props: any): Promise<React.JSX.Element> {
  const { slug } = await props.params;

  const client = new Sanity();

  const { isEnabled } = await draftMode();
  const { books, author: authorDetails } = await client.getBooksReadByAuthor(slug, isEnabled);

  if (!authorDetails.length) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">
        I have read <span className="text-t-violet">{books.length}</span>{" "}
        {books.length == 1 ? "book" : "books"} by{" "}
        <span className="text-t-violet"> {authorDetails[0]?.name}</span>
      </h1>
      <BooksView books={books} />
    </>
  );
}
