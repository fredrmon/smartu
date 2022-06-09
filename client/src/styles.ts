import styled, { keyframes } from "styled-components";
import { Colors } from "./constants";

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1vh;
  padding-bottom: 3vh;
  background-color: ${Colors.background};
`;

export const HeaderContainer = styled.div`
  height: 6vh;
  border-bottom: 4px solid ${Colors.purple};

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  align-items: end;
  column-gap: 4vw;
`;

export const HeaderLink = styled.div`
  margin-left 20px;
  font-size: 30px;
`;

export const CardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  height: auto;
  width: 65vw;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
  padding-bottom: 2vh;
`;

export const SelectActivityCard = styled(CardContainer)`
  margin-bottom: 3vh;
`;

export const CardTitleContainer = styled.div`
  display: flex;
  align-content: center;
`;

export const CardTitle = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: ${Colors.black};
  margin: 10px;
`;

export const CardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardContentFlexStart = styled(CardContent)`
  &&& {
    justify-content: flex-start;
    flex-wrap: wrap;
    grid-gap: 10px;
    column-gap: 10px;
  }
`;

export const CardContentVertical = styled(CardContent)`
  &&& {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const CardContentSelectActivity = styled(CardContent)`
  &&& {
    column-gap: 10px;
  }
`;

// border: 3px solid ${Colors.green};
export const ActivityCard = styled.div`
  background-color: ${Colors.purple};
  color: ${Colors.white};
  border-radius: 10px;
  height: 240px;
  width: 200px;
  &:hover {
    transition: 0.3s;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    background-color: ${Colors.purpleHover};
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ActivityCardWindow = styled.div`
  background-color: ${Colors.white};
  color: ${Colors.black};
  border-radius: 10px;
  height: 40%;
  width: 88%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AnnouncementCard = styled.div`
  background-color: ${Colors.background};
  border-radius: 10px;
  height: 70%;
  width: 70%;
  margin: 10px;
  h1 {
    font-size: 18px;
  }
  p {
    font-size: 14px;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
`;

export const ActivityCardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  height: 500px;
  width: 40vw;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
  overflow: auto;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;

export const LearningProgressContainer = styled(ActivityCardContainer)`
  width: 55vw;
  height: auto;
  align-items: flex-start;
`;

export const OverviewContainer = styled(ActivityCardContainer)`
  width: 25vw;
  height: auto;
`;

export const InsightsContainer = styled.div`
  height: 500px;
  width: 40vw;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
`;

export const InsightsCard = styled.div`
  background-color: ${Colors.white};
  border-radius: 10px;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
  width: 48%;
  height: auto;
  text-align: center;
  p {
    font-size: 12px;
    color: ${Colors.darkgrey};
    margin: 0 auto 0 auto;
    padding: 0 10px 10px 10px;
  }
  h3 {
    font-style: normal;
    font-weight: normal;
    font-size: 90px;
    margin: 0 auto 0 auto;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
`;

const criticalStateAnimation = keyframes`
  0% {background-color: ${Colors.red}; opacity: 1}
  100% {background-color: ${Colors.white}; opacity: 1}
`;

export const InsightsCardRed = styled(InsightsCard)`
  &&& h2 {
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    color: ${Colors.red};
    margin: 0 auto 2vh auto;
  }
  &:hover {
    transition: 0.3s;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
  }
`;

export const InsightsCardAnimated = styled(InsightsCardRed)`
  &&& {
    width: 100%;
    animation-name: ${criticalStateAnimation};
    animation-duration: 4s;
    animation-iteration-count: 1;
  }
`;

export const InsightsCardGreen = styled(InsightsCard)`
  &&& h2 {
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    color: ${Colors.greenTxt};
    margin: 0 auto 2vh auto;
  }
`;

export const InsightsCardGreenClickable = styled(InsightsCardGreen)`
  &:hover {
    transition: 0.3s;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
  }
`;

export const InsightTitle = styled.h1`
  margin: 0 auto 2px auto;
  padding: 10px 15px 0 15px;
  font-size: 20px;
  font-weight: bold;
`;

export const LearningDevCard = styled.div`
  background-color: ${Colors.white};
  border-radius: 10px;
  width: 500px;
  height: 425px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1%;
`;

export const StudentCard = styled.div`
  background-color: ${Colors.white};
  border-radius: 1px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-content: left;
  padding: 1%;
`;

export const FormButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 5px;
`;

export const FormTabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
`;

export const AnnouncementControl = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const ActivityContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-around;
`;

export const ActivityActions = styled.div`
  margin: 0 9.5vw 0 auto;
`;

export const EditActivityActions = styled.div`
  margin: 0 10vw 1vh auto;
`;

export const QuestionFormOption = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const TableContainer = styled.div`
  width: 80%;
`;

export const HelperText = styled.p`
  font-style: italic;
  font-weight: 600;
  font-size 14px;
  margin-left: 10vw;
`;

export const Orb = styled.span`
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
`;
