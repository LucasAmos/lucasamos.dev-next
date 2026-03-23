import { BookView } from "./book";
import { BOOKS_BY_YEAR_QUERY_RESULT } from "../../sanity.types";

export default function BooksView({ books }: { books: BOOKS_BY_YEAR_QUERY_RESULT }) {
  return (
    <div className="grid grid-flow-row xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {books.map((book) => {
        return <BookView key={book._id} book={book} />;
      })}
    </div>
  );
}
