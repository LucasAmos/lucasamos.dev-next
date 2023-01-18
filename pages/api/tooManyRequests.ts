import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.status(429).json(JSON.stringify({ error: "Rate limit reached" }));
};
