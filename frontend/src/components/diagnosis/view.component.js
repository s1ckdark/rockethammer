import React, { Component } from "react";
import axios from 'axios';
import AuthService from "../../services/auth.service";
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import Dialog from "../dialog.component";
import Upload from "./upload.component";

class Diagview extends Component {
    editorRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          userReady:false,
          message:'',
          messageType:'',
          type:'',
          successful:false,
          reset: false,
          editMode:{
            status: false,
            idx:''
          },
          comment:{
            username: '',
            contents: '',
            last_mod_dt:'',
            fileinfo:[]
          },
          errors:{
            contents:'',
            last_mod_dt:'',
            fileinfo:'',
            username:''
            },
        };
    }

    componentDidMount(){
        const {_id} = this.props.router.location.state;
        this.fetchData(_id);
    }

    // meta data를 가져온다
    fetchData = async(_id) => {
        await axios.get(process.env.REACT_APP_API+"/diag/get/"+_id)
            .then(res => {
              this.setState({
                ...this.state,
                data: res.data,
                userReady:true,
                status: false,
                comment:{
                    username: AuthService.getCurrentUser().userid,
                    contents:'',
                    last_mod_dt:'',
                    fileinfo:[]
                }
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
                },()=> this.props.router.navigate("/diag"))
            }
        })
    }

    callAction = (e, msgtype, msg, type, idx) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            messageType: msgtype,
            message:msg,
            type: type,
            target: idx
        })
    }

    handleCallback = (childData) => {
        this.setState({
            ...this.state,
            comment:{
                ...this.state.comment,
                fileinfo:childData
            }
        })
    }

    goBack = () => {
        this.props.router.navigate(-1)
    }

    dialogCallback = (act) => {
        // console.log(typeofapi, subject)
        const {type,target} = this.state
        console.log(act, type, target)
        switch (act){
          case 'yes':
            switch(type){
                case 'post':
                    this.delete(target)
                    this.setState({...this.state,message:'',type:'',messageType:'',target:''})
                    console.log("delete post")
                break;

                case 'comment':
                    this.commentDelete(target)
                    this.setState({...this.state,message:'',type:'',messageType:'',target:''})
                    console.log("delete comment")
                break;
            }
          break;

          case 'no':
            this.setState({...this.state,message:'',type:'',messageType:'',target:''})
          break;

          case 'close':
            this.setState({...this.state,message:'',type:'',messageType:'',target:''})
          break;

          default:
            console.log("dialogCallback")
        }
      }

      onValidation = (obj) => {
        var tmp =[]
        const errors = {
            contents:'',
            last_mod_dt:'',
            fileinfo:'',
            username:''
        }
        let formIsValid = true;

        if ('object' !== typeof obj || null == obj) formIsValid = false;

        // const hasOnlyTheKeys = Array.isArray(fields) ? JSON.stringify(Object.keys(obj).filter(x => fields.includes(x)).sort()) ===  JSON.stringify(fields.sort()) : false
        // if (false === hasOnlyTheKeys) formIsValid = false;

        Object.keys(obj).forEach( prop => {
            switch(obj[prop]){
              case null:
              case undefined:
                errors[prop] = helpers.translate(prop ,"entokr")+ ' 값은 필수입력 항목 입니다';
                formIsValid = false;
                tmp.push(helpers.translate(prop ,"entokr"))
                break;
              case '':
                errors[prop] = helpers.translate(prop ,"entokr")+ ' 값은 필수입력 항목 입니다';
                formIsValid = false;
                tmp.push( helpers.translate(prop ,"entokr"))
                break;
              case 0:
                break;
              default:
            }
        })

        if(tmp.length > 0){
        this.setState({
            ...this.state,
            errors:errors,
            successful:false,
            message: tmp.toString()+"에 잘못된 입력이 있으니 안내에 맞춰 입력해주세요"
        })
    }
        return formIsValid;
    }

    onChangeValue = (e) => {
        this.setState({
            ...this.state,
            comment:{
                ...this.state.comment,
                [e.target.name]: e.target.value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { comment } = this.state
        const comments = this.state.data.comments || []
        comment.last_mod_dt = new Date().toISOString()
        if(!this.onValidation(comment)) return false;
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                comments:[...comments, comment]
            }
        }, ()=> this.updateComment(this.state.data))
    }

    updateComment = async(data)=>{
            await axios.post(process.env.REACT_APP_API+"/diag/update/"+encodeURIComponent(data._id), data).then( res => {
                if(res.status ===200) {
                    // this.setState({
                    //     ...this.state,
                    //     // message:"등록이 완료되었습니다",
                    //     // messageType:'alert',
                    //    reset: false
                    // })

                    this.fetchData(data._id);
                    this.reset()
                }
            })
        }

    reset = (e) => {
        console.log("reset")
        this.setState({
            ...this.state,
            comment:{
                ...this.state.comment,
                contents: '',
                last_mod_dt:'',
                fileinfo:[]
            },
            reset: true
        },()=> this.setState({...this.state,reset:false}))
    }

    commentAdd = (comment, reset) => {
        // const {comment} = this.state
        return (
            <div className="box writeComment">
                <div className="comment-header">
                    <div className="input-group username">
                        <input name="username" type="text" readOnly value={comment.username}/>
                    </div>

                    <div className="comment-btn">
                        <button type="button" className="btn btn-write" onClick={this.onSubmit}>등록</button>
                        <button type="button" className="btn btn-cancel" onClick={this.reset}>취소</button>
                    </div>
                </div>
                <div className="input-group contents">
                    <textarea className="box" name="contents" onChange={(e) => this.onChangeValue(e)} placeholder="내용을 입력해주세요" value={comment.contents} />
                    <span className="input-validator error-msg input-validator-contents">{this.state.errors['contents']}</span>
                </div>
                <div className="input-group uploader">
                    <Upload handleCallback={this.handleCallback} reset={reset} />
                </div>
            </div>
        )
    }

    commentRead = (comment, idx) => {
        const {username, contents, last_mod_dt, fileinfo} = comment
        return (
            <div key={"comment-" + idx} className={"box readComment comment-" + idx}>
                <div className="comment-header">
                    <div className="comment-username">{username}</div>
                    <div className="comment-btn">
                        <button className="btn-delete btn" onClick={(e)=>this.callAction(e, "confirm", "정말 삭제하시겠습니까","comment", idx)} disabled={AuthService.getCurrentUser().userid === username || AuthService.getCurrentUser().userid === 'admin' ? false:true }>삭제</button>
                    </div>
                </div>
                <div className="comment-contents"><textarea name="contents" className="box" value={contents} onChange={(e)=>this.onChangeValue(e)} /></div>
                <div className="comment-date"><span>{helpers.krDateTime(last_mod_dt)}</span></div>
                {fileinfo && fileinfo.length > 0 ?
                    <div className="box comment-fileinfo">
                        <label>첨부파일 목록 : 총 {fileinfo.length} 개</label>
                        <div className="files">
                            <ul>
                            {fileinfo && fileinfo.map((file, i) => { return <li key={i}>첨부된 업로드 파일 : <a key={file.name} href={"/api/files/get/"+file.url+"/"+file.name} title={file.name +" 다운로드 버튼"}>{file.name}</a></li>})}
                            </ul>
                        </div>
                    </div>
                :<></>}
            </div>
        )
    }

    commentDelete = (idx) => {
        let {comments} = this.state.data
        comments.splice(idx,1)
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                comments:comments
            },
            message:"삭제하시겠습니까?",
            messageType:'confirm',
        },()=>this.updateComment(this.state.data))
    }

    comments = (comments) => {
        return (
          <>
            {comments && comments.length > 0 ? (
              comments.map((item, index) => (
                this.commentRead(item, index)
              ))
            ) : <></>}
          </>
        );
      }

    view = (item) => {
        const { comment, reset } = this.state
        return (
            <div className="viewing" key={item._id}>
            <div className="inner">
                <div className="title">{item.title}</div>
                <div className="box username">{item.username}</div>
                <div className="box type">{item.type}</div>
                <div className="box last_mod_dt">{helpers.krDateTime(item.last_mod_dt)}</div>
                <div className="tag">{Object.keys(item.tag).map(ele => {
                    return (
                    <label className={item.tag[ele] === true ? "checked":"unchecked"}><input type="checkbox" defaultChecked={item.tag[ele]} />{helpers.translate(ele)}</label>
                    )
                })}</div>
                <div className="box contents">
                    <Viewer
                        initialValue={item.contents}
                    />
                </div>
                <div className="box fileinfo">
                    <label>첨부파일 목록 : 총 {item.fileinfo && item.fileinfo.length>0 ? item.fileinfo.length:0} 개</label>
                    <div className="files">
                        <ul>
                        {item.fileinfo && item.fileinfo.map((file, i) => { return <li key={i}>첨부된 업로드 파일 : <a key={file.name} href={"/api/files/get/"+file.url+"/"+file.name} title={file.name +" 다운로드 버튼"}>{file.name}</a></li>})}
                        </ul>
                    </div>
                </div>
                <div className="btn-group">
                    <button type="button" onClick={()=>this.props.router.navigate("/diag/write/"+ encodeURIComponent(item._id), {state:{post:item}})} className="btn btn-back">수정하기</button>
                    <button type="button" onClick={(e)=>this.callAction(e, "confirm", "정말 삭제하시겠습니까","post", item._id)} className="btn btn-back">삭제</button>
                    <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                </div>
                <div className="comments">
                    {this.comments(item.comments)}
                    {this.commentAdd(comment,reset)}
                </div>
                </div>
                    </div>
        )
    }
    render(){
        const { userReady, data} = this.state;
        if(userReady){
        return (
                <>
                <div className="diag">
                    <div className="page-header view">
                        <Breadcrumb/>
                    </div>
                    {this.view(data)}

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