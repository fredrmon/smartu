const AnnouncementQuery = {
  GET_ANNOUNCEMENTS: "SELECT * FROM announcement",
  GET_ANNOUNCEMENT: "SELECT * FROM announcement WHERE id = ?",
  CREATE_ANNOUNCEMENT:
    "INSERT INTO announcement (id, title, content, date) values (DEFAULT, ?, ?, CURRENT_TIMESTAMP)",
  UPDATE_ANNOUNCEMENT:
    "UPDATE announcement SET title = ?, content = ? WHERE id = ?",
  DELETE_ANNOUNCEMENT: "DELETE FROM announcement WHERE id = ?",
};

module.exports = AnnouncementQuery;
