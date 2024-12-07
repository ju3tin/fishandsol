const WebSocket = require('ws');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a message schema
const messageSchema = new mongoose.Schema({
  text: String,
  timestamp: String,
});

const Message = mongoose.model('Message', messageSchema);

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log('Received:', message);

    // Save message to MongoDB
    const timestamp = new Date().toLocaleTimeString();
    const newMessage = new Message({ text: message, timestamp });
    await newMessage.save();

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080'); 