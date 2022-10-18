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
import helpers from './helpers.component';
import { withRouter } from "./withRouter.component";

class Historyview extends Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [],
          idx: '',
		  show: false,
          json: {},
          before: {},
          after: {}
        };
        this.handleUserPageChange = this._handleUserPageChange.bind(this);
        this.handleHistoryPageChange = this._handleHistoryPageChange.bind(this);
    }

    _handleUserPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({
        ...this.state,
        user:{
            ...this.state.user,
            currentPage: pageNumber
        }
        });
        this.fetchData();
    }

    _handleHistoryPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({
            ...this.state,
            history:{
                ...this.state.history,
                currentPage: pageNumber
            }
        });
        this.fetchHistoryData();
    }

    componentDidMount(){
        // console.log(this.props);
    }
    exist = (json,key) => {
        json.map((res,index)=>{
          res.hasOwnProperty(key) ? console.log(index, key):console.log("no")
        })
      }

    detailView = (e, idx, before, after) => {
        console.log(idx);
        this.setState({
            ...this.state,
            show:true,
            before: before !=='' ? this.replaceKey(JSON.parse(before)):{},
            after: this.replaceKey(JSON.parse(after))
        })
    }

    render()
    {
        return (
            <>
                <div className="history col-md-12 px-5 pt-5">
                    <div className="container">
                        <table className={ this.state.show ? "historylist bg-light table table-hover d-none" : "historylist bg-light table table-hover"}>
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-3">토픽명</th>
                                    <th scope="col" className="col-md-3">수정자</th>
                                    <th scope="col" className="col-md-3">수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                                    return(
                                        <tr data-index={index} className="text-center" key={item.hist_id} onClick={(e)=>{this.detailView(e, index, item.before, item.after)}}>
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
                                }): <h3 className="p-3 m-3 text-center">검색된 history data가 없습니다</h3>}
                            </tbody>
                        </table>

                        {this.state.show ?
                        <div className="detailView mx-auto">
                            <ReactDiffViewer leftTitle="Before" rightTitle="After" oldValue={helpers.replaceKey(this.state.before,"entokr")} newValue={helpers.replaceKey(this.state.after, "entokr")} splitView={true} />
                            <div className="closeHistoryDetail d-flex justify-content-center my-5">
                                <button type="button" onClick={this.closeHistoryDetail} className="btn btn-warning me-1">뒤로가기</button>
                                <button type="button" onClick={this.props.closeVIEW} className="btn btn-warning">닫기</button>
                            </div>
                        </div>
                        : <div className="closeHistoryDetail d-flex justify-content-center my-5">
                            <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-warning">닫기</button>
                        </div>}
                    </div>
                </div>
            </>

        );
    }
}
export default withRouter(Historyview)