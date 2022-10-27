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
    }

    componentDidMount(){
        console.log("history view",this.props);
    }

    render(){
        const { data } = this.props.router.location.state;
        return (
            <>
                <div className="history view col-md-12 px-5 pt-5">
                <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">Meta</a></li>
                            <li class="breadcrumb-item"><a href="#">View</a></li>
                            <li class="breadcrumb-item"><a href="#">History</a></li>
                            <li class="breadcrumb-item"><a href="#">List</a></li>
                            <li class="breadcrumb-item active" aria-current="page"><a href="#">View</a></li>
                        </ol>
                    </nav>
                    <ReactDiffViewer leftTitle="Before" rightTitle="After" oldValue={helpers.replaceKey(data.before,"entokr")} newValue={helpers.replaceKey(data.after, "entokr")} splitView={true} />
                    <div className="closeHistoryDetail d-flex justify-content-center my-5">
                        <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-warning me-1">뒤로가기</button>
                    </div>
                </div>
            </>

        );
    }
}
export default withRouter(Historyview)