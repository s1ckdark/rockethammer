import React, { Component} from "react";
import axios from 'axios';
import AuthService from "../../services/auth.service";

import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Dialog from "../dialog.component";

class Metadetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          delete:{},
          message:'',
          messageType:''
        };
    }

    // 메타 등록
    write = (e, type, topic_name)=> {
        e.preventDefault();
        let tmp = this.props.data
        tmp.type = type
        tmp.topic_name = topic_name

        this.props.router.navigate('/meta/'+type+'/'+topic_name, {state:tmp})
    }


    // meta의 detail이나 history를 조회
    view = (e, type, topic_name, currentPage = 1) => {
        let url = type ==='history' ? 'history/list/'+topic_name+'/'+currentPage : 'view/'+type+'/'+topic_name
        this.props.router.navigate('/meta/'+url, type !== 'history' ? {state:this.props.data}:{state:{}})
    }

    // 케이스별로 삭제룰 진행한다
    onDel = async (typeofapi, topic_name) => {
        console.log("typeofapi:",typeofapi, "topic_name:",topic_name);
        let url, type = typeofapi === 'api1' ? "logical":"physical"
        console.log(typeofapi)
        switch(typeofapi){
            case 'api1':
                url = process.env.REACT_APP_API+"/meta/delete";
                axios.post(url, {keyword:topic_name,last_mod_dt:new Date().toISOString()}).then(res => console.log(res))
                break;
            case 'api3':
                url = [process.env.REACT_APP_API+"/meta/delete", process.env.REACT_APP_API+"/schema/delete"];
                try {
                Promise.all(url.map(async (endpoint) => await axios.post(endpoint, {keyword:topic_name}))).then((response1, response2) => {
                    console.log(response1, response2)
                })
                } catch(err) {
                    console.log("error", err);
                }
                break;
            case 'api2':
                url = process.env.REACT_APP_API+"/schema/delete";
                axios.post(url, {keyword:topic_name}).then(res => console.log(res))
                break;
            default:
                console.log("typeofapi",typeofapi);

        }


        await axios.post(process.env.REACT_APP_API+"/history/inserthistory", {topic_name:topic_name.replace(/(-value|-key)/g, ""), last_mod_dt:(new Date()).toISOString(),last_mod_id:AuthService.getCurrentUser().userid,before:JSON.stringify(this.props.data.meta_join), after:JSON.stringify({})})
        this.setState({
            ...this.state,
            message:"삭제가 완료되었습니다",
            messageType:"alert"
        })
        // axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:topic_name.replace(/(-value|-key)/g, ""), type:type, reg_dt:(new Date()).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
        // this.setState({
        //     ...this.state,
        //     message:"삭제가 완료되었습니다",
        //     messageType:"alert"
        // })
        // setTimeout(() => {
        this.props.getData()
        // }, 1000)
    }

    // 스키마의 버전이 다른 새로운 스키마가 들어와서 새로 등록한 메타가 있음을 알려준다
    changing = async (e, topic_name, schema, meta_join) => {
        e.preventDefault();
        const tn = topic_name.replace(/(-value|-key)/g, "");

        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(res => {
            if(res.data.length > 1) {
                let temp = [];
                res.data.forEach((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
            })
            this.props.router.navigate('/meta/view/changed/'+tn, {state:{data:temp,schema:schema,meta:meta_join, type:'changed'}})
        }})
    }

    // detail 화면에 나오는 버튼을 정의한다
    detailBtn = (topic_name, sch, meta, meta_history, changed) => {
        const sc = helpers.isEmptyObj(sch.schema)
        const td = sch.wipeout
        const me = helpers.isEmptyObj(meta)
        const mi = me ? false:JSON.parse(meta.is_used)
        const ch = this.changed(meta, sch);
        const hi = meta_history.length > 0 ? true : false;
        // console.log(helpers.isEmptyObj(sch.schema), sc)
        // console.log(ch, sc)
        const cond = [sc, me]
        let typeofapi = "api3";
        function arrayEquals(a, b){
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

        if(arrayEquals(cond, [false, false]) === true) typeofapi = "api1"
        // if(arrayEquals(cond, [false, true]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [true, true]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [undefined, true]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [undefined, false]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [true, false]) === true) typeofapi = "api2"
        // if(arrayEquals(cond, [true, false]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [true, false]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [null, true]) === true) typeofapi = "api3"
        // if(arrayEquals(cond, [null, false]) === true) typeofapi = "api3"
        // if(td === false) typeofapi = "api2"


        console.log("sc:",sc, "me:",me, "mi:",mi, "ch:",ch, "hi:",hi,"td:",td, "api:",typeofapi)
        return (
            <>
                {ch === true && sc === false && td === true ? <button type="button" className="btn btn-changed" onClick={(e)=> this.changing(e, sch.subject, sch, meta)}>변경 등록</button>:<></>}
                <button type="button" className="btn" onClick={e=>this.view(e, "json", topic_name)} disabled={me === false && mi === true ? false:true}>조회</button>
                {sc === false && me === false && mi === true && td === true ?
                <button type="button" className="btn" onClick={e=>this.write(e,"update", topic_name)} disabled={ch !== false && sc === false ? true:false}>수정</button>:
                <button type="button" className="btn " onClick={e=>this.write(e,"reg", topic_name)} disabled={sc !== false|| td === false ? true:false}>등록</button>}
                <button type="button" className="btn btn-delete" onClick={e=> this.callAction(e, "confirm", "정말 삭제하시겠습니까?",typeofapi, sch.subject)} role={typeofapi} disabled={sc != false || mi === true  || td === false ? false:true} role={typeofapi}>삭제</button>
                <button type="button" className="btn btn-history" onClick={(e)=>this.view(e, "history", topic_name)} disabled={ hi ? false:true}>이력</button>

            </>
        )

    }

    // 스키마의 버전이 다른 새로운 스키마가 들어와서 새로 등록한 메타가 있음을 알려준다
    changed = (meta_join, schema) => {
        // console.log(schema.version, meta_join.schema_version)
        return meta_join && schema.version > meta_join.schema_version ? true : false
    }


    callAction = (e, type, msg, typeofapi, subject) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            messageType:type,
            message:msg,
            delete:{
                typeofapi:typeofapi,
                subject:subject
            }
        })
    }

    dialogCallback = (act) => {
        const {typeofapi, subject } = this.state.delete;
        // console.log(typeofapi, subject)
        switch (act){
          case 'yes':
            this.onDel(typeofapi, subject)
                    // this.props.getData()
            this.setState({...this.state,message:''})
          break;

          case 'no':
            this.setState({...this.state,message:''})
          break;

          case 'close':
            this.setState({
              ...this.state,
              message: ""
            })
          break;
          default:
            console.log("dialogCallback")
        }
      }

    render(){
        console.log(this.props.data)
        if(this.props.data === null) return false;
        const { schema, changed } = this.props.data
        const meta_join = this.props.data.meta_join && this.props.data.meta_join.is_used === 'true' ? this.props.data.meta_join : {}
        const meta_history = this.props.data.meta_history ? this.props.data.meta_history : []
        const topic_name = schema.subject.replace(/(-value|-key)/g, "")
        return (
            <>
            <div className="detail-info">
                <div className="info-group topic_name">
                    <label>토픽명</label>
                    <h3>{topic_name}</h3>
                </div>
                    <div className="info-group schema_id">
                        <label className="info-label">물리 스키마 버전</label>
                        <p>{schema.version}</p>
                    </div>
                    <div className="info-group revision">
                        <label className="info-label">논리 스키마 버전</label>
                        <p>{meta_join.revision ? meta_join.revision : "-"}</p>
                    </div>
                    <div className="info-group last_mod_id">
                        <label className="info-label">마지막 수정자</label>
                        <p>{meta_join.last_mod_id ? meta_join.last_mod_id:"-" }</p>
                    </div>
                    <div className="info-group last_mod_dt">
                        <label className="info-label">마지막 수정 일시</label>
                        <p>{meta_join.last_mod_dt ? helpers.krDateTime(meta_join.last_mod_dt) : "-"}</p>
                    </div>
                <div className="btn-group">
                    {this.detailBtn(topic_name,schema,meta_join, meta_history, changed)}
                </div>
            </div>
            {this.state.message && (
            <Dialog type={this.state.messageType} callback={this.dialogCallback} message={this.state.message}/>
          )}
            </>
        )
    }
}

export default withRouter(Metadetail)