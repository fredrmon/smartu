const express = require("express");
const ctrl = require("../controllers/question.controller");
const questionRoutes = express.Router();

questionRoutes.route("/").get(ctrl.getQuestions).post(ctrl.createQuestion);

questionRoutes
  .route("/:id")
  .get(ctrl.getQuestion)
  .put(ctrl.updateQuestion)
  .delete(ctrl.deleteQuestion);

questionRoutes
  .route("/:id/answers")
  .get(ctrl.getQuestionAnswerOptions)
  .post(ctrl.createQuestionAnswerOptions);

questionRoutes
  .route("/:id/answers/:answerid")
  .get(ctrl.getQuestionAnswerOptions)
  .put(ctrl.updateQuestionAnswerOptions);

module.exports = questionRoutes;
