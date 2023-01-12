export default async (req, res) => {
  res.status(429).json(JSON.stringify({ error: "Rate limit reached" }));
};
