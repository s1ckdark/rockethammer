import React, { Component} from "react";
import axios from 'axios';
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
          search:{
            status: false,
            keyword: '',
            startDate: '',
            endData: '',
            last_mod_id:'',
            deleted: false,
            changed: false
          },
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
        // this.fetchMetaData = this.fetchMetaData.bind(this);
    }

    // pagination
    handlePageChange(pageNumber) {
        // console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/meta/'+pageNumber)
        this.fetchData(pageNumber-1)
        this.setState({
            ...this.state,
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

    // meta data를 가져온다
    fetchData = async(page = 0, type = 'list') => {
        const url = type === 'list' ? "/schema/getallschema" : "/schema/search"
        const param = type === 'list' ? {"page":page}:this.state.search
        await axios.post(process.env.REACT_APP_API+url, param)
            .then(res => {
                let tempObj;
                console.log(res)
                if(res.status === 200 && res.data.list && res.data.list.length > 0 ) {
                // if(res.data.length);
            tempObj = JSON.parse(JSON.stringify(res.data));
              const {topic} = tempObj
              tempObj.list.forEach( (item, index) => {
                tempObj['list'][index]['schema']['wipeout'] =  topic.find( x => x === item.schema.subject.replace(/(-value|-key)/g, "")) ? true : false
              })
            } else {
                tempObj = {
                    list:[]
                }
            }
            console.log(tempObj)
              this.setState({
                ...this.state,
                list:'list',
                data: tempObj,
                userReady:true,
                select:{
                    idx:'',
                    topic_name:"",
                    subject:"",
                    schema: false
                  }
              })

            })
    }

    onChangeSearch = (e,index) =>{
        this.setState({
            ...this.state,
            search:{
                ...this.state.search,
                [e.target.name]: e.target.value
            }
            })
    }

    // 리스트상에 row를 눌렀을때 detailview에 나오는 스키마의 데이터를 정의한다
    detailView = async (idx, topic_name, changed) => {
        // e.preventDefault();
        if(topic_name) {
            const tn = topic_name.replace(/(-value|-key)/g, "");
            // const meta_join = await this.fetchMetaData(tn) || {}
            const meta_join = this.state.data.list[idx].meta_join || {}
            // console.log(meta_join)
            if(meta_join && meta_join.is_used === 'true') {
                    this.setState({
                        ...this.state,
                        // meta:meta_join,
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
                    // meta:{},
                    delete:{},
                    userReady: true
                })
            }
        }
    }

    changing = async (e, index, topic_name) => {
        e.preventDefault();
        // const temp = index ? this.state.data['list'][index]: null
        // const meta_join = JSON.parse(this.state.data.list[index].meta_join)
        // const schema = JSON.parse(this.state.data.list[index].schema)
        const tn = topic_name.replace(/(-value|-key)/g, "");

        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(res => {
            if(res.data.length > 1) {
                let temp = [];
                res.data.forEach((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
                })
                console.log(temp)
                this.props.router.navigate('/meta/view/changed/'+tn, {state:{data:temp, type:'changed'}})
            }
        })
    }

    // 리스트 상단의 목록 이름에 대한 설명을 처리한다
    tooltip = (e, action) => {
        e.preventDefault();
        const tooltip = e.target.querySelector('span');
        if(tooltip) {
            console.log(action, tooltip);
            tooltip.classList.toggle("visible")
        }
    }

    getData = () => {
        // const { idx, topic_name, changed } = this.state.select;

        const currentPage = this.state.data.current;
        console.log("currentPage",currentPage);
        this.fetchData(currentPage);

    };

    // changed = (meta_join, schema) => {
    //     return meta_join && meta_join.is_used ==='true' && schema.version > meta_join.schema_version ? true : false
    // }

    advanced = (e) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            search:{
                ...this.state.search,
                status: !this.state.search.status
            }
        })

    }

    render(){
        const { data, userReady } = this.state;
        const { topic_name, idx } = this.state.select;
        if(userReady){
        return (
            <>
                <div className="meta" key={this.state.time}>
                    <div className="page-header list">
                        <Breadcrumb/>
                        <div className="search-bar">
                            <div className={!this.state.search.status ? "normal-search-bar":"normal-search-bar d-none"}>
                                <div className="input-group">
                                    <input className="input-search" name="keyword" value={this.state.search.keyword} onChange = {this.onChangeSearch} placeholder="검색 할 토픽명을 입력하세요"/>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-search" onClick={e=>this.fetchData(0, 'search')}><span className="questionIcon"></span>토픽 검색</button>
                                    <button type="button" className="btn btn-advanced" onClick={this.advanced}>상세 검색</button>
                                </div>
                            </div>
                            <div className={this.state.search.status ? "advanced-search-bar":"advanced-search-bar d-none"}>
                                <div className="input-group">
                                    <input className="input-keyword" type="text" name="keyword" value={this.state.search.keyword} onChange = {this.onChangeSearch} placeholder="검색 할 토픽명을 입력하세요"/>
                                    <input className="input-startdate" type="date" name="startDate" value={this.state.search.startDate} onChange = {this.onChangeSearch} placeholder="등록일자 시작 날짜"/>
                                    <input className="input-enddate" type="date" name="endDate" value={this.state.search.endDate} onChange = {this.onChangeSearch} placeholder="등록일자 끝 날짜"/>
                                    <input className="input-last_mod_id" type="text" name="last_mod_id" value={this.state.search.last_mod_id} onChange = {this.onChangeSearch} placeholder="등록자 id"/>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-advanced open" onClick={e=>this.fetchData(0, 'search')}><span className="questionIcon"></span>상세 검색</button>
                                    <button type="button" className="btn btn-cancel" onClick={this.advanced}>일반 검색</button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="listing">
                        <div className="inner">
                            <table className="table-list">
                                <thead className="thead-light">
                                    <tr className="text-center p-3">
                                        <th scope="col" className="col-md-1">번호</th>
                                        <th scope="col" className="col-md-4">토픽명</th>
                                        <th scope="col" className="col-md-1">등록자</th>
                                        <th scope="col" className="col-md-2">물리등록일시</th>
                                        <th scope="col" className="col-md-1" data-tooltip="물리 스키마 변경 여부입니다. 값이 Y 이면 등록되어 있는 물리 스키마 버전이 최신이 아니므로 변경 등록 해주세요!">물리변경<span className="info-icon">&#x24D8;</span></th>
                                        <th scope="col" className="col-md-1" data-tooltip="물리 스키마 삭제 여부입니다. 값이 Y 이면 물리 스키마 삭제된 상태이므로 논리 메타를 삭제해주세요!">물리삭제<span className="info-icon">&#x24D8;</span></th>
                                        <th scope="col" className="col-md-1" data-tooltip="논리 스키마 삭제 여부입니다. 값이 Y 이면 논리 스키마 삭제된 상태이므로 논리 메타를 삭제해주세요!">토픽삭제<span className="info-icon">&#x24D8;</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                            {data && data.list && data.list.length > 0 ? data.list.map((item,index) => {
                                var {schema, meta_join, changed } = item;
                                // var meta_join = item.meta_join !=='undefined' ? item.meta_join:{}
                                return(
                                        <tr data-index={index} className={idx === index ? "table-active":"text-center"} key={schema._id}>
                                            <th scope="row">{data.count - (data.size * data.current) - index}</th>
                                            <td className="value-subject value form-group clickable" onClick={(e)=>this.detailView(index, schema.subject, changed)}>
                                                {schema.subject.replace(/(-value|-key)/g, "")}
                                            </td>
                                            <td className="value-id value form-group">
                                                {helpers.isEmptyObj(meta_join) === false && JSON.parse(meta_join.is_used) ? meta_join.last_mod_id : "-"}
                                            </td>
                                            <td className="value-id value form-group">
                                                {helpers.schemaTime(schema.reg_dt)}
                                            </td>
                                            {/* <td className="modified value">{this.changed(meta_join, schema) ? <span className="clickable" onClick={(e)=> this.changing(e, index, schema.subject,item, schema, meta_join)}>Y</span> : <span>N</span>}</td> */}
                                            <td className="modified value">{changed ? <span className="clickable" onClick={(e)=> this.changing(e, index, schema.subject,item, schema, meta_join)}>Y</span> : <span>N</span>}</td>
                                            <td className="value-id value form-group">
                                                {schema.schema ? <span>N</span>:<span className="clickable">Y</span> }
                                            </td>
                                            <td className="value-id value form-group">
                                                {schema.wipeout ? <span>N</span>:<span className="clickable">Y</span> }
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
                            <Detail getData={this.getData} key={this.state.time} topic={topic_name} data={typeof(idx) === 'number' ? data['list'][idx]: null}></Detail>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    }
}
export default withRouter(Metalist)