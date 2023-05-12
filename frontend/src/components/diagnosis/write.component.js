import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import Dialog from "../dialog.component";
import Upload from "./upload.component";
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

class Diagwrite extends Component {
    editorRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            userReady: false,
            data:{
                title:'',
                contents:'',
                fileinfo:[],
                username:'',
                type:'',
                tag:{
                    "support":false,
                    "incident":false,
                    "document":false,
                    "diag":false,
                    "etc":false
                },
                last_mod_dt:''
            },
            type:'',
            errors:{
                title:'',
                contents:'',
                fileinfo:[],
                username:'',
                type:'',
                tag:[],
                last_mod_dt:''
            },
            message:'',
            messageType:'',
            successful:false
        };
    }

    componentDidMount(){
        const _id = this.props.router.params.index ? this.props.router.params.index : null;
        const  post  = this.props.router.location.state !== null ? this.props.router.location.state.post:null;
        _id ?
            this.setState({
                ...this.state,
                data: post,
                userReady: true,
                type:"update"
            })
        :this.setState({
                ...this.state,
                data:{
                    ...this.state.data,
                    type:'manual',
                    username: AuthService.getCurrentUser().userid,
                    last_mod_dt:new Date().toISOString()
                },
                userReady: true,
                type:"reg"
            })
    }

    onChangeValue = (e) =>{
        e.preventDefault();
            this.setState({
                ...this.state,
                data: {
                    ...this.state.data,
                    [e.target.name]:e.target.value
                },
                errors:{
                    ...this.state.errors,
                    [e.target.name]:''
                }
            })
        }

    onChangeCheckbox = (e, checked) => {
        e.preventDefault()
        console.log(checked, typeof(checked))
            this.setState({
                ...this.state,
                data: {
                    ...this.state.data,
                    tag:{
                        ...this.state.data.tag,
                        [e.target.name]: !checked
                    }
                }
            })

        }

     onChangeToast = () => {
        const editorHtml = this.editorRef.current?.getInstance().getHTML();
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                contents: editorHtml
            }
        })
    }

    dialogReset = ()=>{
        this.setState({
          ...this.state,
          message: ""
        })
        if(this.state.successful === true) this.props.router.navigate(-1)
      }

    onSubmit = async(e, type) => {
        e.preventDefault();
        const { data } = this.state
        if(!this.onValidation(data)) return false;
        switch(type){
            case 'reg':
                await axios.post(process.env.REACT_APP_API+"/diag/insert/", data).then( res => {
                    if(res.status===200) {
                        this.setState({
                        ...this.state,
                        message:"등록이 완료되었습니다",
                        messageType:'alert',
                        successful:true
                    })
                }
            })
            break;

            case 'update':
                    await axios.post(process.env.REACT_APP_API+"/diag/update/"+encodeURIComponent(data._id), this.state.data).then( res => {
                        if(res.status ===200) {
                            this.setState({
                                ...this.state,
                                message:"수정이 완료되었습니다",
                                messageType:'alert',
                                successful:true
                            })
                        }
                    })

            break;
            default:
                console.log("submit")
        }
    }

    onValidation = (obj) => {
        var tmp =[]
        var tag = []
        const errors = {
            title:'',
            contents:'',
            fileinfo:{},
            username:'',
            type:'',
            last_mod_dt:''
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

        Object.keys(obj.tag).forEach( item => {
            tag.push(obj.tag[item] === false ? false : true)
            console.log(item, obj.tag[item])
        })

        if(!tag.includes(true)){
            tmp.push('tag')
            errors['tag'] = helpers.translate('tag' ,"entokr")+ ' 값은 필수입력 항목 입니다';
            formIsValid = false;
        }

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

    handleCallback = (childData) => {
        console.log(childData);
        this.setState({
            ...this.state,
            data:{
                ...this.state.data,
                fileinfo:childData
            }
        })

    }

    goBack = () => {
        this.props.router.navigate(-1)
    }

    render()
    {
        const { data, userReady } = this.state;
        if(userReady){
            return (
                <div className="diag">
                    <div className="page-header write">
                        <Breadcrumb/>
                    </div>
                    <div className="writing">
                        <div className="inner">
                                <div className="input-group title">
                                    <input name="title" type="text" onChange={this.onChangeValue} value={data.title} placeholder="제목을 입력해주세요" />
                                    <span className="input-validator error-msg input-validator-title">{this.state.errors['title']}</span>
                                </div>
                                <div className="input-group username">
                                    <input name="username" type="text" onChange={this.onChangeValue} readOnly value={data.username}/>
                                </div>
                                <div className="input-group tag">
                                    {Object.keys(this.state.data.tag).map((item, index) => {
                                        return (
                                            <>
                                                <label key={this.state.data.tag[item]} htmlFor={item} className="checkbox-field-label"><input style ={{defaultChecked:this.state.data.tag[item]}} id={item} name={item} type="checkbox" checked={this.state.data.tag[item]} onChange={(e)=>this.onChangeCheckbox(e,this.state.data.tag[item])} /> {helpers.translate(item)}</label>
                                            </>
                                        )
                                    })}
                                     <span className="input-validator error-msg input-validator-tag">{this.state.errors['tag']}</span>
                                </div>
                                <div className="input-group last_mod_dt">
                                    <input name="last_mod_dt" type="text" onChange={this.onChangeValue} readOnly value={helpers.krDateTime(data.last_mod_dt)}/>
                                </div>
                                <div className="input-group type">
                                    <input name="type" type="text" onChange={this.onChangeValue} readOnly value={data.type} />
                                </div>
                                <div className="input-group contents">
                                    {/* <textarea name="contents" onChange={this.onChangeValue} placeholder="내용을 입력해주세요" value={data.contents} /> */}
                                    <Editor
                                        initialValue={data.contents}
                                        placeholder="내용을 입력해주세요."
                                        previewStyle="vertical"
                                        height="300px"
                                        initialEditType="wysiwyg"
                                        ref={this.editorRef}
                                        onChange={this.onChangeToast}
                                        language="ko-KR"
                                        toolbarItems={[
                                            ['heading', 'bold', 'italic', 'strike'],
                                            ['hr', 'quote'],
                                            ['ul', 'ol', 'task', 'indent', 'outdent'],
                                            ['table', 'image', 'link'],
                                            ['code', 'codeblock']
                                        ]}
                                    />
                                     <span className="input-validator error-msg input-validator-contents">{this.state.errors['contents']}</span>
                                </div>
                                <div className="input-group uploader">
                                    <Upload handleCallback={this.handleCallback} list={this.state.data.fileinfo} type="write"/>
                                </div>
                            <div className="btn-group text-center">
                                <button type="button" className="btn btn-write" onClick={e=>this.onSubmit(e, this.state.type)}>{ this.state.type === 'reg' ? "등록":"수장"}</button>
                                <button type="button" className="btn btn-back" onClick={this.goBack}>뒤로가기</button>
                            </div>
                        </div>
                    </div>
                    {this.state.message && (
                        <Dialog type="alert" callback={this.dialogReset} message={this.state.message}/>
                    )}
                </div>
            );
        }
    }
}

export default withRouter(Diagwrite)