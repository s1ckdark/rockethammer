import React, { Component } from "react";
import Iframe from 'react-iframe'
// import UserService from "../services/user.service";

export default class Kafkamonitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="kafkamonitor">
      <div className="container">
        <Iframe url={process.env.REACT_APP_GRAFANA}
        id="KafkaMonitor"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

