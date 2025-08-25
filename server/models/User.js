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
  }
}, { timestamps: true });


export default mongoose.model('User', UserSchema )