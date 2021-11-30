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
import Metalist from './metalist.component';
import Metaupdate from './metaupdate.component';
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
    axios.get(process.env.REACT_APP_API+"/schema/get")
      .then(res => {
<<<<<<< HEAD
        // var data = res.data
        // data.map((item,index)=>{
        //   var tmp = JSON.parse(item.schema);
        //   item.schema = tmp;
        //   res.data[index] = item;
        // })
        this.setState({data:res.data});
=======
        this.setState({
          schema:res.data
        })
>>>>>>> master
      })
  }
  
  onChangeKeyword = (e,index) =>{
    this.setState({
      ...this.state,
      keyword:e.target.value+"-value"
    }) 
  }

onSearch = async()=> {
  await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
  .then(res => {
    console.log(res);
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
<<<<<<< HEAD
        {this.state.data && this.state.data.length > 0 ? 
=======
        {this.state.schema.length > 0 ? 
>>>>>>> master
        <div className="mapping bg-light">
          <Metalist schema={this.state.schema} />
         </div>
        : <></>
  }
      </div>
    );
  }
<<<<<<< HEAD
}
=======
}

>>>>>>> master
