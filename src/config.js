const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/guardian',
  jwtSecret: process.env.JWT_SECRET || 'guardian_default_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
};
