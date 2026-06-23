import { AUTHORS_AND_BOOKS_QUERY_RESULT } from "../../sanity.types";
import { AuthorView } from "./author";

export default function AuthorsView({ authors }: { authors: AUTHORS_AND_BOOKS_QUERY_RESULT }) {
  return (
    <div className="grid grid-flow-row xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {authors.map((author) => {
        return <AuthorView key={author._id} author={author} />;
      })}
    </div>
  );
}
