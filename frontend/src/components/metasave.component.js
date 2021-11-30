import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import {useHistory, withRouter} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
window.React = React;
dotenv.config();

export default class Metaedit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
              topic_name:'',
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
          viewmode:'table'
        };
      }
    componentDidMount(){
        const {type, data} = this.props.location;
        this.setState({
            data: data
        });

        let toJson = JSON.parse(data.schema);
        let jsons = [];
        toJson.fields.map((item, idx) => {
            console.log(item);
            let json = {};
            json.p_name = item.name;
            json.p_type = item.type;
            json.l_name = '';
            json.l_def = '';
            json.is_null = '';
            json.default = '';
            json.memo = '';
            jsons[idx] = json;
        })
        console.log(jsons);

        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                topic_name: data.subject.replace(/-value/g, ""),
                schema_id: data.id,
                schema_version: data.version,
                meta:jsons
            }
        })

    //       this.setState(prevState => ({
    //           meta: {
    //               ...prevState.meta,
    //               schema: mapping
    //           }   
    //       }))
    //       this.setState(prevState => ({
    //         mapping: mapping
    //     }))
    // console.log(this.state.meta)
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
            "memo":"메모"
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

    onChangeValue = (e) =>{
        e.preventDefault();
        this.setState(prevState => ({
         data: {
             ...prevState.data,
             [e.target.name]:e.target.value
         }   
        }))
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

    onSubmit = async(e) => {
        e.preventDefault();
        await axios.post(process.env.REACT_APP_API+"/meta/insert", this.state.data).then( res => {
            if(res.status===200) alert("등록 완료")
        })
    }

    onChangeValueJSON = (e, index) =>{
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
        this.setState({...this.state, viewmode:type})
    }

    readonly = (name) => {
        var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id"];
        let result = tmp.filter(ele => ele === name)
        return result.length > 0 ? true : false
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
                        <JSONInput
                        id          = {this.state.data[`_id`]}
                        placeholder = {this.state.data}
                        locale      = { locale }
                        height      = '550px'
                        onChange    = {this.onChangeValueJSON}
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
                                                                            <td><input type="text" name={fields2} className={"fields-input "+fields2} value={this.state.data[fields][index][fields2]} onChange={(e)=>this.onChangeValueTemp(e,index)} readOnly={this.readonly(fields2)} /></td>
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