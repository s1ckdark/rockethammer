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
import helpers from "../common/helpers";
import { withRouter } from "../common/withRouter";
import Detail from "./metadetail.component";

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
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/meta/list/'+pageNumber)
        this.fetchData(pageNumber-1)
    }

    componentDidMount(){
        console.log("metaview",this.props);
        this.fetchData();
    }

    fetchData = async(page = 0, type = 'list') => {
        console.log(page, type)
        const url = type === 'list' ? "/schema/getallschema" : "/schema/search"
        await axios.post(process.env.REACT_APP_API+url, {keyword:this.state.keyword,size:5,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                list:'list',
                data: res.data,
              })
            })
    }

    onChangeKeyword = (e,index) =>{
        this.setState({
            ...this.state,
            keyword:e.target.value
        })
    }

    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }


    // detailView = (e, idx, topic_name, changed) => {
    //     e.preventDefault();
    //     if(topic_name) {
    //         const tn = topic_name.replace(/(-value|-key)/g, "");
    //         const schema = JSON.parse(this.state.data.list[idx].schema)
    //         const meta_join = JSON.parse(this.state.data.list[idx].meta_join) || {}
    //         if(meta_join.is_used === 'true') {
    //                 this.setState({
    //                     ...this.state,
    //                     detail:meta_join,
    //                     delete:meta_join,
    //                     select:{
    //                         idx:idx,
    //                         topic_name:tn,
    //                         subject:topic_name,
    //                         changed:changed
    //                     }
    //                 })
    //         } else {
    //             this.setState({
    //                 ...this.state,
    //                 select:{
    //                     idx:idx,
    //                     topic_name:tn,
    //                     subject:topic_name,
    //                     changed:changed
    //                 },
    //                 detail:{
    //                     schema_id:'',
    //                     revision:'',
    //                     last_mod_id:'',
    //                     last_mod_dt:''
    //                 },
    //                 delete:{},
    //             })
    //         }
    //     }
    // }

    notiforchange = async (e, index, topic_name) => {
        e.preventDefault();
        const temp = typeof(this.state.select.idx) === 'number' ? this.state.data['list'][this.state.select.idx]: null
        console.log(temp)
        // this.props.router.navigate('/meta/changed/'+topic_name, temp)
        // const meta_join = JSON.parse(this.state.data.list[index].meta_join)
        // const schema = JSON.parse(this.state.data.list[index].schema)
        // const tn = topic_name.replace(/(-value|-key)/g, "");

        // await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(res => {
        //     if(res.data.length > 1) {
        //         let temp = [];
        //         res.data.map((item,index) => {
        //             temp[index] = item;
        //             temp[index]['schema']= JSON.parse(item.schema);
        //         })
        //         this.setState({
        //             ...this.state,
        //             changed:{
        //                 ...this.state.changed,
        //                 before: temp[1],
        //                 after: temp[0]
        //             },
        //             detail:JSON.parse(this.state.data.list[index].meta_join),
        //             select:{
        //                 idx: index,
        //                 topic_name: topic_name,
        //                 subject: tn,
        //                 changed: this.changed(meta_join, schema)
        //             }
        //         })
        //     }
        // })

        // axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
        //     console.log(res.data);
        //     if(res.data && res.data.value.length > 0) {
        //         this.setState({...this.state, schema:res.data})
        //     } else {
        //         this.setState({...this.state, schema:{}})
        //     }
        // })
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
        const { topic_name, idx } = this.state.select;
        console.log(topic_name, idx);
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
                            <button type="button" className="btn btn-danger col-md-1 ms-1 searchbtn" onClick={e=>this.fetchData(0, 'search')}>토픽 검색</button>
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
                                                {helpers.schemaTime(schema.reg_dt)}
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
                            <Detail info={typeof(this.state.select.idx) === 'number' ? data['list'][this.state.select.idx]: null}></Detail>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default withRouter(Metalist)