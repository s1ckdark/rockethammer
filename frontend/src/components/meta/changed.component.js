import React, { Component} from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthService from "../../services/auth.service";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import Pagination from "react-js-pagination";
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";

class Metachanged extends Component {

    // write = (e, type, topic_name)=> {
    //     e.preventDefault();
    //     this.props.router.navigate('/meta/write/'+topic_name, {state:{data:this.props.info,type:type}})
    // }

    // view = (e, type, topic_name, currentPage = 1) => {
    //     let url = type ==='history' ? 'history/list/'+topic_name+'/'+currentPage : type+'/'+topic_name
    //     this.props.router.navigate('/meta/view/'+url, type !== 'history' ? {state:{data:this.props.info,type:type}}:{state:{}})
    // }

    // useConfirm = (e, message, onConfirm, onCancel) => {
    //     e.preventDefault()
    //     if(window.confirm(message)) {
    //         onConfirm();
    //     } else {
    //         onCancel();
    //     }
    // }

    // onDel = async (typeofapi, topic_name) => {
    //     console.log(typeofapi, topic_name);
    //     let url, url2;
    //     switch(typeofapi){
    //         case 'api1':
    //             url = process.env.REACT_APP_API+"/meta/delete";
    //             break;
    //         case 'api2':
    //             url = [process.env.REACT_APP_API+"/meta/delete", process.env.REACT_APP_API+"/schema/delete"];
    //             break;
    //         case 'api3':
    //             url = process.env.REACT_APP_API+"/schema/delete";
    //             break;
    //         default:
    //             console.log("typeofapi",typeofapi);
    //     }

    //     if(typeofapi === 'api1' || typeofapi ==='api3'){    //확인
    //             try {
    //                 axios.post(url, {keyword:JSON.parse(this.state.data['list'][this.state.select.idx].schema).subject}).then(res => console.log(res))
    //             } catch(err) {
    //                 console.log("error", err);
    //             }
    //     } else {
    //         try {
    //             Promise.all(url.map(async (endpoint) => await axios.post(endpoint, {keyword:JSON.parse(this.state.data['list'][this.state.select.idx].schema).subject}))).then((response1, response2) => {
    //                 console.log(response1, response2)
    //             })
    //         } catch(err) {
    //             console.log("error", err);
    //         }
    //     }

    //     await axios.post(process.env.REACT_APP_API+"/history/history_del", {topic_name:topic_name, reg_dt:(new Date).toISOString(),user_id:AuthService.getCurrentUser().userid,op:"delete"})
    //     alert("삭제가 완료되었습니다");
    //     setTimeout(() => {
    //         window.location.reload(false);
    //     }, 1000)
    // }

render(){
        console.log(this.props);
        // if(this.props.info === null) return false;
        // const { schema, meta_join } = helpers.parseNested(this.props.info) || {}
        // let sch = JSON.parse(schema);
        // let meta = helpers.isEmptyObj(meta_join) === false && JSON.parse(meta_join).is_used === 'true' ? JSON.parse(meta_join):{}
        // const topic_name = sch.subject.replace(/(-value|-key)/g, "")
        // // console.log(helpers.isEmptyObj(sch.schema),helpers.isEmptyObj(meta))
        return (
            <div className="changed">

            </div>
        )
    }
}

export default withRouter(Metachanged)