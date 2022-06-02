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

// export const withRouter = (Component: Component) => {
//     const WithRouter = (props) => {
//       const location = useLocation();
//       const navigate = useNavigate();
//       const params = useParams();
//       return <Component {...props} location={location} navigate={navigate} params={params} />;
//     }
//     return WithRouter;
//   }
  
export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:{
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
          },
          typeVIEW:false,
          type:''

        };
    }
      
    componentDidMount(){
        const schema = this.props.schema;
        this.setState({
            ...this.state,
            meta: schema
        })     
    }

  componentWillReceiveProps(nextProps) {
    this.setState({
        ...this.state,
        meta: nextProps.schema
    })  
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
        const tn = topic_name.replace(/(-value|-key)/g, "");
        this.setState({
            ...this.state,
            detailVIEW: true
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
                    changeVIEW:true,
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

    // goBack = ()=>{
    //     this.props.history.goBack();
    // }

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
                        <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"change")}>등록</button>
                        <button type="button" className="btn btn-secondary" onClick={(e)=>this.closeChanged(e)}>돌아가기</button>
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
                            // console.log(schema,meta_join);
                            return(
                                    <tr data-index={index} className={this.state.idx === index ? "table-active text-center":"text-center"} key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td className="modified">{meta_join && schema.version > meta_join.schema_version ? <p onClick={(e)=> this.notiforchange(e, schema.subject)}>O</p> : <p>X</p>}</td>
                                        <td className="value-subject value form-group" onClick={(e)=>this.detailView(e, index, schema.subject)}>
                                            {schema.subject.replace(/(-value|-key)/g, "")}
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
                                <p className="d-inline"><span className="me-2">Schema Version</span>{this.state.detail.schema_id}</p>
                                <p><span className="me-2">Meta Version</span>{this.state.detail.meta_id}</p>
                                <p>{this.state.detail.last_mod_id}</p>
                                <p>{this.state.detail.last_mod_dt}</p>
                                <div className="d-flex">
                                <button type="button" className="btn btn-success me-1" onClick={this.jsonVIEW}>조회</button><button type="button" className="btn btn-info me-1" onClick={(e)=>this.write(e,"update")}>수정</button><button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.detail._id)}>삭제</button> {this.state.history && this.state.history.length >0 ? <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.detail.topic_name)}>HISTORY</button> : <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.detail.topic_name)} disabled={true}>HISTORY</button>}</div></>                     
                                :
                                <>
                                <h3>{this.state.meta.dataList[this.state.idx].schema.subject}</h3>
                                <div className="d-flex">
                                <button type="button" className="btn btn-success me-1" onClick={this.jsonVIEW} disabled={true}>조회</button>
                                <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"reg")}>등록</button>
                                <button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.detail._id)} disabled={true}>삭제</button> 
                                <button type="button" className="btn btn-danger ms-1 searchbtn" onClick={(e)=>this.historyView(e, this.state.meta.data.topic_name)} disabled={true}>HISTORY</button>
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
                 {this.state.typeVIEW ?
                    this.state.detail && this.state.type ==='update' ? <><Metawrite key={this.state.detail._id} closeWrite={this.closeWrite} type={this.state.type} data={this.state.detail}/><div className="close closeWrite" onClick={this.closeWrite}>&times;</div></>
                    :<><Metawrite key={Math.random()} closeWrite={this.closeWrite} type={this.state.type} data={this.state.schema} /><div className="close closeWrite" onClick={this.closeWrite}>&times;</div></>:<></>
                 }
            </div>
        );
    }
}

