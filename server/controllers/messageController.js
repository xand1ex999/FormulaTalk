import Chat from "../models/Chat/Chat.js";
import Message from "../models/Chat/Message.js";

class messageController{

  async loadChat(req, res){
    try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  }

   async sendMessage(req, res){
    const { text } = req.body;
    const { chatId } = req.params; 
    
    if (!text || !chatId) {
      return res.status(400).json({ message: "Text and chatId are required" });
    }

    try {
      const newMessage = await Message.create({
        chat: chatId,         
        sender: req.user.id,  
        text
      });
      await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });
      const io = req.app.get("io");
      const populatedMessage = await newMessage.populate("sender", "username");
      io.to(chatId).emit("receive_message", populatedMessage);
      res.status(201).json(newMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send message" });
    }
  }

}

export default new messageController();