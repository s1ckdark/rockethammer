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
import Modal from "../modal.component";

class Metadetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          delete:{},
          modal:false
        };
    }

    write = (e, type, topic_name)=> {
        e.preventDefault();
        this.props.router.navigate('/meta/'+type+'/'+topic_name, {state:{data:this.props.data}})
    }

    view = (e, type, topic_name, currentPage = 1) => {
        let url = type ==='history' ? 'history/list/'+topic_name+'/'+currentPage : type+'/'+topic_name
        this.props.router.navigate('/meta/view/'+url, type !== 'history' ? {state:this.props.data}:{state:{}})
    }

    onDel = async (typeofapi, topic_name) => {
        console.log(typeofapi, topic_name);
        let url

        switch(typeofapi){
            case 'api1':
                url = process.env.REACT_APP_API+"/meta/delete";
                console.log("api1")
                axios.post(url, {keyword:topic_name,last_mod_dt:new Date().toISOString()}).then(res => console.log(res))
                break;
            case 'api2':
                url = [process.env.REACT_APP_API+"/meta/delete", process.env.REACT_APP_API+"/schema/delete"];
                try {
                Promise.all(url.map(async (endpoint) => await axios.post(endpoint, {keyword:topic_name}))).then((response1, response2) => {
                    console.log(response1, response2)
                })
                } catch(err) {
                    console.log("error", err);
                }
                break;
            case 'api3':
                url = process.env.REACT_APP_API+"/schema/delete";
                axios.post(url, {keyword:topic_name}).then(res => console.log(res))
                break;
            default:
                console.log("typeofapi",typeofapi);
        }

        await axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:topic_name.replace(/(-value|-key)/g, ""), reg_dt:(new Date()).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
        alert("삭제가 완료되었습니다");
        setTimeout(() => {
            window.location.reload(false);
        }, 1000)
    }

    changing = async (e, topic_name, schema, meta_join) => {
        e.preventDefault();
        const tn = topic_name.replace(/(-value|-key)/g, "");

        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(res => {
            if(res.data.length > 1) {
                let temp = [];
                res.data.map((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
            })
            this.props.router.navigate('/meta/view/changed/'+tn, {state:{data:temp,schema:schema,meta:meta_join, type:'changed'}})
        }})
    }

    detailBtn = (topic_name, sch, meta) => {
        console.log(topic_name, sch, meta)
        console.log("schema ->",sch.schema, "meta ->",meta, "is_used ->", meta.is_used)
        const sc = helpers.isEmptyObj(sch.schema)
        const me = helpers.isEmptyObj(meta)
        const mi = meta.is_used

        const cond = [sc, me, mi]
        let typeofapi;

        function arrayEquals(a, b){
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

        if(arrayEquals(cond, [false, false, 'true']) === true) typeofapi = "api1"
        if(arrayEquals(cond, [false, true, undefined]) === true) typeofapi = "api2"
        if(arrayEquals(cond, [true, false, 'true']) === true) typeofapi = "api3"
        if(arrayEquals(cond, [true, true, undefined]) === true) typeofapi = "api3"
        if(arrayEquals(cond, [false, true, 'false']) === true) typeofapi = "api3"

        console.log(sc, me, mi)
        return (
            <>
                {this.changed(meta, sch) ? <button type="button" className="btn btn-changed" onClick={(e)=> this.changing(e, sch.subject, sch, meta)}>변경 등록</button>:<></>}
                <button type="button" className="btn" onClick={e=>this.view(e, "json", topic_name)} disabled={me === false && mi === "true" ? false:true}>조회</button>
                {sc === false && me === false && mi === 'true' ?
                    <button type="button" className="btn" onClick={e=>this.write(e,"update", topic_name)} disabled={sc === true ? true:false}>수정</button>:
                    <button type="button" className="btn " onClick={e=>this.write(e,"reg", topic_name)} disabled={sc !== false && me !== false ? true:false}>등록</button>}
                <button type="button" className="btn btn-delete" onClick={e=> helpers.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, typeofapi, sch.subject), this.onCancel)} role={typeofapi}>삭제{typeofapi}</button>
                <button type="button" className="btn btn-history" onClick={(e)=>this.view(e, "history", topic_name)} disabled={me ? true:false}>이력</button>

            </>
        )

    }
    changed = (meta_join, schema) => {
        return meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? true : false
    }

    render(){
        if(this.props.data === null) return false;
        const {changed} = this.props;
        const { schema, meta_join } = helpers.parseNested(this.props.data) || {}
        let sch = JSON.parse(schema);
        let meta = helpers.isEmptyObj(meta_join) === false && JSON.parse(meta_join).is_used === 'true' ? JSON.parse(meta_join):{}
        const topic_name = sch.subject.replace(/(-value|-key)/g, "")
        console.log("schema ->",helpers.isEmptyObj(sch.schema), "meta ->",helpers.isEmptyObj(meta), "is_used ->", meta.is_used)
        const cond = [helpers.isEmptyObj(sch.schema), helpers.isEmptyObj(meta), meta.is_used]
        return (
            <>
            <Modal open={ this.state.modal } close={ this.closeModal } title="Create a chat room">
                    {/* // Modal.js <main> { this.props.children } </main>에 내용이 입력된다. */}
                    리액트 클래스형 모달 팝업창입니다.
                    쉽게 만들 수 있어요.
                    같이 만들어봐요!
            </Modal>
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
                    {this.detailBtn(topic_name,sch,meta)}
                </div>
            </div>
            </>
        )
    }
}

export default withRouter(Metadetail)