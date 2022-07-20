import React, { Component, useMemo } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link, useHistory, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import Metawrite from "./metawrite.component";
import Historylist from "./historylist.component";
window.React = React;

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:{
              totalcnt:0,
              current:0,
              activePage: 1,
              pageSize:5,
              dataList:[]
          },
          history:{
              data:[],
              totalcnt:0,
              activePage: 1,
              pageSize:5,
              currentTableData:[]
          },
          schema:{
            totalcnt:0,
            current:0,
            activePage: 1,
            pageSize:5,
            dataList:[]
          },
          data:[],
          keyword:'',
          idx:'',
		  show:false,
          historyVIEW:false,
          json:{},
          jsonVIEW:false,
          detailVIEW:false,
          detail:{},
          changeVIEW:false,
          changed:{
              before:'',
              after:''
          },
          typeVIEW:false,
          type:'',
          view:false,
          sectionVIEW:''

        };
    this.handleMetaPageChange = this._handleMetaPageChange.bind(this);
    }
    
    _handleMetaPageChange(pageNumber) {
      console.log(`active page is ${pageNumber}`);
      this.setState({
          ...this.state,
          meta:{
              ...this.state.meta,
              current: pageNumber-1
          }
      }, ()=>{this.fetchMetaData(pageNumber-1);})
    }
      
    componentDidMount(){
        this.fetchMetaData(0);    
    }

