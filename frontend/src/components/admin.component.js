import React, { Component } from "react";
import UserService from "../services/user.service";


export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="admin">
        <div className="card">
          <h1 className="heading-1">Admin은 4월 중 오픈 예정입니다.</h1>
        </div>
      </div>
    );
  }
}


