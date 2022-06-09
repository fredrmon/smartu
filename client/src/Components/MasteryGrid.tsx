import {
  Accordion,
  AccordionSummary,
  IconButton,
  OutlinedInput,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import faker from "faker";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Colors, Score } from "../constants";
import { QuestionCategory } from "../Models/QuestionCategory";
import { TopicMastery, Column } from "../Models/TopicMastery";
import {
  ActivityCardContainer,
  CardContent,
  CardTitle,
  CardTitleContainer,
} from "../styles";
import { StudentDetailsDialog } from "./StudentDetailsDialog";
import { ActivityService as Service } from "../Services/activity.service";
import WarningIcon from "@mui/icons-material/Warning";
import { ActivityOverview } from "../Models/ActivityOverview";

faker.locale = "nb_NO";

export const MasteryGrid = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState<Array<Column>>([]);
  const [rows, setRows] = useState<Array<any>>([]);
  const [mastery, setMastery] = useState<Array<any>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [clickedUserId, setClickedUserId] = useState<number>();
  const [lastAttempt, setLastAttempt] = useState<Array<ActivityOverview>>([]);
  const [averageScore, setAverageScore] = useState<Array<ActivityOverview>>([]);
  const [expandFilters, setExpandFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score" | "alphabetical">("score");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [showScore, setShowScore] = useState<"last_attempt" | "average">(
    "last_attempt"
  );
  const [filteredRows, setFilteredRows] = useState<Array<any>>([]);
  const [lastAttemptList, setLastAttemptList] = useState<Array<any>>([]);
  const [avgList, setAvgList] = useState<Array<any>>([]);


  const { id } = useParams();

  useEffect(() => {
    Service.getMasteryGrid(id, initGrid);
    Service.getMasteryGridLastAttemptList(id, updateLastAttempt);
    Service.getMasteryGridAverageList(id, updateAverageScore);
    Service.getMasteryGridAverage(id, setAvgList);
  }, [id]);

  useEffect(() => {
    if (
      mastery.length > 0 &&
      lastAttempt.length > 0 &&
      showScore === "last_attempt"
    ) {
      sortRowsByLowestLastAttempt();
    }
    if (
      mastery.length > 0 &&
      lastAttempt.length > 0 &&
      showScore === "average"
    ) {
      sortRowsLowestAverageScore();
    }
  }, [mastery, lastAttempt]);

  const changeSort = (
    mode: boolean,
    method: "direction" | "sort" | "score"
  ) => {
    if (!mode && method === "sort") {
      setSortBy("score");
      let reverse = direction === "desc";
      if (showScore === "last_attempt") sortRowsByLowestLastAttempt(reverse);
      else sortRowsLowestAverageScore(reverse);
    } else if (mode && method === "sort") {
      setSortBy("alphabetical");
      let reverse = direction === "desc";
      sortRowsByStudentName(reverse);
    } else if (mode && method === "direction") {
      setDirection("desc");
      if (sortBy === "score" && showScore === "last_attempt")
        sortRowsByLowestLastAttempt(true);
      else if (sortBy === "score" && showScore === "average")
        sortRowsLowestAverageScore(true);
      else sortRowsByStudentName(true);
    } else if (!mode && method === "direction") {
      setDirection("asc");
      if (sortBy === "score" && showScore === "last_attempt")
        sortRowsByLowestLastAttempt();
      else if (sortBy === "score" && showScore === "average")
        sortRowsLowestAverageScore();
      else sortRowsByStudentName();
    } else if (mode && method === "score") {
      setShowScore("average");
      updateGrid(avgList);
      setSortBy("score");
      setDirection("asc");
    } else if (!mode && method === "score") {
      setShowScore("last_attempt");
      updateGrid(lastAttemptList);
      setSortBy("score");
      setDirection("asc");
    }
  };

  const sortRowsByLowestLastAttempt = (reverse?: boolean) => {
    let newRows: any = [];
    let row: any = {};
    for (let item of lastAttempt) {
      row = mastery.find((x) => x.userid === item.userid);
      newRows.push(row);
    }
    if (reverse) newRows.reverse();
    setRows(newRows);
    setFilteredRows(newRows);
  };

  const sortRowsLowestAverageScore = (reverse?: boolean) => {
    let newRows: any = [];
    let row: any = {};
    for (let item of averageScore) {
      row = mastery.find((x) => x.userid === item.userid);
      newRows.push(row);
    }
    if (reverse) newRows.reverse();
    setRows(newRows);
    setFilteredRows(newRows);
  };

  const sortRowsByStudentName = (reverse?: boolean) => {
    let newRows: any = [...rows];
    newRows.sort((a: { studentName: string }, b: { studentName: string }) =>
      a.studentName > b.studentName ? 1 : -1
    );
    if (reverse) newRows.reverse();
    setRows(newRows);
    setFilteredRows(newRows);
  };

  //const original = [...rows];
  const handleSearchChange = (searchTerm: string) => {
    if (searchTerm !== "") {
      const result = rows.filter((row) => {
        return row.studentName
          .toLowerCase()
          .includes(searchTerm.toLocaleLowerCase());
      });
      setFilteredRows(result);
    } else {
      setFilteredRows(rows);
    }
  };

  const initGrid = (data: any) => {
    setLastAttemptList(data);
    let cats = getCategories(data);
    let catCol = createCategoryColumns(cats);
    setColumns(catCol);
    let newRows = createRows(data);
    setMastery(newRows);
  };

  const updateGrid = (data: any) => {
    let cats = getCategories(data);
    let catCol = createCategoryColumns(cats);
    setColumns(catCol);
    let newRows = createRows(data);
    setMastery(newRows);
  };

  const updateLastAttempt = (data: any) => {
    setLastAttempt(data);
  };

  const updateAverageScore = (data: any) => {
    data = sortByLowestAverageScore(data);
    setAverageScore(data);
  };

  const getCategories = (
    list: Array<TopicMastery>
  ): Array<QuestionCategory> => {
    let cats: Array<QuestionCategory> = [];
    let firstUser = list[0]?.userid;
    list = list.filter((el) => {
      return el.userid === firstUser;
    });
    list.forEach((el) => {
      cats.push({
        categoryid: el.questioncategory,
        categoryname: el.categoryname,
      });
    });
    return cats;
  };

  const createCategoryColumns = (
    list: Array<QuestionCategory>
  ): Array<Column> => {
    let catCol: Array<Column> = [
      { id: "studentName", label: "Name", minWidth: 180 },
    ];
    list.forEach((el) => {
      catCol.push({
        id: el.categoryname.toLocaleLowerCase(),
        label: el.categoryname,
        minWidth: 40,
        maxWidth: 50,
      });
    });
    return catCol;
  };

  const createRows = (list: Array<TopicMastery>) => {
    // Get unique users from list and put them into a separate array
    const uniqueUsers = [];
    const map = new Map();
    for (const item of list) {
      if (!map.has(item.userid)) {
        map.set(item.userid, true);
        uniqueUsers.push({
          userid: item.userid,
          name: item.name,
        });
      }
    }
    let newRows: any = [];
    uniqueUsers.forEach((u) => {
      let filteredItems = list.filter((el) => {
        return el.userid === u.userid;
      });
      let newRow: any = {};

      newRow.userid = filteredItems[0].userid;
      newRow.studentName = filteredItems[0].name;
      filteredItems.forEach((el, i) => {
        newRow[el.categoryname.toLocaleLowerCase()] = Math.round(el.score);
      });
      newRows.push(newRow);
    });
    newRows = sortByLowestAverageScore(newRows);
    return newRows;
  };

  const sortByLowestAverageScore = (data: Array<any>) => {
    return data.sort((a, b) => {
      let avgA = getAverageScore(a);
      let avgB = getAverageScore(b);
      return avgA - avgB;
    });
  };

  const getAverageScore = (data: any): number => {
    let score: number = 0;
    let scores = Object.keys(data).filter((keys) => {
      return keys !== "studentName" && keys !== "userid";
    });
    scores.forEach((key) => (score += parseInt(data[key])));
    return score / scores.length;
  };

  const checkLastAttempt = (): boolean => {
    if (showScore === "last_attempt") {
      return true;
    } else return false;
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const getLastAttemptScore = (data: any): number => {
    let score: number = 0;
    lastAttempt.forEach((el) => {
      if (el.userid === data.userid) {
        score = el.score;
      }
    });
    return score;
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCellColor = (value: number): { bg: string; txt: string } => {
    if (value <= Score.low) return { bg: Colors.red, txt: Colors.redTxt };
    else if (value > Score.low && value <= Score.medium)
      return { bg: Colors.yellow, txt: Colors.yellowTxt };
    else return { bg: Colors.green, txt: Colors.greenTxt };
  };

  const handleDialogOpen = (id: number) => {
    setClickedUserId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <ActivityCardContainer style={{ height: "auto" }}>
        <CardTitleContainer>
          <CardTitle>Mastery grid</CardTitle>
          {/*Old tooltip: It is sorted to show students by their average score across all categories, sorted in ascending order.*/}
          <Tooltip title="The mastery grid displays each student's proficiency within the various topics found in this activity's questions. It is sorted after the students' last attempt score, the same order as the graph">
            <IconButton>
              <HelpOutlineIcon color="primary"></HelpOutlineIcon>
            </IconButton>
          </Tooltip>
        </CardTitleContainer>
        <CardContent style={{ width: "80%" }}>
          <Stack direction="column">
            <Accordion expanded={expandFilters} elevation={0}>
              <AccordionSummary
                onClick={() => setExpandFilters(!expandFilters)}
                expandIcon={<FilterListIcon />}
              >
                Filters
              </AccordionSummary>
              <Stack direction="row" spacing={4} alignItems="center">
                <Stack direction="column" spacing={1} alignItems="start">
                  <Typography variant="body2">Sort by:</Typography>
                  <Stack direction="row">
                    <Typography variant="caption">Score</Typography>
                    <Switch
                      size="small"
                      checked={sortBy === "alphabetical"}
                      onChange={(event) =>
                        changeSort(event.target.checked, "sort")
                      }
                    />
                    <Typography variant="caption">Alfabetical</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Stack direction="column" spacing={1} alignItems="start">
                    <Typography variant="body2">Direction:</Typography>
                    <Stack direction="row">
                      <Typography variant="caption">ASC</Typography>
                      <Switch
                        size="small"
                        checked={direction === "desc"}
                        onChange={(event) =>
                          changeSort(event.target.checked, "direction")
                        }
                      />
                      <Typography variant="caption">DESC</Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Stack direction="column" spacing={1} alignItems="start">
                    <Typography variant="body2">Show score for:</Typography>
                    <Stack direction="row">
                      <Typography variant="caption">Last attempt</Typography>
                      <Switch
                        size="small"
                        onChange={(event) =>
                          changeSort(event.target.checked, "score")
                        }
                      />
                      <Typography variant="caption">Average</Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <OutlinedInput
                    endAdornment={<SearchIcon />}
                    onChange={(event) => handleSearchChange(event.target.value)}
                  />
                </Stack>
              </Stack>
            </Accordion>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.studentName + row.css}
                          onClick={() => handleDialogOpen(row.userid)}
                          sx={{
                            ":hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];

                            if (typeof value === "number") {
                              const cellColors: { bg: string; txt: string } =
                                getCellColor(value);
                              return (
                                <TableCell
                                  sx={{
                                    backgroundColor: cellColors.bg,
                                    color: cellColors.txt,
                                    textAlign: "center",
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    fontWeight: "bold",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                >
                                  {value}
                                </TableCell>
                              );
                            } else if (
                              column.id.localeCompare("studentName") !== 0
                            ) {
                              return (
                                <TableCell
                                  sx={{
                                    backgroundColor: Colors.darkgrey,
                                    color: Colors.lightgrey,
                                    textAlign: "center",
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    fontWeight: "bold",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                >
                                  {"n/a"}
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {checkLastAttempt() &&
                                  getLastAttemptScore(row) <= Score.low ? (
                                    <Tooltip title="This student's average topic score is very low">
                                      <span>
                                        <WarningIcon
                                          style={{ maxHeight: '16px', padding: 0 }}
                                          color="error"
                                          sx={{
                                            margin: "0 10px 0 0",
                                            transform: "translate(0, 3px)",
                                          }}
                                        />
                                        {value}
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    ""
                                  )}
                                  {!checkLastAttempt() &&
                                  getAverageScore(row) <= Score.low ? (
                                    <Tooltip title="This student's average topic score is very low">
                                      <span>
                                        <WarningIcon
                                          style={{ maxHeight: '16px', padding: 0 }}
                                          color="error"
                                          sx={{
                                            margin: "0 10px 0 0",
                                            transform: "translate(0, 3px)",
                                          }}
                                        />
                                        {value}
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    ""
                                  )}
                                  {(checkLastAttempt() &&
                                    getLastAttemptScore(row) > Score.low) ||
                                  (!checkLastAttempt() &&
                                    getAverageScore(row) > Score.low) ? (
                                    <span>{value}</span>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Stack>
        </CardContent>
      </ActivityCardContainer>
      <StudentDetailsDialog
        title={"Studentname Namersen"}
        isOpen={isDialogOpen}
        userid={clickedUserId}
        activityid={id}
        handleClose={handleDialogClose}
      />
    </>
  );
};
