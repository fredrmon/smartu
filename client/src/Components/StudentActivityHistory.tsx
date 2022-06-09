import { Colors, Score } from "../constants";
import {
  ActivityCard,
  ActivityCardWindow,
  CardContentFlexStart,
} from "../styles";

export const StudentActivityHistory = ({ attempts, setClickedAttempt }: any) => {
  const getTextColor = (a: any) => {
    const score = (a.score / a.max_score) * 100;
    if (score >= Score.medium) return Colors.green;
    else if (score > Score.low && score <= Score.medium) return Colors.yellow;
    else return Colors.red;
  };

  const handleClick = (attempt: number) => {
    setClickedAttempt(attempt);
  }
  return (
    <>
      <i>Previous attempts:</i>
      <CardContentFlexStart>
        {attempts.map((a: any, index: number) => {
          return (
            <ActivityCard key={"activity-attempt-" + index}  onClick={() =>
              handleClick(
                a.attempt
              )
            }>
              <ActivityCardWindow>
                <h1
                  style={{ color: getTextColor(a), fontWeight: 800, margin: 0 }}
                >
                  {a.score}/{a.max_score}
                </h1>
              </ActivityCardWindow>
              <h1>{a.title}</h1>
              <div>Attempt: {a.attempt}</div>
              <div>{new Date(a.start_date).toDateString()}</div>
            </ActivityCard>
          );
        })}
      </CardContentFlexStart>
    </>
  );
};
