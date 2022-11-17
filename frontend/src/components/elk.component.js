import React, { Component } from "react";
import UserService from "../services/user.service";


export default class Elk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="elk">
        <div className="card">
          <h1 className="heading-1">ELK는 검토 중 입니다.</h1>
        </div>
      </div>
    );
  }
}


