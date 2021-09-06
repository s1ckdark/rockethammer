import React, { Component } from "react";
import Iframe from 'react-iframe'
import UserService from "../services/user.service";


export default class Grafana extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="grafana">
        <Iframe url="http://172.41.41.196:3000/"
        id="grafana"
        className="cors-iframe"/>
      </div>
    );
  }
}

