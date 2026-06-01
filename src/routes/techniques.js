const { Router } = require('express');
const { techniques, getId } = require('../db');

const router = Router();

/* ─────────────────────────────────────────────
   Helper – validate the request body
   ───────────────────────────────────────────── */
function validate(body, res) {
  const { technique, category } = body;
  if (!technique || typeof technique !== 'string' || !technique.trim()) {
    res.status(400).json({ error: '"technique" is required and must be a non-empty string.' });
    return false;
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    res.status(400).json({ error: '"category" is required and must be a non-empty string.' });
    return false;
  }
  return true;
}

/* ─────────────────────────────────────────────
   GET  /techniques  – list all
   ───────────────────────────────────────────── */
router.get('/', (req, res) => {
  res.json(techniques);
});

/* ─────────────────────────────────────────────
   GET  /techniques/:id  – get one
   ───────────────────────────────────────────── */
router.get('/:id', (req, res) => {
  const item = techniques.find((t) => t.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Technique not found.' });
  res.json(item);
});

/* ─────────────────────────────────────────────
   POST /techniques  – create
   ───────────────────────────────────────────── */
router.post('/', (req, res) => {
  if (!validate(req.body, res)) return;

  const { technique, category, description = '' } = req.body;
  const newItem = {
    id: getId(),
    technique: technique.trim(),
    category: category.trim(),
    description: typeof description === 'string' ? description.trim() : '',
  };

  techniques.push(newItem);
  res.status(201).json(newItem);
});

/* ─────────────────────────────────────────────
   PUT /techniques/:id  – full update
   ───────────────────────────────────────────── */
router.put('/:id', (req, res) => {
  const idx = techniques.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Technique not found.' });
  if (!validate(req.body, res)) return;

  const { technique, category, description = '' } = req.body;
  techniques[idx] = {
    ...techniques[idx],
    technique: technique.trim(),
    category: category.trim(),
    description: typeof description === 'string' ? description.trim() : '',
  };

  res.json(techniques[idx]);
});

/* ─────────────────────────────────────────────
   PATCH /techniques/:id  – partial update
   ───────────────────────────────────────────── */
router.patch('/:id', (req, res) => {
  const idx = techniques.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Technique not found.' });

  const { technique, category, description } = req.body;
  if (technique !== undefined) techniques[idx].technique = String(technique).trim();
  if (category !== undefined)  techniques[idx].category  = String(category).trim();
  if (description !== undefined) techniques[idx].description = String(description).trim();

  res.json(techniques[idx]);
});

/* ─────────────────────────────────────────────
   DELETE /techniques/:id  – remove
   ───────────────────────────────────────────── */
router.delete('/:id', (req, res) => {
  const idx = techniques.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Technique not found.' });

  const [removed] = techniques.splice(idx, 1);
  res.json({ message: 'Technique deleted successfully.', deleted: removed });
});

module.exports = router;
