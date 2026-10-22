import type { Author, Category } from "../../sanity.types";

type BookValue = Pick<Author, "_type" | "name"> | Pick<Category, "_type" | "name">;

type BookProps = {
  book: { test: BookValue };
};

export function Book({ book }: BookProps) {
  return <div>{book.test.name}</div>;
}
