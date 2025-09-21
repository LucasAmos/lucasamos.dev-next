import { defineQuery } from "next-sanity";

export const BOOKS_THIS_YEAR_QUERY = defineQuery(`
  *[_type == "book" && (finishDate == null || finishDate >= $yearStart && finishDate <= $yearEnd)] | order(startDate desc) {
    _id,
    audiobook,
    author -> {name},
    category -> {name},
    estimated,
    finishDate,
    startDate,
    title,
    url
  }
`);
