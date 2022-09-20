import { processArrayType } from "json-to-avro/src/jsonToAvro";
import React, { Component } from "react";
import Iframe from 'react-iframe'

// import UserService from "../services/user.service";

export default class Metric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount(){
  }


  render() {
    return (
      <div className="metric">
      <div className="container">
        <Iframe url={process.env.REACT_APP_PROMETHEUS}
        id="metric"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}


