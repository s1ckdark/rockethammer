import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";

import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"
window.React = React;


export default class Metaupdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        data:{},
        history:{},
        updateData:{},
        prevData:{},
        json:{},
        viewmode:'table',
        jsonerr:[]
        };
      }
    componentDidMount(){
        const {type, data} = this.props.location;
        if(data) {
            console.log("props",data);
            localStorage.setItem('meta', JSON.stringify(data));
            this.setState({
                updateData: data,
                prevData:data
            });
        } else {
            console.log("no props");
            this.setState({
                updateData: JSON.parse(localStorage.getItem('meta')),
                prevData:JSON.parse(localStorage.getItem('meta'))

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
        if (typeof (dupeObj) === 'object') {
            if (typeof (dupeObj.length) === 'number')
                retObj = new Array();
    
            for (var objInd in dupeObj) {
                if (dupeObj[objInd] === null)
                    dupeObj[objInd] = "Empty";
                if (typeof (dupeObj[objInd]) === 'object') {
                    retObj[objInd] = this.iterateObj(dupeObj[objInd]);
                } else if (typeof (dupeObj[objInd]) === 'string') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) === 'number') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) === 'boolean') {
                    ((dupeObj[objInd] === true) ? retObj[objInd] = true : retObj[objInd] = false);
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
        console.log(this.state.data[e.target.name], this.state.prevData[e.target.name]);
        this.setState(prevState => ({
         updateData: {
             ...prevState.updateData,
             [e.target.name]:e.target.value
         }   
        }))
      }

    onChangeValueTemp = (e, index) =>{
        // console.log(index, e.target.name, e.target.value)
        console.log(this.state.prevData.meta[index][e.target.name], e.target.value);
       if(this.state.prevData.meta[index][e.target.name] !== e.target.value) {
        let metas = [...this.state.updateData.meta];
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
            updateData: {
                ...this.state.updateData,
                meta:metas
            }   
        }) } 
    }

    onChangeValueJSON = (e, index) =>{
        this.setState({
            json:JSON.parse(this.refs.aceEditor.editor.getValue())

        })
    }

    onSubmit = async(e,_id, mode) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            updateData:{
                    ...this.state.data,
                    last_mod_dt:(new Date).toISOString(),
                    last_mod_id:AuthService.getCurrentUser().userid
                }
            })

        //history state
        this.setState({
		...this.state,
        history:{
                topic_name:this.state.prevData.topic_name,
                before:JSON.stringify(this.state.prevData),
                after:JSON.stringify(this.state.updateData),
                last_mod_dt:(new Date).toISOString(),
                last_mod_id:AuthService.getCurrentUser().userid
            }
        })

        const prevData = this.replaceKey(this.state.prevData, "entokr");

        if(JSON.stringify(prevData) === JSON.stringify(this.state.json)){ 
            alert("변경된 내용이 없습니다.");
            this.goBack();
        } else {
            console.log("changed");
            // this.exist(prevData, this.state.json);
            // Object.keys(prevData).map( res => {
            //     console.log(res);
            //     this.exist(this.state.updateData, res);
            // })
            // this.state.updateData.meta.map(item => Object.keys(item).map( res => {
            //     console.log(res);
            // })
            // )
            // this.exist(this.state.updateData);
            // this.setState({...this.state, 
            //     json:this.replaceKey(this.state.updateData, "krtoen")
            // })
            // if(this.state.updateData.hasOwnProperty('물리명')){alert("있다!")} else {alert("없다")}
            await axios.post(process.env.REACT_APP_API+"/meta/update/"+_id, this.state.updateData).then( res => {
                axios.post(process.env.REACT_APP_API+"/history/insert/", this.state.history).then(res =>{
                if(res.status===200) {alert("수정 완료");setTimeout(() => { 
                    this.goBack();
                }, 1000);}
                })
            })
        }
    }
    
// detect json key changed.
//     exist = (prev, after) => {
//         let keys= [], metakeys=[], err=[];
//         if(typeof(prev) === 'object' || typeof(after) === 'object') {
//             // this.detect(prev, after);
//             Object.keys(prev).map( res => {
//                keys.push(res);
//             })
//             prev.meta.map(res => {
//                 Object.keys(res).map( item => {
//                     metakeys.push(item);
//                 })
//             })
//             keys = [...new Set(keys)]          
//             keys.map(key => {
//                 after.hasOwnProperty(key) ? console.log("yes", key) :  err.push(key)
//                 })
            
