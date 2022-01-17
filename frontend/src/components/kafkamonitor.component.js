import React, { Component } from "react";
import Iframe from 'react-iframe'
import UserService from "../services/user.service";


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
        <Iframe url="http://10.20.19.76:3100/d/jwPKIsniz/kafka-consumer-lag?orgId=1&from=1642308757663&to=1642395157663"
        id="KafkaMonitor"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

