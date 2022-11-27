import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import { Redirect, Link, Navigate } from "react-router-dom";
import { withRouter } from "../../common/withRouter";
import axios from "axios"

import Historylist from '../history/list.component';
import Historyview from '../history/view.component';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      type: "list",
      vtype:''
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
      this.setState({
        ...this.state,
        redirect: true
      })
    }
  }

  handleCallback = (childData) => {
    Object.keys(childData).map( key => {
      this.setState({
        ...this.state,
        [key]:childData[key]
      })
    })
  }

  render() {
    const { type, redirect } = this.state
    const viewType = () => {
      switch(type){
        case "list":
          return <Navigate to="/history/list" pass={this.handleCallback}/>
        case "view":
          return <Navigate to="/history/view" pass={this.handleCallback} />;
        default:
          return <Navigate to="/history/list" pass={this.handleCallback}/>
      }
    }
    return (
      <div className="meta">
        {redirect ? <Navigate to='/home' /> : viewType()}
      </div>
    );
  }
}

export default withRouter(History);
