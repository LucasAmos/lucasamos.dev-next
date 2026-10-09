import { defineQuery } from "next-sanity";

export const ABOUT_PAGE_QUERY = defineQuery(`
*[_type == "about" && slug.current=="about"]{
  title, 
  content,
  techStack -> {
  title,
  techStackSection[] -> {
    title,
    skills,
    "icon": coalesce(icon, "")
  }
},
  imageRow {
  images[]{
    ...,
    asset-> {
      _id,
      url,
      metadata {
      lqip
      }
    }
  }
 }
}
`);
