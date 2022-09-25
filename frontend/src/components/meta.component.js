import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link, Navigate } from "react-router-dom";
import { WithRouter } from "./withRouter.component";
import axios from "axios"
import Register from './register.component'
import { Button,Modal } from 'react-bootstrap'
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Metalist from './metalist.component';
import Metawrite from './metawrite.component';

class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema:{
        totalcnt:0,
        current:0,
        activePage: 1,
        pageSize:5,
        dataList:[]
      },
      data:[],
      keyword:'',
      save:false,
      update:false,
      redirect:false
    };
  this.handleSchemaPageChange = this._handleSchemaPageChange.bind(this);
}

_handleSchemaPageChange(pageNumber) {
  console.log(`active page is ${pageNumber}`);
  this.setState({
      ...this.state,
      schema:{
          ...this.state.schema,
          current: pageNumber-1
      }
  }, ()=>{this.fetchMetaData(pageNumber-1);})
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
    this.fetchMetaData(0);
  }

fetchMetaData = async(page) => {
  await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
      .then(res => {
        this.setState({
          schema:res.data
        })
      })
  }

  render() {
    return (
      <div className="meta">
        {this.state.redirect ? <Navigate to='/home' />:<></>}
        <div className="metalist">
          {this.state.schema.count > 0 ? 
          <>
            <Metalist/>
            {/* <Metawrite/> */}
          </>
          : <></>
          }
        </div>
    </div>
    );
  }
}

export default WithRouter(Meta);
