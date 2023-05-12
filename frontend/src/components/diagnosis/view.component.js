import React, { Component} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

class Diagview extends Component {
    view = ( item ) => {
        return (
            <>
                <div className="title">{item.title}</div>
                <div className="box username">{item.username}</div>
                <div className="box type">{item.type}</div>
                <div className="box last_mod_dt">{item.last_mod_dt}</div>
                <div className="tag">{Object.keys(item.tag).map(ele => {
                    return (
                    <label className={item.tag[ele] === true ? "checked":"unchecked"}><input type="checkbox" checked={item.tag[ele]} />{helpers.translate(ele)}</label>
                    )
                })}</div>
                <div className="box contents">
                    <Viewer
                        initialValue={item.contents}
                    />
                </div>
                <div className="box fileinfo">
                    <label>첨부파일 목록 : 총 {item.fileinfo.length} 개</label>
                    <div className="files">
                        <ul>
                        {item.fileinfo.map((file, i) => { return <li key={i}>첨부된 업로드 파일 : <a key={file.name} href={"/api/files/get/"+file.url+"/"+file.name} title={file.name +" 다운로드 버튼"}>{file.name}</a></li>})}
                        </ul>
                    </div>
                </div>
                <div className="btn-group">
                    <button type="button" onClick={()=>this.props.router.navigate("/diag/write/"+ encodeURIComponent(item._id), {state:{post:item}})} className="btn btn-back">수정하기</button>
                    <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                </div>
            </>
        )
    }
    render(){
        const {_id, data} = this.props.router.location.state
        return (
                <>
                <div className="diag">
                    <div className="page-header view">
                        <Breadcrumb/>
                    </div>
                    <div className="viewing">
                        <div className="inner">
                            {this.view(data)}
                        </div>
                    </div>
                </div>
                </>
            )
        }
    }

export default withRouter(Diagview)