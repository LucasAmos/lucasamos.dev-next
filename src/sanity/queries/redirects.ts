import { defineQuery } from "next-sanity";

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect"]{
  source,
  destination
}
`);
