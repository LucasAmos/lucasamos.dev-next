import { defineQuery } from "next-sanity";

export const CATEGORIES_QUERY = defineQuery(`
   *[_type == "category" ]{
      "category": slug.current
    }
`);
