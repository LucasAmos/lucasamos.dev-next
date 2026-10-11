import React from "react";
import { Sanity } from "../../../../sanity/client";
import BooksView from "../../../../components/books";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 300;
const client = new Sanity();

export const metadata: Metadata = {
  title: "Lucas Amos - Books by author",
  description: "Books by author",
  openGraph: {
    title: "Lucas Amos - Books by author",
    description: "Books by author",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/books.jpg"]
  }
};

export default async function Books({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  const { books, author: authorDetails } = await client.getBooksReadByAuthor(slug);

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

export async function generateStaticParams() {
  return client.getStaticAuthors();
}
