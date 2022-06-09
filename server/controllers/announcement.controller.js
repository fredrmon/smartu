const db = require("../dbConnection");
const AnnouncementQuery = require("../queries/announcement.query");
const http = require("../utils/httpStatus");

const getAnnouncement = (request, response) => {
  db.query(
    AnnouncementQuery.GET_ANNOUNCEMENT,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getAnnouncements = (request, response) => {
  db.query(AnnouncementQuery.GET_ANNOUNCEMENTS, (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const createAnnouncement = (request, response) => {
  db.query(
    AnnouncementQuery.CREATE_ANNOUNCEMENT,
    Object.values(request.body),
    (error, result) => {
      // TODO: Add 400 Bad Request handling
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      else response.status(http.CREATED).send(result);
    }
  );
};

const updateAnnouncement = (request, response) => {
  db.query(
    AnnouncementQuery.UPDATE_ANNOUNCEMENT,
    [request.body.title, request.body.content, request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const deleteAnnouncement = (request, response) => {
  db.query(
    AnnouncementQuery.DELETE_ANNOUNCEMENT,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (result.affectedRows > 0) response.status(http.OK).send(result);
      else response.status(http.NOT_FOUND);
    }
  );
};

module.exports = {
  getAnnouncement,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
