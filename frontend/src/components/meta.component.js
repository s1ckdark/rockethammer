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
import data1 from "./data.json";
import data2 from "./data2.json";
import data3 from "./data3.json";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Metalist from './metalist.component';
window.React = React;
dotenv.config();

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  
  reset = (e)=>{
    e.target.value = '';
  }
  onChangeValue = (e,index) =>{
    this.setState({
      ...this.state,
      mapping:{
        ...this.state.data[index],
        [e.target.name]:e.target.value
      }
    }) 
  }

  onChangeKeyword = (e,index) =>{
    this.setState({
      ...this.state,
      keyword:e.target.value
    }) 
  }

  onSubmit = async(e,index) => {
    e.preventDefault();
    await axios.get(process.env.REACT_APP_API+"/meta/search",{keyword:this.state.keyword})
    .then(res => {
      console.log(res);
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
}

  render() {
    return (
      <div className="meta">
        <div className="find mx-auto text-center">
          <div className="form-group">
            <input className="search" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
            <button className="btn searchbtn" onClick={this.onSearch}>검 색</button>
          </div>
        </div>
        <div className="mapping bg-light">
          <Metalist data={this.state.data} />
         </div>

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

