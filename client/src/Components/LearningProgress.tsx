import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {
  CardTitle,
  CardTitleContainer,
  LearningProgressContainer,
  Orb,
} from "../styles";
import { ActivityService as Service } from "../Services/activity.service";
import { StudentList, TimeList } from "../Models/LearningDev";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Accordion,
  AccordionSummary,
  OutlinedInput,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip as MuiTooltip } from "@mui/material";
import { Colors, Score } from "../constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

const attemptOptions: any = {
  scales: {
    y: {
      title: {
        display: true,
        text: "Student score",
      },
      min: 0,
      max: 100,
      stepSize: 20,
    },
    x: {
      title: {
        display: true,
        text: "Number of attempts",
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const timeOptionsOverTwoMonths: any = {
  scales: {
    y: {
      title: {
        display: true,
        text: "Student score",
      },
      min: 0,
      max: 100,
      stepSize: 20,
    },
    x: {
      title: {
        display: true,
        text: "Progress over time",
      },
      type: "time",
      time: {
        unit: "day",
        stepSize: 14,
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
const timeOptionsUnderTwoMonths: any = {
  scales: {
    y: {
      title: {
        display: true,
        text: "Student score",
      },
      min: 0,
      max: 100,
      stepSize: 20,
    },
    x: {
      title: {
        display: true,
        text: "Progress over time",
      },
      type: "time",
      time: {
        unit: "day",
        stepSize: 7,
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const initialGraphData = {
  labels: [""],
  datasets: [
    {
      label: "Average student score",
      data: [0, 0, 0],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

export const LearningProgress = () => {
  const { id } = useParams();
  const [studentList, setStudentList] = useState<Array<StudentList>>([
    { userid: 0, name: "Loading list...", score: 0, last_attempt: 0 },
  ]);
  const [averageData, setAverageData] = useState<Array<number>>([]);
  const [studentData, setStudentData] = useState<Array<number>>([]);
  const [studentTimeData, setStudentTimeData] = useState<Array<TimeList>>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [updateAvg, setUpdateAvg] = useState<boolean>(false);
  const [clicked, setClicked] = useState<number>(0);
  const [timeData, setTimeData] = useState<Array<number>>([]);
  const [timeLabel, setTimeLabel] = useState<Array<Date>>([]);
  const [days, setDays] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandFilters, setExpandFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score" | "alphabetical">("score");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [showScore, setShowScore] = useState<"last_attempt" | "average">(
    "last_attempt"
  );
  const [filteredRows, setFilteredRows] = useState<Array<any>>([]);
  const [lineColor, setLineColor] = useState({
    dot: Colors.white,
    border: "none",
  });
  const [graphData, setGraphData] = useState<any>(initialGraphData);

  const [graphOptions, setGraphOptions] = useState(attemptOptions);
  const columns: Array<Column> = [
    { id: "studentName", label: "Name", minWidth: 40, maxWidth: 40 },
    { id: "masteryLevel", label: "Mastery", minWidth: 40, maxWidth: 40 },
  ];

  useEffect(() => {
    Service.getData(`${id}`, updateList, updateData);
    Service.getAvgTimeData(`${id}`, updateTimeData);
  }, [`${id}`]);

  useEffect(() => {
    attemptGraph();
  }, [updateAvg]);

  useEffect(() => {
    updateAttemptStudent();
  }, [studentData]);

  useEffect(() => {
    updateTimeStudent();
  }, [studentTimeData]);

  useEffect(() => {
    if (timeLabel.length > 0)
      setDays(
        (timeLabel[timeLabel.length - 1].getTime() - timeLabel[0].getTime()) /
          (1000 * 60 * 60 * 24)
      );
  }, [timeLabel]);

  const changeSort = (
    mode: boolean,
    method: "direction" | "sort" | "score"
  ) => {
    if (!mode && method === "sort") {
      setSortBy("score");
      let reverse = direction === "desc";
      if (showScore === "last_attempt") sortByLastAttempt(reverse);
      else if (showScore === "average") sortByAverageScore(reverse);
    } else if (mode && method === "sort") {
      setSortBy("alphabetical");
      let reverse = direction === "desc";
      sortRowsByStudentName(reverse);
    } else if (mode && method === "direction") {
      setDirection("desc");
      if (sortBy === "score" && showScore === "last_attempt")
        sortByLastAttempt(true);
      else if (sortBy === "score" && showScore === "average")
        sortByAverageScore(true);
      else sortRowsByStudentName(true);
    } else if (!mode && method === "direction") {
      setDirection("asc");
      if (sortBy === "score" && showScore === "last_attempt")
        sortByLastAttempt();
      else if (sortBy === "score" && showScore === "average")
        sortByAverageScore();
      else sortRowsByStudentName();
    } else if (mode && method === "score") {
      setShowScore("average");
      sortByAverageScore();
      setSortBy("score");
      setDirection("asc");
    } else if (!mode && method === "score") {
      setShowScore("last_attempt");
      sortByLastAttempt();
      setSortBy("score");
      setDirection("asc");
    }
  };

  const handleSearchChange = (searchTerm: string) => {
    if (searchTerm !== "") {
      const result = studentList.filter((row) => {
        return row.name.toLowerCase().includes(searchTerm.toLocaleLowerCase());
      });
      setFilteredRows(result);
    } else {
      setFilteredRows(studentList);
    }
  };

  const updateList = (students: Array<StudentList>) => {
    setStudentList(students);
    setFilteredRows(students);
  };

  const sortByLastAttempt = (reverse?: boolean) => {
    let newRows: any = [...studentList];
    newRows.sort((a: { last_attempt: number }, b: { last_attempt: number }) =>
      a.last_attempt > b.last_attempt ? 1 : -1
    );
    if (reverse) newRows.reverse();
    setStudentList(newRows);
    setFilteredRows(newRows);
  };

  const sortRowsByStudentName = (reverse?: boolean) => {
    let newRows: any = [...studentList];
    newRows.sort((a: { name: string }, b: { name: string }) =>
      a.name > b.name ? 1 : -1
    );
    if (reverse) newRows.reverse();
    setStudentList(newRows);
    setFilteredRows(newRows);
  };

  const sortByAverageScore = (reverse?: boolean) => {
    let newRows: any = [...studentList];
    newRows.sort((a: { score: number }, b: { score: number }) =>
      a.score > b.score ? 1 : -1
    );
    if (reverse) newRows.reverse();
    setStudentList(newRows);
    setFilteredRows(newRows);
  };

  const updateData = (list: number[]) => {
    setAverageData(list);
    setUpdateAvg(!updateAvg);
  };

  const updateTimeData = (list: any) => {
    setTimeData(list.map((data: { score: number }) => data.score));
    setTimeLabel(list.map((data: { date: Date }) => new Date(data.date)));
  };

  const getLabels = (averageData: number[]): string[] => {
    let attempts: string[] = [];
    for (let i = 0; i < averageData.length; i++) {
      attempts[i] = (1 + i).toString();
    }
    return attempts;
  };

  const getLineColor = (value: number) => {
    if (value <= Score.low)
      setLineColor({ dot: Colors.red, border: Colors.redLine });
    else if (value > Score.low && value <= Score.medium)
      setLineColor({ dot: Colors.yellow, border: Colors.yellowLine });
    else if (value > Score.medium)
      setLineColor({ dot: Colors.green, border: Colors.greenLine });
  };

  const checkLastAttempt = (): boolean => {
    if (showScore === "last_attempt") {
      return true;
    } else return false;
  };

  const attemptGraph = () => {
    setGraphOptions(attemptOptions);
    setGraphData((state: any) => ({
      ...state,
      labels: getLabels(averageData),
      datasets: [
        {
          label: "Average student score",
          data: averageData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    }));
  };

  const updateAttemptStudent = () => {
    setGraphOptions(attemptOptions);
    setGraphData((state: any) => ({
      ...state,
      labels: getLabels(averageData),
      datasets: [
        {
          label: "Average student score",
          data: averageData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: studentName,
          data: studentData,
          borderColor: lineColor.border,
          backgroundColor: lineColor.dot,
        },
      ],
    }));
  };

  const sameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const mapStudentData = (): any[] => {
    let list: any[] = [];
    let j: number = 0;
    for (let i = 0; i < timeLabel.length; i++) {
      if (studentTimeData.length > i - j) {
        if (sameDay(timeLabel[i], new Date(studentTimeData[i - j].date))) {
          list.push(studentTimeData[i - j].score);
        } else {
          list.push(null);
          j++;
        }
      } else {
        list.push(null);
        j++;
      }
    }
    return list;
  };

  const getTimeLabels = (): string[] => {
    let labels: string[] = [];
    for (let i = 0; i < timeLabel.length; i++) {
      labels[i] = timeLabel[i].toISOString();
    }
    return labels;
  };

  const timeGraph = () => {
    if (days <= 60) setGraphOptions(timeOptionsUnderTwoMonths);
    else setGraphOptions(timeOptionsOverTwoMonths);
    setGraphData({
      labels: getTimeLabels(),
      datasets: [
        {
          label: "Average student score",
          data: timeData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
  };

  const updateTimeStudent = () => {
    if (days <= 60) setGraphOptions(timeOptionsUnderTwoMonths);
    else setGraphOptions(timeOptionsOverTwoMonths);
    setGraphData((state: any) => ({
      ...state,
      labels: getTimeLabels(),
      datasets: [
        {
          label: "Average student score",
          data: timeData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: studentName,
          data: mapStudentData(),
          borderColor: lineColor.border,
          backgroundColor: lineColor.dot,
          showLine: true,
          spanGaps: true,
        },
      ],
    }));
  };

  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 1) {
      if (clicked === 0) {
        timeGraph();
      } else {
        Service.getStudentTimeData(`${id}`, `${clicked}`, setStudentTimeData);
      }
    } else {
      if (clicked === 0) {
        attemptGraph();
      } else {
        Service.getStudentData(`${id}`, `${clicked}`, setStudentData);
      }
    }
  };

  const handleClick = (userid: number, name: string, score: number) => {
    if (clicked === userid && selectedTab === 0) {
      setClicked(0);
      attemptGraph();
    } else if (clicked === userid && selectedTab === 1) {
      setClicked(0);
      timeGraph();
    } else if (selectedTab === 0) {
      setClicked(userid);
      getLineColor(score);
      setStudentName(name);
      Service.getStudentData(`${id}`, `${userid}`, setStudentData);
    } else {
      setClicked(userid);
      getLineColor(score);
      setStudentName(name);
      Service.getStudentTimeData(`${id}`, `${userid}`, setStudentTimeData);
    }
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCellColor = (
    value: number,
    userid: number
  ): { bg: string; border: string } => {
    let innerBorder: string = "inset 0px 0px 0px 4px";
    let colors = { bg: Colors.white, border: "none" };
    if (value > Score.medium)
      colors = {
        bg: Colors.green,
        border:
          clicked === userid ? `${innerBorder} ${Colors.greenTxt}` : "none",
      };
    else if (value > Score.low && value <= Score.medium)
      colors = {
        bg: Colors.yellow,
        border:
          clicked === userid ? `${innerBorder} ${Colors.yellowTxt}` : "none",
      };
    else
      colors = {
        bg: Colors.red,
        border: clicked === userid ? `${innerBorder} ${Colors.redTxt}` : "none",
      };
    return colors;
  };

  return (
    <LearningProgressContainer>
      <CardTitleContainer style={{ alignSelf: "center" }}>
        <CardTitle>Learning progress</CardTitle>
        <MuiTooltip title="The learning progress graphs lets you select students and see their progress across attempts and over time. The blue line shows the average score of all the students. Click on a student to show their graph.">
          <IconButton>
            <HelpOutlineIcon color="primary"></HelpOutlineIcon>
          </IconButton>
        </MuiTooltip>
      </CardTitleContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          columnGap: "20px",
        }}
      >
        <Stack direction="column" alignItems="center">
          <Accordion
            expanded={expandFilters}
            elevation={0}
            sx={{ width: "300px" }}
          >
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
            </Stack>
            <OutlinedInput
              sx={{ marginTop: "5px" }}
              endAdornment={<SearchIcon />}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </Accordion>
          <TableContainer style={{ marginLeft: "2vw", width: "90%" }}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        textAlign:
                          column.id === "studentName" ? "left" : "center",
                      }}
                      key={column.id}
                      align={column.align}
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        key={row.name + row.userid}
                      >
                        {columns.map((column) => {
                          if (checkLastAttempt()) {
                            if (column.id === "studentName") {
                              return (
                                <TableCell
                                  sx={{
                                    textAlign: "left",
                                    ":hover": {
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    },
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  onClick={() =>
                                    handleClick(
                                      row.userid,
                                      row.name,
                                      row.last_attempt
                                    )
                                  }
                                >
                                  {row.name}
                                </TableCell>
                              );
                            } else {
                              const cellColors: { bg: string; border: string } =
                                getCellColor(row.last_attempt, row.userid);
                              return (
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    ":hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  onClick={() =>
                                    handleClick(
                                      row.userid,
                                      row.name,
                                      row.last_attempt
                                    )
                                  }
                                >
                                  <MuiTooltip
                                    title={`${
                                      row.name
                                    } got a score of ${row.last_attempt.toFixed(
                                      2
                                    )} on their last attempt in this activity`}
                                  >
                                    <Orb
                                      style={{
                                        backgroundColor: cellColors.bg,
                                        boxShadow: cellColors.border,
                                      }}
                                    ></Orb>
                                  </MuiTooltip>
                                </TableCell>
                              );
                            }
                          } else if (!checkLastAttempt()) {
                            if (column.id === "studentName") {
                              return (
                                <TableCell
                                  sx={{
                                    textAlign: "left",
                                    ":hover": {
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    },
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  onClick={() =>
                                    handleClick(row.userid, row.name, row.score)
                                  }
                                >
                                  {row.name}
                                </TableCell>
                              );
                            } else {
                              const cellColors: { bg: string; border: string } =
                                getCellColor(row.score, row.userid);
                              return (
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    ":hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  onClick={() =>
                                    handleClick(row.userid, row.name, row.score)
                                  }
                                >
                                  <MuiTooltip
                                    title={`${
                                      row.name
                                    } has an average score of ${row.score.toFixed(
                                      2
                                    )} in this activity`}
                                  >
                                    <Orb
                                      style={{
                                        backgroundColor: cellColors.bg,
                                        boxShadow: cellColors.border,
                                      }}
                                    ></Orb>
                                  </MuiTooltip>
                                </TableCell>
                              );
                            }
                          }
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              sx={{
                ".MuiTablePagination-toolbar, .MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-actions, .MuiTablePagination-displayedRows":
                  {
                    fontSize: 11,
                    padding: 0,
                    margin: 0,
                  },
                ".MuiTablePagination-spacer": {
                  flex: "0 0 0",
                  marginLeft: "10px",
                },
              }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={studentList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Stack>
        <div style={{ marginLeft: "80px" }}>
          <div
            style={{
              maxWidth: "500px",
              maxHeight: "500px",
              margin: "10px auto auto 10px",
            }}
          >
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Progress by attempts" />
              <Tab label="Progress over time" />
            </Tabs>
          </div>
          <Line
            options={graphOptions}
            height={"480px"}
            width={"540px"}
            data={graphData}
          />
        </div>
      </div>
    </LearningProgressContainer>
  );
};
