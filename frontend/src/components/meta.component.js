import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import { Redirect, Link, Navigate } from "react-router-dom";
import { withRouter } from "./withRouter.component";
import axios from "axios"
import Register from './register.component'
import { Button,Modal } from 'react-bootstrap'
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Metalist from './metalist.component';
import Metawrite from './metawrite.component';
import Metaview from './metaview.component';

class Meta extends Component {
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
          return <Navigate to="/meta/list/1"/>
        case "write":
          return <Navigate to="/meta/write"/>
        case "view":
          return <Navigate to="/meta/view" />;
        default:
          return <Navigate to="/meta/list"/>
      }
    }
    return (
      <div className="meta">
        {redirect ? <Navigate to='/home' /> : viewType()}
      </div>
    );
  }
}

export default withRouter(Meta);
