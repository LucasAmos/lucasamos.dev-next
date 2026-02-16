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

export const BOOKS_THIS_YEAR_MULTI_QUERY = defineQuery(`
  { 'books': *[_type == "book" && (finishDate == null || finishDate >= $yearStart && finishDate <= $yearEnd)] | order(startDate desc) {
    _id,
    audiobook,
    author -> {name, slug},
    category -> {name, slug},
    estimated,
    finishDate,
    startDate,
    title,
    url
  },
  'inprogress': count(*[_type == "book" && finishDate== null  ]),
  'finished': count(*[_type == "book" && (finishDate >= $yearStart && finishDate <= $yearEnd)]) 
}
`);
