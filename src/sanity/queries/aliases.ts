import { defineQuery } from "next-sanity";

export const ALIASES_QUERY = defineQuery(`
   *[_type == "alias"] {
    source,
    destination
  }
`);
