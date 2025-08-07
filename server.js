// server.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files (like broadcaster.html, listener.html)
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO for signaling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('broadcaster', () => {
    socket.broadcast.emit('broadcaster');
    console.log('Broadcaster ready');
  });

  socket.on('watcher', () => {
    socket.broadcast.emit('watcher', socket.id);
  });

  socket.on('offer', (id, message) => {
    socket.to(id).emit('offer', socket.id, message);
  });

  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });

  socket.on('candidate', (id, message) => {
    socket.to(id).emit('candidate', socket.id, message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnectPeer', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
