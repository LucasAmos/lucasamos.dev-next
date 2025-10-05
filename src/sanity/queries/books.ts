import { defineQuery } from "next-sanity";

export const BOOKS_QUERY = defineQuery(`
   *[_type == "book" && finishDate ==null || finishDate >= $yearStart && finishDate <= $yearEnd] | order(startDate desc) {
    _id,
    audiobook,
    author -> {name},
    category -> {name, slug},
    estimated,
    finishDate,
    startDate,
    title,
    url
  }
`);
