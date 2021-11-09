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

window.React = React;
dotenv.config();

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      mapping:[]
    };
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_API+"/meta/get")
      .then(res => {
        var data = res.data
        data.map((item,index)=>{
          var tmp = JSON.parse(item.schema);
          item.schema = tmp;
          res.data[index] = item;
        })
        this.setState({data:res.data[0]});
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

  onSubmit = (e,index) => {
    e.preventDefault();

    console.log("submit");
  }

  getTopics = (obj) => {
    if(typeof obj !== 'object') return [];
    if(obj.fields) return [obj.fields];
    var res = [];
    for(var i in obj){
      res.push(...this.getTopics(obj[i]));
    }
    return res;
 }
 getKey = (obj) =>{
  const isObject = val =>
      typeof val === 'object' && !Array.isArray(val);

  const addDelimiter = (a, b) =>
      a ? `${a}.${b}` : b;

  const paths = (obj = {}, head = '') => {
      return Object.entries(obj)
          .reduce((product, [key, value]) => 
              {
                  let fullPath = addDelimiter(head, key)
                  return isObject(value) ?
                      product.concat(paths(value, fullPath))
                  : product.concat(fullPath)
              }, []);
  }

  return paths(obj);
}


  render() {
    return (
      <div className="meta">
        <div className="mapping shadow-lg m-5 p-5">
      {this.getKey(this.state.data).map((res, index) => {
         var ikey = res.split('.').slice(-1)[0];
         var depth = res.split('.').slice(-2)[0];
         if(res.split('.').length === 1){
         return (
         <div className="form-group"><label>{ikey}</label><input name={ikey} value={this.state.mapping[ikey]}  onChange={(e)=>this.onChangeValue(e, index)} /></div>

         )} else {
          return (
            <div className="form-group"><label>{res}</label><input name={ikey} value={this.state.mapping[ikey]}  onChange={(e)=>this.onChangeValue(e, index)} /></div>
   
            )
         }})}
         </div>
        <div className="save">
          <button className="btn" onChange={this.onSubmit}>SAVE</button>
          <button className="btn" onChange={this.reset}>CANCEL</button>
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