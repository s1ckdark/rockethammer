import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import Dialog from "../dialog.component";

class Diagwrite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userReady: false,
            data:{
                subject:'',
                content:'',
                file:{}
            },
            type:'',
            preview: false,
            errors:{
                subject:'',
                content:'',
                file:{}
            },
            message:'',
            messageType:'',
            successful:false
        };
    }

    componentDidMount(){
        const {schema, meta_join, type, topic_name} = this.props.router.location.state;
        let meta ={}
        // console.log(schema, meta_join)
        switch(type) {
            case 'reg':
                axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:topic_name}).then( res => {
                    const {data, status } = res;
                    // console.log(data)
                    if(status === 200) {
                        const sch = Object.keys(data)
                                    .sort()
                                    .reduce(
                                        (newObj,key) => {
                                            newObj[key] = res.data[key];
                                            return newObj;
                                        },{}
                                    )
                        Object.keys(sch).forEach( kind => {
                            if(sch[kind].length > 0) {
                                let tmpJson = JSON.parse(data[kind][0].schema);
                                let json = []
                                tmpJson.fields.forEach(item => {
                                    let temp = {};
                                    temp['p_name'] = item.name;
                                    temp['p_type'] = item.type;
                                    if(kind === 'value') temp['l_name'] = '';
                                    if(kind === 'value') temp['l_def'] = '';
                                    temp['is_null'] = typeof(item['type']) === 'object' && item['type'].filter(function (str) { return str.includes('null')}).length === 1 ? 'Y': 'N'
                                    temp['default'] = item.default ? item.default : '-'
                                    if(kind === 'value') temp['pii'] = '';

                                    json.push(temp)
                                })
                                meta[kind] = json
                            }
                        })
                            meta['topic_name'] = topic_name
                            meta['subject'] = schema.subject
                            meta['schema_id'] = schema.id
                            meta['schema_version'] = schema.version
                            meta['meta_version'] = 1
                            meta['revision'] = 1
                            meta['last_mod_id']=''
                            meta['last_mod_dt']=''
                            meta['is_used'] = true
                            meta['op_name'] = ''
                            meta['service'] = ''
                            meta['related_topics'] = ''
                            meta['retension'] = ''
                            meta['topic_desc'] = ''
                        }
                        this.setState({
                            ...this.state,
                            data: meta,
                            userReady:true,
                            type: type
                        })
                    }
                )

            break;

            case 'changed':
                axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:topic_name}).then( res => {
                    const {data, status } = res;
                    if(status === 200) {
                        const sch = Object.keys(data)
                                    .sort()
                                    .reduce(
                                        (newObj,key) => {
                                            newObj[key] = res.data[key];
                                            return newObj;
                                        },{}
                                    )

                        Object.keys(sch).forEach(kind => {
                            if(sch[kind].length > 0) {
                                console.log(kind, data[kind][0])
                                let tmpJson = JSON.parse(data[kind][0].schema);
                                let json = []
                                tmpJson.fields.forEach(item => {
                                    let temp = {};
                                    temp['p_name'] = item.name;
                                    temp['p_type'] = item.type;
                                    if(kind === 'value') temp['l_name'] = '';
                                    if(kind === 'value') temp['l_def'] = '';
                                    temp['is_null'] = typeof(item['type']) === 'object' && item['type'].filter(function (str) { return str.includes('null')}).length === 1 ? 'Y': 'N'
                                    temp['default'] = item.default ? item.default : '-'
                                    if(kind === 'value') temp['pii'] = '';

                                    json.push(temp)
                                })

                                meta[kind] = json
                            }
                        })

                            meta['topic_name'] = topic_name
                            meta['subject'] = schema.subject
                            meta['schema_id'] = schema.id
                            meta['schema_version'] = schema.version
                            meta['meta_version'] = 1
                            meta['revision'] = 1
                            meta['last_mod_id']=''
                            meta['last_mod_dt']=''
                            meta['is_used'] = true
                            meta['op_name'] = ''
                            meta['service'] = ''
                            meta['related_topics'] = ''
                            meta['retension'] = ''
                            meta['topic_desc'] = ''
                        }
                        this.setState({
                            ...this.state,
                            data: meta,
                            userReady:true,
                            type: type
                        })

                    }
                )

            break;

            case 'update':
                this.setState({
                    ...this.state,
                    data: meta_join,
                    prev: meta_join,
                    userReady:true,
                    type: type
                })

            break;
            default:

        }
}

    onChangeValue = (e, field) =>{
        e.preventDefault();
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                [e.target.name]:e.target.value
            },
             error:{
                ...this.state.error,
                [e.target.name]:''
             }
        })
      }

    preview = async(e, type) => {
        e.preventDefault();
        // console.log(type+" preview")
        const { data, prev } = this.state;
        let temp = {...data}, history={}

        switch(type){
            case 'reg':
                history.before = JSON.stringify({})
                break;

            case 'changed':
                temp.schema_id = data.schema_id;
                temp.meta_version = data.meta_version+1;

            break;

            case 'update':
                if(JSON.stringify(prev) === JSON.stringify(temp)){
                    this.setState({
                        ...this.state,
                        message:"변경된 내역이 없습니다",
                        messageType:'alert',
                        successful:false
                    })
                return false
            }
                temp.revision = data.revision + 1;
                history.before = JSON.stringify(this.state.prev);

            break;
            default:
                console.log("type "+type)
            }

            temp.last_mod_dt = new Date().toISOString();
            temp.last_mod_id = AuthService.getCurrentUser().userid;
            history.last_mod_dt = new Date().toISOString();
            history.last_mod_id = AuthService.getCurrentUser().userid;
            history.topic_name = temp.topic_name;
            history.after = JSON.stringify(temp);


        if(this.onValidation(temp, ["topic_name","subject","schema_id","schema_version","meta_version","op_name","service","revision","topic_desc","last_mod_dt","last_mod_id","is_used"])) {
            this.setState({
                ...this.state,
                data: temp,
                history:history,
                preview:true,
                errors:{
                    ...this.state,
                    topic_name:'',
                    subject:'',
                    schema_id:'',
                    schema_version:'',
                    meta_version:'',
                    revision:'',
                    last_mod_id:'',
                    last_mod_dt:'',
                    is_used: '',
                    op_name:'',
                    service:'',
                    retension:'',
                    topic_desc:''
                },
                successful:false,
                message:''
            })
            return false
        }

    }

    dialogReset = ()=>{
        this.setState({
          ...this.state,
          message: ""
        })
        if(this.state.successful === true) this.props.router.navigate(this.state.type === 'changed' ? -2:-1)
      }

    onSubmit = async(e, type) => {
        e.preventDefault();
        const { data, history } = this.state
        // console.log(data, prev, history)
        // console.log(type)
        // console.log(data.is_used)

        switch(type){
            case 'reg':
                await axios.post(process.env.REACT_APP_API+"/meta/insert/", data).then( res => {
                    axios.post(process.env.REACT_APP_API+"/history/inserthistory/", history).then(res =>{
                        if(res.status===200) {
                            this.setState({
                            ...this.state,
                            message:"등록이 완료되었습니다",
                            messageType:'alert',
                            successful:true
                        })
                }
                    })
                })
            break;

            case 'changed':
                await axios.post(process.env.REACT_APP_API+"/meta/insert/", data).then( res => {
                    axios.post(process.env.REACT_APP_API+"/history/inserthistory/", history).then(res =>{
                    if(res.status===200) {
                        this.setState({
                        ...this.state,
                        message:"변경 등록이 완료되었습니다",
                        messageType:'alert',
                        successful:true
                    })
                }
                    })
                })

            break;

            case 'update':
                    await axios.post(process.env.REACT_APP_API+"/meta/delete/",{keyword:data.topic_name}).then( res => {
                        if(res.status ===200) {
                            axios.post(process.env.REACT_APP_API+"/meta/insert/", data).then( res => {
                                axios.post(process.env.REACT_APP_API+"/history/inserthistory/", history).then(res =>{
                                    if(res.status===200) {
                                        this.setState({
                                            ...this.state,
                                            message:"수정이 완료되었습니다",
                                            messageType:'alert',
                                            successful:true
                                        })
                                    }
                                })
                            })
                        }
                    })

            break;
            default:
                console.log("submit")
        }
    }

    onValidation = (obj, fields) => {
        const errors = {
            topic_name:'',
            subject:'',
            schema_id:'',
            schema_version:'',
            meta_version:'',
            revision:'',
            last_mod_id:'',
            last_mod_dt:'',
            is_used: true,
            op_name:'',
            service:'',
            topic_desc:''
        }
        let formIsValid = true;

        if ('object' !== typeof obj || null == obj) formIsValid = false;

        const hasOnlyTheKeys = Array.isArray(fields) ? JSON.stringify(Object.keys(obj).filter(x => fields.includes(x)).sort()) ===  JSON.stringify(fields.sort()) : false
        if (false === hasOnlyTheKeys) formIsValid = false;

        fields.forEach( prop => {
            switch(obj[prop]){
              case null:
              case undefined:
                errors[prop] = helpers.translate(prop ,"entokr")+ ' 값은 필수입력 항목 입니다';
                formIsValid = false;
                break;
              case '':
                errors[prop] = helpers.translate(prop ,"entokr")+ ' 값은 필수입력 항목 입니다';
                formIsValid = false;
                break;
              case 0:
                break;
              default:
            }
        })
        this.setState({
            ...this.state,
            errors:errors,
            successful:false,
            message:"잘못된 입력이 있으니 안내에 맞춰 입력해주세요"
        })
        return formIsValid;
    }

    previewCancel = (e) =>{
        e.preventDefault()
        this.setState({
            ...this.state,
            preview: false
        })
    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            data:this.state.prev
        })
        this.goBack()
    }

    goBack = () => {
        this.props.router.navigate(-1)
    }

    render()
    {
        const {userReady, data} = this.state;
        let schema = Object.keys(data).map(field => {
            if(typeof(data[field]) === 'object' && data[field].length > 0) return field
        }).filter(ele => ele)
        if(userReady){
            return (
                <div className="meta">
                    <div className="page-header write">
                        <Breadcrumb/>
                    </div>
                    <div className={ this.state.preview ? "writing preview":"writing"}>
                        <div className="inner">
                            <input className="subject" name="subject" type="text" onChange={onChnageValue} placeholder="제목을 입력해주세요" />
                            <textarea className="content" name="content" onChange={onChangeValue} placeholder="내용을 입력해주세요"/>
                            <input type="file" name="upload" multiple="multiple" accept=".json,application/json" />
                        </div>
                        <div className="btn-group text-center">
                        { this.state.preview === false ?
                        <>
                            <button type="button" className="btn btn-write" onClick={e=>this.preview(e, this.state.type)}>저장 전 미리 보기</button><button type="button" className="btn btn-back" onClick={this.goBack}>뒤로가기</button></>
                            :<><button type="button" className="btn btn-write" onClick={e=>this.onSubmit(e, this.state.type)}>{ this.state.type === 'reg' ? "등록":"저장"}</button><button type="button" className="btn btn-back" onClick={e=>this.previewCancel(e)}>뒤로가기</button></>}

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