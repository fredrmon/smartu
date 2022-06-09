const db = require("../dbConnection");
const mysql = require("mysql");
const ActivityQuery = require("../queries/activity.query");
const http = require("../utils/httpStatus");

const getActivity = (request, response) => {
  db.query(ActivityQuery.GET_ACTIVITY, [request.params.id], (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const getActivities = (request, response) => {
  db.query(ActivityQuery.GET_ACTIVITIES, (error, result) => {
    if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
    if (!result) response.status(http.NOT_FOUND);
    else response.status(http.OK).send(result);
  });
};

const createActivity = (request, response) => {
  db.query(
    ActivityQuery.CREATE_ACTIVITY,
    Object.values(request.body),
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      else response.status(http.CREATED).send(result);
    }
  );
};

const updateActivity = (request, response) => {
  db.query(
    ActivityQuery.UPDATE_ACTIVITY,
    [
      request.body.activityname,
      request.body.activitydescription,
      request.body.startdate,
      request.body.enddate,
      request.body.archived,
      request.params.id,
    ],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const deleteActivity = (request, response) => {
  db.query(
    ActivityQuery.DELETE_ACTIVITY,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (result.affectedRows > 0) response.status(http.OK).send(result);
      else response.status(http.NOT_FOUND);
    }
  );
};

const getStatisticsAllStudentsOverview = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_ALL_STUDENTS_OVERVIEW,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsAllActivitiesStudentsOverview = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_ALL_ACTIVITIES_STUDENTS_OVERVIEW,
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsAllStudentsProgress = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_ALL_STUDENTS_PROGRESS,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsQuestionCorrectPercentage = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_QUESTION_CORRECT_PERCENTAGE,
    [request.params.id, mysql.raw(request.query.sort)],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsMostIncorrectAnswerForAllActive = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_MOST_INCORRECT_ANSWER_ALL_ACTIVE,
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsAvgDevelopment = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_AVG_DEVELOPMENT,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsAvgDevelopmentTime = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_AVG_DEVELOPMENT_TIME,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsStudentDevelopment = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_STUDENT_DEVELOPMENT,
    [request.params.id, request.params.userid],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsStudentDevelopmentTime = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_STUDENT_DEVELOPMENT_TIME,
    [request.params.id, request.params.userid],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsTopicMasteryLastAttempt = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_TOPIC_MASTERY_LAST_ATTEMPT,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsTopicMasteryAverage = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_TOPIC_MASTERY_AVERAGE,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsMostPickedIncorrectOption = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_MOST_PICKED_INCORRECT_OPTION,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsMostPickedIncorrectOptionForAllActive = (
  request,
  response
) => {
  db.query(
    ActivityQuery.GET_STATISTICS_MOST_PICKED_INCORRECT_OPTION_ALL_ACTIVE,
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsLongestResponseTime = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_LONGEST_RESPONSE_TIME,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsLongestResponseTimeForAllActive = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_LONGEST_RESPONSE_TIME_ALL_ACTIVE,
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsLogins = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_LOGINS,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getQuestionDifficultyDistribution = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_QUESTION_DIFFICULTY_DISTRIBUTION,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsNotLoggedInSince = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_NOT_LOGGED_IN_SINCE,
    [request.params.id, mysql.raw(request.query.days)],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsProgressList = (request, response) => {
  db.query(
    ActivityQuery.GET_PROGRESS_FOR_ACTIVITY_INSIGHTS,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStatisticsCategories = (request, response) => {
  db.query(
    ActivityQuery.GET_STATISTICS_CATEGORIES,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getQuestions = (request, response) => {
  db.query(
    ActivityQuery.GET_ACTIVITY_QUESTIONS,
    [request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getUsers = (request, response) => {
  db.query(
    ActivityQuery.GET_ACTIVITY_USERS,
    [request.params.id, request.params.userid],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getUser = (request, response) => {
  db.query(
    ActivityQuery.GET_ACTIVITY_USER,
    [request.params.id, request.params.userid],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getUserAttempts = (request, response) => {
  db.query(
    ActivityQuery.GET_ACTIVITY_USER_ATTEMPTS,
    [request.params.userid, request.params.userid, request.params.id],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );
};

const getStudentQuizDetails = (request, response) => {
  db.query(
    ActivityQuery.GET_STUDENT_QUIZ_DETAILS,
    [request.params.id, request.params.userid, request.params.attempt],
    (error, result) => {
      if (error) response.status(http.INTERNAL_SERVER_ERROR).send(error);
      if (!result) response.status(http.NOT_FOUND);
      else response.status(http.OK).send(result);
    }
  );

};

module.exports = {
  getActivity,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getQuestions,
  getUsers,
  getUser,
  getUserAttempts,
  getStatisticsAllStudentsOverview,
  getStatisticsAllStudentsProgress,
  getStatisticsQuestionCorrectPercentage,
  getStatisticsAvgDevelopment,
  getStatisticsAvgDevelopmentTime,
  getStatisticsStudentDevelopment,
  getStatisticsStudentDevelopmentTime,
  getStatisticsTopicMasteryLastAttempt,
  getStatisticsTopicMasteryAverage,
  getStatisticsMostPickedIncorrectOption,
  getStatisticsLongestResponseTime,
  getStatisticsLogins,
  getQuestionDifficultyDistribution,
  getStatisticsNotLoggedInSince,
  getStatisticsProgressList,
  getStatisticsMostPickedIncorrectOptionForAllActive,
  getStatisticsMostIncorrectAnswerForAllActive,
  getStatisticsLongestResponseTimeForAllActive,
  getStatisticsAllActivitiesStudentsOverview,
  getStatisticsCategories,
  getStudentQuizDetails,
};
