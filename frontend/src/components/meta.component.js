import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";

import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
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


window.React = React;

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema:{
        totalcnt:0,
        current:0,
        activePage: 1,
        pageSize:10,
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
        <div className="find mx-auto my-5 text-center d-block">
          <div className="form-inline justify-content-center">
            <input className="search form-control p-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
            <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={this.onMetaSearch}>SEARCH</button>
          </div>
        </div>
        <div className="metalist">
          {this.state.schema.count > 0 ? 
          <div className="mapping bg-light">
            <Metalist schema={this.state.schema}/>
            <div className="paging text-center mx-auto py-5">
                    <Pagination
                        activePage={this.state.schema.current+1}
                        itemsCountPerPage={this.state.schema.size}
                        totalItemsCount={this.state.schema.count}
                        pageRangeDisplayed={5}
                        onChange={this.handleSchemaPageChange}
                        itemClass="page-item"
                        activeLinkClass="page-active"
                        linkClass="page-link"
                        innerClass="pagination d-flex justify-content-center"
                    />
                    </div>
          </div>
          : <></>
          }
        </div>
      </div>
    );
  }
}
