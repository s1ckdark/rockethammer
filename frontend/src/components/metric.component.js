import React, { Component } from "react";
import Iframe from 'react-iframe'
import axios from 'axios'
// import UserService from "../services/user.service";

export default class Metric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount(){
    this.test()
  }

  test = async() => {
    await axios({
      "method": "POST",
      "url": "http://10.20.19.76:3000/api/admin/users",
      "headers": {
        "Authorization": "Basic YWRtaW46c2VjcmV0",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Content-Type": "application/json; charset=utf-8"
      },
      "auth": {
        "username": "admin",
        "password": "secret"
      },
      "data": {
        "email": "user1@test.com",
        "login": "user1",
        "password": "password",
        "name": "test1"
      }
    })
}
  render() {
    return (
      <div className="metric">
      <div className="container">
        <Iframe url="http://10.20.19.109:8080"
        id="metric"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}


