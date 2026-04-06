import { defineQuery } from "next-sanity";

export const ABOUT_QUERY = defineQuery(`
*[_type == "about" && slug.current=="about"]{
  title, 
  content,
  techStack -> {
  title,
  techStackSection[] -> {
    title,
    skills,
    icon
  }
},
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
