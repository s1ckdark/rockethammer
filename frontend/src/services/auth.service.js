import axios from "axios";
// import dotenv from 'dotenv'
// dotenv.config()
const API_URL = process.env.REACT_APP_API;

class AuthService {
  login(userid, password) {
    return axios
      .post(API_URL + "/auth/signin", {
        userid,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          window.whoami = response.data;
        }

        return response.data;
      });
  }
   
  logout() {
    localStorage.removeItem("user");
  }

  register(userid, password, name, dept, group) {
    return axios.post(API_URL + "/auth/signup", {
      userid,
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

