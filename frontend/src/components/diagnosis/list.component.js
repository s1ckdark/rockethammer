import React, { Component} from "react";
import axios from 'axios';
import Pagination from "react-js-pagination";
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";

class Diaglist extends Component {
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
          search:{
            status: false,
            keyword: '',
            startDate: '',
            endData: '',
            last_mod_id:'',
            deleted: false,
            changed: false,
            filter:''
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
          time:'',
          filter:{
            "support":false,
            "incident":false,
            "document":false,
            "diag":false,
            "etc":false
          }
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        // this.fetchMetaData = this.fetchMetaData.bind(this);
    }

    // pagination
    handlePageChange(pageNumber) {
        // console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/diag/'+pageNumber)
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
        console.log(currentPage);
        this.fetchData(currentPage-1);
    }

    // meta data를 가져온다
    fetchData = async(page = 0, type = 'list') => {
        const url = type === 'list' ? "/diag/list" : "/diag/search"
        const param = type === 'list' ? {"page":page}:this.state.search
        await axios.post(process.env.REACT_APP_API+url, param)
        .then(res => {
            this.setState({
            ...this.state,
            list:'list',
            data: res.data,
            userReady:true
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
            },()=>{
                if(e.target.name === 'tag') this.fetchData(0,"search")
            })
    }

    getData = () => {
        // const { idx, topic_name, changed } = this.state.select;
        const currentPage = this.state.data.current;
        console.log("currentPage",currentPage);
        this.fetchData(currentPage);
    };

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

    view = (e, _id, item) => {
        e.preventDefault();
        this.props.router.navigate("/diag/view/"+encodeURIComponent(_id),  {state:{data:item, _id:_id}})
    }
    render(){
        const { data, userReady, filter } = this.state;
        const { idx } = this.state.select;
        if(userReady){
        return (
            <>
                <div className="diag" key={this.state.time}>
                    <div className="page-header list">
                        <Breadcrumb/>
                        <div className="search-bar">
                            <div className={!this.state.search.status ? "normal-search-bar":"normal-search-bar d-none"}>
                                <div className="input-group">
                                    <input className="input-search" name="keyword" value={this.state.search.keyword} onChange = {this.onChangeSearch} placeholder="검색 할 제목을 입력하세요"/>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-search" onClick={e=>this.fetchData(0, 'search')}><span className="questionIcon"></span>제목 검색</button>
                                    <button type="button" className="btn btn-advanced" onClick={this.advanced}>상세 검색</button>
                                </div>
                            </div>
                            <div className={this.state.search.status ? "advanced-search-bar":"advanced-search-bar d-none"}>
                                <div className="input-group">
                                    <input className="input-keyword" type="text" name="keyword" value={this.state.search.keyword} onChange = {this.onChangeSearch} placeholder="검색 할 제목을 입력하세요"/>
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
                                        <th scope="col" className="col-md-4">제목
                                        </th>
                                        <th scope="col" className="col-md-2">
                                            <select name="tag" onChange={this.onChangeSearch} value={this.state.search.tag} defaultValue={"none"}>
                                                <option value="none" disabled>태그</option>
                                                {Object.keys(filter).map(ele=> {
                                                    return (
                                                        <option value={ele}>{helpers.translate(ele)}</option>
                                                    )
                                                })}
                                            </select>
                                        </th>
                                        <th scope="col" className="col-md-2">등록자</th>
                                        <th scope="col" className="col-md-2">등록일시</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {data && data.list && data.list.length > 0 ? data.list.map((item,index) => {
                                let tmp = Object.keys(item.tag).filter(ele => item.tag[ele] === true).map(ele=>helpers.translate(ele))
                                return(
                                        <tr data-index={index} className={idx === index ? "table-active":"text-center"} key={item._id} onClick={(e)=>this.view(e, item._id, item)}>
                                            <th scope="row">{data.count - (data.size * data.current) - index}</th>
                                            <td className="value-title value form-group">
                                                {item.title}
                                            </td>
                                            <td className="value-tag value form-group">
                                                {tmp.toString()}
                                                {/* {Object.keys(item.tag).map(ele=> {
                                                    return(
                                                        <>
                                                        <input type="checkbox" checked={item.tag[ele]}/><label>{helpers.translate(ele)}</label>
                                                        </>
                                                    )
                                                    })
                                                } */}
                                            </td>
                                            <td className="value-username value form-group">
                                                {item.username}
                                            </td>
                                            <td className="value-last_mod_dt value form-group">
                                               {helpers.krDateTime(item.last_mod_dt)}
                                            </td>
                                        </tr>
                                    );
                                }): <tr><td colSpan="5"><h3 className="emptyData">검색된 data가 없습니다</h3></td></tr>
                                }
                                </tbody>
                            </table>
                            <div className="btn-group">
                                <button className="btn btn-write" onClick={()=>this.props.router.navigate("/diag/write", {state:{type:"write"}})}>쓰기</button>
                            </div>
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
                    </div>
                </div>
            </>
        );
    }
    }
}
export default withRouter(Diaglist)