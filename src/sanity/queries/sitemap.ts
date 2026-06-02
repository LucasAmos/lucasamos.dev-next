import { defineQuery } from "next-sanity";

export const SITEMAP_QUERY = defineQuery(`
{
  "pages": *[
    _type in ["cv", "about"] &&
    defined(slug.current)
  ]{
    "href": select(
      _type == "cv" => "/" + parentPage->slug.current + "/" + slug.current,
      _type == "about" => slug.current,
      slug.current
    ),
    _updatedAt
  },
  "authors": *[
    _type == "author"
  ]{
    "slug":  slug.current,
  },
    "categories": *[
    _type == "category"
  ]{
    "slug":  slug.current
  }
}
`);
