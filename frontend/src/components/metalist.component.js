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
import Historylist from "./historylist.component";
window.React = React;

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:{
              data:[],
              totalcnt:0,
              activePage: 1,
              pageSize:10,
              currentTableData:[]
          },
          history:{
              data:[],
              totalcnt:0,
              activePage: 1,
              pageSize:10,
              currentTableData:[]
          },
          idx:'',
		  show:false,
          showHistory:false,
          json:{},
          jsonVIEW:false,
          detail:{}
        };
        this.handleMetaPageChange = this._handleMetaPageChange.bind(this);
        this.handleHistoryPageChange = this._handleHistoryPageChange.bind(this);
    }

    _handleMetaPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({
            ...this.state,
            meta:{
                ...this.state.meta,
                activePage: pageNumber
            }
        }, ()=>{this.fetchMetaData();})
    }

    _handleHistoryPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({
        ...this.state,
            historyPage:{
                ...this.state.history,
                activePage:pageNumber
            }
        });
        this.fetchHistoryData();
    }
      
    componentDidMount(){
        // console.log(this.props);
        this.fetchMetaData();
    }

    onEdit = (e,item) => {
        e.preventDefault();
        console.log("edit");
        console.log(item);
    }

    onSave = (e) => {
        e.preventDefault();
    }

    onDel = (e,_id) => {
        e.preventDefault();
        this.historyAction(e, "delete", _id);
        // if (window.confirm("정말 삭제하시겠습니까??") == true){    //확인
        //     axios.delete(process.env.REACT_APP_API+"/meta/delete",{data:{keyword:_id}}).then(res => {
        //          alert("삭제가 완료되었습니다");
        //          setTimeout(() => { 
        //             window.location.reload(false);
        //         }, 1000);
        //     }) 
        // }       
    }

    fetchMetaData = () => {
        const firstPageIndex = (this.state.meta.activePage - 1) * this.state.meta.pageSize;
        const lastPageIndex = firstPageIndex + this.state.meta.pageSize;

        this.setState({
            ...this.state,
            meta:{
                ...this.state.meta,
                data:this.props.schema,
                totalcnt: this.props.schema.length,
                currentTableData:this.props.schema.slice(firstPageIndex, lastPageIndex)
            }
        })
    } 
    

    
      fetchHistoryData = () => {
          const firstPageIndex = (this.state.history.activePage - 1) * this.state.history.pageSize;
          const lastPageIndex = firstPageIndex + this.state.history.pageSize;

          if(this.state.history.data.length > 0){
          this.setState({
              ...this.state,
              history:{
                ...this.state.history,
                totalcnt: this.state.history.data.length,
                currentTableData:this.state.history.data.slice(firstPageIndex, lastPageIndex)
              }
            })
        } else {
          this.setState({
              ...this.state,
              history:{
                ...this.state.history,
                data: [],
                totalcnt: 0,
                currentTableData:[]
              }
            })
        }
      }

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }

    detailView = (e, idx, topic_name) => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:topic_name}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, detail:res.data[0],show:true, idx:idx})
            } else {
                this.setState({...this.state, detail:{},idx:idx,show:true})
            }
        })
        axios.post(process.env.REACT_APP_API+"/history/get",{keyword:topic_name}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, history:res.data, idx:idx})
            } else {
                this.setState({...this.state, history:{},idx:idx})
            }
        })
    }

    historyView = (e, idx, topic_name) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            showHistory:true
        })
    }

    closeHistory = ()=>{
        this.setState({
            ...this.state,
            showHistory: false
        })
    }

    jsonVIEW = () => {
        this.setState({
            ...this.state,
            json:this.replaceKey(this.state.meta),
            jsonVIEW:true
        })
    }
    closeVIEW = () => {
        this.setState({
            ...this.state,
            jsonVIEW:false
        })
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

    historyAction = (e,act, id) => {
        e.preventDefault();
        console.log(e, act, id);
    }

    render()
    {
        return (
            <div className="result">
                <div className="d-flex">
                    <div className="schemaList col-md-7 p-5">
                        <table className="metalist bg-light table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-5">토픽명</th>
                                    <th scope="col" className="col-md-1">스키마버전</th>
                                    <th scope="col" className="col-md-1">스키마Id</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.props.schema.length > 0 ? this.props.schema.map((item,index) => { 
                        //   {this.state.meta.currentTableData.length > 0 ? this.state.meta.currentTableData.map((item,index) => {
                         
                            var temp = {};
                            var mapping = {};
                            var schema = JSON.parse(item.schema);
                            Object.keys(item).map((res,index) => {
                                    this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                            })
                            return(
                                        <tr data-index={index} className={this.state.idx === index ? "table-active text-center":"text-center"} key={item._id} onClick={(e)=>this.detailView(e, index, item.subject.replace(/-value/g, ""))}>
                                             <th scope="row">{index+1}</th>
                                            <td className="value-subject value form-group">
                                            {item.subject.replace(/-value/g, "")}
                                            </td>
                                            <td className="value-version value form-group">
                                            {item.version}
                                            </td>
                                            <td className="value-id value form-group">
                                            {item.id}
                                            </td>
                                        </tr>
                                );
                            }): <h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3>    
                            }
                            </tbody>
                        </table>
                    </div>
                   {this.state.show ? 
                    <div className="detailview col-md-5 p-5 m-5 border-left">
                        <div className="detail ">
                            {Object.keys(this.state.detail).length > 0 ? 
                                <>
                                <h3>{this.state.detail.topic_name}</h3>
                                <p className="d-inline"><span className="mr-2">Schema Version</span>{this.state.detail.schema_id}</p>
                                <p><span className="mr-2">Meta Version</span>{this.state.detail.meta_id}</p>
                                <p>{this.state.detail.last_mod_id}</p>
                                <p>{this.state.detail.last_mod_dt}</p>
                                <button type="button" className="btn btn-success mr-1" onClick={this.jsonVIEW}>조회</button><button type="button" className="btn btn-info mr-1"><Link to={{pathname:'/metaupdate', data:this.state.meta, type:"update"}}>수정</Link></button><button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.meta.data._id)}>삭제</button> {this.state.history && this.state.history.length >0 ? <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.meta.data.topic_name)}>HISTORY</button> : <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.meta.data.topic_name)} disabled={true}>HISTORY</button>}</>                     
                                :
                                <>
                                <p>등록된 Meta가 존재하지 않습니다</p>
                                <button type="button" className="btn btn-primary mr-1"><Link to={{pathname:'/metasave', data:this.props.schema[this.state.idx], type:"reg"}}>등록</Link></button>
                                </>}
                        </div>
                    </div>
                    : <></>}
                </div>
                {this.state.showHistory ? 
                <div className="viewHistory">
                    <div className="closeHistory closeBtn"><button type="button" onClick={this.closeHistory} className="btn btn-warning">CLOSE</button></div>
                    <Historylist data={this.state.history} />
                </div>
                : <></>}
		        {this.state.jsonVIEW ?
                <div className="viewJSON">
                    <div className="closeJSON closeBtn"><button type="button" onClick={this.closeVIEW} className="btn btn-warning">CLOSE</button></div>
                    <AceEditor
                        mode="json"
                        theme="tomorrow"
                        name={this.state.json[`_id`]}
                        value = {JSON.stringify(this.state.json, null, 4)}
                        onChange={this.onChangeJSON}
                        fontSize= {14}
                        width= "100%"
                        height="100%"
                    />
                </div>
                : <></>}
                <div className="paging text-center mx-auto py-5">
                    <Pagination
                        activePage={this.state.meta.activePage}
                        itemsCountPerPage={this.state.meta.pageSize}
                        totalItemsCount={this.state.meta.totalcnt}
                        pageRangeDisplayed={5}
                        onChange={this.handleMetaPageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                        innerClass="pagination d-flex justify-content-center"
                    />
                    </div>
            </div>

        );
    }
}
