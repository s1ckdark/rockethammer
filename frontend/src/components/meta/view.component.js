import React, { Component} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from 'axios';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import ReactDiffViewer from 'react-diff-viewer';
import Historylist from "../history/list.component";
import helpers from "../../common/helpers";
import history from "../history/view.component";
import { withRouter } from "../../common/withRouter";

class Metaview extends Component {

    write = (e, type, topic_name)=> {
        e.preventDefault();
        this.props.router.navigate('/meta/write/'+topic_name, {state:{data:this.props.data,type:type}})
    }

    view = ( type, props ) => {
        if(type === 'json') {
            const { data, schemas } = props
            const meta = helpers.parse(data.meta_join)
            return (
                <>
                    <div className="viewer json">
                        <AceEditor
                            mode="json"
                            name={meta._id}
                            value = {helpers.replaceKey(meta,"entokr")}
                            onChange={this.onChangeJSON}
                            maxLines={Infinity}
                            fontSize= {14}
                            readOnly={true}
                            showPrintMargin={false}
                            width="100%"
                            wrapEnabled={true}
                            style={{
                                lineHeight: "22px"
                              }}
                            tabSize={8}
                        />
                    </div>
                    <div className="btn-group">
                            <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                    </div>
                </>
            )
        } else if(type==='table'){

        } else if(type ==='changed'){
            return (
                <div className="changeView">
                    <div className="d-flex pb-5">
                        <ReactDiffViewer leftTitle="변경 전" rightTitle="변경 후" oldValue={JSON.stringify(props[1], null, 4)} newValue={JSON.stringify(props[0], null, 4)} splitView={true} />
                    </div>
                    <div className="btnArea d-flex justify-content-center mb-5">
                        <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"change")}>등록</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>this.props.router.navigate(-1)}>뒤로가기</button>
                    </div>
                </div>
            )
        }
    }
    render(){
        const { type } = this.props.router.params;
            return (
                <>
                <div className="meta">
                    <div className="page-header view">
                        <div className="breadcrumb">
                            <nav aria-label="breadcrumb">
                                <img src="/img/meta_color.svg"></img>
                                <h3>메타관리</h3>
                                <ol className="current">
                                    <li className="breadcrumb-item"><a href="#">홈</a></li>
                                    <li className="breadcrumb-item"><a href="#">메타</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">조회</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="viewing">
                        <div className="btn-group type-view">
                            <button className="btn btn-json active">JSON</button>
                            <button className="btn btn-table">TABLE</button>
                        </div>
                        {this.view(type, this.props.router.location.state)}
                    </div>
                </div>
                </>
            )
    }
}

export default withRouter(Metaview)