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
import Breadcrumb from "../breadcrumb.component";

class Historyview extends Component {

    render(){
        const { before, after } = this.props.router.location.state.data;
        console.log(this.props.router.location.state.data)
        let parseBefore = before ==='' ? JSON.stringify(before, null, 8):JSON.stringify(JSON.parse(before), null, 8)
        let parseAfter = JSON.stringify(JSON.parse(after), null, 8);

        return (
            <>
                <div className="meta history">
                    <div className="page-header">
                        <Breadcrumb/>
                    </div>
                    <div className="viewing">
                        <div className="diff-viewer">
                            <ReactDiffViewer leftTitle="변경 전" rightTitle="변경 후" oldValue={parseBefore} newValue={parseAfter} splitView={true} />
                        </div>
                        <div className="btn-group">
                            <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                        </div>
                    </div>
                </div>
            </>

        );
    }
}
export default withRouter(Historyview)