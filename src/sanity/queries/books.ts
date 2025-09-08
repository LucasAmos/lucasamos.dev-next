import { defineQuery } from "next-sanity";

export const BOOKS_QUERY = defineQuery(`
*[_type == "book"] | order(startDate desc) {
  _id,
  author -> {name},
  category -> {name},
  finishDate,
  startDate,
  title,
  estimated,
  url
}`);
