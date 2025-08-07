const io = require('socket.io')(3000);
let broadcaster;

io.on('connection', socket => {
  socket.on('broadcaster', () => broadcaster = socket.id);
  socket.on('watcher', () => broadcaster && socket.to(broadcaster).emit('watcher', socket.id));
  socket.on('offer', (id, message) => socket.to(id).emit('offer', socket.id, message));
  socket.on('answer', (id, message) => socket.to(id).emit('answer', socket.id, message));
  socket.on('candidate', (id, message) => socket.to(id).emit('candidate', socket.id, message));
  socket.on('disconnect', () => socket.id === broadcaster && (broadcaster = null));
});
