import React from "react";
import { BOOKS_QUERY } from "../../sanity/queries/books";
import { client } from "../../sanity/lib/client";

import { BookView } from "../../components/book";
import { BOOKS_QUERYResult } from "../../../sanity.types";

const Books: React.FC = async () => {
  const books: BOOKS_QUERYResult = await client.fetch(BOOKS_QUERY);

  return (
    <>
      <h1 className="mb-5 font-Inter text-3xl sm:text-4xl">My reading list</h1>

      <div className="xs:grid-cols-2 grid grid-flow-row md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {books.map((book) => {
          return <BookView key={book._id} book={book} />;
        })}
      </div>
    </>
  );
};

export default Books;
