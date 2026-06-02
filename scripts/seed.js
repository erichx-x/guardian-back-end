const bcrypt = require('bcrypt');
const { connect } = require('../src/db');
const Technique = require('../src/models/Technique');
const User = require('../src/models/User');

const users = [
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

const sampleTechniques = [
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

async function seed() {
  await connect();
  console.log('Conectado ao MongoDB.');

  const existingUsers = await User.countDocuments();
  if (existingUsers === 0) {
    await Promise.all(
      users.map(async (user) => {
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
    console.log('Usuários iniciais criados.');
  } else {
    console.log('Usuários já existem, pulando criação.');
  }

  const existingTechniques = await Technique.countDocuments();
  if (existingTechniques === 0) {
    await Technique.insertMany(sampleTechniques);
    console.log('Técnicas iniciais criadas.');
  } else {
    console.log('Técnicas já existem, pulando criação.');
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error('Falha ao inicializar banco de dados:', error);
  process.exit(1);
});
