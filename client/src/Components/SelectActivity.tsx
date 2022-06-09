import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  MostIncorrectNotification,
  PickRateNotification,
  StudentNotification,
} from "../Models/Activity";
import {
  ActivityCard,
  CardContentSelectActivity,
  CardTitle,
  FormTabsContainer,
  SelectActivityCard,
} from "../styles";
import { NotificationThreshold } from "../constants";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Badge, ButtonGroup, Tab, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import DeleteIcon from "@mui/icons-material/Delete";

type ActivityData = {
  activity: Activity;
  numberOfStudents?: number;
};

export const SelectActivity = (props: any) => {
  const [activities, setActivities] = useState<Array<ActivityData>>([]);
  const [activitiesActive, setActivitiesActive] = useState<Array<ActivityData>>(
    []
  );
  const [activitiesUpcoming, setActivitiesUpcoming] = useState<
    Array<ActivityData>
  >([]);
  const [activitiesArchived, setActivitiesArchived] = useState<
    Array<ActivityData>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("2");
  const [deleteId, setDeleteId] = useState<number>();
  const [studentNotification, setStudentNotification] = useState<
    Array<boolean>
  >([]);
  const [pickRateNotification, setPickRateNotification] = useState<
    Array<boolean>
  >([]);
  const [mostIncorrectNotification, setMostIncorrectNotification] = useState<
    Array<boolean>
  >([]);
  const [longestTimeNotification, setLongestTimeNotification] = useState<
    Array<boolean>
  >([]);

  const fetchActivities = useCallback(async () => {
    const activityList: Array<ActivityData> = [];
    const active: Array<ActivityData> = [];
    const upcoming: Array<ActivityData> = [];
    const archived: Array<ActivityData> = [];
    await axios
      .get("/api/activities")
      .then((res) => {
        res.data.forEach((el: Activity) => {
          activityList.push({ activity: el });
        });
      })
      .then(() => {
        let promises: Array<Promise<AxiosResponse<any, any>>> = [];
        activityList.forEach((el) => {
          promises.push(
            axios.get(`/api/activities/${el.activity.activityid}/users`)
          );
        });
        Promise.all(promises).then((res) => {
          // Requires the arrays to be in the same order
          res.forEach((el, idx) => {
            activityList[idx].numberOfStudents = el.data.length;
          });
          activityList.forEach((element) => {
            if (
              element.activity.endDate * 1000 < new Date().getTime() ||
              element.activity.archived === "true"
            )
              archived.push(element);
            else if (element.activity.startDate * 1000 > new Date().getTime())
              upcoming.push(element);
            else active.push(element);
          });
          setActivities(activityList);
          setActivitiesActive(active);
          setActivitiesUpcoming(upcoming);
          setActivitiesArchived(archived);
          setIsLoading(false);
        });
      });
  }, []);

  const fetchNotifications = useCallback(async () => {
    await axios
      .get(`/api/activities/statistics/student_performance_overview`)
      .then((res) => {
        const reslist: StudentNotification[] = res.data.map(
          (data: { activityid: number; score: number }) => data
        );
        const studentAtRisk: boolean[] = [];
        let found: boolean = false;
        activitiesActive.forEach((active) => {
          found = false;
          reslist.forEach((element) => {
            if (element.activityid === active.activity.activityid) {
              found = true;
              studentAtRisk.push(
                element.score < NotificationThreshold.studentScore
              );
            }
          });
          if (!found) studentAtRisk.push(false);
        });
        setStudentNotification(studentAtRisk);
      });
    await axios
      .get(`/api/activities/statistics/questions_most_picked_incorrect`)
      .then((res) => {
        const list: PickRateNotification[] = res.data.map(
          (data: { activityid: number; pick_rate: number }) => data
        );
        const pickRateWarning: boolean[] = [];
        let found: boolean = false;
        activitiesActive.forEach((active) => {
          found = false;
          list.forEach((element) => {
            if (element.activityid === active.activity.activityid) {
              found = true;
              pickRateWarning.push(
                element.pick_rate > NotificationThreshold.incorrectOption
              );
            }
          });
          if (!found) pickRateWarning.push(false);
        });
        setPickRateNotification(pickRateWarning);
      });
    await axios
      .get(`/api/activities/statistics/questions_most_incorrect_answer`)
      .then((res) => {
        const list: MostIncorrectNotification[] = res.data.map(
          (data: { activityid: number; pick_rate: number }) => data
        );
        const mostIncorrectWarning: boolean[] = [];
        let found: boolean = false;
        activitiesActive.forEach((active) => {
          found = false;
          list.forEach((element) => {
            if (element.activityid === active.activity.activityid) {
              found = true;
              mostIncorrectWarning.push(
                element.performance < NotificationThreshold.incorrectQuestion
              );
            }
          });
          if (!found) mostIncorrectWarning.push(false);
        });
        setMostIncorrectNotification(mostIncorrectWarning);
      });
    //
    await axios
      .get(`/api/activities/statistics/longest_response_time`)
      .then((res) => {
        const list: any[] = res.data.map(
          (data: { activityid: number; time: number }) => data
        );
        const longestTimeWarning: boolean[] = [];
        let found: boolean = false;
        activitiesActive.forEach((active) => {
          found = false;
          list.forEach((element) => {
            if (element.activityid === active.activity.activityid) {
              found = true;
              longestTimeWarning.push(
                element.time > NotificationThreshold.timeToAnswer
              );
            }
          });
          if (!found) longestTimeWarning.push(false);
        });
        setLongestTimeNotification(longestTimeWarning);
      });
  }, [activitiesActive]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    //For hiding notifications for the study/user tests
    if(localStorage.getItem("answerOption") !== null && localStorage.getItem("longestToAnswer") !== null && localStorage.getItem("commonlyFailed") !== null){
     //localStorage.clear();
    }
    else{
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const getToolTipText = (id: number): string => {
    let text: string = "";
    if (
      studentNotification[id] &&
      (pickRateNotification[id] ||
        mostIncorrectNotification[id] ||
        longestTimeNotification[id])
    )
      text = "Critical student status \n Check quiz statistics";
    else if (studentNotification[id]) text = "Critical student status";
    else if (
      pickRateNotification[id] ||
      mostIncorrectNotification ||
      longestTimeNotification[id]
    )
      text = "Check quiz statistics";
    return text;
  };

  const handleNewActivity = () => {
    navigate(`/new_activity`, {
      state: { numberOfStudents: 0 },
    });
  };

  const handleNavigation = (
    activity: any | undefined,
    archived: boolean | undefined,
    students: number | undefined
  ) => {
    if (typeof activity.activityid === "number" && typeof students === "number")
      window.sessionStorage.setItem("timeLeft", JSON.stringify(activity.endDate));
      window.sessionStorage.setItem("startTime", JSON.stringify(activity.startDate));
      window.sessionStorage.setItem("archived", JSON.stringify(archived));
      navigate(`/activity/${activity.activityid}`, {
        state: { numberOfStudents: students },
      });

  };

  const handleEdit = (
    event: any,
    activityid: number,
    students: number | undefined
  ) => {
    event.stopPropagation();
    window.sessionStorage.setItem(
      "activity",
      JSON.stringify(
        activities.find((item) => item.activity.activityid === activityid)
      )
    );
    if (typeof students === "number")
      navigate(`/activity/${activityid}/edit_description`, {
        state: { numberOfStudents: students },
      });
  };

  const handleTabChange = (event: any, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/activities/${deleteId}`)
      .then((res) => {
        let list: Array<ActivityData> = activitiesArchived;
        let fullList: Array<ActivityData> = activities;
        list = list.filter((a) => a.activity.activityid !== deleteId);
        fullList = fullList.filter((a) => a.activity.activityid !== deleteId);
        setActivitiesArchived(list);
        setActivities(fullList);
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  };

  const handleDialogOpen = (event: any, id: number) => {
    event.stopPropagation();
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (deleteResource: "delete" | "cancel") => {
    if (deleteResource === "delete") handleDelete();
    setIsDialogOpen(false);
  };

  return (
    <>
      <SelectActivityCard>
        <CardTitle>Activities</CardTitle>

        <TabContext value={selectedTab}>
          <FormTabsContainer style={{ margin: "0 13% 0 13%" }}>
            <TabList onChange={handleTabChange}>
              <Tab label="Upcoming" value="1" />
              <Tab label="Active" value="2" />
              <Tab label="Archived" value="3" />
            </TabList>
            <Button
              aria-label="add"
              onClick={handleNewActivity}
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
            >
              New activity
            </Button>
          </FormTabsContainer>
          <TabPanel value="1">
            {isLoading ? (
              <CardContentSelectActivity>loading...</CardContentSelectActivity>
            ) : (
              <CardContentSelectActivity>
                {activitiesUpcoming.map((data, idx) => {
                  return (
                    <div key={"activity-" + idx}>
                      <ActivityCard
                        onClick={() =>
                          handleNavigation(
                            data.activity,
                            false,
                            data.numberOfStudents
                          )
                        }
                      >
                        <div></div>
                        <h1>{data.activity.activityname}</h1>
                        <div>{data.numberOfStudents} students</div>
                      </ActivityCard>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title={`Edit ${data.activity.activityname}`}>
                          <Button
                            sx={{ marginTop: "5px" }}
                            variant="outlined"
                            onClick={(event) =>
                              handleEdit(
                                event,
                                data.activity.activityid,
                                data.numberOfStudents
                              )
                            }
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </CardContentSelectActivity>
            )}
            {activitiesUpcoming.length === 0 && !isLoading ? (
              <CardContentSelectActivity>
                <div> No upcoming activities </div>
              </CardContentSelectActivity>
            ) : (
              ""
            )}
          </TabPanel>
          <TabPanel value="2">
            {isLoading ? (
              <CardContentSelectActivity>loading...</CardContentSelectActivity>
            ) : (
              <CardContentSelectActivity>
                {activitiesActive.map((data, idx) => {
                  return (
                    <Badge
                      key={"activity-" + idx}
                      color="error"
                      invisible={
                        !studentNotification[idx] &&
                        !pickRateNotification[idx] &&
                        !mostIncorrectNotification[idx] &&
                        !longestTimeNotification[idx]
                      }
                      badgeContent={
                        <Tooltip
                          title={
                            <div style={{ whiteSpace: "pre-line" }}>
                              {getToolTipText(idx)}
                            </div>
                          }
                        >
                          <b style={{ fontSize: 16 }}>!</b>
                        </Tooltip>
                      }
                    >
                      <div>
                        <ActivityCard
                          onClick={() =>
                            handleNavigation(
                              data.activity,
                              false,
                              data.numberOfStudents
                            )
                          }
                        >
                          <div></div>
                          <h1>{data.activity.activityname}</h1>
                          <div>{data.numberOfStudents} students</div>
                        </ActivityCard>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title={`Edit ${data.activity.activityname}`}>
                            <Button
                              sx={{ marginTop: "5px" }}
                              variant="outlined"
                              onClick={(event) =>
                                handleEdit(
                                  event,
                                  data.activity.activityid,
                                  data.numberOfStudents
                                )
                              }
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </Badge>
                  );
                })}
              </CardContentSelectActivity>
            )}
            {activitiesActive.length === 0 && !isLoading ? (
              <CardContentSelectActivity>
                <div> No active activities </div>
              </CardContentSelectActivity>
            ) : (
              ""
            )}
          </TabPanel>
          <TabPanel value="3">
            {isLoading ? (
              <CardContentSelectActivity>loading...</CardContentSelectActivity>
            ) : (
              <CardContentSelectActivity>
                {activitiesArchived.map((data, idx) => {
                  return (
                    <div
                      key={"activity-" + idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        rowGap: "5px",
                      }}
                    >
                      <ActivityCard
                        onClick={() =>
                          handleNavigation(
                            data.activity,
                            true,
                            data.numberOfStudents
                          )
                        }
                      >
                        <div></div>
                        <h1>{data.activity.activityname}</h1>
                        <div>{data.numberOfStudents} students</div>
                      </ActivityCard>

                      <ButtonGroup variant="outlined">
                        <Tooltip title={`Delete ${data.activity.activityname}`}>
                          <Button
                            onClick={(event) =>
                              handleDialogOpen(event, data.activity.activityid)
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title={`Edit ${data.activity.activityname}`}>
                          <Button
                            onClick={(event) =>
                              handleEdit(
                                event,
                                data.activity.activityid,
                                data.numberOfStudents
                              )
                            }
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </div>
                  );
                })}
              </CardContentSelectActivity>
            )}
            {activitiesArchived.length === 0 && !isLoading ? (
              <CardContentSelectActivity>
                <div> No archived activities </div>
              </CardContentSelectActivity>
            ) : (
              ""
            )}
          </TabPanel>
        </TabContext>
      </SelectActivityCard>
      <ConfirmDeleteDialog
        title="Are you sure you want to delete this activity?"
        body="Deleting this activity can not be undone. If you need to change it you can choose the edit option instead."
        isOpen={isDialogOpen}
        handleClose={handleDialogClose}
      />
    </>
  );
};
