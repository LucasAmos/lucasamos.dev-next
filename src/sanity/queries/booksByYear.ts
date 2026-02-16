import { defineQuery } from "next-sanity";

export const BOOKS_BY_YEAR_QUERY = defineQuery(`
  *[_type == "book" && finishDate >= $yearStart && finishDate <= $yearEnd] | order(startDate desc) {
    _id,
    audiobook,
    author -> {name, slug},
    category -> {name, slug},
    estimated,
    finishDate,
    startDate,
    title,
    url
  }
`);
