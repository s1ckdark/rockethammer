import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";

import axios from "axios"
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashAlt,
  faUserEdit,
  faLockOpen,
  faLock,
  faSmileBeam
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Register from './register.component'
import { Button,Modal } from 'react-bootstrap'
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Metalist from './metalist.component';

export default class Meta extends Component {
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
    this.fetchMetaData(0);
  }

  onChangeKeyword = (e,index) =>{
    this.setState({
      ...this.state,
      keyword:e.target.value
    }) 
  }

fetchMetaData = async(page) => {
  await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
      .then(res => {
        this.setState({
          schema:res.data
        })
      })
  }

onMetaSearch = async()=> {
  await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
  .then(res => {
    console.log(res);
    this.setState({
      ...this.state,
      schema:res.data
    }) 
  })
}

onHistorySearch = async()=> {
  await axios.post(process.env.REACT_APP_API+"/history/search",{keyword:this.state.keyword})
  .then(res => {
    console.log(res);
    this.setState({
      ...this.state,
      history:res.data
    }) 
  })
}
  render() {
    return (
      <div className="meta">
        <div className="metalist">
          {this.state.schema.count > 0 ? 
          <>
            <Metalist/>
          </>
          : <></>
          }
        </div>
      </div>
    );
  }
}
