import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // you can replace * with your frontend URL for security
    methods: ["GET", "POST"]
  }
});

// Track users in each room
const rooms = {
  general: new Set(),
  anxiety: new Set(),
  depression: new Set(),
  random: new Set()
};

// Track username to socket mapping
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_connected', ({ username }) => {
    userSocketMap.set(socket.id, username);
    updateUserCounts();
  });

  socket.on('join_room', ({ room, username }) => {
    Object.keys(rooms).forEach(r => rooms[r].delete(socket.id));
    socket.join(room);
    rooms[room].add(socket.id);

    io.to(room).emit('message_received', {
      id: Date.now(),
      text: `${username} has joined the chat`,
      sender: 'System',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: room
    });

    updateUserCounts();
  });

  socket.on('leave_room', ({ room }) => {
    const username = userSocketMap.get(socket.id);
    socket.leave(room);
    rooms[room]?.delete(socket.id);

    io.to(room).emit('message_received', {
      id: Date.now(),
      text: `${username} has left the chat`,
      sender: 'System',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: room
    });

    updateUserCounts();
  });

  socket.on('send_message', (message) => {
    io.to(message.room).emit('message_received', {
      ...message,
      isCurrentUser: false
    });
  });

  socket.on('disconnect', () => {
    const username = userSocketMap.get(socket.id);
    userSocketMap.delete(socket.id);

    Object.entries(rooms).forEach(([room, users]) => {
      if (users.delete(socket.id)) {
        io.to(room).emit('message_received', {
          id: Date.now(),
          text: `${username} has disconnected`,
          sender: 'System',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          room: room
        });
      }
    });

    updateUserCounts();
  });

  function updateUserCounts() {
    const counts = {};
    Object.entries(rooms).forEach(([room, users]) => {
      counts[room] = users.size;
    });
    io.emit('user_count_update', counts);
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});