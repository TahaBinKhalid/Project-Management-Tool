require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User'); 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name _id');
    console.log("Found users:", users); 
    res.json(users);
  } catch (err) {
    console.error("User Route Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time server running on port ${PORT}`);
});