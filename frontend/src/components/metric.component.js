import React, { Component } from "react";
import Iframe from 'react-iframe'
// import UserService from "../services/user.service";

export default class Metric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
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


