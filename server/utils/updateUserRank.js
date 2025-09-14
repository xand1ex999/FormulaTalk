async function updateUserRank(user) {
  console.log("works rank update", user.points, "and", user.rank);

  if (user.points >= 100) {
    user.rank = 'Champion';
  } else if (user.points >= 50) {
    user.rank = 'Pro';
  } else {
    user.rank = 'Rookie';
  }
  return await user.save();
}


export default updateUserRank;