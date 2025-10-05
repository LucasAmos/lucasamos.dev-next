import { defineQuery } from "next-sanity";

export const BOOKS_BY_YEAR_AND_CATEGORY_QUERY = defineQuery(`
  { 'books' :*[_type == "book" && finishDate >= $yearStart && finishDate <= $yearEnd && category->slug.current == $category] | order(startDate desc) {
    _id,
    audiobook,
    author -> {name},
    category -> {name, slug},
    estimated,
    finishDate,
    startDate,
    title,
    url
  },
  'category' :*[_type == "category" && slug.current == $slug]
  }
`);
