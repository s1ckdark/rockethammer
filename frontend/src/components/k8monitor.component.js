import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashAlt,
  faUserEdit,
  faLockOpen,
  faLock
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Register from './register.component'
import { Button,Modal } from 'react-bootstrap'
import { JsonToTable } from "react-json-to-table";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

window.React = React;
dotenv.config();

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema:[],
      data:[],
      keyword:''
    };
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_API+"/meta/get")
      .then(res => {
      //   var data = res.data
      //   data.map((item,index)=>{
      //     var tmp = JSON.parse(item.schema);
      //     item.schema = tmp;
      //     res.data[index] = item;
      //   })
      //   this.setState({data:res.data[0]});
      })
  }
  
  onChangeKeyword = (e,index) =>{
    this.setState({
      ...this.state,
      keyword:e.target.value
    }) 
  }

onSearch = async()=> {
  await axios.post(process.env.REACT_APP_API+"/meta/search",{keyword:this.state.keyword})
  .then(res => {
    this.setState({
      ...this.state,
      data:res.data
    }) 
  })
  await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword.replace(/-value/g, "")})
  .then(res => {
    this.setState({
      ...this.state,
      schema:res.data
    }) 
  })
}

  render() {
    return (
      <div className="meta">
        <div className="find mx-auto my-5 text-center d-block">
          <div className="form-inline justify-content-center">
            <input className="search form-control p-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
            <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={this.onSearch}>검 색</button>
          </div>
        </div>
        {this.state.data.length > 0 ? 
        <div className="mapping bg-light">
         </div>
        : <></>
  }
      </div>
    );
  }
}


 
{/* <JSONInput
id          = {this.state.data[index]._id}
placeholder = {res}
locale      = { locale }
height      = '550px'
onChange    = {this.onChangeValue}
/> */}

