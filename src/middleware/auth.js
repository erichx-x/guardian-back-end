const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const User = require('../models/User');

async function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inválido ou inativo.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Acesso não autorizado.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    next();
  };
}

module.exports = { authenticate, authorize };
