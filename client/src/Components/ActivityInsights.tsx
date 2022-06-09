import { useEffect, useState } from "react";
import {
  InsightTitle,
  InsightsContainer,
  InsightsCardGreen,
  InsightsCardAnimated,
  InsightsCardRed,
  InsightsCardGreenClickable,
} from "../styles";
import {
  CorrectResponses,
  LongestTimeSpent,
  MostPickedIncorrectAnswer,
} from "../Models/ActivityInsight";
import { ActivityService as Service } from "../Services/activity.service";
import { useParams } from "react-router-dom";
import { Badge, Tooltip } from "@mui/material";
import { NotificationThreshold } from "../constants";
import { QuestionFormDialog } from "./QuestionFormDialog";

const emptyObj1 = {
  questionid: 0,
  correct_responses: 0,
  wrong_responses: 0,
  questiontheme: "",
};

const emptyObj2 = {
  questionid: 0,
  questiontheme: "",
  answerid: 0,
  answer: "",
  picks: 0,
  pick_rate: 0,
  correct_responses: 0,
  wrong_responses: 0,
  performance: 0,
  first_option: 0,
  options: 0,
};

export const ActivityInsights = () => {
  const { id } = useParams();
  const [mostIncorrectResponses, setMostIncorrectResponses] =
    useState<CorrectResponses>(emptyObj1);
  const [mostCorrectResponses, setMostCorrectResponses] =
    useState<CorrectResponses>(emptyObj1);
  const [mostIncorrectAnswerOption, setMostIncorrectAnswerOption] =
    useState<MostPickedIncorrectAnswer>(emptyObj2);
  const [longestTimeSpent, setLongestTimeSpent] = useState<LongestTimeSpent>();
  const [logins, setLogins] = useState<number>();
  const [notLoggedIn, setNotLoggedIn] = useState<number>(0);
  const [progressInsights, setProgressInsights] = useState<Array<number>>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [clickedInsight, setClickedInsight] = useState<number>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    Service.getQuestionCorrectPercent(
      `${id}`,
      "ASC",
      setMostIncorrectResponses
    );
    Service.getQuestionCorrectPercent(`${id}`, "DESC", setMostCorrectResponses);
    Service.getMostPickedIncorrectAnswerOption(
      `${id}`,
      setMostIncorrectAnswerOption
    );
    Service.getLongestTime(`${id}`, setLongestTimeSpent);
    Service.getLogins(`${id}`, setLogins);
    Service.getNotLoggedIn(`${id}`, getDays(), setNotLoggedIn);
    Service.getProgressInsights(`${id}`, setProgressInsights);

    setTimeout(() => setIsLoaded(true), 350);
  }, [id]);

  const getDays = (): number => {
    const currentDate: Date = new Date();
    const lastMonth: Date = new Date();
    lastMonth.setMonth(currentDate.getMonth() - 1);
    setDate(lastMonth);
    const diffInMs: number = currentDate.getTime() - lastMonth.getTime();
    const diffInDays: number = diffInMs / (1000 * 3600 * 24);
    return diffInDays;
  };

  const handleClick = (id: number) => {
    setClickedInsight(id);
    setOpenQuestionForm(true);
    hideNotification(id);
  };

  //Function for hiding the highlights and notification when opened during the study/user tests
  const hideNotification = (id: number) => {
    if (id === 85 && localStorage.getItem("answerOption") === null)
      localStorage.setItem("answerOption", "checked");
    else if (id === 66 && localStorage.getItem("longestToAnswer") === null)
      localStorage.setItem("longestToAnswer", "checked");
    else if (id === 7 && localStorage.getItem("commonlyFailed") === null)
      localStorage.setItem("commonlyFailed", "checked");
  };

  return (
    <InsightsContainer>
      {!isLoaded ? (
        <div>Loading</div>
      ) : (
        <>
          <MostCommonlyFailed
            handleClick={handleClick}
            data={mostIncorrectResponses}
          />
          <LongestTimeToAnswer
            handleClick={handleClick}
            data={longestTimeSpent}
          />
          <MostPickedIncorrectAnswerOption
            handleClick={handleClick}
            data={mostIncorrectAnswerOption}
          />
          <MostCorrectlyAnswered
            handleClick={handleClick}
            data={mostCorrectResponses}
          />
          <LoginActivity
            date={date}
            logins={logins}
            notLoggedIn={notLoggedIn}
          />
          <ProgressInsights data={progressInsights} />
        </>
      )}
      <QuestionFormDialog
        openForm={openQuestionForm}
        newQuestion={false}
        closeForm={() => {
          setOpenQuestionForm(false);
        }}
        clickedQuestion={clickedInsight}
        activityid={id}
      />
    </InsightsContainer>
  );
};

