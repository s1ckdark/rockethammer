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
        <Iframe url="http://10.20.19.76:3100/d/sckEbYTMk/kafka-metrics-monitoring?orgId=1&refresh=30s&from=1643877669071&to=1643964069072"
        id="KafkaMonitor"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

