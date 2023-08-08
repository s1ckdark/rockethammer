import React, { Component } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from "../../services/auth.service";
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import Dialog from "../dialog.component";
import Upload from "./upload.component";
// import CommentAdd from "./commentAdd.component"

class Diagview extends Component {
    editorRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
          data:{},
          userReady:false,
          message:'',
          messageType:'',
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



    callAction = (e, type, msg) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            messageType:type,
            message:msg
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
        // if(!this.onValidation(data)) return false;
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                comments:[...comments, comment]
            },
            status: true
        }, ()=> this.updateComment(this.state.data))
    }

    // onEdit = async (idx, e) => {
    //     e.preventDefault();
    //     const { comment, data } = this.state;
    //     const updatedComment = { ...comment, last_mod_dt: new Date().toISOString() };
    //     console.log(updatedComment)
    //     // Check if data.comment is an array, if not, initialize it as an empty array
    //     const updatedData = { ...data}
    //     updatedData.comments[idx] = updatedComment;
    //     // console.log(updatedData);
    //     this.updateComment(updatedData);
    //     this.commentEditMode(idx, e)
    //   };


    updateComment = async(data)=>{
            await axios.post(process.env.REACT_APP_API+"/diag/update/"+encodeURIComponent(data._id), data).then( res => {
                if(res.status ===200) {
                    // this.setState({
                    //     ...this.state,
                    //     // message:"등록이 완료되었습니다",
                    //     // messageType:'alert',
                    //     // successful:true
                    // })
                    this.fetchData(data._id);
                }
            })
        }

    cancel = (e) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            comment:{
                ...this.state.comment,
                contents: '',
                last_mod_dt:'',
                fileinfo:[]
            },
            reset: true
        })
    }

    commentAdd = (reset) => {
        const {comment} = this.state
        return (
            <div className="box writeComment">
                <div className="comment-header">
                    <div className="input-group username">
                        <input name="username" type="text" readOnly value={comment.username}/>
                    </div>

                    <div className="comment-btn">
                        <button type="button" className="btn btn-write" onClick={this.onSubmit}>등록</button>
                        <button type="button" className="btn btn-cancel" onClick={this.cancel}>취소</button>
                    </div>
                </div>
                <div className="input-group contents">
                    <textarea className="box" name="contents" onChange={(e) => this.onChangeValue(e)} placeholder="내용을 입력해주세요" value={comment.contents} />
                </div>
                <div className="input-group uploader">
                    <Upload handleCallback={this.handleCallback} mode="comment"/>
                </div>
            </div>
        )
    }

    commentRead = (comment, idx) => {
        return (
            <div key={"comment-" + idx} className={"box readComment comment-" + idx}>
                <div className="comment-header">
                    <div className="comment-username">{comment.username}</div>
                    <div className="comment-btn">
                        {/* <button className="btn-modify btn" onClick={(e)=>this.commentEditMode(idx,e)}>수정</button> */}
                        <button className="btn-delete btn" onClick={(e)=>this.commentDelete(idx,e)}>삭제</button>
                    </div>
                </div>
                {/* <div className="comment-contents"><Viewer initialValue={comment.contents} /></div> */}
                <div className="comment-contents"><textarea name="contents" className="box" value={comment.contents} onChange={(e)=>this.onChangeValue(e)} /></div>
                <div className="comment-date"><span>{helpers.krDateTime(comment.last_mod_dt)}</span></div>
                {comment.fileinfo && comment.fileinfo.length > 0 ?
                    <div className="box comment-fileinfo">
                        <label>첨부파일 목록 : 총 {comment.fileinfo.length} 개</label>
                        <div className="files">
                            <ul>
                            {comment.fileinfo && comment.fileinfo.map((file, i) => { return <li key={i}>첨부된 업로드 파일 : <a key={file.name} href={"/api/files/get/"+file.url+"/"+file.name} title={file.name +" 다운로드 버튼"}>{file.name}</a></li>})}
                            </ul>
                        </div>
                    </div>
                :<></>}
            </div>
        )
    }

    commentEdit = (comment, idx) => {
        // const {comment, type}=this.state
        return (
            <div className="box writeComment">
                <div className="comment-header">
                    <div className="input-group username">
                        <input name="username" type="text" readOnly value={comment.username}/>
                    </div>

                    <div className="comment-btn">
                        <button type="button" className="btn btn-write" onClick={e=>this.onEdit(idx, e)}>저장</button>
                        <button type="button" className="btn btn-cancel" onClick={e=>this.cancel(e)}>취소</button>
                    </div>
                </div>
                <div className="input-group contents">
                    <textarea className="box" name="contents" onChange={(e) => this.onChangeValue(e)} placeholder="내용을 입력해주세요">{comment.contents}</textarea>
                </div>
                <div className="input-group uploader">
                    <Upload handleCallback={this.handleCallback} list={comment.fileinfo} type="write"/>
                </div>
            </div>
        )
    }

    commentEditMode= (idx, e)=>{
        e.preventDefault()
        const {comments}= this.state.data
        if (!this.state.editMode.status){
            this.setState({
                ...this.state,
                comment:comments[idx],
                editMode: {
                    status:true,
                    idx:idx
                }
            });
        } else {
            this.setState({
                ...this.state,
                comment:{
                    username: '',
                    contents: '',
                    last_mod_dt:'',
                    fileinfo:[]
                  },
                editMode: {
                    status:false,
                    idx:''
                }
            });
        }

    }
    commentDelete = (idx,e) => {
        e.preventDefault()
        let {comments} = this.state.data
        comments.splice(idx,1)
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                comments:comments
            }
        },()=>this.updateComment(this.state.data))
    }
    comments = (comments) => {
        return (
          comments && comments.length > 0 ? (
            <>
              {comments.map((item, index) => (
                this.state.editMode.status && this.state.editMode.idx === index ?
                    this.commentEdit(item,index)
                :this.commentRead(item, index)
              ))}
              {this.commentAdd(this.state.reset)}
            </>
          ) : this.commentAdd(this.state.reset)
        )
      }

    view = (item) => {
        return (
            <>
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
                    <button type="button" onClick={(e)=>this.callAction(e, "confirm", "정말 삭제하시겠습니까")} className="btn btn-back">삭제</button>
                    <button type="button" onClick={()=>this.props.router.navigate(-1)} className="btn btn-back">뒤로가기</button>
                </div>
                <div className="comments">
                    {this.comments(item.comments)}
                </div>

            </>
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