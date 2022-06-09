import axios from "axios";
import { User } from "../Models/User";

export class UserService {
  static async getUsers(): Promise<Array<User>> {
    let users: Array<User> = [];
    await axios
      .get(`/api/users`)
      .then((res) => {
        users = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return users;
  }
}
