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
import helpers from "./helpers.component";
import history from "./history.component";

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
          select:{
            idx:'',
            topic_name:"",
            subject:""
          },
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
          type:'list',
          listtype:'list',
          view:false,
          sectionVIEW:'',
          delete:{}
        };
        this.handleMetaPageChange = this._handleMetaPageChange.bind(this);
        this.detailView = this.detailView.bind(this);
        this.closeWrite = this.closeWrite.bind(this);
    }
    
    _handleMetaPageChange(pageNumber) {
      console.log(`active page is ${pageNumber}`);
      this.setState({
          ...this.state,
          meta:{
              ...this.state.meta,
              current: pageNumber-1
          },
          detailVIEW:false
      }, ()=>{this.fetchMetaData(pageNumber-1);})
    }
      
    componentDidMount(){
        this.fetchMetaData(0);    
    }

    // componentWillMount = () => {
    //     /* attach listeners to google StreetView */
    //     // window.addEventListener('popstate', (event) => {
    //     //     event.preventDefault()
    //     //     this.listenBackEvent();
    //     // });
    //     // console.log(history);
    //   }

    // listenBackEvent = () => {
    //     // 뒤로가기 할 때 수행할 동작을 적는다
    //     if(this.state.show){
    //         this.setState({
    //             ...this.state,
    //             show: false
    //         })
    //     }
    //     alert("show:false")
    // };
  
