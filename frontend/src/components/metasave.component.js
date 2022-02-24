import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import {useHistory, withRouter} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";

import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"
window.React = React;


export default class Metasave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                key:{
                    topic_name:'',
                    topic_desc:'',
                    schema_id:'',
                    meta_id:'',
                    schema_version:'',
                    recycle_pol:'',
                    op_name:'',
                    service:'',
                    related_topics:[],
                    last_mod_dt:'',
                    last_mod_id:'',
                    meta:[]
                },
                value:{
                    topic_name:'',
                    topic_desc:'',
                    schema_id:'',
                    meta_id:'',
                    schema_version:'',
                    recycle_pol:'',
                    op_name:'',
                    service:'',
                    related_topics:[],
                    last_mod_dt:'',
                    last_mod_id:'',
                    meta:[]
                }
            },
          viewmode:'table',
          json:{}
        };
      }
    componentDidMount(){
        // console.log(this.props.location)
        const {schema, type, data} = this.props.location;
            if(data) {
                data.map( json => {
                    // console.log(json);
                let whatisit = json.subject.split("-").pop();
                let toJson = JSON.parse(json.schema);
                let jsons = [];
                    toJson.fields.map((item, idx) => {
                        let json = {};
                        json.p_name = item.name;
                        json.p_type = item.type;
                        json.l_name = '';
                        json.l_def = '';
                        //null허용여부 분기 default값 지정
                        json.is_null = typeof(item['type']) === 'object' && item['type'].filter(function (str) { return str.includes('null')}).length === 1 ? 'y': 'n' 
                        json.default = item.default ? item.default : ''
                        json.memo = '';
                        jsons[idx] = json;
                    })
                        this.setState(prevState => ({
                            data:{
                                ...prevState.data,
                                [whatisit]:{
                                    topic_name: json.subject.replace(/-value/g, ""),
                                    schema_id: json.id,
                                    schema_version: json.version,
                                    meta:jsons,
                                    last_mod_dt:(new Date).toISOString(),
                                    last_mod_id:AuthService.getCurrentUser().userid
                                }
                            }
                        }), ()=>{
                            localStorage.setItem('data', JSON.stringify(this.state.data));
                            console.log("set ok props "+whatisit,this.state.data[whatisit]);
                        })
                })

          
        } else {
            this.setState({
                data: JSON.parse(localStorage.getItem('data')),
            }, ()=>{
                console.log("set ok noprops ",this.state.data);
            })
        }


     }

    trans = (name) => {
        var defineName = {
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
        }
        return  defineName[name] ? defineName[name]:name;
    }
    
    iterateObj = (dupeObj) => {
        var retObj = new Object();
        if (typeof (dupeObj) == 'object') {
            if (typeof (dupeObj.length) == 'number')
                retObj = new Array();
    
            for (var objInd in dupeObj) {
                if (dupeObj[objInd] == null)
                    dupeObj[objInd] = "Empty";
                if (typeof (dupeObj[objInd]) == 'object') {
                    retObj[objInd] = this.iterateObj(dupeObj[objInd]);
                } else if (typeof (dupeObj[objInd]) == 'string') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) == 'number') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) == 'boolean') {
                    ((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
                }       
            }
        }
        return retObj;
    }

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    onChangeValue = (e, fields) =>{
        e.preventDefault();
        console.log(fields);
        this.setState(prevState => ({
         data: {
             ...prevState.data,
             [fields]:{
                 ...this.state.data[fields],
             [e.target.name]:e.target.value
             }
            }   
        }))
      }

    onChangeValueTemp = (e, index) =>{
        e.preventDefault();
        console.log(index, e.target.name, e.target.value)
        let metas = [...this.state.data.value.meta];
        metas.map((ele, idx) => {
            if(idx === index) {
                let meta = {...metas[index]};
                meta[e.target.name] = e.target.value;
                metas[idx] = meta;
            } 
        }
        )
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                value:{
                    ...this.state.data.value,
                    meta:metas
                }
            }   
        })
    }

    onSubmit = async(e) => {
        e.preventDefault();
	    await axios.post(process.env.REACT_APP_API+"/meta/insert", this.state.data.value).then( res => {
            if(res.status===200) {alert("등록 완료");setTimeout(() => { 
                this.goBack();
            }, 500);}
        })
    }
    
    onChangeValueJSON = (e, index, whatisit) =>{
        e.preventDefault();
        this.setState({
            ...this.state,
            json:e.target.value
        })
    }

    goBack = ()=>{
        this.props.history.goBack();
    }

    viewMode = (e, type) => {
        e.preventDefault();
        this.setState({...this.state, 
            json:this.replaceKey(this.state.data),
            viewmode:type})
    }

    readonly = (name) => {
        var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id","is_null","default"];
        let result = tmp.filter(ele => ele === name)
        return result.length > 0 ? true : false
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
        this.replaceKey(this.state.data);
        let fields="key";
        return (
            <div className="metalist bg-light p-5">
            <div className="meta">
            <div className="mode d-flex justify-content-end">
                        <button type="button" className={this.state.viewmode === "json" ? "btn btn-success" : "btn btn-dark mr-1"} onClick={(e)=>this.viewMode(e,"json")}>JSON</button>
                        <button type="button" className={this.state.viewmode === "table" ? "btn btn-success" : "btn btn-dark"} onClick={(e)=>this.viewMode(e,"table")}>TABLE</button>
                    </div>
                    <div className={this.state.viewmode === "json" ? "d-block type-json" : "d-none type-json"}>
                        <AceEditor
                            mode="json"
                            theme="tomorrow"
                            name={this.state.json[`_id`]}
                            value = {JSON.stringify(this.state.json, null, 4)}
                            onChange={this.onChangeValueJSON}
                            fontSize= {14}
                            width= "100%"
                            height="60vh"
                        />
                        <div className="action text-right my-5">
                            <button type="button" className="btn btn-primary mr-3" onClick={this.onSubmit}>저장</button>
                            <button type="button" className="btn btn-secondary" onClick={this.goBack}>돌아가기</button>
                        </div>
                    </div>
                    <div className={this.state.viewmode === "table" ? "d-block type-table" : "d-none type-table"}>  
                    {Object.keys(this.state.data).map(fields => {
                        return (
                            <section className={fields+"_schema mb-5"}>
                                <h3 className="mb-5">{fields} Schema</h3>
                        {Object.keys(this.state.data[fields]).map(field => {
                            let data = this.state.data;
                            console.log(field,data[fields][field],typeof(data[fields][field]))
                            if(typeof(data[fields][field]) !== "object"){
                                if(field !== "_id") {
                                return (
                                    <div className="d-flex">
                                        <div className={field+" col-md-2"}>{this.trans(field)}</div>
                                        <div className={"value-"+field+" value form-group"}>
                                            <input type="text" name={field} className={"input-"+field+" input-value"} value={data[fields][field]} onChange={(e)=> this.onChangeValue(e, fields)} readOnly={this.readonly(field)}/>
                                        </div>
                                    </div>
                                );
                                } else {
                                    return(
                                        <input type="hidden" name={field} className={"input-"+field+" input-value"} value={data[fields][field]} onChange={(e)=> this.onChangeValue(e, fields)} readOnly={this.readonly(field)}/>
                                    )
                                }
                            } else {
                                if(field === 'related_topics'){
                                    return(
                                    <div className="d-flex">
                                        <div className={field+" col-md-2"}>{this.trans(field)}</div>
                                        <div className={"value-"+field+" value form-group"}>
                                            <input type="text" name={field} className={"input-"+field+" input-value"} value={data[fields][field]} onChange={(e)=> this.onChangeValue(e, fields)} readOnly={this.readonly(field)}/>
                                        </div>
                                    </div>
                                    )
                                } else if(field === 'meta') {
                                    return (
                                        <table className="table my-5">
                                            {data[fields][field].map((ele, index) => {
                                                return (
                                                    <>
                                                    {index === 0 ? 
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                {Object.keys(ele).map((field2) => {
                                                                    return (
                                                                        <>
                                                                            <th scope="col" className="text-center">{this.trans(field2)}</th>
                                                                        </>
                                                                    );
                                                                }) 
                                                                }   
                                                            </tr>
                                                        </thead>
                                                    : <></>}
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">{index+1}</th>
                                                                {Object.keys(ele).map((field2) => {
                                                                        return (
                                                                            <td><input type="text" name={field2} className={"field-input "+field2} value={data[fields][field][index][field2]} onChange={(e)=>this.onChangeValueTemp(e,index, fields)} readOnly={this.readonly(field2)} /></td>
                                                                        );
                                                                        
                                                                    }) 
                                                                }   
                                                            </tr>
                                                        </tbody>
                                                    </>
                                                )
                                            })}
                                        </table>
                                    )
                                }
                            }                            
                        
                        }) }
                        </section>
                    
                        );
                    })
                    }    
                    <div className="action text-center">
                        <button type="button" className="btn btn-primary mr-3" onClick={this.onSubmit}>저장</button>
                        <button type="button" className="btn btn-secondary" onClick={this.goBack}>돌아가기</button>
                    </div>
                    </div>
                </div>
   
                </div>
        );
    }
}
