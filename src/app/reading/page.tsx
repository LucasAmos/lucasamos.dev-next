import React from "react";
import { Metadata } from "next";
import { BOOKS_QUERY } from "../../sanity/queries/books";
import { client } from "../../sanity/lib/client";

import { BookView } from "../../components/book";
import { BOOKS_QUERYResult } from "../../../sanity.types";

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

const Books: React.FC = async () => {
  const books: BOOKS_QUERYResult = await client.fetch(BOOKS_QUERY);

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">What I'm reading</h1>

      <div className="grid grid-flow-row xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {books.map((book) => {
          return <BookView key={book._id} book={book} />;
        })}
      </div>
    </>
  );
};

export default Books;
