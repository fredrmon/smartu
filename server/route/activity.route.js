const express = require("express");
const ctrl = require("../controllers/activity.controller");
const activityRoutes = express.Router();

activityRoutes.route("/").get(ctrl.getActivities).post(ctrl.createActivity);

activityRoutes
  .route("/:id")
  .get(ctrl.getActivity)
  .put(ctrl.updateActivity)
  .delete(ctrl.deleteActivity);

activityRoutes.route("/:id/questions").get(ctrl.getQuestions);

activityRoutes.route("/:id/users").get(ctrl.getUsers);

activityRoutes.route("/:id/users/:userid").get(ctrl.getUser);

activityRoutes.route("/:id/users/:userid/attempts").get(ctrl.getUserAttempts);

activityRoutes
  .route("/:id/statistics/student_performance_overview")
  .get(ctrl.getStatisticsAllStudentsOverview);

activityRoutes
  .route("/:id/statistics/student_performance_progress")
  .get(ctrl.getStatisticsAllStudentsProgress);

activityRoutes
  .route("/:id/statistics/question_correct_percentage")
  .get(ctrl.getStatisticsQuestionCorrectPercentage);

activityRoutes
  .route("/:id/statistics/development_avg")
  .get(ctrl.getStatisticsAvgDevelopment);

activityRoutes
  .route("/:id/statistics/development_avg_time")
  .get(ctrl.getStatisticsAvgDevelopmentTime);

activityRoutes
  .route("/:id/statistics/development_student/:userid")
  .get(ctrl.getStatisticsStudentDevelopment);

activityRoutes
  .route("/:id/statistics/development_student_time/:userid")
  .get(ctrl.getStatisticsStudentDevelopmentTime);

activityRoutes
  .route("/:id/statistics/topic_mastery_last_attempt")
  .get(ctrl.getStatisticsTopicMasteryLastAttempt);

activityRoutes
  .route("/:id/statistics/topic_mastery_average")
  .get(ctrl.getStatisticsTopicMasteryAverage);


activityRoutes
  .route("/:id/statistics/questions_most_picked_incorrect")
  .get(ctrl.getStatisticsMostPickedIncorrectOption);

activityRoutes
  .route("/:id/statistics/questions_longest_avg_response_time")
  .get(ctrl.getStatisticsLongestResponseTime);

activityRoutes.route("/:id/statistics/logins").get(ctrl.getStatisticsLogins);

activityRoutes
  .route("/:id/statistics/not_logged_in")
  .get(ctrl.getStatisticsLogins);

activityRoutes
  .route("/:id/statistics/question_difficulty_distribution")
  .get(ctrl.getQuestionDifficultyDistribution);

activityRoutes
  .route("/:id/statistics/progress_list")
  .get(ctrl.getStatisticsProgressList);

activityRoutes
  .route("/statistics/questions_most_picked_incorrect")
  .get(ctrl.getStatisticsMostPickedIncorrectOptionForAllActive);

activityRoutes
  .route("/statistics/questions_most_incorrect_answer")
  .get(ctrl.getStatisticsMostIncorrectAnswerForAllActive);

activityRoutes
  .route("/statistics/longest_response_time")
  .get(ctrl.getStatisticsLongestResponseTimeForAllActive);

activityRoutes
  .route("/statistics/student_performance_overview")
  .get(ctrl.getStatisticsAllActivitiesStudentsOverview);

activityRoutes
  .route("/:id/statistics/categories")
  .get(ctrl.getStatisticsCategories);

activityRoutes
  .route("/:id/users/:userid/attempt_details/:attempt")
  .get(ctrl.getStudentQuizDetails);

module.exports = activityRoutes;
