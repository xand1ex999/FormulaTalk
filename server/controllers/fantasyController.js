import User from "../models/User.js";

class fantasyController{

  async createFavorites(req, res) {
    try {
      const { userId, favoriteDriver, favoriteTeam } = req.body;
      if (!req.user || req.user.id !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            favoriteDriver: {
              id: favoriteDriver.id,
              name: favoriteDriver.name,
              team: favoriteDriver.team,
              avatar: favoriteDriver.avatar
            },
            favoriteTeam: {
              id: favoriteTeam.id,
              name: favoriteTeam.name,
              logo: favoriteTeam.logo
            }
          }
        },
        { 
          new: true, 
          runValidators: true 
        }
      ).select('-password'); 
      
      res.status(200).json({
        success: true,
        message: 'Favorite selection updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating favorite selection:', error);
      res.status(500).json({ message: 'Error updating favorite selection' });
    }
  }

  async getFavoriteSelection(req, res){
    try {
      const { username } = req.params;
      const user = await User.findOne({username: username})
      .select("_id username favoriteDriver favoriteTeam")
      res.json(user)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting favorite selection' });
    }
  }

}

export default new fantasyController();