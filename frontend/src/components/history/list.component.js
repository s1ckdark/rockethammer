import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';
import axios from 'axios';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import ReactDiffViewer from 'react-diff-viewer';
import helpers from '../../common/helpers';
import { withRouter } from "../../common/withRouter";
import BreadcrumbComponent from "../breadcrumb.component";

class Historylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                current:0,
                count:0,
                size:10,
                list:[]
            },
            idx: '',
            topic_name:this.props.router.params.topic_name,
            userReady:false
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handlePageChange(pageNumber) {
        this.props.router.navigate('/meta/history/list/'+this.state.topic_name+'/'+pageNumber)
        this.fetchData(this.state.topic_name, pageNumber-1);
      }


    fetchData = (topic_name,page=0) => {
        axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:this.state.topic_name,size:10,page:page}).then(res => {
            this.setState({
                ...this.state,
                data:res.data,
                userReady: true
            })
        })
    }

    componentDidMount(){
        const { topic_name } = this.props.router.params;
        const currentPage = this.props.router.params.currentPage || 1
        this.fetchData(topic_name, currentPage-1)
    }

    detailView = (e, idx, topic_name) => {
        e.preventDefault();
        this.props.router.navigate('/meta/history/view/'+topic_name,{state:{data:this.state.data.list[idx]}})
    }

    render(){
        const { currentPage, topic_name  } = this.props.router.params;
        const { data, userReady } = this.state;
        const { count, current, list, pageCount, size } = data;
        if(userReady) {
        return (
            <>
                <div className="meta history">
                    <div className="page-header">
                        <BreadcrumbComponent/>
                        {/* <div className="search-bar">
                            <input className="input-search" name="search" value={this.state.search} onChange = {this.onChangeKeyword} placeholder="검색 할 토픽명을 입력하세요"/>
                            <button type="button" className="btn btn-search" onClick={e=>this.fetchData(0, 'search')}>토픽 검색</button>
                        </div> */}
                    </div>
                    <div className="listing">
                        <div className="schema-list">
                            <table className="table-list">
                                <thead>
                                    <tr className="">
                                        <th scope="col">번호</th>
                                        <th scope="col">토픽명</th>
                                        <th scope="col">수정자</th>
                                        <th scope="col">수정일시</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length > 0 ? list.map((item,index) => {
                                        return(
                                            <tr data-index={index} className="text-center" key={item.hist_id} onClick={(e)=>{this.detailView(e, index, item.topic_name)}}>
                                                <th scope="row">{count - (current*size) - index}</th>
                                                <td className="value-subject value form-group">
                                                {item.topic_name}
                                                </td>
                                                <td className="last_mod_id value form-group">
                                                {item.last_mod_id}
                                                </td>
                                                <td className="last_mod_id value form-group">
                                                {helpers.krDateTime(item.last_mod_dt)}
                                                </td>
                                            </tr>
                                        );
                                    }): <tr><td colspan="4"><h3 className="p-3 m-3 text-center">검색된 history data가 없습니다</h3></td></tr>}
                                </tbody>
                            </table>
                            <div className="paging">
                                <Pagination
                                    activePage={current+1}
                                    itemsCountPerPage={size}
                                    totalItemsCount={count}
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
export default withRouter(Historylist)