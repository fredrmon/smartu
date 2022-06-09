
import { Button, Tooltip } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { LearningProgress } from "./LearningProgress";
import { Overview } from "./Overview";
import { ActivityInsights } from "./ActivityInsights";
import { MasteryGrid } from "./MasteryGrid";
import { ActivityActions, ActivityContainer } from "../styles";
import { useEffect, useState } from "react";

type LocationState = {
  numberOfStudents: number;
};


export const Activity = (props: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [archived, setArchived] = useState<boolean>(true);
  const location = useLocation();
  const { numberOfStudents } = location.state as LocationState;
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("timeLeft") !== null) {
      const activityData = JSON.parse(
        window.sessionStorage.getItem("timeLeft") || ""
      );
      setDate(new Date(activityData * 1000));
      displayDate(activityData);
    }
    if (window.sessionStorage.getItem("startTime") !== null) {
      const activityData = JSON.parse(
        window.sessionStorage.getItem("startTime") || ""
      );
      setStartDate(new Date(activityData * 1000));
    }
    if (window.sessionStorage.getItem("archived") !== null) {
      const activityData = JSON.parse(
        window.sessionStorage.getItem("archived") || ""
      );
      setArchived(activityData);
    }
  }, [id]);

  useEffect(() => {
    if (numberOfStudents > 0) {
      setHasData(true);
    }
  }, [numberOfStudents]);


  const displayDate = (time: number): void => {
    const oneDay = 1000 * 60 * 60 * 24;
    const endDate = new Date(time * 1000);
    const daysUntil = Math.round(endDate.getTime() - Date.now()) / oneDay;
    setTimeLeft(`${daysUntil.toFixed(0)}`);
  };

  const daysUntilStart = (): string => {
    const oneDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.round( startDate.getTime()- Date.now()) / oneDay;
    return daysUntil.toFixed(0);
  }

  const handleClickEdit = () => {
    navigate(`/activity/${id}/edit`, {
      state: { numberOfStudents: numberOfStudents },
    });
  };

  return (
    <>
      <ActivityActions>
        {parseInt(timeLeft) > 0 && (startDate < new Date()) && !archived && (
        <Tooltip title={`Activity ends on ${date.toDateString()}`}>
          <span style={{ marginRight: "30px" }}>
            <i>{`${timeLeft} days until activity ends`}</i>
          </span>
        </Tooltip>
          )}
        {parseInt(timeLeft) === 0 && (startDate < new Date()) && !archived && (
          <Tooltip title={`Activity ends on ${date.toDateString()}`}>
          <span style={{ marginRight: "30px" }}>
            <i>{`Activity ends today`}</i>
          </span>
          </Tooltip>
        )}
        {parseInt(timeLeft) >= 0 && (startDate > new Date()) && !archived && (
          <Tooltip title={`Activity starts on ${startDate.toDateString()}`}>
          <span style={{ marginRight: "30px" }}>
            <i>{`This activity has not started. ${daysUntilStart()} days until activity starts`}</i>
          </span>
          </Tooltip>
        )}
        {(parseInt(timeLeft) < 0 || archived) && (
          <Tooltip title={`Activity ended on ${date.toDateString()}`}>
          <span style={{ marginRight: "30px" }}>
            <i>{`Activity is closed and archived`}</i>
          </span>
          </Tooltip>

        )}
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleClickEdit}
        >
          Edit questions and topics
        </Button>
      </ActivityActions>

      <>
        {hasData ? (
          <ActivityContainer>
            <Overview />
            <LearningProgress />
            <MasteryGrid />
            <ActivityInsights />
          </ActivityContainer>
        ) : (
          <>
            <h1>There is no data to display yet for this activity</h1>
            <br />
            <p>Data will be displayed here once it exists</p>
          </>
        )}
      </>
    </>
  );
};
