import axios from "axios";
import {
  LongestTimeSpent,
  MostPickedIncorrectAnswer,
} from "../Models/ActivityInsight";
import { StudentList, TimeList } from "../Models/LearningDev";
import { ActivityOverview, CategoryOverview } from "../Models/ActivityOverview";
import { Score } from "../constants";

export class ActivityService {
  // Fetching data for activity Insights
  static getQuestionCorrectPercent(
    id: string,
    sortingDirection: "ASC" | "DESC",
    callback: any
  ) {
    axios
      .get(`/api/activities/${id}/statistics/question_correct_percentage`, {
        params: { sort: sortingDirection },
      })
      .then((res) => {
        const questionCorrectPercent = res.data[0];
        callback(questionCorrectPercent);
      });
  }

  static getMostPickedIncorrectAnswerOption(id: string, callback: any) {
    axios
      .get(`/api/activities/${id}/statistics/questions_most_picked_incorrect`)
      .then((res) => {
        const mostPicked: MostPickedIncorrectAnswer = res.data[0];
        callback(mostPicked);
      });
  }

  static async getProgressAmongStudents(id: string): Promise<any> {
    let progress: any[] = [];
    await axios
      .get(`/api/activities/${id}/statistics/progress_list`)
      .then((res) => {
        progress = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return progress;
  }

  //Checks if the last attempt resulted in a higher score than previous attempts for each student
  static getProgressInsights(id: string, callback: any) {
    let studentList: number[] = [];
    let userid: number = 0;
    let attempt: number = 0;
    let worstScore: number = 100;
    let bestScore: number = 0;
    let secondLastBestScore: number = 0;
    let lastScore: number = 0;
    Promise.all([this.getProgressAmongStudents(id)])
      .then((values) => {
        let list: any[] = values[0];
        list.forEach((element) => {
          if (element.userid === userid) {
            lastScore = element.score;
            secondLastBestScore = bestScore;
            if (element.attempt > attempt) attempt = element.attempt;
            if (element.score > bestScore) bestScore = element.score;
            if (element.score < worstScore) worstScore = element.score;
          } else {
            if (
              lastScore > secondLastBestScore &&
              lastScore > worstScore &&
              attempt > 1 &&
              userid !== 0
            ) {
              studentList.push(userid);
            }
            userid = element.userid;
            lastScore = element.score;
            if (element.attempt > 0) attempt = element.attempt;
            if (element.score > 0) bestScore = element.score;
            if (element.score < 100) worstScore = element.score;
          }
        });
      })
      .then(() => {
        callback(studentList);
      });
  }

  static getLogins(id: string, callback: any) {
    axios.get(`/api/activities/${id}/statistics/logins`).then((res) => {
      const logins: number = res.data[0].logins;
      callback(logins);
    });
  }

  // TODO: Fix
  static getNotLoggedIn(id: string, days: number, callback: any) {
    axios
      .get(`/api/activities/${id}/statistics/not_logged_in`, {
        params: { days: days },
      })
      .then((res) => {
        const logins: number = res.data[0].logins;
        callback(logins);
      });
  }

  static getLongestTime(id: string, callback: any) {
    axios
      .get(
        `/api/activities/${id}/statistics/questions_longest_avg_response_time`
      )
      .then((res) => {
        let questionsOverThreshold = 0;
        res.data.forEach((el: { average_response_time: number }) => {
          questionsOverThreshold += el.average_response_time > 180 ? 1 : 0;
        });
        const displayTime = ActivityService.convertToMinutesAndSeconds(
          res.data[0]?.average_response_time
        );
        const longestTime: LongestTimeSpent = {
          questionid: res.data[0]?.questionid,
          average_response_time: displayTime,
          time: res.data[0]?.average_response_time,
          questionsOverThreshold,
        };
        callback(longestTime);
      });
  }

  static convertToMinutesAndSeconds = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return minutes + " m " + seconds + " s";
  };

  // Fetching data for learning development graph
  static async getAvgDevelopment(id: string): Promise<number> {
    let learningDev: number = 0;
    await axios
      .get(`/api/activities/${id}/statistics/development_avg`)
      .then((res) => {
        learningDev = res.data.map((data: { score: number }) => data.score);
      })
      .catch((err) => {
        console.log(err);
      });
    return learningDev;
  }

  static async getStudentList(id: string): Promise<Array<StudentList>> {
    let studentList: Array<StudentList> = [];
    await axios
      .get(`/api/activities/${id}/statistics/student_performance_progress`)
      .then((res) => {
        studentList = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return studentList;
  }

  static getData(id: string, callback1: any, callback2: any) {
    let studentList: Array<StudentList> = [];
    Promise.all([this.getStudentList(id)]).then((values) => {
      studentList = values[0];
      callback1(studentList);
    });
    Promise.all([this.getAvgDevelopment(id)]).then((values) => {
      let avgData = values[0];
      callback2(avgData);
    });
  }

  static async getStudentDevelopment(
    id: string,
    userid: string
  ): Promise<number> {
    let studentData: number = 0;
    await axios
      .get(`/api/activities/${id}/statistics/development_student/${userid}`)
      .then((res) => {
        studentData = res.data.map((data: { score: number }) => data.score);
      })
      .catch((err) => {
        console.log(err);
      });
    return studentData;
  }

  static getStudentData(id: string, userid: string, callback: any) {
    Promise.all([this.getStudentDevelopment(id, userid)]).then((values) => {
      const studentData = values[0];
      callback(studentData);
    });
  }

  static async getAvgProgressOverTime(id: string): Promise<Array<TimeList>> {
    let avgData: Array<TimeList> = [{ score: 0, date: 0 }];
    await axios
      .get(`/api/activities/${id}/statistics/development_avg_time`)
      .then((res) => {
        avgData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return avgData;
  }

  static async getStudentProgressOverTime(
    id: string,
    userid: string
  ): Promise<Array<TimeList>> {
    let avgData: Array<TimeList> = [{ score: 0, date: 0 }];
    await axios
      .get(
        `/api/activities/${id}/statistics/development_student_time/${userid}`
      )
      .then((res) => {
        avgData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return avgData;
  }

  static getStudentTimeData(id: string, userid: string, callback: any) {
    Promise.all([this.getStudentProgressOverTime(id, userid)]).then(
      (values) => {
        const studentData = values[0];
        callback(studentData);
      }
    );
  }

  static getAvgTimeData(id: string, callback: any) {
    Promise.all([this.getAvgProgressOverTime(id)]).then((values) => {
      const data = values[0];
      callback(data);
    });
  }

  //Fetching data for Mastery Grid
  static getMasteryGrid(id: any, callback: any) {
    axios.get(`/api/activities/${id}/statistics/topic_mastery_last_attempt`).then((res) => {
      callback(res.data);
    });
  }

  static getMasteryGridAverage(id: any, callback: any) {
    axios.get(`/api/activities/${id}/statistics/topic_mastery_average`).then((res) => {
      callback(res.data);
    });
  }

  static getMasteryGridLastAttemptList(id: any, callback: any) {
    axios.get(`/api/activities/${id}/statistics/student_performance_overview`).then((res) => {
      const overviewList: Array<ActivityOverview> = res.data;
      callback(overviewList);
    });
  }

  static getMasteryGridAverageList(id: any, callback: any) {
    axios.get(`/api/activities/${id}/statistics/student_performance_progress`).then((res) => {
      let overviewList: Array<ActivityOverview> = [];
      let item: ActivityOverview = {score: 0, userid: 0};
      res.data.forEach((el: { score: number, userid: number }) => {
        item = {score: el.score, userid: el.userid};
        overviewList.push(item);
      })
      callback(overviewList);
    });
  }

  /*
   * Fetching data for Mastery Overview
   * Gets a list of all questions students have answered on
   * for a specific activity and then calculates the students'
   * overall performance in the activity
   */
  static getMasteryOverviewData(id: string, callback: any) {
    let performance: number[];
    axios
      .get(`/api/activities/${id}/statistics/student_performance_overview`)
      .then((response) => {
        if (response.data.length > 0) {
          const overviewList: Array<ActivityOverview> = response.data;
          performance = ActivityService.calculatePerformance(overviewList);
          callback(performance);
        } else {
          callback([0, 0, 0]);
        }
      })
      .catch((err) => console.log(err));
  }

  /*
   *  Calculates performance of student by comparing the number
   *  of correct answers to the total number of answers
   */
  static calculatePerformance = (
    list: Array<ActivityOverview>
  ): Array<number> => {
    let performanceList: number[] = [0, 0, 0];
    list.forEach((element) => {
      if (element.score > Score.medium) performanceList[2]++;
      else if (element.score > Score.low) performanceList[1]++;
      else performanceList[0]++;
    });

    return performanceList;
  };

  static getOverviewCategoryData(id: string, callback: any) {
    axios
      .get(`/api/activities/${id}/statistics/categories`)
      .then((response) => {
        if (response.data.length > 0) {
          const categoryList: Array<CategoryOverview> = response.data;
          callback(categoryList);
        } else {
          callback({ total: 0, categoryname: "no category" });
        }
      })
      .catch((err) => console.log(err));
  }

  static getOverviewDifficultyData(id: string | number, callback: any) {
    axios
      .get(`/api/activities/${id}/statistics/question_difficulty_distribution`)
      .then((res) => {
        if (res.data.length > 0) {
          callback(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
