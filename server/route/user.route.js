const express = require("express");
const ctrl = require("../controllers/user.controller");
const userRoutes = express.Router();

userRoutes.route("/").get(ctrl.getUsers);

userRoutes.route("/:id").get(ctrl.getUser);

module.exports = userRoutes;
