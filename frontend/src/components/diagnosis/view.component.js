import React, { Component} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import Dialog from "../dialog.component";

class Diagview extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          userReady:false,
          message:'',
          messageType:'',
          successful:false
        };
    }

    componentDidMount(){
        const {_id} = this.props.router.location.state;
        this.fetchData(_id);
    }

    // meta data를 가져온다
    fetchData = async(_id) => {
        console.log(_id)
        await axios.get(process.env.REACT_APP_API+"/diag/get/"+_id)
            .then(res => {
              this.setState({
                ...this.state,
                data: res.data,
                userReady:true
              })

            })
        }

    delete = async (_id) => {
        await axios.get(process.env.REACT_APP_API+"/diag/delete/"+_id).then( res => {
            if(res.status === 200) {
                this.setState({
                    ...this.state,
                    message:"삭제가 완료되었습니다",
                    messageType:"alert"
                })
            }
        })
    }

    callAction = (e, type, msg) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            messageType:type,
            message:msg
        })
    }

    dialogCallback = (act) => {
        // console.log(typeofapi, subject)
        switch (act){
          case 'yes':
            this.delete(this.state.data._id)
                    // this.props.getData()
            this.setState({...this.state,message:''})
          break;

          case 'no':
            this.setState({...this.state,message:''})
          break;

          case 'close':
            this.setState({
              ...this.state,
              message: ""
            })
          break;
          default:
            console.log("dialogCallback")
        }
      }
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
                    <button type="button" onClick={(e)=>this.callAction(e, "confirm", "정말 삭제하시겠습니까")} className="btn btn-back">삭제</button>
                    <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                </div>
            </>
        )
    }
    render(){
        const { userReady, data} = this.state;
        console.log(data)
        if(userReady){
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
                {this.state.message && (
                    <Dialog type={this.state.messageType} callback={this.dialogCallback} message={this.state.message}/>
                )}
                </>
            )
        }
    }
    }

export default withRouter(Diagview)