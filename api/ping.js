module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).end(JSON.stringify({ ok: true, path: req.url, now: Date.now() }));
};


