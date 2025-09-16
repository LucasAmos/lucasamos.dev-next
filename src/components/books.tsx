import { BookView } from "./book";
import { BOOKS_QUERYResult } from "../../sanity.types";

export default async function BooksView({ books }: { books: BOOKS_QUERYResult }) {
  return (
    <div className="grid grid-flow-row xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {books.map((book) => {
        return <BookView key={book._id} book={book} />;
      })}
    </div>
  );
}
