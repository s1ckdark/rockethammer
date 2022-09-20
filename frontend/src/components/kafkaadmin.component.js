import { processArrayType } from "json-to-avro/src/jsonToAvro";
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

  componentDidMount(){

  }

  runAfterRender = () => {
    const navi = document.querySelector("nav[role='navigation']")
    if(navi)
    {
      navi.style.display="none"
      document.querySelector("main").style.marginTop=0
    }
  }

  render() {
    this.runAfterRender()
    return (
      <div className="kafkadmin" onLoad={this.runAfterRender}>
      <div className="container">
        <Iframe url={process.env.REACT_APP_KAFAKUI}
        id="KafkaAdmin"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

