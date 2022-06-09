const db = require("../dbConnection");
const QuestionQuery = require("../queries/question.query");
const http = require("../utils/httpStatus");

const getQuestion = (request, response) => {
  db.query(QuestionQuery.GET_QUESTION, [request.params.id], (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const getQuestions = (request, response) => {
  db.query(QuestionQuery.GET_QUESTIONS, (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const updateQuestion = (request, response) => {
  db.query(
    QuestionQuery.UPDATE_QUESTION,
    [
      request.body.questioncategory,
      request.body.questiondifficulty,
      request.body.questiontheme,
      request.body.image,
      request.params.id,
    ],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const createQuestion = (request, response) => {
  console.log(request.body);
  db.query(
    QuestionQuery.CREATE_QUESTION,
    [
      request.body.questioncategory,
      request.body.questiondifficulty,
      request.body.image,
      request.body.questiontheme,
      request.body.activityid,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(http.INTERNAL_SERVER_ERROR).send(error);
      } else response.status(http.CREATED).send(result);
    }
  );
};

const deleteQuestion = (request, response) => {
  db.query(
    QuestionQuery.DELETE_QUESTION,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (result.affectedRows > 0) response.status(http.OK).send(result);
      else response.status(http.NOT_FOUND);
    }
  );
};

const getQuestionAnswerOptions = (request, response) => {
  db.query(
    QuestionQuery.GET_QUESTION_ANSWER_OPTIONS,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const updateQuestionAnswerOptions = (request, response) => {
  db.query(
    QuestionQuery.UPDATE_QUESTION_ANSWER_OPTION,
    [
      request.body.answer,
      request.body.correctanswer,
      request.params.id,
      request.params.answerid,
    ],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const createQuestionAnswerOptions = (request, response) => {
  db.query(
    QuestionQuery.CREATE_QUESTION_ANSWER_OPTION,
    [
      request.body.questionid,
      request.body.answer,
      request.body.correctanswer,
      request.params.questionid,
    ],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      else response.status(http.CREATED).send(result);
    }
  );
};

module.exports = {
  getQuestion,
  getQuestions,
  updateQuestion,
  createQuestion,
  deleteQuestion,
  getQuestionAnswerOptions,
  updateQuestionAnswerOptions,
  createQuestionAnswerOptions,
};
