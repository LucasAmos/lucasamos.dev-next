import React from "react";
import { Sanity } from "../../../sanity/client";
import { notFound } from "next/navigation";
import AuthorsView from "../../../components/authors";
import { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Lucas Amos - Authors I have read",
  description: "Authors I have read",
  openGraph: {
    title: "Lucas Amos - Authors I have read",
    description: "Authors I have read",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/books.jpg"]
  }
};

export default async function Books(): Promise<React.JSX.Element> {
  const authors = await new Sanity().getAuthorsAndBooks();

  if (!authors.length) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">Authors</h1>
      <AuthorsView authors={authors} />
    </>
  );
}
