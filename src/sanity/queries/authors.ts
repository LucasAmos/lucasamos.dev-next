import { defineQuery } from "next-sanity";

export const AUTHORS_QUERY = defineQuery(`
   *[_type == "author" ]{
      "slug": slug.current
    }
`);
