const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  const normalized = String(username).trim().toLowerCase();
  const user = await User.findOne({ $or: [{ email: normalized }, { name: normalized }] });

  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Usuário inativo.' });
  }

  const token = jwt.sign({ sub: user.id, role: user.role, name: user.name }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    token,
  });
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logout realizado com sucesso.' });
});

router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
