import express from "express";   
import mongoose from "mongoose"; 
import dotenv from "dotenv";     
import cors from "cors"; 
import http, { createServer } from 'http'
import { Server } from "socket.io";
import multer from "multer";
import cloudinary from "cloudinary";
import fs from "fs";

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

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: 'tmp/' });

const allowedOrigins = [
  "http://localhost:5173",
  "https://formulatalk-webapp.onrender.com"
];

//Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', postRoutes);
app.use('/api', chatRoutes);
app.use('/api', messageRoutes);

app.get("/", (req, res) => {
  res.send("🚀 backend is working!");
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "posts" 
    });
    fs.unlinkSync(req.file.path);
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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


