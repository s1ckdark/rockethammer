import React, { Component } from "react";
import Iframe from 'react-iframe'
import axios from 'axios'
// import UserService from "../services/user.service";

export default class Metric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount(){
    this.test()
  }

  test = async() => {
    await axios.post("http://localhost/api/grafana/user").then( res => console.log(res))
}
  render() {
    return (
      <div className="metric">
      <div className="container">
        <Iframe url="http://localhost:8081"
        id="metric"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}


