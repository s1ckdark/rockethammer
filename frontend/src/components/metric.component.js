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
  componentDidUpdate(prevProps){
    if(this.props.router.location.key !== prevProps.router.location.key) {
        // console.log(this.props.router.location.key , prevProps.router.location.key)
        window.location.reload()
    }
}

  componentDidMount(){
    const user = AuthService.getCurrentUser();
    if (user !== null ) {
      this.setState({
        ...this.state,
        currentUser: user,
      })
    } else {
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
        <Iframe url={process.env.REACT_APP_PROMETHEUS}
        id="metric"
        className="cors-iframe"/>
      </div>
    );
  }
}


