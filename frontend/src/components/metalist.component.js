import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';
import axios from 'axios';
import dotenv from "dotenv";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"
window.React = React;
dotenv.config();

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:[],
          idx:'',
		  show:false
        };
      }
    componentDidMount(){
        // console.log(this.props);
    }

    onEdit = (e,item) => {
        e.preventDefault();
        console.log("edit");
        console.log(item)
    }

    onSave = (e) => {
        e.preventDefault();
        // axios.post()
    }

    onDel = (e,_id) => {
        e.preventDefault();
        if (window.confirm("정말 삭제하시겠습니까??") == true){    //확인
            axios.delete(process.env.REACT_APP_API+"/meta/delete",{data:{keyword:_id}}).then(res => {
                 alert("삭제가 완료되었습니다");
                 setTimeout(() => { 
                    window.location.reload(false);
                }, 1000);
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

    detailView = (e, idx, _id) => {
        e.preventDefault();
        console.log(idx)
        console.log(e.target);
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:_id}).then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({...this.state, meta:res.data[0],show:true, idx:idx})
            } else {
                this.setState({...this.state, meta:{},idx:idx,show:true})
            }
        })
    }
    jsonVIEW = () => {
        this.setState({
            ...this.state,
            jsonVIEW:true
        })
    }
    closeVIEW = () => {
        this.setState({
            ...this.state,
            jsonVIEW:false
        })
    }
    render()
    {
        return (
            <div className="result">
                <div className="d-flex">
                    <div className="schemaList col-md-8 p-5">
                        <table className="metalist bg-light table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-3">토픽명</th>
                                    <th scope="col" className="col-md-2">스키마버전</th>
                                    <th scope="col" className="col-md-2">스키마Id</th>
                                    <th scope="col" className="col-md-2">수정자</th>
                                    <th scope="col" className="col-md-2">수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.props.schema.length > 0 ? this.props.schema.map((item,index) => {
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
                                            <td className="last_mod_id value form-group">
                                            {item.id}
                                            </td>
                                            <td className="last_mod_dt value form-group">
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
                    <div className="detailview col-md-4 p-5 m-5 border-left">
                        <div className="detail ">
                            {Object.keys(this.state.meta).length > 0 ? 
                                <>
                                <h3>{this.state.meta.topic_name}</h3>
                                <p className="d-inline"><span className="mr-2">Schema Version</span>{this.state.meta.schema_id}</p>
                                <p><span className="mr-2">Meta Version</span>{this.state.meta.meta_id}</p>
                                <p>{this.state.meta.last_mod_id}</p>
                                <p>{this.state.meta.last_mod_dt}</p>
                                <button type="button" className="btn btn-success mr-1" onClick={this.jsonVIEW}>조회</button><button type="button" className="btn btn-info mr-1"><Link to={{pathname:'/metaupdate', data:this.state.meta, type:"update"}}>수정</Link></button><button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.meta._id)}>삭제</button></>                     
                                :
                                <>
                                <p>등록된 Meta가 존재하지 않습니다</p>
                                <button type="button" className="btn btn-primary mr-1"><Link to={{pathname:'/metasave', data:this.props.schema[this.state.idx], type:"reg"}}>등록</Link></button>
                                </>}
                        </div>
                    </div>
                    : <></>}
                </div>
		        {this.state.jsonVIEW ?
                <div className="viewJSON">
                    <div className="closeJSON"><button type="button" onClick={this.closeVIEW} className="btn btn-warning">CLOSE</button></div>
                    {/* <JSONInput
                        id          = {this.state.meta[`_id`]}
                        placeholder = {this.state.meta}
                        locale      = { locale }
                        height      = '100%'
                        width       = '100%'
                        fontSize    = {14}
                        mode        = 'json'
                        theme       = "tomorrow"
                        onChange={this.onChangeJSON}
                    /> */}
                    <AceEditor
                        mode="json"
                        theme="tomorrow"
                        name={this.state.meta[`_id`]}
                        value = {JSON.stringify(this.state.meta, null, 4)}
                        // editorProps={{ $blockScrolling: true }}
                        onChange={this.onChangeJSON}
                        fontSize= {14}
                        width= "100%"
                        height="100%"
                    />
                </div>
                : <></>}
            </div>

        );
    }
}
