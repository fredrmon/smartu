import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton, Tab, Tabs, Tooltip as MuiTooltip } from "@mui/material";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useCallback, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { Colors } from "../constants";
import {
  CategoryOverview,
  DifficultyDistribution,
  TabContentProps,
} from "../Models/ActivityOverview";
import { ActivityService as Service } from "../Services/activity.service";
import {
  CardContent,
  CardTitle,
  CardTitleContainer,
  OverviewContainer,
} from "../styles";

ChartJS.register(
  ArcElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export const Overview = () => {
  const { id } = useParams();
  const [xLabel, setXLabel] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState(0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 14,
        },
      },
    },
  };

  const chartColorsRYG = {
    backgroundColor: [Colors.red, Colors.yellow, Colors.green],
    borderColor: [Colors.white],
    borderWidth: 2,
  };

  const chartColorsBlueShades = {
    backgroundColor: [
      Colors.blueShadeA,
      Colors.blueShadeB,
      Colors.blueShadeC,
      Colors.blueShadeD,
      Colors.blueShadeE,
    ],
    borderColor: [Colors.white],
    borderWidth: 2,
  };

  const [chartData, setChartData] = useState({
    labels: ["High risk", "Medium risk", "Low risk"],
    datasets: [
      {
        label: "# of students in mastery group",
        data: [0, 0, 0],
        ...chartColorsRYG,
      },
    ],
  });

  const diffOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: "# of questions",
        },
        min: 0,
        stepSize: 5,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 13,
        },
      },
    },
  };

  // Fetch data from backend and render doughnut-chart
  const updateList = useCallback((list: number[]) => {
    let total: number = list[0] + list[1] + list[2];
    setXLabel("Total # of students in activity: " + total);
    setChartData((prevState) => ({
      ...prevState,
      labels: ["High risk", "Medium risk", "Low risk"],
      datasets: [
        {
          label: prevState.datasets[0].label,
          data: list,
          ...chartColorsRYG,
        },
      ],
    }));
  }, []);

  const updateCategoryList = (list: Array<CategoryOverview>) => {
    setXLabel(
      "Total # of questions in activity: " +
        list.map((item) => item.total).reduce((prev, curr) => prev + curr, 0)
    );
    if (list.length > 0) {
      setChartData((prevState) => ({
        //...prevState,
        labels: list.map((data: { categoryname: string }) => data.categoryname),
        datasets: [
          {
            label: prevState.datasets[0].label,
            data: list.map((data: { total: number }) => data.total),
            ...chartColorsBlueShades,
          },
        ],
      }));
    } else {
      setChartData((prevState) => ({
        //...prevState,
        labels: ["No categories"],
        datasets: [
          {
            label: prevState.datasets[0].label,
            data: [0],
            ...chartColorsBlueShades,
          },
        ],
      }));
    }
  };

  const updateDifficultyList = (list: Array<DifficultyDistribution>) => {
    setXLabel("Topics");
    setChartData({
      labels: list.map((data: { categoryname: string }) => data.categoryname),
      datasets: [
        {
          label: "Easy",
          data: list.map((data: { easy: number }) => data.easy),
          backgroundColor: [Colors.blue],
          borderColor: [],
          borderWidth: 0,
        },
        {
          label: "Medium",
          data: list.map((data: { medium: number }) => data.medium),
          backgroundColor: [Colors.yellow],
          borderColor: [],
          borderWidth: 0,
        },
        {
          label: "Hard",
          data: list.map((data: { hard: number }) => data.hard),
          backgroundColor: [Colors.orange],
          borderColor: [],
          borderWidth: 0,
        },
      ],
    });
  };

  useEffect(() => {
    Service.getMasteryOverviewData(`${id}`, updateList);
  }, [id, updateList]);

  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      Service.getMasteryOverviewData(`${id}`, updateList);
    } else if (newValue === 1) {
      Service.getOverviewCategoryData(`${id}`, updateCategoryList);
    } else {
      Service.getOverviewDifficultyData(`${id}`, updateDifficultyList);
    }
  };

  return (
    <OverviewContainer>
      <CardTitleContainer>
        <CardTitle>Overview</CardTitle>
        <MuiTooltip
          title={
            selectedTab === 0 || selectedTab === 1
              ? selectedTab === 0
                ? "The mastery overview shows the distribution of mastery level among the students registered in the activity "
                : "The question distribution displays % of questions within each topic"
              : "The difficulty distribution shows the number of questions within each difficulty level grouped by topic"
          }
        >
          <IconButton>
            <HelpOutlineIcon color="primary"></HelpOutlineIcon>
          </IconButton>
        </MuiTooltip>
      </CardTitleContainer>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          label={
            <div>
              Student <br /> overview
            </div>
          }
        />
        <Tab
          label={
            <div>
              Question <br /> distribution
            </div>
          }
        />
        <Tab
          label={
            <div>
              Difficulty <br /> distribution
            </div>
          }
        />
      </Tabs>
      <CardContent style={{ margin: "auto 0 auto 0" }}>
        <TabContent
          data={chartData}
          options={
            selectedTab === 0 || selectedTab === 1 ? options : diffOptions
          }
          tab={selectedTab}
        />
      </CardContent>
    </OverviewContainer>
  );
};

const TabContent = ({ data, options, tab }: TabContentProps) => {
  return (
    <>
      {tab === 0 || tab === 1 ? (
        <Doughnut data={data} options={options} height={"400"} width={"300"} />
      ) : (
        <Bar data={data} options={options} height={"420"} width={"380"} />
      )}
    </>
  );
};
