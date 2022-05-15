import React, { Component, useMemo } from "react";
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
              current:0,
              activePage: 1,
              pageSize:10,
              dataList:[]
          },
          history:{
              data:[],
              totalcnt:0,
              activePage: 1,
              pageSize:10,
              currentTableData:[]
          },
          schema:[],
          idx:'',
		  show:false,
          showHistory:false,
          json:{},
          jsonVIEW:false,
          detailVIEW:false,
          detail:{},
          changeVIEW:false,
          changed:{
              before:'',
              after:''
          }
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
                current: pageNumber-1
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
        // console.log(this.pagination());
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
        const pageSize = this.props.schema.size;
        const currentPage = this.props.schema.current;
        const totalCount = this.props.schema.count;
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

    fetchMetaData = () => {  
        axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:this.state.meta.current})
        .then(res => {
            console.log(res.data);
            this.setState({
                ...this.state,
                meta:res.data
            })
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
        // const tn = topic_name;
        const tn = topic_name.replace(/(-value|-key)/g, "");
        this.setState({
            ...this.state,
            detailVIEW: true
        })
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:tn}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, detail:res.data[0],show:true, idx:idx})
            } else {
                this.setState({...this.state, detail:{},idx:idx,show:true})
            }
        })
        axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:tn}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, history:res.data, idx:idx})
            } else {
                this.setState({...this.state, history:{},idx:idx})
            }
        })
        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            console.log(res.data);
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data, idx:idx})
            } else {
                this.setState({...this.state, schema:{},idx:idx})
            }
        })
    }

    historyView = (e, topic_name) => {
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
            jsonVIEW:true
        })
    }

    changeView = (e, type) => {
        e.preventDefault();
        console.log(type);
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
            "reviseon":"리비젼",
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

    notiforchange = async (e, subject) => {
        e.preventDefault();
        //schemas의 before, after를 api call로 가져와야한다. 
        // api call limit(2), sort(reg_dt, -1)
        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":subject}).then(
            res => {
                let temp = [];
                res.data.map((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
                })
                this.setState({
                    ...this.state,
                    changeVIEW:true,
                    changed:{
                      ...this.state.changed,
                      before: temp[1],
                      after: temp[0]
                    }
                  })
            }
        )
    }

    closeChanged = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            changeVIEW: false,
            changed:{
                ...this.state.changed,
                before: "",
                after: ""
            }
        })
    }

    render()
    {
        return (
            <div className="result">
                {this.state.changeVIEW ? 
                <div className="layer" >
                    <div className="closeCHanged closeBtn"><button type="button" onClick={this.closeChanged} className="btn btn-warning">CLOSE</button></div>
                    <div className="d-flex py-5">
                        <div className="before col-md-6 p-5 border-right">
                            {this.state.changed.before ? <pre>{JSON.stringify(this.state.changed.before, null, 4)}</pre> : null }
                        </div>
                        <div className="after col-md-6 p-5">
                            {this.state.changed.after ? <pre>{JSON.stringify(this.state.changed.after, null, 4)}</pre> : null } 
                        </div>
                    </div>
                    <div className="btnArea d-flex justify-content-center">
                        <Link to={{pathname:'/metasave', data:this.state.meta.after, type:"reg"}}><button type="button" className="btn btn-primary mr-1">등록</button></Link>
                        <Link to={{pathname:'/metasave', data:this.state.schema, type:"reg"}}><button type="button" className="btn btn-primary mr-1">취소</button></Link>
                    </div>
                </div>
                : <></>}
                <div className="d-flex">
                    <div className={ this.state.detailVIEW ? "schemaList col-md-7 p-5 transition":"schemaList col-md-12 p-5 transition"}>
                        <table className="metalist bg-light table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">#</th>
                                    <th scope="col" className="col-md-2">변경</th>
                                    <th scope="col" className="col-md-4">토픽명</th>
                                    <th scope="col" className="col-md-2">등록일시</th>
                                    <th scope="col" className="col-md-3">pschema삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.state.meta.dataList.length > 0 ? this.state.meta.dataList.map((item,index) => {
                            var temp = {};
                            var mapping = {};
                            var schema = JSON.parse(item.schema), meta_join = JSON.parse(item.meta_join);       
                            Object.keys(item.schema).map((res,index) => {
                                    this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                            })
                            return(
                                    <tr data-index={index} className={this.state.idx === index ? "table-active text-center":"text-center"} key={item.schema._id}>
                                        <th scope="row">{index+1}</th>
                                        <td className="modified">{item.meta_join ? <p onClick={(e)=> this.notiforchange(e, schema.subject)}>O</p> : "X"}</td>
                                        <td className="value-subject value form-group" onClick={(e)=>this.detailView(e, index, schema.subject)}>
                                            {schema.subject}
                                        </td>
                                        <td className="value-id value form-group">
                                            {schema.reg_dt}
                                            {/* {new Date(schemas.reg_dt).toISOString().substring(0,10)} */}
                                        </td>
                                        <td className="value-id value form-group">
                                            {schema ? "N":"Y"}
                                        </td>
                                    </tr>
                                );
                            }): <tr><td colSpan="4"><h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3></td> </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                   {this.state.show ? 
                    <div className="detailview col-md-5 p-5 m-5 border-left">
                        <div className="detail">
                            {Object.keys(this.state.detail).length > 0 ? 
                                <>
                                <h3>{this.state.detail.topic_name}</h3>
                                <p className="d-inline"><span className="mr-2">Schema Version</span>{this.state.detail.schema_id}</p>
                                <p><span className="mr-2">Meta Version</span>{this.state.detail.meta_id}</p>
                                <p>{this.state.detail.last_mod_id}</p>
                                <p>{this.state.detail.last_mod_dt}</p>
                                <div className="d-flex">
                                <button type="button" className="btn btn-success mr-1" onClick={this.jsonVIEW}>조회</button><Link to={{pathname:'/metawrite', data:this.state.detail, type:"update"}}><button type="button" className="btn btn-info mr-1">수정</button></Link><button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.detail._id)}>삭제</button> {this.state.history && this.state.history.length >0 ? <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.detail.topic_name)}>HISTORY</button> : <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.detail.topic_name)} disabled={true}>HISTORY</button>}</div></>                     
                                :
                                <>
                                <h3>{this.state.meta.dataList[this.state.idx].schema.subject}</h3>
                                <div className="d-flex">
                                <button type="button" className="btn btn-success mr-1" onClick={this.jsonVIEW} disabled={true}>조회</button>
                                <Link to={{pathname:'/metawrite', data:this.state.schema, type:"reg"}}><button type="button" className="btn btn-primary mr-1">등록</button></Link>
                                <button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.detail._id)} disabled={true}>삭제</button> 
                                <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.meta.data.topic_name)} disabled={true}>HISTORY</button>
                                </div>
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
                    <div className="keySchemaJson schemaTypeBtn"><button type="button" onClick={(e)=> this.changeView(e, "key")} className="btn btn-outline-info">KEY</button></div>
                    <div className="valueSchemaJson schemaTypeBtn"><button type="button" onClick={(e)=> this.changeView(e, "value")} className="btn btn-outline-info">VALUE</button></div>
                    <div className="closeJSON closeBtn"><button type="button" onClick={this.closeVIEW} className="btn btn-warning">CLOSE</button></div>
                    <AceEditor
                        mode="json"
                        theme="tomorrow"
                        name={this.state.json[`_id`]}
                        value = {JSON.stringify(this.replaceKey(this.state.detail), null, 4)}
                        onChange={this.onChangeJSON}
                        fontSize= {14}
                        width= "100%"
                        height="100%"
                    />
                </div>
                : <></>}
                <div className="paging text-center mx-auto py-5">
                    <Pagination
                        activePage={this.state.meta.current+1}
                        itemsCountPerPage={this.props.schema.size}
                        totalItemsCount={this.props.schema.count}
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
