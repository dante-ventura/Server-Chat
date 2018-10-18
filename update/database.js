var mongoose = require('mongoose');

module.exports = gamedb = mongoose.createConnection(`mongodb://127.0.0.1/chat`, { useNewUrlParser: true })