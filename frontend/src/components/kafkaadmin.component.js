import React, { Component } from "react";
import Iframe from 'react-iframe'
import UserService from "../services/user.service";


export default class Kafkaadmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="kafkadmin">
      <div className="container">
        <Iframe url="http://10.20.19.62:8081/"
        id="KafkaAdmin"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

