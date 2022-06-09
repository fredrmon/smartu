const CategoryQuery = {
  GET_CATEGORIES: "SELECT * FROM question_category",
  CREATE_CATEGORY:
    "INSERT INTO question_category(categoryid, categoryname) VALUES (DEFAULT, ?)",
  UPDATE_CATEGORY:
    "UPDATE question_category SET categoryname = ? WHERE categoryid = ?",
};

module.exports = CategoryQuery;
