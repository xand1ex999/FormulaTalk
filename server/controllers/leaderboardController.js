import User from "../models/User.js";

class LeaderboardController {

  async getLeaders(req, res) {
    try {
      const leaders = await User.find()
      .select("_id username rank points avatar")
      .sort({points: -1})                   
      .limit(3);
      if(!leaders){
        return res.status(400).json({message: "No leaders so far"})
      }
      res.json(leaders)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Can`t fetch the leaders' });
    }
  }
}

export default new LeaderboardController;