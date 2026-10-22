import { defineQuery } from "next-sanity";

export const BOOKS_BY_CATEGORY_QUERY = defineQuery(`
  { 'books' :*[_type == "book" && finishDate != null && category->slug.current == $category] | order(startDate desc) {
    _id,
    _type,
    audiobook,
    author -> {name, slug},
    category -> {name, slug},
    estimated,
    finishDate,
    startDate,
    title,
    url,
    test -> {
      _type == "author" => {
        _type,
        name
      },
      _type == "category" => {
        _type,
        name
      }
    }
  },
  'category' :*[_type == "category" && slug.current == $category]
  }
`);
