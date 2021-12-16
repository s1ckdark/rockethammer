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
        <Iframe url="http://10.20.19.109:9000/"
        id="gitlab"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

