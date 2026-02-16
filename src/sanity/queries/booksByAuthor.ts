import { defineQuery } from "next-sanity";

export const BOOKS_BY_AUTHOR_QUERY = defineQuery(`
  { 'books' :*[_type == "book" && finishDate != null && author->slug.current== $slug] | order(startDate desc) {
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
  'author' :*[_type == "author" && slug.current == $slug]
  }
`);
