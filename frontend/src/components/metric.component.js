import { processArrayType } from "json-to-avro/src/jsonToAvro";
import React, { Component } from "react";
import Iframe from 'react-iframe'

import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";
// import UserService from "../services/user.service";

export default class Metric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      redirect:''
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


  render() {
    return (
      <div className="metric">
        {this.state.redirect ? <Navigate to='/home' />:<></>}
      <div className="container">
        <Iframe url={process.env.REACT_APP_PROMETHEUS}
        id="metric"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}


