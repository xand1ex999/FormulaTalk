import express from "express";   
import mongoose from "mongoose"; 
import dotenv from "dotenv";     
import cors from "cors"; 
import http, { createServer } from 'http'
import { Server } from "socket.io";
//routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
//socket
import initWebSocket from "./WebSocket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const allowedOrigins = [
  'http://localhost:5173',               
  'https://formulatalk-webapp.onrender.com/' 
];

// Middleware
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', postRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api', chatRoutes);
app.use('/api', messageRoutes);

app.get("/", (req, res) => {
  res.send("🚀 backend is working!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);
initWebSocket(io);

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {  
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startApp();


