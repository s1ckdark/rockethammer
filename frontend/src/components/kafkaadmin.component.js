import { processArrayType } from "json-to-avro/src/jsonToAvro";
import React, { Component } from "react";
import Iframe from 'react-iframe'
import AuthService from "../services/auth.service";
import {Navigate} from 'react-router-dom'

export default class Kafkaadmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      redirect:false
    };
  }

  componentDidMount(){
    const user = AuthService.getCurrentUser();
    if (user !== null ) {
      this.setState({
        ...this.state,
        currentUser: user,
      })
    } else {
      console.log("not")
      this.setState({
        ...this.state,
        redirect: true
      })
    } 
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
      <div className="kafkadmin">
        {this.state.redirect ? <Navigate to='/home' />:<></>}
      <div className="container">
        <Iframe url={process.env.REACT_APP_KAFAKUI}
        id="KafkaAdmin"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

