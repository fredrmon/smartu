const db = require("../dbConnection");
const UserQuery = require("../queries/user.query");
const http = require("../utils/httpStatus");

const getUser = (request, response) => {
  db.query(UserQuery.GET_USER, [request.params.id], (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const getUsers = (request, response) => {
  db.query(UserQuery.GET_USERS, (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

module.exports = { getUser, getUsers };
