import mongoose from 'mongoose'

const UserSchema  = new mongoose.Schema({
  username: {
    type: String,
    required: true,  
    unique: true,
    minlength: 3,
    maxlength: 20
    },
  email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true,
      minlength: 5,
      maxlength: 50
  },
  password: {
    type: String,
    required: true 
  },
  bio: {
    type: String,
    default: ""
  },
  avatar: {
    type: String
  },
  rank: { 
    type: String,
    enum: ['Rookie', 'Pro', 'Champion'], default: 'Rookie' 
  },
  points: {
    type: Number,
    default: 0
  },
  favoriteDriver: {
    id: { type: String, default: null },
    name: { type: String, default: null },
    team: { type: String, default: null },
    avatar: { type: String, default: null }
  },
  favoriteTeam: {
    id: { type: String, default: null },
    name: { type: String, default: null },
    logo: { type: String, default: null }
  }
}, { timestamps: true });


export default mongoose.model('User', UserSchema )