//             metakeys.map(key => {
//                     after['meta'].map((ele) => {
//                         console.log(ele, key);
//                         ele.hasOwnProperty(key) ? console.log("yes", key) : err.push(key)
//                         // console.log("no", key);
//                 })
//             })
//             if(err.length > 0) { this.setState({...this.state, jsonerr:err}); alert("JSON 키는 변경될 수 없습니다.");}
//     } else {
//         alert("JSON을 입력해주세요")
//     }
// }

    // detect = (base, update) => {
        // let keys =[];
        // console.log(base);
        // Object.keys(base).map(ele=>{
        //     if(typeof(base[ele]) !== 'object') {
        //        keys.push(ele);
        //     }
        // }) 
        // base[meta].map(ele => {
        //     Object.keys(base['meta'])
        // })
        
        // console.log(keys);
        // update.hasOwnProperty(key) ? console.log(index, key):console.log("no")
        // Object.keys(base).map((res,index)=>{
        //     if(typeof(json[res]) !== 'object') {
        //         res.hasOwnProperty(key) ? console.log(index, key):console.log("no")
        //     }
            
            // res.hasOwnProperty(key) ? console.log(index, key):console.log("no")
        // })
    // }
	    
    replaceKey = (data, mode)=>{
        let swaps;
        switch(mode) {
            case "entokr":
                swaps = {
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
                break;
            case "krtoen":
                swaps = {
                    "_id":"_id",
                    "토픽명":"topic_name",
                    "스키마ID":"schema_id",
                    "메타ID":"meta_id",
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


    viewMode = (e, type) => {
        e.preventDefault();
        this.setState({...this.state, 
            json:this.replaceKey(this.state.updateData, "entokr"),
            viewmode:type})
    }
    goBack = ()=>{
        this.props.history.goBack();
    }

    

    render()
    {
        console.log(this.state.updateData);
        return (
            <div className="metalist bg-light p-5">
            <div className="meta">
            <div className="mode d-flex justify-content-end mb-5">
                        <button type="button" className={this.state.viewmode === "json" ? "btn btn-success" : "btn btn-dark mr-2"} onClick={(e)=>this.viewMode(e,"json")}>JSON VIEW</button>
                        <button type="button" className={this.state.viewmode === "table" ? "btn btn-success" : "btn btn-dark ml-2"} onClick={(e)=>this.viewMode(e,"table")}>TABLE</button>
                    </div>
                    <div className={this.state.viewmode === "json" ? "d-block type-json" : "d-none type-json"}>
                        <AceEditor
                            ref="aceEditor"
                            mode="json"
                            theme="tomorrow"
                            name="ace-editor"
                            // name={this.state.json[`_id`]}
                            value = {JSON.stringify(this.state.json, null, 4)}
                            // value = {this.state.data}
                            editorProps={{ $blockScrolling: true }}
                            onChange={this.onChangeValueJSON}
                            fontSize= {14}
                            readOnly
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                                useWorker: false
                              }}
                              style={{
                                // position: 'relative',
                                width: "100%",
                                height: "60vh"
                              }}
                              showPrintMargin
                              wrapEnabled
                              showGutter
                              highlightActiveLine
                        />
                    </div>
                    <div className={this.state.viewmode === "table" ? "d-block type-table" : "d-none type-table"}>
                        <div className="d-flex flex-wrap">
                    {Object.keys(this.state.updateData).map((fields) => {
                            if(typeof(this.state.updateData[fields]) !== "object"){
                                if(fields !== "_id") {
                                    return (
                                        <div className="d-flex w-50 justify-content-center">
                                            <div className={fields+" col-md-4 text-left"}>{this.trans(fields)}</div>
                                            <div className={"value-"+fields+" value form-group col-md-6"}>
                                            <input type="text" name={fields} className={"input-"+fields+" input-value w-100"} value={this.state.updateData[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                            </div>
                                        </div>
                                    );
                                    } else {
                                        return(
                                            <input type="hidden" name={fields} className={"input-"+fields+" input-value"} value={this.state.updateData[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                        )
                                    }
                            } else {
                                if(fields === 'related_topics'){
                                    return(
                                    <div className="d-flex">
                                        <div className={fields+" col-md-2"}>{this.trans(fields)}</div>
                                        <div className={"value-"+fields+" value form-group"}>
                                            <input type="text" name={fields} className={"input-"+fields+" input-value"} value={this.state.updateData[fields]} onChange={this.onChangeValue} readOnly={this.readonly(fields)}/>
                                        </div>
                                    </div>
                                    )
                                } else if(fields === 'meta') {
                                    return (
                                        <table className="table my-5">
                                            {this.state.updateData[fields].map((ele, index) => {
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
                                                                            <td><input type="text" name={fields2} className={"fields-input "+fields2} value={this.state.updateData[fields][index][fields2]} onChange={(e)=>this.onChangeValueTemp(e,index)}  readOnly={this.readonly(fields2)}/></td>
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
                    </div>
                </div>
                    <div className={this.state.viewmode === 'table' ? "action visible text-center mx-auto my-5" : "action invisible text-center mx-auto my-5"}>
                        <button type="button" className="btn btn-primary mr-3" onClick={(e)=>this.onSubmit(e,this.state.updateData._id)}>수정</button>
                        <button type="button" className="btn btn-secondary" onClick={this.goBack}>돌아가기</button>
                    </div>
                </div>
                </div>
        );
    }
}
