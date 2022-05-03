const mongoose = require('mongoose');

const messageSchema = mongoose.Schema;

module.exports = mongoose.model('Message', messageSchema);
