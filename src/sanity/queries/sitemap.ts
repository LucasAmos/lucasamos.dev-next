import { defineQuery } from "next-sanity";

export const SITEMAP_QUERY = defineQuery(`
*[_type in ["cv", "about"] && defined(slug.current)] {
    "href": select(
    _type == "cv" => "/" + parentPage->slug.current + "/" + slug.current,
      _type == "about" => slug.current,
      slug.current
    ),
    _updatedAt
  }
`);
