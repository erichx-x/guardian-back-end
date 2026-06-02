const { Router } = require('express');
const Technique = require('../models/Technique');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

function buildSearchFilter(query, category) {
  const filter = {};

  if (category) {
    filter.category = new RegExp(`^${category.trim()}$`, 'i');
  }

  if (query) {
    const q = query.trim();
    filter.$or = [
      { technique: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
    ];
  }

  return filter;
}

router.get('/', async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 12, 1);

  const filter = buildSearchFilter(q, category);
  const total = await Technique.countDocuments(filter);
  const techniques = await Technique.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  return res.json({ data: techniques, total, page: pageNumber, limit: pageSize });
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || String(q).trim().length === 0) {
    return res.json({ data: [], total: 0 });
  }

  const filter = buildSearchFilter(q, null);
  const techniques = await Technique.find(filter).sort({ createdAt: -1 }).limit(8);
  const total = await Technique.countDocuments(filter);

  return res.json({ data: techniques, total });
});

router.get('/:id', async (req, res) => {
  const technique = await Technique.findById(req.params.id);
  if (!technique) {
    return res.status(404).json({ error: 'Técnica não encontrada.' });
  }

  return res.json(technique);
});

router.post('/', authenticate, authorize('admin', 'editor'), async (req, res) => {
  const { technique, category, description = '', video = '', thumbnail = '', tags = [] } = req.body;

  if (!technique || !category) {
    return res.status(400).json({ error: 'Os campos technique e category são obrigatórios.' });
  }

  const newTechnique = await Technique.create({
    technique: technique.trim(),
    category: category.trim(),
    description: String(description || '').trim(),
    video: String(video || '').trim(),
    thumbnail: String(thumbnail || '').trim(),
    tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()) : [],
  });

  return res.status(201).json(newTechnique);
});

router.put('/:id', authenticate, authorize('admin', 'editor'), async (req, res) => {
  const { technique, category, description = '', video = '', thumbnail = '', tags = [] } = req.body;

  if (!technique || !category) {
    return res.status(400).json({ error: 'Os campos technique e category são obrigatórios.' });
  }

  const updated = await Technique.findByIdAndUpdate(
    req.params.id,
    {
      technique: technique.trim(),
      category: category.trim(),
      description: String(description || '').trim(),
      video: String(video || '').trim(),
      thumbnail: String(thumbnail || '').trim(),
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()) : [],
    },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: 'Técnica não encontrada.' });
  }

  return res.json(updated);
});

router.patch('/:id', authenticate, authorize('admin', 'editor'), async (req, res) => {
  const updates = {};
  const allowedFields = ['technique', 'category', 'description', 'video', 'thumbnail', 'tags'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = field === 'tags' ? (Array.isArray(req.body.tags) ? req.body.tags.map((tag) => String(tag).trim()) : []) : String(req.body[field]).trim();
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido enviado para atualização.' });
  }

  const updated = await Technique.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!updated) {
    return res.status(404).json({ error: 'Técnica não encontrada.' });
  }

  return res.json(updated);
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const deleted = await Technique.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Técnica não encontrada.' });
  }

  return res.json({ message: 'Técnica excluída com sucesso.' });
});

module.exports = router;
