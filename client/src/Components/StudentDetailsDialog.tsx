import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { User } from "../Models/User";
import { StudentActivityHistory } from "./StudentActivityHistory";
import { StudentActivityDetails } from "./StudentActivityDetails";


export const StudentDetailsDialog = ({
  title,
  body,
  userid,
  activityid,
  isOpen,
  handleClose,
}: any) => {
  const [user, setUser] = useState<User>();
  const [lastLogin, setLastLogin] = useState<Date>(new Date(0));
  const [loginCount, setLoginCount] = useState<number>();
  const [attempts, setAttempts] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [clickedAttempt, setClickedAttempt] = useState<number>(0);

  const fetchData = useCallback(async () => {
    let promise1 = await axios
      .get(`/api/users/${userid}`)
      .then((res) => {
        setUser(res.data[0]);
      })
      .then(async () => {
        await axios
          .get(`/api/activities/${activityid}/users/${userid}`)
          .then((res) => {
            setLastLogin(new Date(res.data[0].date));
            setLoginCount(res.data[0].count_logins);
          });
      });
    let promise2 = await axios
      .get(`/api/activities/${activityid}/users/${userid}/attempts`)
      .then((res) => {
        let tempAttempts = res.data;
        setAttempts(tempAttempts);
      });
    Promise.resolve([promise1, promise2]);
    setIsLoading(false);
  }, [activityid, userid]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [fetchData, isOpen]);

  useEffect(() => {
    if(clickedAttempt !== 0) {
      setIsDialogOpen(true);
    }
  }, [clickedAttempt]);

  const timeSince = (date: Date) => {
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    // Math.abs() prevents crashing if data in the DB has a date in the future
    // This will give an incorrect last login date, but prevents application crash
    const seconds = Math.abs(Math.floor((Date.now() - date.getTime()) / 1000));
    const interval = intervals.find((i) => i.seconds < seconds);
    const count = Math.floor(seconds / interval!.seconds);
    return `${count} ${interval!.label}${count !== 1 ? "s" : ""} ago`;
  };

  const loginDateToString = (date: Date) => {
    const time = date.toLocaleTimeString().split(":");
    return `${date.toDateString()}, ${time[0]}:${time[1]}`;
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setClickedAttempt(0);
  };

  return (
    <>
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      {isLoading ? (
        <DialogTitle>Loading user...</DialogTitle>
      ) : (
        <>
          <DialogTitle>{`${user?.uname} ${user?.usurname}`}</DialogTitle>
          <DialogContent>
            <DialogContentText>{user?.email}</DialogContentText>
            Last login: <b>{loginDateToString(lastLogin)} </b>
            <i>({timeSince(lastLogin)})</i>
            <br />
            Total number of logins: <b>{loginCount}</b>{" "}
            <Divider sx={{ margin: "1vh auto 2vh auto" }} />
            <StudentActivityHistory attempts={attempts} setClickedAttempt={setClickedAttempt}/>
          </DialogContent>
        </>
      )}

      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Close</Button>
      </DialogActions>
    </Dialog>
      <StudentActivityDetails
        attemptnumber={clickedAttempt}
        isOpen={isDialogOpen}
        userid={userid}
        activityid={activityid}
        handleCloseAttempt={handleDialogClose}
      />
    </>
  );
};
