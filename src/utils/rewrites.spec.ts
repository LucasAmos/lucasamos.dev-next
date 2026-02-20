import { mapRewrites } from "../lib/utils";

const rewrites = [
  {
    _type: "category",
    rewrite: { slug: { current: "warcategoryalias" } },
    slug: { _type: "slug", current: "war" }
  }
];

const routes = {
  category: "/books/category"
};

describe("first", () => {
  test("should", () => {
    const result: any = mapRewrites(rewrites, routes);

    expect(result).toEqual([
      {
        source: "warcategoryalias",
        destination: "/books/category/war"
      }
    ]);
  });
});
