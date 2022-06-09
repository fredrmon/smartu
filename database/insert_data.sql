SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS smartu;

USE smartu;

DROP TABLE IF EXISTS `statistics`;
DROP TABLE IF EXISTS `submit_quiz`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `usersinactivity`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `announcement`;
DROP TABLE IF EXISTS `question_category`;
DROP TABLE IF EXISTS `quiz_question`;
DROP TABLE IF EXISTS `quiz_answer`;

DROP VIEW IF EXISTS `graph_data`;
DROP VIEW IF EXISTS `question_statistics`;
DROP VIEW IF EXISTS `most_picked_incorrect_option`;
DROP VIEW IF EXISTS `student_overview`;
DROP VIEW IF EXISTS `longest_response_time`;
DROP VIEW IF EXISTS `student_details`;
DROP VIEW IF EXISTS `mastery_grid`;

CREATE TABLE `statistics` (
    `question_id` int(11) NOT NULL,
    `correct_responses` int(11) NOT NULL DEFAULT 0,
    `wrong_responses` int(11) NOT NULL DEFAULT 0,
    `effort_put` int(11) NOT NULL DEFAULT 0,
    `effort` float NOT NULL DEFAULT 0,
    `performance` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `submit_quiz` (
    `submitquizid` int(11) NOT NULL,
    `userid` int(11) NOT NULL,
    `questionid` int(11) NOT NULL,
    `answersubmitedid` int(11) NOT NULL,
    `correctness` int(11) NOT NULL,
    `perceived_diff` int(11) NOT NULL,
    `activityid` int(11) NOT NULL,
    `locked` int(11) NOT NULL,
    `part` int(11) NOT NULL,
    `starttime` bigint unsigned NOT NULL,
    `endtime` bigint unsigned NOT NULL,
    `responsetime` double NOT NULL,
    `effort` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
    `userid` int(11) NOT NULL,
    `username` varchar(20) NOT NULL,
    `userpwd` varchar(72) NOT NULL,
    `usercategory` int(1) NOT NULL,
    `email` varchar(30) NOT NULL,
    `uname` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `usurname` varchar(30) NOT NULL,
    `aem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `usersinactivity` (
  `userid` int(11) NOT NULL,
  `activityid` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `adaptivescore` float NOT NULL,
  `fixedscore` float NOT NULL,
  `count_logins` int(11) NOT NULL,
  `pretest_submited` int(11) NOT NULL,
  `posttest_submited` int(11) NOT NULL,
  `mastery` int(1) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


ALTER TABLE `submit_quiz`
    ADD PRIMARY KEY (`submitquizid`);

ALTER TABLE `users`
    ADD PRIMARY KEY (`userid`),
    ADD UNIQUE KEY `userid` (`userid`);

ALTER TABLE `statistics`
    ADD PRIMARY KEY (`question_id`);

ALTER TABLE `usersinactivity`
    ADD PRIMARY KEY (`userid`,`activityid`);


ALTER TABLE `submit_quiz`
    MODIFY `submitquizid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=329;

ALTER TABLE `users`
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2,
    MODIFY `userpwd` varchar(72) NOT NULL;

ALTER TABLE `submit_quiz`
    ADD `attempt` int(11) NOT NULL DEFAULT 1,
    ADD `statistics_clicks` int(11) NOT NULL DEFAULT 0,
    ADD `statistics_time` int(11) NOT NULL DEFAULT 0;

CREATE TABLE `activities` (
  `activityid` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `activityname` varchar(64) NOT NULL,
  `activitystatus` int(1) NOT NULL,
  `activitydescription` text NOT NULL,
  `activitycreator` int(11) NOT NULL,
  `levellow` int(3) NOT NULL,
  `levelhigh` int(3) NOT NULL,
  `adaptive_instruction` text NOT NULL,
  `fixed_instruction` text NOT NULL,
  `phasetwobegindate` date NOT NULL,
  `phasetwoenddate` date NOT NULL,
  `startdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `enddate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `archived` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `quiz_answer` (
    `answerid` int(11) NOT NULL,
    `questionid` int(11) DEFAULT NULL,
    `answer` text DEFAULT NULL,
    `correctanswer` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `quiz_question` (
  `questionid` int(11) NOT NULL,
  `questinact` int(11) NOT NULL,
  `questiontype` int(11) NOT NULL,
  `questioncategory` int(11) NOT NULL,
  `questiondifficulty` int(1) NOT NULL,
  `questiontheme` text NOT NULL,
  `questionavailable` int(1) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `fixed` int(11) NOT NULL,
  `activityid` int(11) NOT NULL,
  `inallactivities` int(1) NOT NULL,
  `probzA` double NOT NULL,
  `probzB` double NOT NULL,
  `probzC` double NOT NULL,
  `diff` int(11) NOT NULL,
  `monades` float NOT NULL,
  `RTE_threshold` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `announcement` (
    `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `title` varchar(72) NOT NULL,
    `content` text NOT NULL,
    `date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `question_category` (
  `categoryid` int(11) NOT NULL,
  `categoryname` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

ALTER TABLE `quiz_answer`
    ADD PRIMARY KEY (`answerid`);

ALTER TABLE `quiz_question`
    ADD PRIMARY KEY (`questionid`),
    ADD UNIQUE KEY `questionid` (`questionid`);

ALTER TABLE `quiz_answer`
    MODIFY `answerid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=429;

ALTER TABLE `quiz_question`
    MODIFY `questionid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;


CREATE VIEW `question_statistics` AS SELECT quiz_question.activityid, quiz_question.questionid, quiz_question.questioncategory, question_category.categoryname, submit_quiz.userid, submit_quiz.correctness FROM quiz_question LEFT JOIN question_category ON quiz_question.questioncategory=question_category.categoryid INNER JOIN submit_quiz ON submit_quiz.questionid = quiz_question.questionid;

CREATE VIEW `graph_data` AS SELECT ( SUM(correctness) / COUNT(submitquizid) * 100) AS score, submit_quiz.userid, uname, usurname, attempt, MAX(starttime) AS date, FROM_UNIXTIME(MAX(starttime/1000)) AS attemptdate, activityid FROM submit_quiz LEFT JOIN users ON submit_quiz.userid = users.userid GROUP BY attempt, submit_quiz.userid, activityid ORDER BY attempt, submit_quiz.userid;

CREATE VIEW `most_picked_incorrect_option` AS SELECT activities.activityid, quiz_question.questionid, quiz_question.questiontheme, quiz_answer.answerid, quiz_answer.answer, COUNT(quiz_answer.answerid) as picks, COUNT(quiz_answer.answerid)/(statistics.correct_responses + statistics.wrong_responses) as pick_rate, statistics.correct_responses, statistics.wrong_responses, statistics.performance FROM activities LEFT JOIN quiz_question ON activities.activityid = quiz_question.activityid LEFT JOIN quiz_answer ON quiz_answer.questionid = quiz_question.questionid LEFT JOIN statistics ON quiz_answer.questionid = statistics.question_id LEFT JOIN submit_quiz ON quiz_answer.answerid = submit_quiz.answersubmitedid WHERE quiz_answer.correctanswer = 0 AND activities.startdate < CURRENT_TIMESTAMP AND activities.enddate > CURRENT_TIMESTAMP AND activities.archived = 0 GROUP BY quiz_answer.answerid ORDER BY activities.activityid;

CREATE VIEW `student_overview` AS SELECT activityid, (SUM(correctness) / COUNT(submitquizid) * 100) as score, userid, MAX(attempt) as attempt FROM submit_quiz GROUP BY userid, activityid ORDER BY userid;

CREATE VIEW longest_response_time AS SELECT AVG(responsetime) as average_response_time, questionid, activityid FROM submit_quiz WHERE responsetime < 1200 GROUP BY questionid ORDER BY activityid;

CREATE VIEW `student_details` AS SELECT quiz_question.activityid, quiz_question.questionid, quiz_question.questioncategory, question_category.categoryname, submit_quiz.userid, submit_quiz.correctness, attempt FROM quiz_question LEFT JOIN question_category ON quiz_question.questioncategory=question_category.categoryid INNER JOIN submit_quiz ON submit_quiz.questionid = quiz_question.questionid;

CREATE VIEW `mastery_grid` AS SELECT student_details.userid, CONCAT(users.uname, ' ', users.usurname) as name, student_details.questioncategory, student_details.categoryname, (SUM(student_details.correctness) / COUNT(student_details.questionid)) * 100 as score, attempt, activityid FROM student_details LEFT JOIN users ON users.userid = student_details.userid GROUP BY student_details.userid, student_details.categoryname, attempt;
