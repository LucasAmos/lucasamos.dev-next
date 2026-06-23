import type { ReactNode } from "react";
import Link from "next/link";
import { AUTHORS_AND_BOOKS_QUERY_RESULT } from "../../sanity.types";

function Author({ children }: { children: ReactNode }): ReactNode {
  return <h1 className="text-t-purple font-Inter xs:text-sm sm:text-lg lg:text-xl">{children}</h1>;
}

function BooksInProgress({ count }: { count: number }) {
  return (
    <div className="text-t-violet">
      {count} book{pluralise(count)} in progress
    </div>
  );
}

function Container({ children }: { children: ReactNode; url: string | null }): ReactNode {
  return (
    <div className="flex flex-col  mb-2 mr-2 rounded-md border border-t-violet p-2">{children}</div>
  );
}

function pluralise(number: number) {
  return number === 1 ? "" : "s";
}

function BooksFinished({ count }: { count: number }) {
  return (
    <div className="text-t-darkgreen">
      {count} book{pluralise(count)} finished
    </div>
  );
}

export function AuthorView({
  author
}: {
  author: AUTHORS_AND_BOOKS_QUERY_RESULT[number];
}): ReactNode {
  const { booksInProgress, booksRead, name, slug } = author;
  return (
    <Link href={`/books/author/${slug}`}>
      <Container url={"url"}>
        <div className="flex flex-col grow justify-between">
          <div className="flex-row flex justify-between">
            <div>
              <Author>{name}</Author>
            </div>
          </div>
          <div className="flex-col flex justify-between">
            <BooksInProgress count={booksInProgress} />
            <BooksFinished count={booksRead} />
          </div>
        </div>
      </Container>
    </Link>
  );
}
