import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(429).json(JSON.stringify({ error: "Rate limit reached" }));
};
