const { Router } = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json(users.map((user) => user.toJSON()));
});

router.patch('/:id/role', authenticate, authorize('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'editor', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido.' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.role = role;
  await user.save();
  return res.json(user.toJSON());
});

router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.status = status;
  await user.save();
  return res.json(user.toJSON());
});

module.exports = router;
