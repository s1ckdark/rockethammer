import React, { Component} from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthService from "../../services/auth.service";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";

class Metadetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          changed:{
              before:'',
              after:''
          },
          delete:{}
        };
    }

    write = (e, type, topic_name)=> {
        e.preventDefault();
        this.props.router.navigate('/meta/write/'+topic_name, {state:{data:this.props.data,type:type}})
    }

    view = (e, type, topic_name, currentPage = 1) => {
        let url = type ==='history' ? 'history/list/'+topic_name+'/'+currentPage : type+'/'+topic_name
        this.props.router.navigate('/meta/view/'+url, type !== 'history' ? {state:{data:this.props.data,type:type}}:{state:{}})
    }

    onDel = async (typeofapi, topic_name) => {
        console.log(typeofapi, topic_name);
        let url, url2;
        switch(typeofapi){
            case 'api1':
                url = process.env.REACT_APP_API+"/meta/delete";
                break;
            case 'api2':
                url = [process.env.REACT_APP_API+"/meta/delete", process.env.REACT_APP_API+"/schema/delete"];
                break;
            case 'api3':
                url = process.env.REACT_APP_API+"/schema/delete";
                break;
            default:
                console.log("typeofapi",typeofapi);
        }

        if(typeofapi === 'api1' || typeofapi ==='api3'){    //확인
                try {
                    axios.post(url, {keyword:JSON.parse(this.state.data['list'][this.state.select.idx].schema).subject}).then(res => console.log(res))
                } catch(err) {
                    console.log("error", err);
                }
        } else {
            try {
                Promise.all(url.map(async (endpoint) => await axios.post(endpoint, {keyword:JSON.parse(this.state.data['list'][this.state.select.idx].schema).subject}))).then((response1, response2) => {
                    console.log(response1, response2)
                })
            } catch(err) {
                console.log("error", err);
            }
        }

        await axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:topic_name, reg_dt:(new Date).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
        alert("삭제가 완료되었습니다");
        setTimeout(() => {
            window.location.reload(false);
        }, 1000)
    }

render(){
        if(this.props.data === null) return false;
        const { schema, meta_join } = helpers.parseNested(this.props.data) || {}
        let sch = JSON.parse(schema);
        let meta = helpers.isEmptyObj(meta_join) === false && JSON.parse(meta_join).is_used === 'true' ? JSON.parse(meta_join):{}
        const topic_name = sch.subject.replace(/(-value|-key)/g, "")
        return (
            <div className="detail-info">
                <div className="info-group topic_name">
                    <label>토픽명</label>
                    <h3>{topic_name}</h3>
                </div>
                    <div className="info-group schema_id">
                        <label className="info-label">물리 스키마 버전</label>
                        <p>{meta.schema_id ? meta.schema_id : "-"}</p>
                    </div>
                    <div className="info-group revision">
                        <label className="info-label">논리 스키마 버전</label>
                        <p>{meta.revision ? meta.revision : "-"}</p>
                    </div>
                    <div className="info-group last_mod_id">
                        <label className="info-label">마지막 수정자</label>
                        <p>{meta.last_mod_id ?meta.last_mod_id:"-" }</p>
                    </div>
                    <div className="info-group last_mod_dt">
                        <label className="info-label">마지막 수정 일시</label>
                        <p>{meta.last_mod_dt ? helpers.krDateTime(meta.last_mod_dt) : "-"}</p>
                    </div>
                <div className="btn-group">
                    {helpers.isEmptyObj(sch.schema) === false && meta.is_used === 'true' ? <button type="button" className="btn" onClick={e=>this.write(e,"update", topic_name)}>수정</button>:<button type="button" className="btn btn-primary me-1" onClick={e=>this.write(e,"reg", topic_name)}  disabled={helpers.isEmptyObj(sch.schema) === true ? true:false}>등록</button>}
                    <button type="button" className="btn" onClick={e=>this.view(e, 'json', topic_name)} disabled={helpers.isEmptyObj(meta) === false && meta.is_used === 'true' ? false:true}>조회</button>
                    {helpers.isEmptyObj(sch.schema) === false ? <button type="button" className="btn" onClick={e=> helpers.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api1", this.state.select.topic_name), this.onCancel)} role="api1" disabled={helpers.isEmptyObj(meta) === false && meta.is_used === 'true' ? false:true}>삭제</button>:<></>}
                    {helpers.isEmptyObj(sch.schema) === undefined && helpers.isEmptyObj(meta) === false && meta.is_used === 'true' ? <button type="button" className="btn" onClick={e=> helpers.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api2", this.state.select.topic_name), this.onCancel)} role="api2">삭제</button>:<></>}
                    {helpers.isEmptyObj(sch.schema) === undefined && helpers.isEmptyObj(meta) === true && meta.is_used === 'true' ? <button type="button" className="btn" onClick={e=> helpers.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api3", this.state.select.subject), this.onCancel)} role="api3">삭제</button>:<></>}
                    <button type="button" className="btn" onClick={(e)=>this.view(e, 'history', topic_name)} disabled={helpers.isEmptyObj(meta) ? true:false}>이력</button>
                </div>
            </div>
        )
    }
}

export default withRouter(Metadetail)