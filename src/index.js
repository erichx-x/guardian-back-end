const express = require('express');
const techniquesRouter = require('./routes/techniques');

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ── */
app.use(express.json());

/* ── CORS (allow the Next.js dev server) ── */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── Routes ── */
app.use('/techniques', techniquesRouter);

/* ── Health-check ── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`Guardian API running on http://localhost:${PORT}`);
});

module.exports = app;
