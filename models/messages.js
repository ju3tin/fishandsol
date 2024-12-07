// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

if (!mongoose.models.Message) {
  module.exports = mongoose.model('Message', messageSchema);
}