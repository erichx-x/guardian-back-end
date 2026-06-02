const express = require('express');
const cors = require('cors');
const { connect } = require('./db');
const { port } = require('./config');
const techniquesRouter = require('./routes/techniques');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/techniques', techniquesRouter);
app.use('/users', usersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Guardian API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao conectar no MongoDB:', error);
    process.exit(1);
  });

module.exports = app;
