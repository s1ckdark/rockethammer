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

range = (start, end) => {
  let length = end - start + 1;
  /*
      Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

pagination = () => {
  const siblingCount = 1;
  const pageSize = this.state.schema.size;
  const currentPage = this.state.schema.current;
  const totalCount = this.state.schema.count;
  const totalPageCount = Math.ceil(totalCount / pageSize);
  // const firstPageIndex = (this.state.meta.activePage - 1) * this.state.meta.pageSize;
  // const lastPageIndex = firstPageIndex + this.state.meta.pageSize;
  
  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5;

  /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
      */
      if (totalPageNumbers >= totalPageCount) {
          return this.range(1, totalPageCount);
      }

   /*
Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
  */
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
  );

  /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  /*
      Case 2: No left dots to show, but rights dots to be shown
  */
  if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = this.range(1, leftItemCount);

      return [...leftRange, "DOTS", totalPageCount];
  }

  /*
      Case 3: No right dots to show, but left dots to be shown
  */
  if (shouldShowLeftDots && !shouldShowRightDots) {
      
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = this.range(
      totalPageCount - rightItemCount + 1,
      totalPageCount
      );
      return [firstPageIndex, "DOTS", ...rightRange];
  }
      
  /*
      Case 4: Both left and right dots to be shown
  */
  if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = this.range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
  }
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
