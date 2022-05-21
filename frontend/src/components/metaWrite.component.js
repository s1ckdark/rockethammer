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
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
window.React = React;


export default class Metawrite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                topic_name:'',
                subject:'',
                schema_id:'',
                schema_version:'',
                meta_version:'',
                revision:'',
                last_mod_id:'',
                last_mod_dt:'',
                is_used: true,
                topic_desc:'',
                op_name:'',
                service:'',
                related_topics:[],
                key:[],
                value:[]
            },
            history:{},
            prevData:{},
            viewmode:'table',
            json:{},
            jsonerr:[],
            type:''
        };
    }

    componentDidMount(){
        const {type, data} = this.props.location;
        console.log(this.props);
        console.log(data);
        this.setState({
            ...this.state,
            type: type
        })
        if(data && type ==='reg' || type === 'change') {
            console.log("type",type);
            Object.keys(data).map( whatisit => {
                console.log(whatisit,data[whatisit].length);
                if(data[whatisit].length > 0){
                    console.log(data[whatisit][0].schema);
                let toJson = JSON.parse(data[whatisit][0].schema);
                let jsons = [];
                toJson.fields.map((item, idx) => {
                    let json = {};
                    json.p_name = item.name;
                    json.p_type = item.type;
                    if(whatisit === 'value') json.l_name = '';
                    if(whatisit === 'value') json.l_def = '';
                    //null허용여부 분기 default값 지정
                    json.is_null = typeof(item['type']) === 'object' && item['type'].filter(function (str) { return str.includes('null')}).length === 1 ? 'y': 'n' 
                    json.default = item.default ? item.default : ''
                    if(whatisit === 'value') json.memo = '';
                    jsons[idx] = json;
                })
                this.setState(prevState => ({
                    data:{
                        ...prevState.data,
                        topic_name: data['value'][0].subject.replace(/(-value|-key)/g, ""),
                        subject:data['value'][0].subject,
                        schema_id: data['value'][0].id,
                        schema_version: data['value'][0].version,
                        meta_version:1,
                        revision:1, 
                        last_mod_dt:(new Date).toISOString(),
                        last_mod_id:AuthService.getCurrentUser().userid,
                        is_used: true, 
                        [whatisit]:jsons
                    }
                }), ()=>{
                    localStorage.setItem('data', JSON.stringify(this.state.data));
                    localStorage.setItem('type', type);
                    console.log("reg - set ok props "+whatisit,this.state.data[whatisit]);
                })
            }  
            })   
    } else if(data && type ==='update') {
        console.log("type",type);
        delete data['_id'];
        data['revision'] = data['revision'] + 1;
        data['meta_version'] = data['meta_version'] + 1; 
        data['last_mod_dt'] = (new Date).toISOString();
        data['last_mod_id'] = AuthService.getCurrentUser().userid;
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('type', type);
        this.setState({
            data: data,
            prevData:data
        });
    } else if(!data) {
        console.log("type",type);
        this.setState({
            data: JSON.parse(localStorage.getItem('data')),
            prevData:JSON.parse(localStorage.getItem('data')),
            type: localStorage.getItem('type'),
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
            "schema_version":"스키마버전",
            "meta_version":"메타버전",
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

    onChangeValue = (e, field) =>{
        e.preventDefault();
        this.setState(prevState => ({
         data: {
             ...prevState.data,
             [e.target.name]:e.target.value
             }
        }))
      }

    onChangeValueTemp = (e, index, field) =>{
        e.preventDefault();
        // console.log(index, e.target.name, e.target.value)
        let metas = [...this.state.data[field]];
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
                [field]:metas
            }   
        })
    }

    onSubmit = async(e, type) => {
        e.preventDefault();
        let temp = this.state.data;
        if(type === 'reg' || type ==='change'){
              if(type === 'reg') {
                temp.meta_version = 1;             
            } else {
                let meta_versionInt = this.state.data.meta_version + 1;
                console.log(meta_versionInt, meta_versionInt);
                temp.meta_version = meta_versionInt;
            }
            temp.last_mod_dt = (new Date).toISOString();
            temp.last_mod_id = AuthService.getCurrentUser().userid;
            console.log(temp);
            this.setState(prevState => ({
                    data: temp
                }),()=>{
                this.setState({
                    ...this.state,
                    history:{
                            topic_name:this.state.prevData.topic_name,
                            before:JSON.stringify(this.state.data),
                            after:JSON.stringify(this.state.data),
                            last_mod_dt:(new Date).toISOString(),
                            last_mod_id:AuthService.getCurrentUser().userid
                        }
                    })
                }
            )
            await axios.post(process.env.REACT_APP_API+"/meta/insert/", this.state.data).then( res => {
                axios.post(process.env.REACT_APP_API+"/history/inserthistory/", this.state.history).then(res =>{
                if(res.status===200) {
                    localStorage.removeItem('type');
                    localStorage.removeItem('data');
                    alert("등록 완료");
                setTimeout(() => { 
                    this.goBack();
                }, 1000);}
                })
            })
        } else if(type === 'update'){
            temp.revision = parseInt(this.state.data.revision)+1;
            temp.last_mod_dt = (new Date).toISOString();
            temp.last_mod_id = AuthService.getCurrentUser().userid;
            this.setState(prevState => ({
                    data: temp
                }),()=>{
                this.setState({
                    ...this.state,
                    history:{
                            topic_name:this.state.prevData.topic_name,
                            before:JSON.stringify(this.state.prevData),
                            after:JSON.stringify(this.state.data),
                            last_mod_dt:(new Date).toISOString(),
                            last_mod_id:AuthService.getCurrentUser().userid
                        }
                    })
                }
            )
            // console.log(this.state.prevData);
            let prevData = this.state.prevData, nextData= this.state.data;
            // let compare = ["revision","meta_version","schema_id","schema_version","last_mod_dt","last_mod_id"];

            // const prevData = this.replaceKey(this.state.prevData, "entokr");
            if(JSON.stringify(prevData) === JSON.stringify(temp)){ 
                localStorage.removeItem('type');
                localStorage.removeItem('data');
                alert("변경된 내용이 없습니다.");
                this.goBack();
            } else {
                console.log("changed");
                // this.exist(prevData, this.state.json);
                // Object.keys(prevData).map( res => {
                //     console.log(res);
                //     this.exist(this.state.data, res);
                // })
                // this.state.data.meta.map(item => Object.keys(item).map( res => {
                //     console.log(res);
                // })
                // )
                // this.exist(this.state.data);
                // this.setState({...this.state, 
                //     json:this.replaceKey(this.state.data, "krtoen")
                // })
                // if(this.state.data.hasOwnProperty('물리명')){alert("있다!")} else {alert("없다")}
                // await axios.post(process.env.REACT_APP_API+"/meta/update/"+_id, this.state.data).then( res => {
                await axios.post(process.env.REACT_APP_API+"/meta/insert/", this.state.data).then( res => {
                    axios.post(process.env.REACT_APP_API+"/history/inserthistory/", this.state.history).then(res =>{
                    if(res.status===200) {
                        localStorage.removeItem('type');
                        localStorage.removeItem('data');
                        alert("수정 완료");
                        setTimeout(() => { 
                        this.goBack();
                    }, 1000);}
                    })
                })
            }
        }
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
            json:this.replaceKey(this.state.data, "entokr"),
            viewmode:type})
    }

    readonly = (name, schema=null) => {
        // console.log(name, schema);
        if(schema !== 'key') { 
            var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id","is_null","default","revision","schema_id","meta_version","last_mod_id","last_mod_dt","subject"];
            let result = tmp.filter(ele => ele === name)
            return result.length > 0 ? true : false 
        } else { return true; }
    }
    hideField = (name) =>{
        let tmp = ["last_mod_dt","last_mod_id","subject","is_used"];
        let result = tmp.filter(ele => ele === name )
        return result.length > 0 ? "d-none" : "d-block"
    }
    replaceKey = (data, mode)=>{
        let swaps;
        switch(mode) {
            case "entokr":
                swaps = {
                    "_id":"_id",
                    "topic_name":"토픽명",
                    "schema_id":"스키마ID",
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
                break;
            case "krtoen":
                swaps = {
                    "_id":"_id",
                    "토픽명":"topic_name",
                    "스키마ID":"schema_id",
                    "스키마버전":"schema_version",
                    "메타버전":"meta_version",
                    "데이터삭제주기":"recycle_pol",
                    "관리부서":"op_name",
                    "업무시스템":"service",
                    "연관토픽":"related_topics",
                    "최종수정시간":"last_mod_dt",
                    "최종수정자":"last_mod_id",
                    "schema":"schema",               
                    "물리명":"p_name",
                    "데이터 타입":"p_type",
                    "논리명":"l_name",
                    "설명":"l_def",
                    "Null허용여부":"is_null",
                    "기본값":"default",
                    "메모":"memo",
                    "토픽설명":"topic_desc"
                };
                break;
            default:
                break;
            }

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
                            name={this.state.data[`topic_name`]}
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
                        <div className="d-flex flex-wrap my-5"> 
                        {Object.keys(this.state.data).map(field => {
                            // common field
                            const data = this.state.data;
                            // console.log(field, data[field]);
                            if(typeof(data[field]) !== "object" || data[field] === null){
                                return (
                                    <div className={this.hideField(field)+" form-group col-md-6 "+field}>
                                        <div className={field}><p className="field-label">{this.trans(field)}</p></div>
                                        <div className={"value-"+field+" value"}>
                                            <input type="text" name={field} className={"input-"+field+" input-value w-100"} value={data[field]} onChange={(e)=> this.onChangeValue(e, field)} readOnly={this.readonly(field)}/>
                                        </div>
                                    </div>
                                )
                            } else {
                                if(field === 'related_topics'){
                                    return (
                                        <div className="form-group field col-md-6">
                                                <div className={field}><p className="field-label">{this.trans(field)}</p></div>
                                                <div className={"value-"+field+" value"}>
                                                    <input type="text" name={field} className={"input-"+field+" input-value w-100"} value={data[field]} onChange={(e)=> this.onChangeValue(e, field)} readOnly={this.readonly(field)}/>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        if(data[field] && data[field].length > 0 ){
                                            return(
                                                <div className="col-md-12">
                                                <h3 className="h3 schema-field mt-5">{field} Schema</h3>
                                                <table className="table my-1">
                                                    {data[field].map((meta_field, index) => {
                                                        return (
                                                            <>
                                                            {index === 0 ? 
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">#</th>
                                                                        {Object.keys(meta_field).map((field2) => {
                                                                            return (
                                                                                <>
                                                                                    <th scope="col" className="text-center">{this.trans(field2)}</th>
                                                                                </>
                                                                            );
                                                                        }) 
                                                                        }   
                                                                    </tr>
                                                                </thead>
                                                            : <tr>
                                                                <th scope="row">{index+1}</th>
                                                                {Object.keys(meta_field).map((field2) => {
                                                                        return (
                                                                            <td><input type="text" name={field2} className={"field-input "+field2} value={data[field][index][field2]} onChange={(e)=>this.onChangeValueTemp(e, index, field)} readOnly={this.readonly(field2, field)} /></td>
                                                                        );
                                                                        
                                                                    }) 
                                                                }   
                                                            </tr>
                                                        }
                                                           
                                                            </>
                                                        )
                                                    })}
                                                </table>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <>
                                                    {/* <div className="col-md-12">
                                                    <h3 className="h3 schema-field mt-5 mb-2">등록된 {field} schema가 없습니다</h3>
                                                    </div> */}
                                                </>
                                            )
                                        }
                                    }
                                }
                            })
                        }
                        </div>
                        <div className="action text-center">
                            <button type="button" className="btn btn-primary mr-3" onClick={(e)=>this.onSubmit(e, this.state.type)}>{ this.state.type === 'reg' ? "등록":"저장"}</button>
                            <button type="button" className="btn btn-secondary" onClick={this.goBack}>돌아가기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 