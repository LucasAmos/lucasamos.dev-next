import { REWRITES_QUERYResult } from "../../sanity.types";

type Routes = {
  category: string;
};

export function calculateReadingTime(text: string): number {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

export function mapRewrites(rewrites: REWRITES_QUERYResult, routes: Routes) {
  const results = rewrites.map((record) => {
    if (record._type === "category") {
      return {
        source: record.rewrite?.slug.current,
        destination: `${routes["category"]}/${record.slug.current}`,
      };
    }
  });
  return results;
}
