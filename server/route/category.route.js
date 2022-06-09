const express = require("express");
const ctrl = require("../controllers/category.controller");
const categoryRoutes = express.Router();

categoryRoutes.route("/").get(ctrl.getCategories).post(ctrl.createCategory);

categoryRoutes.route("/:id").put(ctrl.updateCategory);

module.exports = categoryRoutes;
