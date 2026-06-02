const mongoose = require('mongoose');
const { mongoUri } = require('./config');

function connect() {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { connect, mongoose };
