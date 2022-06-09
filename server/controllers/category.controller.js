const db = require("../dbConnection");
const CategoryQuery = require("../queries/category.query");
const http = require("../utils/httpStatus");

const getCategories = (request, response) => {
  db.query(CategoryQuery.GET_CATEGORIES, (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const createCategory = (request, response) => {
  db.query(
    CategoryQuery.CREATE_CATEGORY,
    request.body.title,
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      else response.status(http.CREATED).send(result);
    }
  );
};

const updateCategory = (request, response) => {
  db.query(
    CategoryQuery.UPDATE_CATEGORY,
    [request.body.categoryname, request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

module.exports = { getCategories, createCategory, updateCategory };
