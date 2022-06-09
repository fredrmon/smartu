import { Button, FormControl, FormGroup, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormButtonContainer } from "../styles";

export const AnnouncementForm = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      id !== undefined &&
      typeof window.sessionStorage.getItem("announcement") === "string"
    ) {
      let jsonData = window.sessionStorage.getItem("announcement");
      let announcement = JSON.parse(jsonData!);
      setTitle(announcement.title);
      setBody(announcement.content);
    }
  }, [id]);

  const handleSave = () => {
    if (body.length > 0 && title.length > 0) {
      if (
        id !== undefined &&
        typeof window.sessionStorage.getItem("announcement") === "string"
      ) {
        axios
          .put(`/api/announcements/${id}`, { title: title, content: body })
          .then((res) => {
            window.sessionStorage.removeItem("announcement");
            navigate(-1);
          });
      } else {
        axios
          .post(`/api/announcements`, { title: title, content: body })
          .then((res) => {
            navigate(-1);
          })
          .catch((error) => {
            console.log(error.toJSON());
          });
      }
    }
  };

  const handleCancel = () => {
    // TODO: Add warning dialog if cancelling when there is text in fields
    if (body.length !== 0 || title.length !== 0) {
      if (
        // eslint-disable-next-line no-restricted-globals
        confirm("You have unfinished changes, are you sure you want to quit?")
      )
        navigate(-1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <h1>Create a new announcement</h1>
      <FormControl fullWidth margin="dense">
        <FormGroup>
          <TextField
            label="Title"
            required
            placeholder="Write a title for your announcement"
            multiline={true}
            rows={2}
            margin="normal"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="Announcement text"
            required
            placeholder="Write a title for your announcement"
            multiline={true}
            rows={4}
            margin="normal"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <FormButtonContainer>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={body.length <= 0 || title.length <= 0}
            >
              Publish
            </Button>
          </FormButtonContainer>
        </FormGroup>
      </FormControl>
    </div>
  );
};
