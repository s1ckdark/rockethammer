import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
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
dotenv.config();

export default class Metaupdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        data:{},
        json:{},
        viewmode:'table'
        };
      }
    componentDidMount(){
        const {type, data} = this.props.location;
        if(data) {
            console.log("props");
            localStorage.setItem('meta', JSON.stringify(data));
            this.setState({
                data: data
            });
        } else {
            console.log("no props");
            this.setState({
                data: JSON.parse(localStorage.getItem('meta'))
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

    readonly = (name) => {
        var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id"];
        let result = tmp.filter(ele => ele === name)
        return result.length > 0 ? true : false
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

    onChangeValue = (e) =>{
        e.preventDefault();
        this.setState(prevState => ({
         data: {
             ...prevState.data,
             [e.target.name]:e.target.value
         }   
        }))
//        this.setState({
//          ...this.state,
//        data:{
//                ...this.state.data,
//                last_mod_dt:(new Date).toISOString(),
//               last_mod_id:AuthService.getCurrentUser().userid
//            }
//        }) 
      }

    onChangeValueTemp = (e, index) =>{
        e.preventDefault();
        console.log(index, e.target.name, e.target.value)
        let metas = [...this.state.data.meta];
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
                meta:metas
            }   
        })
    }

    onChangeValueJSON = (e, index) =>{
        e.preventDefault();
        console.log(e.target.value);
        // this.setState({
        //     ...this.state,
        //     json:e.target.value
        // })
    }

    onSubmit = async(e,_id) => {
        e.preventDefault();
        this.setState({
		...this.state,
	data:{
            ...this.state.data,
            last_mod_dt:(new Date).toISOString(),
            last_mod_id:AuthService.getCurrentUser().userid
        }
	})
	    await axios.post(process.env.REACT_APP_API+"/meta/update/"+_id, this.state.data).then( res => {
            if(res.status===200) {alert("수정 완료");setTimeout(() => { 
                this.goBack();
            }, 1000);}
        })
    }

    viewMode = (e, type) => {
        e.preventDefault();
        this.setState({...this.state, 
            json:this.replaceKey(this.state.data),
            viewmode:type})
    }
    goBack = ()=>{
        this.props.history.goBack();
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
            <div className="metalist bg-light p-5">
            <div className="meta">
            <div className="mode d-flex justify-content-end">
                        <button type="button" className={this.state.viewmode === "json" ? "btn btn-success" : "btn btn-dark mr-2"} onClick={(e)=>this.viewMode(e,"json")}>JSON</button>
                        <button type="button" className={this.state.viewmode === "table" ? "btn btn-success" : "btn btn-dark"} onClick={(e)=>this.viewMode(e,"table")}>TABLE</button>
                    </div>
                    <div className={this.state.viewmode === "json" ? "d-block type-json" : "d-none type-json"}>
                        {/* <JSONInput
                        id          = {this.state.data[`_id`]}
                        placeholder = {this.state.data}
                        locale      = { locale }
                        height      = '550px'
			            width       = '100%'
                        onChange    = {this.onChangeValueJSON}
                        /> */}
                        <AceEditor
                            mode="json"
                            theme="tomorrow"
                            name={this.state.json[`_id`]}
                            value = {JSON.stringify(this.state.json, null, 4)}
                            // value = {this.state.data}
                            // editorProps={{ $blockScrolling: true }}
                            onChange={this.onChangeValueJSON}
                            fontSize= {14}
                            width= "100%"
                            height="60vh"
                        />
                        <div className="action text-right">
                            <button type="button" className="btn btn-primary mr-3" onClick={this.onSubmit}>SAVE</button>
                            <button type="button" className="btn btn-secondary" onClick={this.reset}>CANCEL</button>
                        </div>
                    </div>
                    <div className={this.state.viewmode === "table" ? "d-block type-table" : "d-none type-table"}>
                    {Object.keys(this.state.data).map((fields) => {
                            if(typeof(this.state.data[fields]) !== "object"){
                                if(fields !== "_id") {
                                    return (
                                        <div className="d-flex">
                                            <div className={fields+" col-md-2"}>{this.trans(fields)}</div>
                                            <div className={"value-"+fields+" value form-group"}>
                                            <input type="text" name={fields} className={"input-"+fields+" input-value"} value={this.state.data[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                            </div>
                                        </div>
                                    );
                                    } else {
                                        return(
                                            <input type="hidden" name={fields} className={"input-"+fields+" input-value"} value={this.state.data[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                        )
                                    }
                            } else {
                                if(fields === 'related_topics'){
                                    return(
                                    <div className="d-flex">
                                        <div className={fields+" col-md-2"}>{this.trans(fields)}</div>
                                        <div className={"value-"+fields+" value form-group"}>
                                            <input type="text" name={fields} className={"input-"+fields+" input-value"} value={this.state.data[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                        </div>
                                    </div>
                                    )
                                } else if(fields === 'meta') {
                                    return (
                                        <table className="table my-5">
                                            {this.state.data[fields].map((ele, index) => {
                                                return (
                                                    <>
                                                    {index === 0 ? 
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                {Object.keys(ele).map((fields2) => {
                                                                    return (
                                                                        <>
                                                                            <th scope="col" className="text-center">{this.trans(fields2)}</th>
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
                                                                {Object.keys(ele).map((fields2) => {
                                                                        return (
                                                                            <td><input type="text" name={fields2} className={"fields-input "+fields2} value={this.state.data[fields][index][fields2]} onChange={(e)=>this.onChangeValueTemp(e,index)}  readOnly={this.readonly(fields2)}/></td>
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
                        }) 
                    }    
                    <div className="action text-center m-5">
                        <button type="button" className="btn btn-primary mr-3" onClick={(e)=>this.onSubmit(e,this.state.data._id)}>수정</button>
                        <button type="button" className="btn btn-secondary" onClick={this.goBack}>돌아가기</button>
                    </div>
                    </div>
                </div>
   
                </div>
        );
    }
}
