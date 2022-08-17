import React, { Component, useMemo } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link, useHistory, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthService from "../services/auth.service";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import ReactDiffViewer from 'react-diff-viewer';
import Pagination from "react-js-pagination";
import Metawrite from "./metawrite.component";
import Historylist from "./historylist.component";
window.React = React;

export default class Weblog extends Component {
    constructor(props) {
        super(props);
        this.state = {
          log:{
              totalcnt:0,
              current:0,
              activePage: 1,
              pageSize:5,
              dataList:[]
          }
        };
        this.handleMetaPageChange = this._handleMetaPageChange.bind(this);
    }
    
    _handleMetaPageChange(pageNumber) {
      console.log(`active page is ${pageNumber}`);
      this.setState({
          ...this.state,
          meta:{
              ...this.state.log,
              current: pageNumber-1
          },
          detailVIEW:false
      }, ()=>{this.fetchLogData(pageNumber-1);})
    }
      
    componentDidMount(){
        this.fetchLogData(0);    
    }

    fetchLogData = async(page) => {
        await axios.post(process.env.REACT_APP_API+"/user/loadsesshistory",{size:5,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                log: res.data,
              })
            })
        }

    render()
    {
        return (
            <>
                <div className="webLogHisory">
                <div className="d-flex justify-content-around">
                    <div className="logList col-md-12 my-5 transition">
                        <table className="metalist table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-6">로그</th>
                                    <th scope="col" className="col-md-2">접속IP</th>
                                    <th scope="col" className="col-md-1">유저ID</th>
                                    <th scope="col" className="col-md-2">로그인일시</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.state.log.dataList && this.state.log.dataList.length > 0 ? this.state.log.dataList.map((item,index) => {
                            console.log(item);
                            return(
                                    <tr data-index={index} className="text-center" key={5*parseInt(this.state.log.current)+index+1}>
                                        <th scope="row">{5*parseInt(this.state.log.current)+index+1}</th>
                                        <td className="log">{item.log}</td>
                                        <td className="ipAddr">{item.ipAddr}</td>
                                        <td className="userid">{item.userid}</td>
                                        <td className="login_dt">{item.login_dt}</td>
                                    </tr>
                                );
                            }): <tr><td colSpan="5"><h3 className="p-3 m-3 text-center">검색된 Log Data가 없습니다</h3></td> </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="paging text-center mx-auto py-1">
                        <Pagination
                            activePage={this.state.log.current+1}
                            itemsCountPerPage={this.state.log.size}
                            totalItemsCount={this.state.log.count}
                            pageRangeDisplayed={5}
                            onChange={this.handleMetaPageChange}
                            itemClass="page-item"
                            activeLinkClass="page-active"
                            linkClass="page-link"
                            innerClass="pagination d-flex justify-content-center"
                        />
                </div>
            </div>
            </>
        );
    }
}

