import { defineQuery } from "next-sanity";

export const CV_QUERY = defineQuery(`
    *[_type == "cv" && slug.current=="cv"]{
      parentPage -> {
      title
    },
    title, 
    content
  }
`);
