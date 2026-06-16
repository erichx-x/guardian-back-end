const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { connect } = require('./db');
const { port } = require('./config');
const techniquesRouter = require('./routes/techniques');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const User = require('./models/User');
const Technique = require('./models/Technique');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/techniques', techniquesRouter);
app.use('/users', usersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Initial data for seeding
const initialUsers = [
  {
    name: 'Administrador',
    email: 'admin@guardian.com',
    password: 'admin',
    role: 'admin',
  },
  {
    name: 'Editor BJJ',
    email: 'editor@guardian.com',
    password: 'editor',
    role: 'editor',
  },
  {
    name: 'Aluno',
    email: 'user@guardian.com',
    password: 'user',
    role: 'user',
  },
];

const initialTechniques = [
  { technique: 'O-soto-gari', category: 'Quedas', description: 'Projeção clássica com desequilíbrio lateral.' },
  { technique: 'Ippon seoi nage', category: 'Quedas', description: 'Projeção de ombro com controle de manga.' },
  { technique: 'Triângulo', category: 'Defesas', description: 'Finalização de pernas no pescoço do adversário.' },
  { technique: 'Omoplata', category: 'Defesas', description: 'Finalização usando a rotação do tronco e controle de braço.' },
  { technique: 'Guarda fechada tradicional', category: 'Raspagem', description: 'Controle de guarda com toque de quadril e pegada de manga.' },
  { technique: 'Passagem de guarda', category: 'Passagem', description: 'Pressão e controle para conquistar a meia-guarda.' },
  { technique: 'Americana', category: 'Finalização', description: 'Chave de ombro com controle do braço do adversário.' },
  { technique: 'Kimura', category: 'Finalização', description: 'Chave de ombro com rotação e controle de pulso.' },
  { technique: 'Ogoshi', category: 'Quedas', description: 'Projeção de quadril com rotação de corpo e alavanca.' },
  { technique: 'Meia guarda moderna', category: 'Raspagem', description: 'Controle de meia-guarda com gancho e pegada de manga.' },
];

async function initializeDatabase() {
  const existingUsers = await User.countDocuments();
  if (existingUsers === 0) {
    await Promise.all(
      initialUsers.map(async (user) => {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await User.create({
          name: user.name,
          email: user.email,
          role: user.role,
          passwordHash,
          status: 'active',
        });
      })
    );
    console.log('✓ Usuários iniciais criados.');
  }

  const existingTechniques = await Technique.countDocuments();
  if (existingTechniques === 0) {
    await Technique.insertMany(initialTechniques);
    console.log('✓ Técnicas iniciais criadas.');
  }
}

connect()
  .then(async () => {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Guardian API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao conectar no MongoDB:', error);
    process.exit(1);
  });

module.exports = app;
