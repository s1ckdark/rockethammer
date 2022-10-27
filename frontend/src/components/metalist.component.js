import React, { Component} from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthService from "../services/auth.service";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import helpers from "./helpers.component";
import { withRouter } from "./withRouter.component";

class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{
              totalcnt:0,
              current:0,
              pageSize:5,
              list:[]
          },
          schemas:{},
          keyword:'',
          select:{
            idx:'',
            topic_name:"",
            subject:"",
            schema: false
          },
          type:'list',
          detail:{},
          changed:{
              before:'',
              after:''
          },
          delete:{}
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.detailView = this.detailView.bind(this);
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/meta/list/'+pageNumber)
        this.fetchData(pageNumber-1)
    }

    componentDidMount(){
        console.log("metaview",this.props);
        this.fetchData(0);
    }

    useConfirm = (e, message, onConfirm, onCancel) => {
        e.preventDefault()
        if(window.confirm(message)) {
            onConfirm();
        } else {
            onCancel();
        }
    }

    onDel = async (typeofapi, topic_name) => {
        console.log(typeofapi, topic_name);
        let url, url2;
        switch(typeofapi){
            case 'api1':
                url = process.env.REACT_APP_API+"/meta/delete";
                break;
            case 'api2':
                url = [process.env.REACT_APP_API+"/meta/delete",  process.env.REACT_APP_API+"/schema/delete"];
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

        await axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:this.state.detail.topic_name, reg_dt:(new Date).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
        localStorage.removeItem('type');
        localStorage.removeItem('data');
        // alert("삭제가 완료되었습니다");
        // setTimeout(() => {
        //     window.location.reload(false);
        // }, 1000)
    }

    fetchData = async(page) => {
        console.log("page",page, this.state.type)
        if(this.state.type ==='list'){
        await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
            .then(res => {
                console.log(res)
              this.setState({
                ...this.state,
                list:'list',
                data: res.data,
              })
            })
        } else if(this.state.type ==='search'){
            await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword, size:5,page:page})
            .then(res => {
                this.setState({
                ...this.state,
                list:'search',
                data:res.data,
                })
            })
        }
    }

    onChangeKeyword = (e,index) =>{
        this.setState({
            ...this.state,
            keyword:e.target.value
        })
    }

    onMetaSearch = async(e)=> {
        e.preventDefault();
        if(this.state.keyword.length !=null){
            await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
            .then(res => {
                console.log(res);
                this.setState({
                ...this.state,
                type:'search',
                meta:res.data
                })
            })
        }
    }

    write = (e, type, topic_name)=> {
        e.preventDefault();
        this.props.router.navigate('/meta/write/'+topic_name, {state:{data:this.state.data.list[this.state.select.idx],type:type,schemas:this.state.schemas}})
    }

    view = (e, type, topic_name, currentPage = 1) => {
        let url = type ==='history' ? 'history/list/'+topic_name+'/'+currentPage : type+'/'+topic_name
        this.props.router.navigate('/meta/view/'+url, type !== 'history' ? {state:{data:this.state.data.list[this.state.select.idx],type:type,schemas:this.state.schemas}}:{state:{}})
    }

    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }

    detailView = (e, idx, topic_name, changed) => {
        e.preventDefault();
        if(topic_name) {
            const tn = topic_name.replace(/(-value|-key)/g, "");
            const schema = JSON.parse(this.state.data.list[idx].schema)
            const meta_join = JSON.parse(this.state.data.list[idx].meta_join) || {}

            if(meta_join != null > 0) {
                axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:tn}).then(res => {
                    this.setState({
                        ...this.state,
                        schema:schema,
                        detail:meta_join,
                        delete:meta_join,
                        history:res.data,
                        select:{
                            idx:idx,
                            topic_name:tn,
                            subject:topic_name,
                            changed:changed
                        }
                    })
                })
            } else {
                this.setState({
                    ...this.state,
                    schema:{},
                    select:{
                        idx:idx,
                        topic_name:tn,
                        subject:topic_name,
                        changed:changed
                    },
                    detail:{
                        schema_id:'',
                        revision:'',
                        last_mod_id:'',
                        last_mod_dt:''
                    },
                    delete:{},
                    history:{}
                })
            }
        }
    }

    notiforchange = async (e, index, topic_name) => {
        e.preventDefault();
        //schemas의 before, after를 api call로 가져와야한다.
        // api call limit(2), sort(reg_dt, -1)
        const meta_join = JSON.parse(this.state.data.list[index].meta_join)
        const schema = JSON.parse(this.state.data.list[index].schema)

        const tn = topic_name.replace(/(-value|-key)/g, "");
        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(res => {
            if(res.data.length > 1) {
                let temp = [];
                res.data.map((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
                })
                this.setState({
                    ...this.state,
                    changed:{
                        ...this.state.changed,
                        before: temp[1],
                        after: temp[0]
                    },
                    detail:JSON.parse(this.state.data.list[index].meta_join),
                    select:{
                        idx: index,
                        topic_name: topic_name,
                        subject: tn,
                        changed: this.changed(meta_join, schema)
                    }
                })
            }
        })

        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            console.log(res.data);
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data})
            } else {
                this.setState({...this.state, schema:{}})
            }
        })
    }

    tooltip = (e, action) => {
        e.preventDefault();
        const tooltip = e.target.querySelector('span');
        if(tooltip) {
            console.log(action, tooltip);
            tooltip.classList.toggle("visible")
        }
    }

    changed = (meta_join, schema) => {
        return meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? true : false
    }

    render(){
        const { data } = this.state;
        const { detail } = this.state;
        const topic_name = this.state.select.subject.replace(/(-value|-key)/g, "");
        console.log(this.props);
        return (
            <>
                <div className="metalist">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">Meta</a></li>
                            <li class="breadcrumb-item active" aria-current="page">List</li>
                        </ol>
                    </nav>
                    <div className="find mx-auto my-5 text-center d-block">
                        <div className="d-flex justify-content-center col-md-12 mx-auto">
                            <input className="search px-3 col-md-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
                            <button type="button" className="btn btn-danger col-md-1 ms-1 searchbtn" onClick={e=>this.onMetaSearch(e)}>토픽 검색</button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around">
                        <div className="schemaList col-md-9 my-5 transition">
                            <table className="table-list table table-hover table-striped">
                                <thead className="thead-light">
                                    <tr className="text-center p-3">
                                        <th scope="col" className="col-md-1">번호</th>
                                        <th scope="col" className="col-md-6">토픽명</th>
                                        <th scope="col" className="col-md-3">등록일시</th>
                                        <th scope="col" className="col-md-1" data-tooltip="물리 스키마 변경 여부입니다. 값이 Y 이면 등록되어 있는 물리 스키마 버전이 최신이 아니므로 변경 등록 해주세요!">변경(물리)<span className="info-icon">&#x24D8;</span></th>
                                        <th scope="col" className="col-md-1" data-tooltip="물리 스키마 삭제 여부입니다. 값이 Y 이면 물리 스키마 삭제된 상태이므로 논리 메타를 삭제해주세요!">삭제(물리)<span className="info-icon">&#x24D8;</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                            {data && data.list && data.list.length > 0 ? data.list.map((item,index) => {
                                var schema = JSON.parse(item.schema), meta_join = item.meta_join !=='undefined' ? JSON.parse(item.meta_join):null;
                                return(
                                        <tr data-index={index} scope="row" className={this.state.select.idx === index ? "table-active text-center":"text-center"} key={5*parseInt(data.current)+index+1}>
                                            <th scope="row">{5*parseInt(data.current)+index+1}</th>
                                            <td className="value-subject value form-group clickable" onClick={(e)=>this.detailView(e, index, schema.subject, this.changed(meta_join, schema))}>
                                                {schema.subject.replace(/(-value|-key)/g, "")}
                                            </td>
                                            <td className="value-id value form-group">
                                                {helpers.krDateTime(schema.reg_dt).substring(0,19)}
                                            </td>
                                            <td className="modified value">{this.changed(meta_join, schema) ? <span className="clickable" onClick={(e)=> this.notiforchange(e, index, schema.subject)}>Y</span> : <span>N</span>}</td>
                                            <td className="value-id value form-group">
                                                {schema.schema ? <span>N</span>:<span>Y</span> }
                                            </td>
                                        </tr>
                                    );
                                }): <tr><td colSpan="5"><h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3></td></tr>
                                }
                                </tbody>
                            </table>
                            <div className="paging text-center mx-auto py-2">
                                <Pagination
                                    activePage={data.current+1}
                                    itemsCountPerPage={data.size}
                                    totalItemsCount={data.count}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                    itemClass="page-item"
                                    activeLinkClass="page-active"
                                    linkClass="page-link"
                                    innerClass="pagination d-flex justify-content-center"
                            />
                            </div>
                        </div>
                        <div className="detailview col-md-3 p-5 ms-3 my-3 border-left bg-light">
                            <div className="detail">
                                <div className="info-group mb-4">
                                    <label>토픽명</label>
                                    <h3>{this.state.select.subject !== '' ? this.state.select.subject.replace(/(-value|-key)/g, ""):"토픽 이름입니다"}</h3>
                                </div>
                                    <div className="info-group schema_id">
                                        <label className="me-2">물리 스키마 버전</label>
                                        <p>{this.state.detail.is_used && this.state.detail.schema_id ? this.state.detail.schema_id : "물리 스키마 버전입니다"}</p>
                                    </div>
                                    <div className="info-group revision">
                                        <label className="me-2">논리 스키마 버전</label>
                                        <p>{this.state.detail.is_used && this.state.detail.revision ? this.state.detail.revision : "메타 수정 버전입니다"}</p>
                                    </div>
                                    <div className="info-group last_mod_id">
                                        <label className="me-2">마지막 수정자</label>
                                        <p>{this.state.detail.is_used && this.state.detail.last_mod_id ?this.state.detail.last_mod_id:"마지막 수정한 ID입니다" }</p>
                                    </div>
                                    <div className="info-group last_mod_dt">
                                        <label className="me-2">마지막 수정 일시</label>
                                        <p>{this.state.detail.is_used && this.state.detail.last_mod_dt ? helpers.krDateTime(this.state.detail.last_mod_dt) : "최종수정시각입니다"}</p>
                                    </div>
                                {this.state.select.subject ?
                                <div className="d-flex">
                                    <button type="button" className="btn btn-success me-1" onClick={e=>this.view(e, 'json', topic_name)} disabled={Object.keys(this.state.detail).length > 0 ? false:true}>조회</button>
                                    {Object.keys(this.state.detail).length  > 0 ? <button type="button" className="btn btn-info me-1" onClick={e=>this.write(e,"update", topic_name)}>수정</button>:<button type="button" className="btn btn-primary me-1" onClick={e=>this.write(e,"reg", topic_name)}  disabled={JSON.parse(data['list'][this.state.select.idx].schema).schema ? false:true}>등록</button>}
                                    {JSON.parse(data['list'][this.state.select.idx].schema).schema && this.state.detail.is_used ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api1", this.state.select.topic_name), this.onCancel)} role="api1" disabled={Object.keys(this.state.detail).length > 0 ? false:true}>삭제</button>:<></>}
                                    {!JSON.parse(data['list'][this.state.select.idx].schema).schema && !this.state.detail.is_used ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api2", this.state.select.topic_name), this.onCancel)} role="api2">삭제</button>:<></>}
                                    {!JSON.parse(data['list'][this.state.select.idx].schema).schema && !this.state.detail.is_used ? <button type="button" className="btn btn-secondary me-1" onClick={e=> this.useConfirm(e, "정말 삭제하시겠습니까?", this.onDel.bind(this, "api3", this.state.select.subject), this.onCancel)} role="api3">삭제</button>:<></>}
                                    <button type="button" className="btn btn-danger searchbtn" onClick={(e)=>this.view(e, 'history', topic_name)} disabled={Object.keys(this.state.detail).length > 0 ? false:true}>이력</button>
                                </div>
                                :<></>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default withRouter(Metalist)