/* Any request that falls through the router lands here as a clean 404 JSON. */
export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}
