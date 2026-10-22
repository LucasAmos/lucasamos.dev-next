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
    return <div>category: test: {book.test.test}</div>;
  }
  if (book.test._type === "author") {
    return <div>author: name: {book.test.name}</div>;
  }
  return <div>unknown</div>;
}
