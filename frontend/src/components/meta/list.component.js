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
import Detail from "./detail.component";
import Breadcrumb from "../breadcrumb.component";

class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{
              pageCount:0,
              current:0,
              size:5,
              count:0,
              list:[]
          },
          schemas:{},
          meta:{},
          keyword:'',
          select:{
            idx:'',
            topic_name:"",
            subject:"",
            schema: false
          },
          type:'list',
          changed:{
              before:'',
              after:''
          },
          delete:{},
          userReady:false,
          time:''
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchMetaData = this.fetchMetaData.bind(this);
    }

    handlePageChange(pageNumber) {
        // console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/meta/'+pageNumber)
        this.fetchData(pageNumber-1)
        this.setState({
            ...this.state,
            meta:{},
            select:{
                idx:'',
                topic_name:"",
                subject:"",
                schema: false
            }
        })
    }

    componentDidMount(){
        // console.log("metaview",this.props);
        const currentPage = this.props.router.params.currentPage || 1
        this.fetchData(currentPage-1);
    }

    fetchData = async(page = 0, type = 'list') => {
        const url = type === 'list' ? "/schema/getallschema" : "/schema/search"
        await axios.post(process.env.REACT_APP_API+url, {keyword:this.state.keyword,size:10,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                list:'list',
                data: res.data,
                userReady:true
              })
            })
    }

    onChangeKeyword = (e,index) =>{
        this.setState({
            ...this.state,
            keyword:e.target.value
        })
    }

    fetchMetaData = async(tn) => {
        try {
        const temp =  await axios.post(process.env.REACT_APP_API+"/meta/getmeta", {keyword:tn})
        this.setState({
            meta:temp.data[0]
        })
        return temp.data[0]
        } catch(err) {
            console.log("Err =>", err)
        }
    }
    detailView = async (idx, topic_name, changed) => {
        // e.preventDefault();
        if(topic_name) {
            const tn = topic_name.replace(/(-value|-key)/g, "");
            const schema = JSON.parse(this.state.data.list[idx].schema)
            const meta_join = await this.fetchMetaData(tn) || {}
            // const meta_join = JSON.parse(this.state.data.list[idx].meta_join) || {}
            // console.log(meta_join)
            if(meta_join && meta_join.is_used === 'true') {
                    this.setState({
                        ...this.state,
                        meta:meta_join,
                        delete:meta_join,
                        select:{
                            idx:idx,
                            topic_name:tn,
                            subject:topic_name,
                            changed:changed
                        },
                        userReady: true
                    })
            } else {
                this.setState({
                    ...this.state,
                    select:{
                        idx:idx,
                        topic_name:tn,
                        subject:topic_name,
                        changed:changed
                    },
                    meta:{},
                    delete:{},
                    userReady: true
                })
            }
        }
    }

    changing = async (e, index, topic_name) => {
        e.preventDefault();
        const temp = index ? this.state.data['list'][index]: null
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
                this.props.router.navigate('/meta/view/changed/'+tn, {state:{data:temp, type:'changed'}})
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
    getTime = () => {
        const {idx, topic_name,changed} = this.state.select;
        console.log("gettime")
        this.detailView(idx,topic_name, changed)
        this.setState({
            ...this.state,
            time:new Date().getTime,
            select:{
                idx:'',
                topic_name:'',
                subject:'',
                changed:''
            },
            meta:{},
            userReady:false
        })
    }

    changed = (meta_join, schema) => {
        return meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? true : false
    }

    render(){
        const { data, meta, userReady } = this.state;
        const { topic_name, idx } = this.state.select;
        if(userReady){
        return (
            <>
                <div className="meta" key={this.state.time}>
                    <div className="page-header list">
                        <Breadcrumb/>
                        <div className="search-bar">
                                <input className="input-search" name="search" value={this.state.search} onChange = {this.onChangeKeyword} placeholder="검색 할 토픽명을 입력하세요"/>
                                <button type="button" className="btn btn-search" onClick={e=>this.fetchData(0, 'search')}><span className="questionIcon"></span>토픽 검색</button>
                        </div>
                    </div>
                    <div className="listing">
                        <div className="inner">
                            <table className="table-list">
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
                                        <tr data-index={index} scope="row" className={this.state.select.idx === index ? "table-active":"text-center"} key={schema._id.$oid}>
                                            <td scope="row">{5*parseInt(data.current)+index+1}</td>
                                            <td className="value-subject value form-group clickable" onClick={(e)=>this.detailView(index, schema.subject, this.changed(meta_join, schema))}>
                                                {schema.subject.replace(/(-value|-key)/g, "")}
                                            </td>
                                            <td className="value-id value form-group">
                                                {helpers.schemaTime(schema.reg_dt)}
                                            </td>
                                            <td className="modified value">{this.changed(meta_join, schema) ? <span className="clickable" onClick={(e)=> this.changing(e, index, schema.subject,item, schema, meta_join)}>Y</span> : <span>N</span>}</td>
                                            <td className="value-id value form-group">
                                                {schema.schema ? <span>N</span>:<span>Y</span> }
                                            </td>
                                        </tr>
                                    );
                                }): <tr><td colSpan="5"><h3 className="emptyData">검색된 meta data가 없습니다</h3></td></tr>
                                }
                                </tbody>
                            </table>
                            <div className="paging">
                                <Pagination
                                    activePage={data.current+1}
                                    itemsCountPerPage={data.size}
                                    totalItemsCount={data.count}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                    itemClass="page-item"
                                    activeLinkClass="page-active"
                                    linkClass="page-link"
                                    innerClass="pagination"
                            />
                            </div>
                        </div>
                        <div className="detailview">
                            <Detail getTime={this.getTime} key={this.state.time} topic={this.state.select.topic_name} data={typeof(this.state.select.idx) === 'number' ? data['list'][this.state.select.idx]: null} meta={meta}></Detail>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    }
}
export default withRouter(Metalist)