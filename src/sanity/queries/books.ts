import { defineQuery } from "next-sanity";

export const BOOKS_QUERY = defineQuery(`
*[_type == "book"]{
  _id,
  author,
  category -> {name},
  finishDate,
  startDate,
  title,
}`);
