import { defineQuery } from "next-sanity";

export const OLDEST_BOOK_QUERY = defineQuery(`
*[_type == "book"] | order(finishDate asc)[0] {
    finishDate
}
`);
