const UserQuery = {
  GET_USER: "SELECT * FROM users WHERE userid = ?",
  GET_USERS: "SELECT * FROM users",
};

module.exports = UserQuery;
