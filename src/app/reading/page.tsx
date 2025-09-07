import React from "react";
import { BOOKS_QUERY } from "../../sanity/queries/books";
import { client } from "../../sanity/lib/client";

import { BookView } from "../../components/book";
import { BOOKS_QUERYResult } from "../../../sanity.types";

export const revalidate = 0;

const Books: React.FC = async () => {
  const books: BOOKS_QUERYResult = await client.fetch(BOOKS_QUERY);

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl">My reading list</h1>

      <div className="grid grid-flow-row xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {books.map((book) => {
          return <BookView key={book._id} book={book} />;
        })}
      </div>
    </>
  );
};

export default Books;
