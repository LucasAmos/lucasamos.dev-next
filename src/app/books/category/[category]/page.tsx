import React from "react";
import { Sanity } from "../../../../sanity/client";
import BooksView from "../../../../components/books";
export const revalidate = 300;
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Book } from "../../../../components/Test";

const client = new Sanity();

export const metadata: Metadata = {
  title: "Lucas Amos - Categories I have read",
  description: "Categories I have read",
  openGraph: {
    title: "Lucas Amos - Categories I have read",
    description: "Categories I have read",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/books.jpg"]
  }
};

export default async function Books(props: any): Promise<React.JSX.Element> {
  const { category } = await props.params;

  const { books, category: categoryDetails } = await client.getBooksReadByCategory(category);

  if (!categoryDetails.length) {
    notFound();
  }

  return (
    <>
      <Book book={books[0]}></Book>
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

export async function generateStaticParams() {
  return client.getStaticCategories();
}
