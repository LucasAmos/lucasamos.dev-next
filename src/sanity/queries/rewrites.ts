import { defineQuery } from "next-sanity";

export const REWRITES_QUERY = defineQuery(`
*[_type != "rewrite" && references(*[_type == "rewrite"]._id)]{
  _type,
  slug,
  rewrite-> {
    slug  {
    current
    }
  }
}
`);
