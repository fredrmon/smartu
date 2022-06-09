import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { ActivityCardWindow } from "../styles";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import SquareIcon from "@mui/icons-material/Square";
import Box from "@mui/material/Box";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Colors, Score } from "../constants";

export const StudentActivityDetails = ({
  attemptnumber,
  isOpen,
  userid,
  activityid,
  handleCloseAttempt,
}: any) => {
  const [results, setResults] = useState([
    {
      score: 0,
      max_score: 0,
      categoryname: "No category",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (attempt: number, id: number) => {
    await axios
      .get(
        `/api/activities/${activityid}/users/${id}/attempt_details/${attempt}`
      )
      .then((res) => {
        setResults(res.data);
      });
  }, []);

  useEffect(() => {
    if (isOpen && attemptnumber !== 0 && userid !== undefined)
      fetchData(attemptnumber, userid).then(() => {
        setIsLoading(false);
      });
  }, [fetchData, isOpen]);

  const getTextColor = (a: any) => {
    const score = (a.score / a.max_score) * 100;
    if (score >= Score.medium) return Colors.green;
    else if (score > Score.low && score <= Score.medium) return Colors.yellow;
    else return Colors.red;
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleCloseAttempt}>
      {isLoading ? (
        <DialogTitle>Loading user...</DialogTitle>
      ) : (
        <ActivityCardWindow>
          <Grid item xs={12} md={6}>
            <br />
            <br />
            <Box
              sx={{
                border: 1,
                borderRadius: 5,
                borderColor: Colors.purple,
                boxShadow: 3,
              }}
            >
              <List dense={false}>
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: "25px" }}
                    primary={"Attempt " + attemptnumber}
                  />
                </ListItem>
                <br />
                {results.map((a: any, index: number) => {
                  return (
                    <ListItem key={"attempt-" + index}>
                      <ListItemIcon>
                        <SquareIcon style={{ fill: getTextColor(a) }} />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: "25px" }}
                        primary={
                          a.categoryname + ":" + a.score + "/" + a.max_score
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Grid>
        </ActivityCardWindow>
      )}
      <DialogActions>
        <Button onClick={() => handleCloseAttempt(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
