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
    // this.test()
  }

  // test = async() => {
  //   await axios.post("http://localhost:8080/api/grafana/user").then( res => console.log(res))
// }
  render() {
    return (
      <div className="metric">
      <div className="container">
        <Iframe url="http://10.29.62.76:9090"
        id="metric"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}


