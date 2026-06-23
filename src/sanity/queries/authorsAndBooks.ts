import { defineQuery } from "next-sanity";

export const AUTHORS_AND_BOOKS_QUERY = defineQuery(`
  *[_type == "author"] | order(name asc) {
  _id,
  name,
  "slug" : slug.current,
  "booksRead": count(
    *[
      _type == "book" &&
      author._ref == ^._id &&
      defined(finishDate)
    ],
  ),
  "booksInProgress": count(
    *[
      _type == "book" &&
      author._ref == ^._id &&
      !defined(finishDate)
    ]
  )
}
`);
