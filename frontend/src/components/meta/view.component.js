import React, { Component} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import ReactDiffViewer from 'react-diff-viewer';
import Historylist from "../history/list.component";
import helpers from "../../common/helpers";
import history from "../history/view.component";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";

class Metaview extends Component {

    write = (e, type, topic_name)=> {
        e.preventDefault();
        this.props.router.navigate('/meta/write/'+topic_name, {state:{schema:this.props.router.location.state.schema,meta:this.props.router.location.state.meta_join,type:type}})
    }

    viewer = (e,type,topic_name,state) => {
        e.preventDefault()
        console.log(state)
        this.props.router.navigate('/meta/view/'+type+'/'+topic_name, {state:{data:state.data}})
    }

    inputfield = ( field_name, field_type = 'input') => {
        let {data} = this.props.router.location.state
        data = JSON.parse(data.meta_join)
        return (
            <div className={"input-group "+field_name}>
                <label htmlFor='field_name' className="field-label">{helpers.translate(field_name, "entokr")}</label>
                 {field_type === 'textarea' ?
                    <textarea name={field_name} className={"input-"+field_name} value={data[field_name]} readOnly={"true"}/>
                :<input name={field_name} className={"input-"+field_name} value={data[field_name]} readOnly={"true"}/>}
            </div>
        )
    }

    view = ( type, props ) => {
        if(type === 'json') {
            const { data } = props
            const meta = JSON.parse(data.meta_join)
            return (
                <>
                    <div className="viewer json">
                        <AceEditor
                            mode="json"
                            name={meta._id.$oid}
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
            // let { data } = props
            const data = this.props.router.location.state.meta
            let schema = Object.keys(data).map(field => {
                if(typeof(data[field]) === 'object' && data[field].length > 0) return field
            }).filter(ele => ele)
            return(
                <>
                <div className="viewer table">
                    <div className="default-group">
                        {this.inputfield("topic_name")}
                        {this.inputfield("schema_id")}
                        {this.inputfield("schema_version")}
                        {this.inputfield("op_name")}
                        {this.inputfield("service")}
                        {this.inputfield("related_topics")}
                        {this.inputfield("topic_desc", 'textarea')}
                    </div>
                    <div className="schema-group">
                        {schema.map(ele => {
                            return (
                                <div className={ele+"-schema"}>
                                    <h3 className={ele+"-schema-header"}>{ele} Schema</h3>
                                    <table className={ele+"-schema-table"}>
                                        {data[ele].map((field, index) => {
                                            return (
                                                <>
                                                {index === 0 ?
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="col-1">번호</th>
                                                                {Object.keys(field).map((field2, index) => {
                                                                    return (
                                                                        <th scope="col">{helpers.translate(field2,"entokr")}</th>
                                                                    );
                                                                })
                                                            }
                                                        </tr>
                                                    </thead>
                                                :<></>}
                                                <tr>
                                                    <td scope="row">{index+1}</td>
                                                        {Object.keys(field).map((field2) => {
                                                            return (
                                                                <td><input type="text" name={field2} className={"field-input "+field2} value={field[field2].length > 0 ? field[field2]:"-"} readOnly={"true"}/></td>
                                                            );
                                                        })}
                                                </tr>
                                                </>
                                            )
                                        })}
                                    </table>
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="btn-group">
                    <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                </div>
                </>
            )

        } else if(type ==='changed'){

            return (
                <div className="viewer changed">
                    <div className="diff">
                        <ReactDiffViewer leftTitle="변경 전" rightTitle="변경 후" oldValue={JSON.stringify(props.data[1], null, 4)} newValue={JSON.stringify(props.data[0], null, 4)} splitView={true} />
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-write" onClick={(e)=>this.write(e,"changed", this.props.router.params.topic_name)}>등록</button>
                        <button type="button" className="btn btn-back" onClick={()=>this.props.router.navigate(-1)}>뒤로가기</button>
                    </div>
                </div>
            )
        }
    }
    render(){
        console.log(this.props.router.location)
        const {type, topic_name} = this.props.router.params
            return (
                <>
                <div className="meta">
                    <div className="page-header view">
                        <Breadcrumb/>
                    </div>
                    <div className="viewing">
                        <div className="inner">
                            {type !== 'changed' ?
                                <div className="btn-group type-view">
                                    <button className={type === 'json' ? "btn btn-json active":"btn btn-json"} onClick={(e)=>this.viewer(e,'json',topic_name, this.props.router.location.state)}>JSON</button>
                                    <button className={type === 'table' ? "btn btn-table active":"btn btn-table"} onClick={(e)=>this.viewer(e,'table',topic_name, this.props.router.location.state)}>TABLE</button>
                                </div>:<></>}
                            {this.view(type, this.props.router.location.state)}
                        </div>
                    </div>
                </div>
                </>
            )
        }
    }

export default withRouter(Metaview)