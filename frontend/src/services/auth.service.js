import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.REACT_APP_API;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "/auth/signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          window.whoami = response.data;
        }

        return response.data;
      });
  }
   
  logout() {
    localStorage.removeItem("user");
  }

  register(username, password, name, dept, group) {
    return axios.post(API_URL + "/auth/signup", {
      username,
      password,
      name,
      dept,
      group,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();

