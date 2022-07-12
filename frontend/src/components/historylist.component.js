import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';
import axios from 'axios';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import ReactDiffViewer from 'react-diff-viewer';

window.React = React;

export default class Historylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [],
          idx: '',
		  show: false,
          json: {},
          before: {},
          after: {}
        };
        this.handleUserPageChange = this._handleUserPageChange.bind(this);
        this.handleHistoryPageChange = this._handleHistoryPageChange.bind(this);
    }

    _handleUserPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ 
        ...this.state,
        user:{
            ...this.state.user,
            currentPage: pageNumber
        }
        });
        this.fetchData();
    }

    _handleHistoryPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({
            ...this.state,
            history:{
                ...this.state.history,
                currentPage: pageNumber
            }
        });
        this.fetchHistoryData();
    }
      
    componentDidMount(){
        // console.log(this.props);
    }

    replaceKey = (data)=>{
        const swaps = {
            "_id":"_id",
            "topic_name":"토픽명",
            "schema_id":"스키마ID",
            "meta_id":"메타ID",
            "schema_version":"스키마버전",
            "meta_version":"메타버전",
            "recycle_pol":"데이터삭제주기",
            "op_name":"관리부서",
            "service":"업무시스템",
            "related_topics":"연관토픽",
            "last_mod_dt":"최종수정시간",
            "last_mod_id":"최종수정자",
            "schema":"",
            "p_name":"물리명",
            "p_type":"데이터 타입",
            "l_name":"논리명",
            "l_def":"설명",
            "is_null":"Null허용여부",
            "default":"기본값",
            "memo":"메모",
            "topic_desc":"토픽설명"
        };
        const pattern = new RegExp(
        Object.keys(swaps).map(e => `(?:"(${e})":)`).join("|"), "g"
        );
        const result = JSON.parse(
        JSON.stringify(data).replace(pattern, m => `"${swaps[m.slice(1,-2)]}":`)
        );
        return result;
    }

    exist = (json,key) => {
        json.map((res,index)=>{
          res.hasOwnProperty(key) ? console.log(index, key):console.log("no")
        })
      }

    detailView = (e, idx, before, after) => {
        console.log(idx);
        this.setState({
            ...this.state,
            show:true,
            before: this.replaceKey(JSON.parse(before)),
            after: this.replaceKey(JSON.parse(after))
        })
    }

    closeHistoryDetail = (e) => {
        this.setState({
            ...this.state,
            show:false,
            after:{},
            before:{}
        })
    }

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    replaceKey = (data)=>{
        const swaps = {
            "_id":"_id",
            "topic_name":"토픽명",
            "schema_id":"스키마ID",
            "meta_id":"메타ID",
            "schema_version":"스키마버전",
            "meta_version":"메타버전",
            "recycle_pol":"데이터삭제주기",
            "op_name":"관리부서",
            "service":"업무시스템",
            "related_topics":"연관토픽",
            "last_mod_dt":"최종수정시간",
            "last_mod_id":"최종수정자",
            "schema":"",
            "p_name":"물리명",
            "p_type":"데이터 타입",
            "l_name":"논리명",
            "l_def":"설명",
            "is_null":"Null허용여부",
            "default":"기본값",
            "memo":"메모",
            "topic_desc":"토픽설명"
        };
        const pattern = new RegExp(
        Object.keys(swaps).map(e => `(?:"(${e})":)`).join("|"), "g"
        );
        const result = JSON.parse(
        JSON.stringify(data).replace(pattern, m => `"${swaps[m.slice(1,-2)]}":`)
        );
        return result;
    }
    render()
    {
        return (
            <>
                    <div className="history col-md-12 px-5 pt-5">
                        <div className="container">
                        <table className={ this.state.show ? "historylist bg-light table table-hover d-none" : "historylist bg-light table table-hover"}>
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-3">토픽명</th>
                                    <th scope="col" className="col-md-3">수정자</th>
                                    <th scope="col" className="col-md-3">수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                                    return(
                                        <tr data-index={index} className="text-center" key={item.hist_id} onClick={(e)=>{this.detailView(e, index, item.before, item.after)}}>
                                            <th scope="row">{index+1}</th>
                                            <td className="value-subject value form-group">
                                            {item.topic_name}
                                            </td>
                                            <td className="last_mod_dt value form-group">
                                            {item.last_mod_id}                                     
                                            </td>
                                            <td className="last_mod_id value form-group">
                                            {item.last_mod_dt.split('.')[0].replace('T', ' ')}
                                            </td>
                                        </tr>
                                    );
                                }): <h3 className="p-3 m-3 text-center">검색된 history data가 없습니다</h3>}
                            </tbody>
                        </table>
                        {this.state.show ? 
                        <div className="detailView mx-auto">
                            <ReactDiffViewer leftTitle="Before" rightTitle="After" oldValue={JSON.stringify(this.state.before, null, 2)} newValue={JSON.stringify(this.state.after, null, 2)} splitView={true} />
                            <div className="closeHistoryDetail d-flex justify-content-end my-3">
                                <button type="button" onClick={this.closeHistoryDetail} className="btn btn-warning">내역 리스트</button>
                                <button type="button" onClick={this.closeHistory} className="btn btn-warning">내역 닫기</button>
                            </div>
                        </div>
                        : <div className="closeHistoryDetail d-flex justify-content-end my-3">
                        <button type="button" onClick={(e)=>this.closeHistory(e)} className="btn btn-warning">내역 닫기</button>
                         </div>}
                           
             
                    {/* <Pagination
                        activePage={this.state.user.currentPage}
                        itemsCountPerPage={this.state.user.pageSize}
                        totalItemsCount={this.state.user.totalcnt}
                        onChange={this.handleUserPageChange}
                    /> */}
                    </div>
                    </div>
        </>


        );
    }
}
