const QuestionQuery = {
  GET_QUESTION: "SELECT * FROM quiz_question WHERE questionid = ?",
  GET_QUESTIONS: "SELECT * FROM quiz_question",
  CREATE_QUESTION:
    "INSERT INTO quiz_question (questionid, questinact, questiontype, questioncategory, questiondifficulty, image, questiontheme, questionavailable, fixed, activityid, inallactivities, probzA, probzB, probzC, diff, monades, RTE_threshold) VALUES (DEFAULT, 1, 1, ?, ?, ?, ?, 1, 1, ?, 1, 0, 0, 0, 1, 0, 0)",
  GET_QUESTION_ANSWER_OPTIONS: "SELECT * FROM quiz_answer WHERE questionid = ?",
  UPDATE_QUESTION:
    "UPDATE quiz_question SET questioncategory = ?, questiondifficulty = ?, questiontheme = ?, image = ? WHERE questionid = ?",
  UPDATE_QUESTION_ANSWER_OPTION:
    "UPDATE quiz_answer SET answer = ?, correctanswer = ? WHERE questionid = ? AND answerid = ?",
  CREATE_QUESTION_ANSWER_OPTION:
    "INSERT INTO quiz_answer (answerid, questionid, answer, correctanswer) VALUES (DEFAULT, ?, ?, ?)",
  DELETE_QUESTION_ANSWER_OPTION: "",
  DELETE_QUESTION: "DELETE FROM quiz_question WHERE questionid = ?",
  // GET_QUESTION_DIFFICULTY_DISTRIBUTION:
  //   "SELECT quiz_question.questionid, quiz_question.questioncategory, question_category.categoryname, quiz_question.questiondifficulty, COUNT(quiz_question.questiondifficulty) as number_of_questions FROM quiz_question LEFT JOIN question_category ON quiz_question.questioncategory = question_category.categoryid WHERE quiz_question.activityid = ? GROUP BY quiz_question.questioncategory, quiz_question.questiondifficulty",
};

module.exports = QuestionQuery;
