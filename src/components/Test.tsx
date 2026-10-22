import type { Author, Category } from "../../sanity.types";

type BookValue = Pick<Author, "_type" | "name"> | Pick<Category, "_type" | "name" | "test">;

type BookProps = {
  book: {
    test: BookValue;
  };
};

export function Book({ book }: BookProps) {
  console.log(book);

  if (book.test._type === "category") {
    return <div>{book.test.test}</div>;
  }
  return <div>{book.test.name}</div>;
}
