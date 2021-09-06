import React, { Component } from "react";
import Iframe from 'react-iframe'
// import UserService from "../services/user.service";


export default class Gitlab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }


  render() {
    return (
      <div className="container">
        <Iframe url="http://172.41.41.194:5500/"
        id="gitlab"
        className="cors-iframe"/>
      </div>
    );
  }
}

