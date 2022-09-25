import React, { Component } from "react";
import Iframe from 'react-iframe'
import { withRouter } from "./withRouter.component";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";
// import UserService from "../services/user.service";

class Kafkamonitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      redirect:false
    };
  }

  componentDidMount() {
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
      <div className="kafkamonitor">
        {this.state.redirect ? <Navigate to='/home' />:<></>}
      <div className="container">
        <Iframe url={process.env.REACT_APP_GRAFANA}
        id="KafkaMonitor"
        className="cors-iframe"/>
      </div>
      </div>
    );
  }
}

export default withRouter(Kafkamonitor);
