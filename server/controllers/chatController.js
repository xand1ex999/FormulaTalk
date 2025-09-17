import Chat from "../models/Chat/Chat.js";

class chatController{

  async createChat(req, res){
    try {
      const userId = req.user.id;
      const {receiverId} = req.body;
      if (!receiverId) {
        return res.status(400).json({ message: "receiverId is required" });
      }
      let chat = await Chat.findOne({
        participants: { $all: [userId, receiverId] },
      })
      if (!chat) {
        chat = new Chat({
          participants: [userId, receiverId],
        });
        await chat.save();
      }
      res.status(201).json(chat);
    } catch (error) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }


   async getAllChats(req, res){
      try {
        const userId = req.user.id;
        const chats = await Chat.find({participants: userId})
        .populate("participants", "username avatar") 
        .populate("lastMessage");
        res.json(chats);
      } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
  }

}

export default new chatController();