const express = require("express");
const ctrl = require("../controllers/announcement.controller");
const announcementRoutes = express.Router();

announcementRoutes
  .route("/")
  .get(ctrl.getAnnouncements)
  .post(ctrl.createAnnouncement);

announcementRoutes
  .route("/:id")
  .get(ctrl.getAnnouncement)
  .put(ctrl.updateAnnouncement)
  .delete(ctrl.deleteAnnouncement);

module.exports = announcementRoutes;