//     unlistenHistoryEvent = history.listen(({ action }) => {
//         if (action === "POP") {
//           this.listenBackEvent();
//         }
//         // return this.unlistenHistoryEvent;
//     });
// //   componentWillReceiveProps(nextProps) {
//     this.setState({
//         ...this.state,
//         meta: nextProps.schema
//     })  
//   }

    useConfirm = (e, message, onConfirm, onCancel) => {
        e.preventDefault()
        if(window.confirm(message)) {
                onConfirm();
            } else {
                onCancel();
            }
        }
    

    onDel = async (typeofapi, topic_name) => {
        console.log(typeofapi, topic_name);
        let url, url2;
        switch(typeofapi){
            case 'api1':
                url = process.env.REACT_APP_API+"/meta/delete";
                break;
            case 'api2':
                url = [process.env.REACT_APP_API+"/meta/delete",  process.env.REACT_APP_API+"/schema/delete"];
                break;
            case 'api3':
                url = process.env.REACT_APP_API+"/schema/delete";
                break;
            default:
                console.log("typeofapi",typeofapi);
        }
        
        if(typeofapi === 'api1' || typeofapi ==='api3'){    //확인
                try {
                    axios.post(url, {keyword:JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).subject}).then(res => console.log(res))
                } catch(err) {
                    console.log("error", err);
                }
        } else {
            try {
                Promise.all(url.map(async (endpoint) => await axios.post(endpoint, {keyword:JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).subject}))).then((response1, response2) => {
                    console.log(response1, response2)
                })
            } catch(err) {
                console.log("error", err);
            }
        }
    
        await axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:this.state.detail.topic_name, reg_dt:(new Date).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
        localStorage.removeItem('type');
        localStorage.removeItem('data');
        alert("삭제가 완료되었습니다");
        setTimeout(() => { 
            window.location.reload(false);
        }, 1000)
    }  

    onCancel = () => {
        console.log("cancel");
    }

    fetchMetaData = async(page) => {
        if(this.state.type ==='list'){
        await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                listtype:'list',
                meta: res.data,
                show:false
              })
            })
        } else {
            await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword, size:5,page:page})
            .then(res => {
                this.setState({
                ...this.state,
                listtype:'search',
                meta:res.data,
                show:false
                }) 
            }) 
        }
        }

        onChangeKeyword = (e,index) =>{
            this.setState({
              ...this.state,
              keyword:e.target.value
            }) 
          }

        onMetaSearch = async(e)=> {
            e.preventDefault();
            if(this.state.keyword.length !=null){
                await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
                .then(res => {
                    console.log(res);
                    this.setState({
                    ...this.state,
                    listtype:'search',
                    meta:res.data
                    }) 
                })
            } 
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
           sectionVIEW:'',
           changeVIEW:false,
           view:false
        })
    }




    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }

    detailView = (e, idx, topic_name) => {
        e.preventDefault();
        if(topic_name) {
        const tn = topic_name.replace(/(-value|-key)/g, "");
        this.setState({
            ...this.state,
            detailVIEW: true,
            detail:'',
            select:{
                idx:idx,
                topic_name:tn,
                subject:topic_name
            }
        })
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:tn}).then(res => {
            console.log(res);
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, detail:res.data[0],delete:res.data[0],show:true, type:'update'})
            } else {
                this.setState({...this.state, detail:{},delete:{},type:'reg', show:true})
            }
        })
        axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:tn}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, history:res.data})
            } else {
                this.setState({...this.state, history:{},select:{idx:idx,topic_name:tn}})
            }
        })
        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data})
            } else {
                this.setState({...this.state, schema:{}})
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
            show:true,
            after:{},
            before:{},
            typeVIEW: false
        })
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

    closeWrite = (e, idx=this.state.select.idx, topic_name=this.state.select.topic_name) => {
        e.preventDefault();
        console.log(idx,topic_name);
        this.detailView(e,idx, topic_name);
        this.setState({
            ...this.state,
           type:'',
           typeVIEW:false,
           changeVIEW:false,
           show:true
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
                <div className={this.state.view ? "list d-none":"metalist"}>
                <div className="find mx-auto my-5 text-center d-block">
                    <div className="d-flex justify-content-center col-md-12 mx-auto">
                        <input className="search px-3 col-md-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
                        <button type="button" className="btn btn-danger col-md-1 ms-1 searchbtn" onClick={e=>this.onMetaSearch(e)}>토픽 검색</button>
                    </div>
                </div>
                <div className="d-flex justify-content-around">
                    <div className={ this.state.detailVIEW ? "schemaList col-md-9 my-5 transition":"schemaList col-md-12 my-5 transition"}>
                        <table className="table-list table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-2" data-tooltip="물리 스키마 변경 여부입니다. 값이 Y 이면 등록되어 있는 물리 스키마 버전이 최신이 아니므로 변경 등록 해주세요!">변경(물리)<span className="info-icon">&#x24D8;</span></th>
                                    <th scope="col" className="col-md-4">토픽명</th>
                                    <th scope="col" className="col-md-3">등록일시</th>
                                    <th scope="col" className="col-md-2" data-tooltip="물리 스키마 삭제 여부입니다. 값이 Y 이면 물리 스키마 삭제된 상태이므로 논리 메타를 삭제해주세요!">삭제(물리)<span className="info-icon">&#x24D8;</span></th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.state.meta && this.state.meta.dataList && this.state.meta.dataList.length > 0 ? this.state.meta.dataList.map((item,index) => {
                            var temp = {};
                            var mapping = {};
                            var schema = JSON.parse(item.schema), meta_join = item.meta_join !=='undefined' ? JSON.parse(item.meta_join):null;   
                            Object.keys(item.schema).map((res,index) => {
                                    helpers.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                            })
                            return(
                                    <tr data-index={index} className={this.state.select.idx === index ? "table-active text-center":"text-center"} key={5*parseInt(this.state.meta.current)+index+1}>
                                        <td scope="row">{5*parseInt(this.state.meta.current)+index+1}</td>
                                        <td className="modified value">{meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? <span className="clickable" onClick={(e)=> this.notiforchange(e, schema.subject)}>Y</span> : <span>N</span>}</td>
                                        <td className="value-subject value form-group clickable" onClick={(e)=>this.detailView(e, index, schema.subject)}>
                                            {schema.subject.replace(/(-value|-key)/g, "")}
                                        </td>
                                        <td className="value-id value form-group">
                                            {helpers.krDateTime(schema.reg_dt).substring(0,19)}
                                            {/* {new Date(schema.reg_dt).toISOString().substring(0,16)} */}
                                        </td>
                                        <td className="value-id value form-group">
                                            {schema.schema ? <span>N</span>:<span>Y</span> }  
                                            {/* {schema.schema ? <span>&#x2610;</span>:<span>&#x2611;</span> } */}
                                        </td>
                                    </tr>
                                );
                            }): <tr><td colSpan="5"><h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3></td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    {this.state.show ? 
                    <div className="detailview col-md-3 p-5 ms-3 my-3 border-left bg-light">
                        <div className="detail">
                            <div className="info-group mb-4">
                                <label>토픽명</label>
                                <h3>{JSON.parse(this.state.meta.dataList[this.state.select.idx].schema).subject.replace(/(-value|-key)/g, "")}</h3>
                            </div>
                            {Object.keys(this.state.detail).length > 0 ? 
                                <>
                                <div className="info-group">
                                    <label className="me-2">물리 스키마 버전</label>
                                    <p>{this.state.detail.schema_id}</p>
                                </div>
                                <div className="info-group">
                                    <label className="me-2">논리 스키마 버전</label>
                                    <p>{this.state.detail.revision}</p>
                                </div>
                                <div className="info-group last_mod_info">
                                    <label className="me-2">마지막 수정자</label>
                                    <p>{this.state.detail.last_mod_id}</p>
                                </div>
                                <div className="info-group">
                                    <label className="me-2">마지막 수정 일시</label>
                                    <p>{this.state.detail.last_mod_dt ? helpers.krDateTime(this.state.detail.last_mod_dt) : <></>}</p>
                                </div>
                                </>
                                :<></>}
                            <div className="d-flex">
                                <button type="button" className="btn btn-success me-1" onClick={e=>this.view(e, 'json')} disabled={Object.keys(this.state.detail).length > 0 ? false:true}>조회</button>
                                {Object.keys(this.state.detail).length  > 0 ? <button type="button" className="btn btn-info me-1" onClick={e=>this.write(e,"update")}>수정</button>:<button type="button" className="btn btn-primary me-1" onClick={e=>this.write(e,"reg")}  disabled={JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).schema ? false:true}>등록</button>}
                                {JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).schema && Object.keys(this.state.detail).length >= 0 ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api1", this.state.select.topic_name), this.onCancel)} role="api1" disabled={Object.keys(this.state.detail).length > 0 ? false:true}>삭제</button>:<></>}
                                {!JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).schema && Object.keys(this.state.detail).length > 0  ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api2", this.state.select.topic_name), this.onCancel)} role="api2">삭제</button>:<></>}
                                {!JSON.parse(this.state.meta['dataList'][this.state.select.idx].schema).schema && Object.keys(this.state.detail).length === 0  ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api3", this.state.select.subject), this.onCancel)} role="api3">삭제</button>:<></>}
                                <button type="button" className="btn btn-danger searchbtn" onClick={(e)=>this.view(e, 'history')} disabled={this.state.history && this.state.history.length >0 ? false:true}>이력</button>
                            </div>
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
                <div className="layer transition">
                {this.state.view && this.state.sectionVIEW === 'history' ? 
                <div className="viewHistory">
                    <Historylist data={this.state.history} closeVIEW={this.closeVIEW} />
                </div>
                : <></>}
		       {this.state.view && this.state.sectionVIEW === 'json' ?
                <div className="jsonViewLayer">
                    <div className="jsonView d-flex overflow-scroll">
                    <AceEditor
                        mode="json"
                        theme="tomorrow"
                        name={this.state.json[`_id`]}
                        value = {JSON.stringify(helpers.replaceKey(this.state.detail,"entokr"), null, 4)}
                        onChange={this.onChangeJSON}
                        maxLines={Infinity}
                        fontSize= {14}
                        width="100%"
                    />
                    </div>
                     <div className="mt-5 btnArea d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={this.closeVIEW}>뒤로가기</button>
                    </div>
                </div>
                : <></>}
                {this.state.view && this.state.sectionVIEW === 'change' ?
                <div className="changeView">
                    <div className="d-flex pb-5">
                        <ReactDiffViewer leftTitle="Before" rightTitle="After" oldValue={JSON.stringify(helpers.replaceKey(this.state.changed.before,"entokr"), null, 4)} newValue={JSON.stringify(helpers.replaceKey(this.state.changed.after,"entokr"), null, 4)} splitView={true} />
                    </div>
                    <div className="btnArea d-flex justify-content-center mb-5">
                        <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"change")}>등록</button>
                        <button type="button" className="btn btn-secondary" onClick={this.closeVIEW}>뒤로가기</button>
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

