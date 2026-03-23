import { defineQuery } from "next-sanity";

export const ABOUT_QUERY = defineQuery(`
*[_type == "about" && slug.current=="about"]{
  title, 
  content,
  imageRow {
  images[]{
    ...,
    asset-> {
      url,
      metadata {
      lqip
      }
    }
  }
 }
}
`);
