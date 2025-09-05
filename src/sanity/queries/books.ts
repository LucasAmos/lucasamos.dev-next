import { defineQuery } from "next-sanity";

export const BOOKS_QUERY = defineQuery(`
*[_type == "book"] | order(startDate desc) {
  _id,
  author,
  category -> {name},
  finishDate,
  startDate,
  title,
}`);