const getPercent = (
  correctResponses: number,
  wrongResponses: number
): number => {
  let totalResponses: number = correctResponses + wrongResponses;
  let percentage: number = (wrongResponses / totalResponses) * 100;
  return Math.round(percentage);
};

const MostCommonlyFailed = ({ data, handleClick }: any) => {
  let totalResponses = data?.correct_responses + data?.wrong_responses;
  let displayAnimation: boolean =
    data?.wrong_responses / totalResponses >
      NotificationThreshold.incorrectQuestion &&
    localStorage.getItem("commonlyFailed") === null;

  const insightDisplay = (
    <>
      <InsightTitle>Most commonly failed question</InsightTitle>
      <p>Question {data?.questionid}:</p>
      <Tooltip
        title={`% of total submissions that answered incorrectly on question with id ${data?.questionid}`}
      >
        <h2>{getPercent(data?.correct_responses, data?.wrong_responses)}%</h2>
      </Tooltip>
      <p>
        From {data?.correct_responses + data?.wrong_responses} total responses,{" "}
        {data?.wrong_responses} answered incorrectly
      </p>
    </>
  );

  return (
    <Badge
      sx={{ width: "48%" }}
      color="error"
      invisible={!displayAnimation}
      badgeContent={
        <Tooltip
          title={
            <div style={{ whiteSpace: "pre-line" }}>
              {`The error rate exceeds the threshold. Please check if there are any errors in the question.`}
            </div>
          }
        >
          <b style={{ fontSize: 16 }}>!</b>
        </Tooltip>
      }
    >
      {displayAnimation ? (
        <InsightsCardAnimated onClick={() => handleClick(data?.questionid)}>
          {insightDisplay}
        </InsightsCardAnimated>
      ) : (
        <InsightsCardRed
          onClick={() => handleClick(data?.questionid)}
          style={{ width: "100%" }}
        >
          {insightDisplay}
        </InsightsCardRed>
      )}
    </Badge>
  );
};

const MostCorrectlyAnswered = ({ data, handleClick }: any) => {
  return (
    <InsightsCardGreenClickable onClick={() => handleClick(data?.questionid)}>
      <InsightTitle>Most correctly answered question</InsightTitle>
      <p>Question {data?.questionid}:</p>
      <Tooltip
        title={`% of total submissions that answered correctly on question with id ${data?.questionid}`}
      >
      <h2>{getPercent(data?.wrong_responses, data?.correct_responses)}%</h2>
      </Tooltip>
      <p>
        {`From ${
          data?.correct_responses + data?.wrong_responses
        } total responses, ${data?.correct_responses} answered correctly`}
      </p>
    </InsightsCardGreenClickable>
  );
};

