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
import helpers from '../common/helpers';
import { withRouter } from "../common/withRouter";

class Historylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                totalcnt:0,
                current:0,
                pageSize:5,
                list:[]
            },
            idx: '',
            topic_name:this.props.router.params.topic_name
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.props.router.navigate('/meta/view/history/list/'+this.state.topic_name+'/'+pageNumber)
        this.fetchData(this.state.topic_name, pageNumber-1);
      }


    fetchData = (topic_name,page=0) => {
        console.log(topic_name, page)
        axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:this.state.topic_name,size:5,page:page}).then(res => {
            this.setState({
                ...this.state,
                data:res.data,
            })
        })
    }

    componentDidMount(){
        console.log("history list",this.props);
        const { currentPage, topic_name } = this.props.router.params;
        this.fetchData(topic_name)
    }

    detailView = (e, idx, topic_name) => {
        e.preventDefault();
        this.props.router.navigate('/meta/view/history/view/'+topic_name,{state:{data:this.state.data.list[idx]}})
    }

    render(){
        const { currentPage, topic_name } = this.props.router.params;
        const { data } = this.state;
        console.log(data)
        const { count, current, list, pageCount, size } = data;
        console.log(list)
        return (
            <>
                <div className="history list col-md-12 px-5 pt-5">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">Meta</a></li>
                            <li class="breadcrumb-item"><a href="#">View</a></li>
                            <li class="breadcrumb-item"><a href="#">History</a></li>
                            <li class="breadcrumb-item active" aria-current="page">List</li>
                        </ol>
                    </nav>
                    <table className="bg-light table table-hover">
                        <thead>
                            <tr className="text-center p-3">
                                <th scope="col" className="col-md-1">번호</th>
                                <th scope="col" className="col-md-3">토픽명</th>
                                <th scope="col" className="col-md-3">수정자</th>
                                <th scope="col" className="col-md-3">수정일시</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? list.map((item,index) => {
                                return(
                                    <tr data-index={index} className="text-center" key={item.hist_id} onClick={(e)=>{this.detailView(e, index, item.topic_name)}}>
                                        <th scope="row">{index+1}</th>
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
            </>

        );
    }
}
export default withRouter(Historylist)