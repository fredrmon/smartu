import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Icon,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormButtonContainer } from "../styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { ConfirmWarningDialog } from "./ConfirmWarningDialog";
import { TimePicker, DatePicker } from "@mui/lab";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type ActivityFormProps = {
  mode: "edit" | "create";
};

type LocationState = {
  numberOfStudents: number;
};

export const ActivityForm = ({ mode }: ActivityFormProps): JSX.Element => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [archived, setArchived] = useState<boolean>(false);
  const [exit, setExit] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dateHelperText, setDateHelperText] = useState<string>(" ");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { numberOfStudents } = location.state as LocationState;

  useEffect(() => {
    if (
      mode === "edit" &&
      typeof window.sessionStorage.getItem("activity") === "string"
    ) {
      fetchSessionStorage();
    } else if (
      mode === "edit" &&
      window.sessionStorage.getItem("activity") === null
    ) {
      fetchActivity();
    }
  }, []);

  useEffect(() => {
    if (mode === "create") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setEndDate(tomorrow);
    }
  }, [mode]);

  useEffect(() => {
    if (endDate.getTime() < new Date().getTime() && !archived)
      setDateHelperText(
        "End date must be later than start date and current time"
      );
    else if (endDate.getTime() < startDate.getTime())
      setDateHelperText("End date must be later than start date");
    else setDateHelperText(" ");
  }, [archived, endDate, startDate]);

  const fetchActivity = () => {
    axios.get(`/api/activities/${id}`).then((res) => {
      setTitle(res.data[0].activityname);
      setDescription(res.data[0].activitydescription);
      setStartDate(new Date(res.data[0].startDate * 1000));
      setEndDate(new Date(res.data[0].endDate * 1000));
      if (
        new Date(res.data[0].endDate * 1000).getTime() < new Date().getTime() ||
        res.data[0].archived === "true"
      ) {
        setArchived(true);
      } else setArchived(false);
    });
  };

  const fetchSessionStorage = () => {
    let jsonData = window.sessionStorage.getItem("activity");
    let activity = JSON.parse(jsonData!);
    setTitle(activity.activity.activityname);
    setDescription(activity.activity.activitydescription);
    setStartDate(new Date(activity.activity.startDate * 1000));
    setEndDate(new Date(activity.activity.endDate * 1000));
    if (
      activity.activity.endDate * 1000 < new Date().getTime() ||
      activity.activity.archived === "true"
    ) {
      setArchived(true);
    } else setArchived(false);
  };

  const createActivity = () => {
    return axios.post(`/api/activities`, {
      activityname: title,
      activitystatus: 1,
      activitydescription: description,
      activitycreator: 0,
      adaptive_instruction: "",
      startdate: startDate.getTime() / 1000,
      enddate: endDate.getTime() / 1000,
    });
  };

  const updateActivity = () => {
    return axios.put(`/api/activities/${id}`, {
      activityname: title,
      activitydescription: description,
      startdate: startDate.getTime() / 1000,
      enddate: endDate.getTime() / 1000,
      archived: archived,
    });
  };

  const handleSave = () => {
    if (description.length > 0 && title.length > 0) {
      if (archived) handleDialogOpen(true);
      else saveAndExit();
    }
  };

  const handleNext = () => {
    if (description.length > 0 && title.length > 0) {
      if (archived) handleDialogOpen(false);
      else saveAndNext();
    }
  };

  const saveAndExit = () => {
    setIsSubmitted(true);
    if (mode === "create") {
      createActivity()
        .then((res) => {
          navigate("/");
        })
        .catch((err) => setIsSubmitted(false));
    } else {
      updateActivity()
        .then((res) => {
          navigate("/");
        })
        .catch((err) => setIsSubmitted(false));
    }
  };

  const saveAndNext = () => {
    setIsSubmitted(true);
    if (mode === "create") {
      createActivity()
        .then((res) => {
          window.sessionStorage.removeItem("activity");
          const createdId: number = res.data.insertId;
          navigate(`/activity/${createdId}/add_questions`, {
            state: { numberOfStudents: numberOfStudents },
          });
        })
        .catch((err) => setIsSubmitted(false));
    } else {
      updateActivity()
        .then((res) => {
          window.sessionStorage.removeItem("activity");
          navigate(`/activity/${id}/add_questions`, {
            state: { numberOfStudents: numberOfStudents },
          });
        })
        .catch((err) => setIsSubmitted(false));
    }
  };

  const handleCancel = () => {
    // TODO: Add warning dialog if cancelling when there is text in fields
    navigate("/");
  };

  const handleStartDate = (newDate: Date | null) => {
    if (newDate === null) {
      setStartDate(new Date());
    } else setStartDate(newDate);
  };

  const handleEndDate = (newDate: Date | null) => {
    if (newDate === null) {
      setEndDate(new Date());
    } else setEndDate(newDate);
  };

  const handleDialogOpen = (value: boolean) => {
    setExit(value);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (confirm: "confirm" | "cancel") => {
    if (confirm === "confirm") {
      if (exit) saveAndExit();
      else saveAndNext();
    }
    setIsDialogOpen(false);
  };

  return (
    <div style={{ width: "24vw" }}>
      <h1>{mode === "create" ? "Create a new activity" : "Edit activity"}</h1>
      <FormControl fullWidth margin="normal">
        <FormGroup>
          <TextField
            label="Title"
            required
            error={title.length < 2}
            color={
              title.length >= 2 && title.length <= 10 ? "primary" : undefined
            }
            placeholder="Write a title for your activity"
            multiline={true}
            rows={2}
            margin="normal"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            inputProps={{ maxLength: 10, minLength: 2 }}
            helperText={`Minimum 2 characters. ${
              10 - title.length
            } characters left`}
          />
          <TextField
            label="Activity text"
            required
            placeholder="Write a description for your activity"
            multiline={true}
            rows={4}
            margin="normal"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {mode === "edit" ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={archived}
                  onChange={(event) => setArchived(event.target.checked)}
                  color="default"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Archive activity"
            />
          ) : (
            <></>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={1} marginTop={1}>
              <Stack direction="row" spacing={3}>
                <div style={{maxWidth: 250}}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={handleStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                </div>
                <TimePicker
                  label="Start time"
                  value={startDate}
                  ampm={false}
                  onChange={handleStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Tooltip title="Start date and time represents the date and time the activity will be published and visible for the students">
                  <Icon>
                    <HelpOutlineIcon color="primary"></HelpOutlineIcon>
                  </Icon>
                </Tooltip>
              </Stack>
              <br />
              <Stack direction="row" spacing={3}>
                <div style={{maxWidth: 250}}>
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={handleEndDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        startDate > endDate ||
                        (!archived && endDate < new Date())
                      }
                      helperText={dateHelperText}
                    />
                  )}
                />
                </div>
                <TimePicker
                  label="End time"
                  value={endDate}
                  ampm={false}
                  onChange={handleEndDate}
                  renderInput={(params) => <TextField {...params} error={
                    startDate > endDate ||
                    (!archived && endDate < new Date())
                  } />}
                />
                <Tooltip title="End date and time represents the date and time the activity will be closed">
                  <Icon>
                    <HelpOutlineIcon color="primary"></HelpOutlineIcon>
                  </Icon>
                </Tooltip>
              </Stack>
            </Stack>
          </LocalizationProvider>
          <FormButtonContainer style={{ marginTop: "10px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                description.length <= 0 ||
                title.length <= 0 ||
                title.length < 2 ||
                startDate > endDate ||
                isSubmitted
              }
            >
              Save and exit
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                description.length <= 0 ||
                title.length <= 0 ||
                title.length < 2 ||
                startDate > endDate ||
                isSubmitted
              }
            >
              Next
            </Button>
          </FormButtonContainer>
        </FormGroup>
      </FormControl>
      <ConfirmWarningDialog
        title="Are you sure you want to archive this activity?"
        body="Archiving this activity will make it unavailable for all students. You can restore the activity by editing it from the archived activities tab."
        isOpen={isDialogOpen}
        handleClose={handleDialogClose}
        confirm={true}
      />
    </div>
  );
};