const LongestTimeToAnswer = ({ data, handleClick }: any) => {
  let displayAnimation: boolean =
    data?.time > NotificationThreshold.timeToAnswer &&
    localStorage.getItem("longestToAnswer") === null;

  const insightDisplay = (
    <>
      <InsightTitle>Longest time to answer (avg)</InsightTitle>
      <p>Question {data?.questionid}:</p>
      <Tooltip title="The highest average time spent on answering a question">
        <h2>{data?.average_response_time}</h2>
      </Tooltip>
      <p>
        In total, {data?.questionsOverThreshold} questions have an average
        response time over 3 minutes
      </p>
    </>
  );

  return (
    <Badge
      sx={{ width: "48%" }}
      color="error"
      invisible={!displayAnimation}
      badgeContent={
        <Tooltip
          title={
            <div style={{ whiteSpace: "pre-line" }}>
              {`The average time spent exceeds the threshold. Please check if there are any errors in the question.`}
            </div>
          }
        >
          <b style={{ fontSize: 16 }}>!</b>
        </Tooltip>
      }
    >
      {displayAnimation ? (
        <InsightsCardAnimated onClick={() => handleClick(data?.questionid)}>
          {insightDisplay}
        </InsightsCardAnimated>
      ) : (
        <InsightsCardRed
          onClick={() => handleClick(data?.questionid)}
          style={{ width: "100%" }}
        >
          {insightDisplay}
        </InsightsCardRed>
      )}
    </Badge>
  );
};

const MostPickedIncorrectAnswerOption = ({ data, handleClick }: any) => {
  let displayAnimation: boolean =
    data?.pick_rate > NotificationThreshold.incorrectOption &&
    localStorage.getItem("answerOption") === null;
  const insightDisplay = (
    <>
      <InsightTitle>Most picked incorrect answer option</InsightTitle>
      <p>
        Question {data?.questionid}, answer option{" "}
        {data?.answerid + 1 - data?.first_option}
      </p>

      <Tooltip
        title={`% of total submissions that chose option ${data?.answerid + 1 - data?.first_option}`}
      >
        <h2>{(data?.pick_rate * 100).toFixed(0)}%</h2>
      </Tooltip>

      <p>
        Out of {data?.correct_responses + data?.wrong_responses} total
        responses, {data?.picks} selected this option
      </p>
    </>
  );

  return (
    <Badge
      sx={{ width: "48%" }}
      color="error"
      invisible={!displayAnimation}
      badgeContent={
        <Tooltip
          title={
            <div style={{ whiteSpace: "pre-line" }}>
              {`The pick rate (${data?.pick_rate}) exceeds the threshold. Please check if the correct option is set.`}
            </div>
          }
        >
          <b style={{ fontSize: 16 }}>!</b>
        </Tooltip>
      }
    >
      {displayAnimation ? (
        <InsightsCardAnimated onClick={() => handleClick(data?.questionid)}>
          {insightDisplay}
        </InsightsCardAnimated>
      ) : (
        <InsightsCardRed
          onClick={() => handleClick(data?.questionid)}
          style={{ width: "100%" }}
        >
          {insightDisplay}
        </InsightsCardRed>
      )}
    </Badge>
  );
};

const LoginActivity = ({ logins, date, notLoggedIn }: any) => {
  return (
    <InsightsCardGreen>
      <InsightTitle>Login activity</InsightTitle>
      <Tooltip
        title={`Shows how many students have logged in the last week`}
      >
      <h2>{logins}</h2>
      </Tooltip>
      <p>student logins in the last 7 days</p>
      {notLoggedIn === 0 && (
        <p>
          {" "}
          All students have been logged in since{" "}
          {date.toLocaleString("en-GB", { month: "long" })}{" "}
          {date.getDate().toString()}
        </p>
      )}
      {notLoggedIn === 1 && (
        <p>
          1 student has not logged in since{" "}
          {date.toLocaleString("en-GB", { month: "long" })}{" "}
          {date.getDate().toString()}
        </p>
      )}
      {notLoggedIn > 1 && (
        <p>
          {notLoggedIn} students have not logged in since{" "}
          {date.toLocaleString("en-GB", { month: "long" })}{" "}
          {date.getDate().toString()}
        </p>
      )}
    </InsightsCardGreen>
  );
};

const ProgressInsights = ({ data }: any) => {
  return (
    <InsightsCardGreen>
      <InsightTitle>Progress among students</InsightTitle>
      <Tooltip
        title={`Shows the number of students that has improved their score compared to previous attempts`}
      >
      <h2>{data?.length}</h2>
      </Tooltip>
      <p>student(s) improved their score on their last attempt</p>
    </InsightsCardGreen>
  );
};
