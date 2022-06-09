import axios from "axios";
import { useEffect, useState } from "react";
import {
  AnnouncementCard,
  CardContainer,
  CardContentVertical,
  CardTitle,
  FormButtonContainer,
} from "../styles";
import { Announcement } from "../Models/Announcement";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { AnnouncementControl } from "../styles";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Array<Announcement>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [announcementId, setAnnouncementId] = useState<number>();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/announcements").then((res) => {
      const announcementList: Array<Announcement> = res.data;
      sortByDate(announcementList);
      setAnnouncements(announcementList);
    });
  }, []);

  const sortByDate = (announcementList: Array<Announcement>) => {
    announcementList.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getDateString = (date: string): string => {
    let dateObj: Date = new Date(date);
    let dateString: string =
      dateObj.toLocaleDateString().replaceAll(".", "/") +
      " " +
      dateObj.toLocaleTimeString();

    return dateString;
  };

  const handleNewAnnouncement = () => {
    navigate("/new_announcement");
  };

  const handleDelete = () => {
    axios
      .delete(`/api/announcements/${announcementId}`)
      .then((res) => {
        let announcementList: Array<Announcement> = announcements;
        announcementList = announcementList.filter(
          (a) => a.id !== announcementId
        );
        setAnnouncements(announcementList);
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  };

  const handleEdit = (id: number) => {
    window.sessionStorage.setItem(
      "announcement",
      JSON.stringify(announcements.find((item) => item.id === id))
    );
    navigate(`/announcement/${id}/edit`);
  };

  const handleDialogOpen = (id: number) => {
    setAnnouncementId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (deleteResource: "delete" | "cancel") => {
    if (deleteResource === "delete") handleDelete();
    setIsDialogOpen(false);
  };

  return (
    <>
      <CardContainer>
        <CardTitle>Announcements</CardTitle>
        <FormButtonContainer style={{ marginRight: "13%" }}>
          <Button
            aria-label="add"
            onClick={handleNewAnnouncement}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            New announcement
          </Button>
        </FormButtonContainer>
        <CardContentVertical>
          {announcements.map((data, idx) => {
            return (
              <AnnouncementCard key={"announcement-" + idx}>
                <AnnouncementControl>
                  <h1>{data.title}</h1>
                  <div>
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEdit(data.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={() => handleDialogOpen(data.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </AnnouncementControl>

                <i>{getDateString(data.date)}</i>
                <p>{data.content}</p>
              </AnnouncementCard>
            );
          })}
        </CardContentVertical>
      </CardContainer>
      <ConfirmDeleteDialog
        title="Are you sure you want to delete this announcement?"
        body="Deleting this announcement can not be undone. If you need to change it you can choose the edit option instead."
        isOpen={isDialogOpen}
        handleClose={handleDialogClose}
      />
    </>
  );
};
