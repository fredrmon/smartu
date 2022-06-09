import axios from "axios";
import { ActivityOverview } from "../Models/ActivityOverview";
import { Announcement } from "../Models/Announcement";

export class Service {
  // Threshold values for high and medium performance
  static high: number = 0.75;
  static medium: number = 0.5;

  /*
   * Gets a list of all questions students have answered on
   * for a specific activity and then calculates the students'
   * overall performance in the activity
   */
  static createNewAnnouncement(body: Announcement, callback: any) {
    axios
      .post(`/api/announcements`)
      .then((res) => {
        if (res.status === 201) {
          callback(res);
        }
      })
      .catch((err) => console.log(err));
  }
}
