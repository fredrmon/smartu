const ActivityQuery = {
  GET_ACTIVITY:
    "SELECT activityname, activitystatus, activitydescription, activitycreator, levellow, levelhigh, adaptive_instruction, fixed_instruction, phasetwobegindate, phasetwoenddate, UNIX_TIMESTAMP(startDate) as startDate, UNIX_TIMESTAMP(endDate) as endDate, IF(archived, 'true', 'false') archived FROM activities WHERE activityid = ?",
  GET_ACTIVITIES:
    "SELECT activityid, activityname, activitystatus, activitydescription, activitycreator, levellow, levelhigh, adaptive_instruction, fixed_instruction, phasetwobegindate, phasetwoenddate, UNIX_TIMESTAMP(startDate) as startDate, UNIX_TIMESTAMP(endDate) as endDate, IF(archived, 'true', 'false') archived FROM activities ORDER BY activityid DESC",
  CREATE_ACTIVITY:
    "INSERT INTO activities (activityid, activityname, activitystatus, activitydescription, activitycreator, levellow, levelhigh, adaptive_instruction, fixed_instruction, phasetwobegindate, phasetwoenddate, startdate, enddate, archived) values (DEFAULT , ?, ?, ?, ?, 0, 0, ?, '', current_date, current_date, FROM_UNIXTIME(?), FROM_UNIXTIME(?), 0)",
  UPDATE_ACTIVITY:
    "UPDATE activities SET activityname = ?, activitydescription = ?, startdate = FROM_UNIXTIME(?), enddate = FROM_UNIXTIME(?), archived = ? WHERE activityid = ?",
  DELETE_ACTIVITY:
    "DELETE activities, quiz_question, quiz_answer, submit_quiz, statistics, usersinactivity FROM activities LEFT JOIN quiz_question ON activities.activityid = quiz_question.activityid LEFT JOIN quiz_answer ON quiz_question.questionid = quiz_answer.questionid LEFT JOIN statistics ON quiz_question.questionid = statistics.question_id LEFT JOIN submit_quiz ON activities.activityid = submit_quiz.activityid LEFT JOIN usersinactivity ON activities.activityid = usersinactivity.activityid WHERE activities.activityid = ?",
  GET_ACTIVITY_QUESTIONS:
    "SELECT quiz_question.*, question_category.categoryname, statistics.correct_responses, statistics.wrong_responses, statistics.effort_put, statistics.effort, statistics.performance FROM quiz_question LEFT JOIN statistics ON quiz_question.questionid = statistics.question_id LEFT JOIN question_category ON question_category.categoryid = quiz_question.questioncategory WHERE activityid = ?",
  GET_ACTIVITY_USER:
    "SELECT * FROM usersinactivity WHERE activityid = ? AND userid = ?",
  GET_ACTIVITY_USERS: "SELECT * FROM usersinactivity WHERE activityid = ?",
  GET_ACTIVITY_USER_ATTEMPTS:
    "SELECT SUM(quiz_answer.correctanswer) score, COUNT(quiz_answer.correctanswer) max_score, submit_quiz.activityid, activities.activityname title, submit_quiz.attempt, start_date FROM submit_quiz INNER JOIN quiz_answer ON submit_quiz.answersubmitedid=quiz_answer.answerid INNER JOIN activities ON submit_quiz.activityid=activities.activityid INNER JOIN (SELECT attempt, MIN(starttime) start_date FROM submit_quiz WHERE userid = ? GROUP BY attempt) a ON submit_quiz.attempt=a.attempt WHERE userid = ? AND submit_quiz.activityid = ? GROUP BY attempt ORDER BY start_date DESC;",
  GET_STATISTICS_ALL_STUDENTS_OVERVIEW:
    "SELECT score, userid FROM (SELECT userid,  uname, usurname, score, attempt, activityid, ROW_NUMBER() OVER (PARTITION BY userid ORDER BY attempt DESC) rank FROM `graph_data`)a WHERE activityid = ? GROUP BY userid ORDER BY score, usurname, uname ASC", //score for last attempt
  //"SELECT (SUM(correctness) / COUNT(submitquizid) * 100) as score, userid FROM submit_quiz WHERE activityid = ? GROUP BY attempt, userid ORDER BY userid", //average score
  GET_STATISTICS_ALL_STUDENTS_PROGRESS:
    "SELECT question_statistics.userid, CONCAT(users.uname, ' ', users.usurname) as name, (SUM(question_statistics.correctness) / COUNT(question_statistics.correctness) * 100) as score, graph_data.score as last_attempt FROM question_statistics LEFT JOIN users ON users.userid = question_statistics.userid LEFT JOIN graph_data ON graph_data.activityid = question_statistics.activityid AND question_statistics.userid = graph_data.userid WHERE question_statistics.activityid = ? GROUP BY question_statistics.userid ORDER BY last_attempt ASC;",
  GET_STATISTICS_QUESTION_CORRECT_PERCENTAGE:
    "SELECT statistics.correct_responses, statistics.wrong_responses, quiz_question.questiontheme, quiz_question.questionid FROM statistics JOIN quiz_question ON statistics.question_id = quiz_question.questionid JOIN activities ON quiz_question.activityid = activities.activityid WHERE quiz_question.activityid = ? ORDER BY performance ? LIMIT 1",
  GET_STATISTICS_AVG_DEVELOPMENT:
    "SELECT (SUM(correctness) / COUNT(submitquizid) * 100) as score FROM submit_quiz WHERE activityid = ? GROUP BY attempt ORDER BY attempt ASC",
  GET_STATISTICS_AVG_DEVELOPMENT_TIME:
    "SELECT SUM(score)/COUNT(score) AS score, date FROM graph_data WHERE activityid = ? GROUP BY DATE(attemptdate) ORDER BY attemptdate ASC",
  GET_STATISTICS_STUDENT_DEVELOPMENT:
    "SELECT ( SUM(correctness) / COUNT(submitquizid) * 100) as score FROM submit_quiz WHERE activityid = ? AND userid = ? GROUP BY attempt ORDER BY attempt",
  GET_STATISTICS_STUDENT_DEVELOPMENT_TIME:
    "SELECT SUM(score)/COUNT(score) AS score, date FROM graph_data WHERE activityid = ? AND userid = ? GROUP BY DATE(attemptdate) ORDER BY attemptdate ASC",
  GET_STATISTICS_TOPIC_MASTERY_LAST_ATTEMPT:
    "SELECT mastery_grid.userid, mastery_grid.name, mastery_grid.questioncategory, mastery_grid.categoryname, mastery_grid.score FROM `mastery_grid`, (SELECT userid, categoryname, MAX(attempt) as attempt FROM mastery_grid GROUP BY userid, categoryname) max_attempt WHERE mastery_grid.userid = max_attempt.userid AND mastery_grid.attempt = max_attempt.attempt AND mastery_grid.categoryname=max_attempt.categoryname AND mastery_grid.activityid=?",   //score based on last attempt
  GET_STATISTICS_TOPIC_MASTERY_AVERAGE:
    "SELECT question_statistics.userid, CONCAT(users.uname, ' ', users.usurname) as name, question_statistics.questioncategory, question_statistics.categoryname, (SUM(question_statistics.correctness) / COUNT(question_statistics.correctness)) * 100 as score FROM question_statistics LEFT JOIN users ON users.userid = question_statistics.userid WHERE activityid = ? GROUP BY question_statistics.userid, question_statistics.categoryname", //score based on average score
  GET_STATISTICS_MOST_PICKED_INCORRECT_OPTION:
    "SELECT most_picked_incorrect_option.questionid, most_picked_incorrect_option.questiontheme, most_picked_incorrect_option.answerid, most_picked_incorrect_option.answer, most_picked_incorrect_option.picks, most_picked_incorrect_option.pick_rate, most_picked_incorrect_option.correct_responses, most_picked_incorrect_option.wrong_responses, most_picked_incorrect_option.performance, quiz_answer.answerid as first_option, COUNT(quiz_answer.answerid) as options FROM `most_picked_incorrect_option` JOIN quiz_answer ON quiz_answer.questionid = most_picked_incorrect_option.questionid WHERE activityid = ? GROUP BY most_picked_incorrect_option.questionid ORDER BY pick_rate DESC",
  //"SELECT quiz_question.questionid, quiz_question.questiontheme, quiz_answer.answerid, quiz_answer.answer, COUNT(quiz_answer.answerid) as picks, COUNT(quiz_answer.answerid)/(statistics.correct_responses + statistics.wrong_responses) as pick_rate, statistics.correct_responses, statistics.wrong_responses, statistics.performance FROM quiz_answer LEFT JOIN quiz_question ON quiz_answer.questionid = quiz_question.questionid LEFT JOIN statistics ON quiz_answer.questionid = statistics.question_id LEFT JOIN submit_quiz ON quiz_answer.answerid = submit_quiz.answersubmitedid WHERE quiz_question.activityid = ? AND quiz_answer.correctanswer = 0 GROUP BY quiz_answer.answerid ORDER BY `pick_rate` DESC LIMIT 1",
  GET_STATISTICS_LONGEST_RESPONSE_TIME:
    "SELECT average_response_time, questionid FROM `longest_response_time` WHERE activityid = ? GROUP BY questionid ORDER BY average_response_time DESC",
  // "SELECT AVG(responsetime) as average_response_time, questionid FROM submit_quiz WHERE activityid = ? GROUP BY questionid ORDER BY average_response_time DESC", //not limitied by the 20 min threshold
  GET_STATISTICS_LOGINS:
    "SELECT COUNT(*) as logins FROM usersinactivity WHERE activityid=? AND date >= NOW() + INTERVAL -7 DAY AND date < NOW() + INTERVAL 0 DAY",
  GET_STATISTICS_NOT_LOGGED_IN_SINCE:
    "SELECT COUNT(*) as logins FROM usersinactivity WHERE activityid=? AND date <= NOW() + INTERVAL -? DAY",
  GET_STATISTICS_MOST_PICKED_INCORRECT_OPTION_ALL_ACTIVE:
    "SELECT activityid, MAX(pick_rate) as pick_rate FROM `most_picked_incorrect_option` GROUP BY activityid",
  GET_STATISTICS_MOST_INCORRECT_ANSWER_ALL_ACTIVE:
    "SELECT MIN(performance) as performance, quiz_question.activityid FROM statistics JOIN quiz_question ON statistics.question_id = quiz_question.questionid JOIN activities ON quiz_question.activityid = activities.activityid GROUP BY activities.activityid",
  GET_STATISTICS_LONGEST_RESPONSE_TIME_ALL_ACTIVE:
    "SELECT  activityid, MAX(average_response_time) as time FROM longest_response_time GROUP BY activityid",
  GET_STATISTICS_ALL_ACTIVITIES_STUDENTS_OVERVIEW:
    "SELECT activityid, MIN(score) as score FROM `student_overview` GROUP BY activityid", //average score
  //"SELECT MIN(score) as score, activityid, MAX(attempt) as attempt FROM `graph_data` GROUP BY activityid", //lowest score from last attempt
  GET_STATISTICS_CATEGORIES:
    "SELECT COUNT(questionid) as total, categoryname FROM quiz_question JOIN question_category ON question_category.categoryid = quiz_question.questioncategory WHERE activityid = ? GROUP BY questioncategory",
  GET_STATISTICS_QUESTION_DIFFICULTY_DISTRIBUTION:
    "SELECT quiz_question.activityid, quiz_question.questioncategory, question_category.categoryname, quiz_question.questiondifficulty, COUNT(CASE quiz_question.questiondifficulty WHEN 1 then 1 else null end) as easy, COUNT(CASE quiz_question.questiondifficulty WHEN 2 then 1 else null end) as medium, COUNT(CASE quiz_question.questiondifficulty WHEN 3 then 1 else null end) as hard FROM quiz_question LEFT JOIN question_category ON quiz_question.questioncategory = question_category.categoryid WHERE quiz_question.activityid = ? GROUP BY quiz_question.questioncategory",
  //"SELECT quiz_question.activityid, quiz_question.questioncategory, question_category.categoryname, quiz_question.questiondifficulty, COUNT(quiz_question.questiondifficulty) as number_of_questions FROM quiz_question LEFT JOIN question_category ON quiz_question.questioncategory = question_category.categoryid WHERE quiz_question.activityid = ? GROUP BY quiz_question.questioncategory, quiz_question.questiondifficulty",
  GET_PROGRESS_FOR_ACTIVITY_INSIGHTS:
    "SELECT score, userid, attempt FROM `graph_data` WHERE activityid = ? ORDER BY userid, attempt",
  GET_STUDENT_QUIZ_DETAILS:
    "SELECT SUM(correctness) as score, COUNT(questionid) as max_score, categoryname FROM `student_details` WHERE activityid= ? AND userid= ? AND attempt = ? GROUP BY categoryname;"
};

module.exports = ActivityQuery;
