import React, { Component } from "react";
import Iframe from 'react-iframe'
// import UserService from "../services/user.service";


export default class Portainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="container">
        <Iframe url="http://172.41.41.197:9000/"
        id="portainer"
        className="cors-iframe"/>
      </div>
    );
  }
}

