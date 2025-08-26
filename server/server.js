import express from "express";   
import mongoose from "mongoose"; 
import dotenv from "dotenv";     
import cors from "cors"; 
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', postRoutes);

app.get("/", (req, res) => {
  res.send("🚀 backend is working!");
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startApp();