//   componentWillReceiveProps(nextProps) {
//     this.setState({
//         ...this.state,
//         meta: nextProps.schema
//     })  
//   }

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
    fetchMetaData = async(page) => {
        await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
            .then(res => {
                console.log(res);
              this.setState({
                meta: res.data
              })
            })
        }

        onChangeKeyword = (e,index) =>{
            this.setState({
              ...this.state,
              keyword:e.target.value
            }) 
          }
    
        
        onMetaSearch = async()=> {
          await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
          .then(res => {
            console.log(res);
            this.setState({
              ...this.state,
              meta:res.data
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

    write = (e, type)=> {
        e.preventDefault();
        this.setState({
            ...this.state,
           typeVIEW: true,
           type:type,
           changeVIEW:false
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

    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }

    detailView = (e, idx, topic_name) => {
        e.preventDefault();
        // const tn = topic_name;
        if(topic_name) {
        const tn = topic_name.replace(/(-value|-key)/g, "");
        this.setState({
            ...this.state,
            detailVIEW: true,
            detail:''
        })
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:tn}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, detail:res.data[0],show:true, type:'update', idx:idx})
            } else {
                this.setState({...this.state, detail:{},type:'reg', idx:idx,show:true})
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
            // console.log(res.data);
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data, idx:idx})
            } else {
                this.setState({...this.state, schema:{},idx:idx})
            }
        })
    }
    }

    view = (e, type) => {
        this.setState({
            ...this.state,
            view:true,
            sectionVIEW:type
        })
    }

    closeVIEW = () => {
        this.setState({
            ...this.state,
            view:false,
            sectionVIEW:'',
            changed:{
                ...this.state.changed,
                before: "",
                after: ""
            },
            show:false,
            after:{},
            before:{}
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
            "schema":"스키마",
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

    notiforchange = async (e, topic_name) => {
        e.preventDefault();
        //schemas의 before, after를 api call로 가져와야한다. 
        // api call limit(2), sort(reg_dt, -1)
        const tn = topic_name.replace(/(-value|-key)/g, "");
        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(
            res => {
                if(res.data.length > 1) {
                let temp = [];
                res.data.map((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
                })
                this.setState({
                    ...this.state,
                    view:true,
                    sectionVIEW:'change',
                    changed:{
                      ...this.state.changed,
                      before: temp[1],
                      after: temp[0]
                    }
                  })
                }}
        )
        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            console.log(res.data);
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data})
            } else {
                this.setState({...this.state, schema:{}})
            }
        })
    }
    closeWrite = (e) => {
        e.preventDefault();
        this.detailView(e,this.state.idx, this.state.detail.topic_name);
        this.setState({
            ...this.state,
           type:'',
           typeVIEW:false,
           changeVIEW:false
        })
        
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

    closeHistoryDetail = (e) => {
        this.setState({
            ...this.state,
            show:false,
            after:{},
            before:{}
        })
    }

    tooltip = (e, action) => {
        e.preventDefault();
        const tooltip = e.target.querySelector('span');
        if(tooltip) { 
            console.log(action, tooltip);
            tooltip.classList.toggle("visible")
        } 
    }
    render()
    {
        return (
            <>
                <div className={this.state.view ? "metalist d-none":"metalist"}>
                <div className="find mx-auto my-5 text-center d-block">
                    <div className="d-flex justify-content-center col-md-12 mx-auto">
                        <input className="search px-3 col-md-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
                        <button type="button" className="btn btn-danger col-md-1 ms-1 searchbtn" onClick={this.onMetaSearch}>검색</button>
                    </div>
                </div>
                <div className="d-flex justify-content-around">
                    <div className={ this.state.detailVIEW ? "schemaList col-md-9 my-5 transition":"schemaList col-md-12 my-5 transition"}>
                        <table className="metalist table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-2" data-tooltip="물리 스키마 변경 여부 입니다">변경(물리)</th>
                                    <th scope="col" className="col-md-4">토픽명</th>
                                    <th scope="col" className="col-md-3">등록일시</th>
                                    <th scope="col" className="col-md-2" data-tooltip="물리 스키마 삭제 여부 입니다">삭제(물리)</th>
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
                            console.log("schema",schema)
                            console.log("meta_join",meta_join);
                            return(
                                    <tr data-index={index} className={this.state.idx === index ? "table-active text-center":"text-center"} key={5*parseInt(this.state.meta.current)+index+1}>
                                        <th scope="row">{5*parseInt(this.state.meta.current)+index+1}</th>
                                        <td className="modified">{meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? <p className="clickable" onClick={(e)=> this.notiforchange(e, schema.subject)}>O</p> : <p>X</p>}</td>
                                        <td className="value-subject value form-group clickable" onClick={(e)=>this.detailView(e, index, schema.subject)}>
                                            {schema.subject.replace(/(-value|-key)/g, "")}
                                        </td>
                                        <td className="value-id value form-group">
                                            {schema.reg_dt.substring(0,19)}
                                            {/* {new Date(schema.reg_dt).toISOString().substring(0,16)} */}
                                        </td>
                                        <td className="value-id value form-group">
                                            {schema.schema ? "N":"Y" }
                                        </td>
                                    </tr>
                                );
                            }): <tr><td colSpan="4"><h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3></td> </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                   {this.state.show ? 
                    <div className="detailview col-md-3 p-5 ms-3 my-3 border-left bg-light">
                        <div className="detail">
                            <div className="info-group mb-4">
                                    <label>토픽명</label>
                                    <h3>{JSON.parse(this.state.meta.dataList[this.state.idx].schema).subject.replace(/(-value|-key)/g, "")}</h3>
                                </div>
                            {Object.keys(this.state.detail).length > 0 ? 
                                <>
                                <div className="info-group">
                                    <label className="me-2">스키마 버전</label>
                                    <p>{this.state.detail.schema_id}</p>
                                </div>
                                <div className="info-group">
                                    <label className="me-2">메타 버젼</label>
                                    <p>{this.state.detail.meta_version}</p>
                                </div>
                                <div className="info-group last_mod_info">
                                    <label className="me-2">마지막 수정자</label>
                                    <p>{this.state.detail.last_mod_id}</p>
                                </div>
                                <div className="info-group">
                                    <label className="me-2">마지막 수정 일시</label>
                                    <p>{this.state.detail.last_mod_dt.split('.')[0].replace('T', ' ')}</p>
                                </div>
                                <div className="d-flex">
                                    <button type="button" className="btn btn-success me-1" onClick={e=>this.view(e, 'json')}>조회</button>
                                    <button type="button" className="btn btn-info me-1" onClick={e=>this.write(e,"update")} disabled={JSON.parse(this.state.meta['dataList'][this.state.idx].schema).schema ? false:true}>수정</button>
                                    <button type="button" className="btn btn-secondary" onClick={e=>this.onDel(e,this.state.detail.topic_name)}  disabled={JSON.parse(this.state.meta['dataList'][this.state.idx].schema).schema ? false:true}>삭제</button> 
                                    {this.state.history && this.state.history.length >0 ? <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={(e)=>this.view(e, 'history')}>이력</button> : <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={e=>this.view(e, 'history')} disabled={true}>이력</button>}
                                </div>
                                </>                     
                                :
                                <>
                                <div className="d-flex">
                                <button type="button" className="btn btn-success me-1" onClick={e=>this.view(e, 'json')} disabled={true}>조회</button>
                                <button type="button" className="btn btn-primary me-1" onClick={e=>this.write(e,"reg")}  disabled={JSON.parse(this.state.meta['dataList'][this.state.idx].schema).schema ? false:true}>등록</button>
                                <button type="button" className="btn btn-secondary" onClick={e=>this.onDel(e,this.state.detail._id)} disabled={true}>삭제</button> 
                                <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={e=>this.view(e, 'history')} disabled={true}>이력</button>
                                </div>
                                </>}
                        </div>
                    </div>
                    : <></>}
       
                </div>
                <div className="paging text-center mx-auto py-1">
                        <Pagination
                            activePage={this.state.meta.current+1}
                            itemsCountPerPage={this.state.meta.size}
                            totalItemsCount={this.state.meta.count}
                            pageRangeDisplayed={5}
                            onChange={this.handleMetaPageChange}
                            itemClass="page-item"
                            activeLinkClass="page-active"
                            linkClass="page-link"
                            innerClass="pagination d-flex justify-content-center"
                        />
                    </div>
                    </div>
                <div className="layer">
                {this.state.view && this.state.sectionVIEW === 'history' ? 
                <div className="viewHistory">
                    <Historylist data={this.state.history} closeVIEW={this.closeVIEW} />
                </div>
                : <></>}
		       {this.state.view && this.state.sectionVIEW === 'json' ?
                <div className="jsonView">
                    <AceEditor
                        mode="json"
                        theme="tomorrow"
                        name={this.state.json[`_id`]}
                        value = {JSON.stringify(this.replaceKey(this.state.detail), null, 4)}
                        onChange={this.onChangeJSON}
                        height={"calc(100vh - 250px)"}
                        fontSize= {14}
                        width="100%"
                    />
                     <div className="btnArea d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={this.closeVIEW}>돌아가기</button>
                    </div>
                </div>
                : <></>}
                {this.state.view && this.state.sectionVIEW === 'change' ?
                <div className="changeView">
                    {/* <div className="closeCHanged closeBtn"><button type="button" onClick={this.closeChanged} className="btn btn-warning">CLOSE</button></div> */}
                    <div className="d-flex pb-5">
                        <div className="before col-md-6 border-right">
                            <AceEditor
                                mode="json"
                                theme="tomorrow"
                                name={this.state.json[`_id`]}
                                value = {JSON.stringify(this.replaceKey(this.state.changed.before), null, 4)}
                                onChange={this.onChangeJSON}
                                fontSize= {14}
                                width="100%"
                                height={"calc(100vh - 250px)"}
                            />
                        </div>
                        <div className="after col-md-6">
                            <AceEditor
                                mode="json"
                                theme="tomorrow"
                                name={this.state.json[`_id`]}
                                value = {JSON.stringify(this.replaceKey(this.state.changed.after), null, 4)}
                                onChange={this.onChangeJSON}
                                fontSize= {14}
                                width="100%"
                                height={"calc(100vh - 250px)"}
                            />
                        </div>
                    </div>
                    <div className="btnArea d-flex justify-content-center">
                        <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"change")}>등록</button>
                        <button type="button" className="btn btn-secondary" onClick={this.closeVIEW}>돌아가기</button>
                    </div>
                </div>
                : <></>}
                 {this.state.typeVIEW ?
                    this.state.detail && this.state.type ==='update' ? <><Metawrite key={this.state.detail._id} closeWrite={e => this.closeWrite(e)} type={this.state.type} data={this.state.detail}/></>
                    :<><Metawrite key={Math.random()} closeWrite={e => this.closeWrite(e)} type={this.state.type} data={this.state.schema} /></>:<></>
                 }
                 </div>
            </>
        );
    }
}

