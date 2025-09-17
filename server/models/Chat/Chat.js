import mongoose from 'mongoose';

const Chat = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ], 
  isGroup: {
    type: Boolean,
    default: false
  },
  chatName: {
    type: String,
    default: null 
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Chat', Chat);
