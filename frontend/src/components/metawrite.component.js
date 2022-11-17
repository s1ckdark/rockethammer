import React, { Component } from "react";
import {useNavigate, Redirect, Link, useLocation } from 'react-router-dom';
import AuthService from "../services/auth.service";
import axios from "axios"
import helpers from "../common/helpers";
import { withRouter } from "../common/withRouter";

function parseNested(str) {
    try {
        return JSON.parse(str, (_, val) => {
            if (typeof val === 'string')
                return parseNested(val)
            return val
        })
    } catch (exc) {
        return str
    }
}

class Metawrite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
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
                related_topics:'',
                topic_desc:'',
                key:[],
                value:[]
            },
            history:{},
            prevData:{},
            type:'',
            preview: false,
            error:{
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
        };
    }

    componentDidMount(){
        const {type, data, schemas} = this.props.router.location.state;
        const schema = parseNested(JSON.stringify(data.schema))
        let meta = typeof(data.meta_join) === 'string' ? parseNested(JSON.stringify(data.meta_join)):{}
        console.log(type,meta)
        if(data && ( type === 'reg' || type ==='change')){
            meta = {
                ...this.state.data,
                topic_name: schema.subject.replace(/(-value|-key)/g, ""),
                subject:schema.subject,
                schema_id: schema.id.$numberLong,
                schema_version: schema.version.$numberLong,
                meta_version: type ==='reg' ? 1: meta.meta_version + 1,
                revision:1,
                last_mod_dt: new Date().toISOString(),
                last_mod_id:AuthService.getCurrentUser().userid,
                is_used: true
            }

            Object.keys(schemas).map( kind => {
                if(schemas[kind].length > 0){
                    let toJson = JSON.parse(schemas[kind][0].schema);
                    let jsons = []
                    toJson.fields.map((item, idx) => {
                        let json = {};
                        json.p_name = item.name;
                        json.p_type = item.type;
                        if(kind === 'value') json.l_name = '';
                        if(kind === 'value') json.l_def = '';
                        json.is_null = typeof(item['type']) === 'object' && item['type'].filter(function (str) { return str.includes('null')}).length === 1 ? 'y': 'n'
                        json.default = item.default ? item.default : ''
                        if(kind === 'value') json.memo = '';
                        jsons[idx] = json;
                        json.pii = '';
                        json.retension = '';
                    })
                    console.log("jsons",jsons);
                }
            })
            this.setState({
                ...this.state,
                data:meta,
                prevData:meta,
                type:type
            })
        } else if(data && type ==='update') {
            delete meta['_id'];
            meta['revision'] = meta['revision'] + 1;
            meta['last_mod_dt'] = new Date().toISOString();
            meta['last_mod_id'] = AuthService.getCurrentUser().userid;
            this.setState({
                ...this.state,
                data: meta,
                prevData:parseNested(JSON.stringify(data.meta_join)),
                type:type
            });
    }
}

    onChangeValue = (e, field) =>{
        e.preventDefault();
        this.setState({
            ...this.state,
         data: {
             ...this.state.data,
             [e.target.name]:e.target.value
             }
        })
      }

    onChangeValueTemp = (e, index, field) =>{
        e.preventDefault();
        let metas = [...this.state.data[field]];
        metas.map((ele, idx) => {
            if(idx === index) {
                let meta = {...metas[index]};
                meta[e.target.name] = e.target.value;
                metas[idx] = meta;
            }
        }
        )
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                [field]:metas
            }
        })
    }
    onPreview = async(e, type) => {
        e.preventDefault();
        let temp = this.state.data;
        if(type === 'reg' || type ==='change'){
            if(type === 'reg') {
                temp.meta_version = 1;
                console.log(type);
            } else {
                let meta_versionInt = this.state.prevData.meta_version + 1;
                temp.meta_version = meta_versionInt;
                console.log(type);
            }
            temp.last_mod_dt = new Date().toISOString();
            temp.last_mod_id = AuthService.getCurrentUser().userid;

            this.setState({
                ...this.state,
                    data: temp
                },()=>{
                this.setState({
                    ...this.state,
                    history:{
                            topic_name:this.state.data.topic_name,
                            before:type==='reg' ? "":JSON.stringify(this.state.prevData),
                            after:JSON.stringify(this.state.data),
                            last_mod_dt:new Date().toISOString(),
                            last_mod_id:AuthService.getCurrentUser().userid
                        }
                    })
                }
            )
        } else if(type === 'update'){
            console.log(type);
            temp.revision = parseInt(this.state.prevData.revision)+1;
            temp.is_used = "true";
            temp.last_mod_dt = new Date().toISOString();
            temp.last_mod_id = AuthService.getCurrentUser().userid;
            this.setState({
                    ...this.state,
                data: temp
                },()=>{
                this.setState({
                    ...this.state,
                    history:{
                            topic_name:this.state.prevData.topic_name,
                            before:JSON.stringify(this.state.prevData),
                            after:JSON.stringify(this.state.data),
                            last_mod_dt:new Date().toISOString(),
                            last_mod_id:AuthService.getCurrentUser().userid
                        }
                    })
                }
            )
        }

        if(this.onValidation(this.state.data, ["topic_name","subject","schema_id","schema_version","meta_version","op_name","service","revision","topic_desc","last_mod_dt","last_mod_id","is_used"])) {
            this.setState({
                ...this.state,
                error:{
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
                },
                preview:true
            })
        } else {return false}
    }
    onValidation = (obj, fields) => {
        console.log("validation");
        if ('object' !== typeof obj || null == obj) {
            console.log('Object is not valid');
            return false;
        }

        const hasOnlyTheKeys = Array.isArray(fields) ? JSON.stringify(Object.keys(obj).filter(x => fields.includes(x)).sort()) ===  JSON.stringify(fields.sort()) : false
        if (false === hasOnlyTheKeys) return false;

        let temp = {};
        fields.map( prop => {
            switch(obj[prop]){
              case null:
              case undefined:
                console.log(prop + ' is undefined');
                break;
              case '':
                console.log(prop + ' is empty string');
                temp[prop] = helpers.replaceKey(prop ,"entokr")+ ' 값은 필수입력 항목 입니다';
                break;
              case 0:
                console.log(prop + ' is 0');
                break;
              default:
            }
        })
        this.setState({
            ...this.state,
            error:temp
        })
        return Object.keys(temp).length > 0 ? false:true
    }
    onCancel = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            data:this.state.prevData
        })
        this.props.closeWrite(e)
    }
    onPreviewClose = (e) => {
        this.setState({
            ...this.state,
            preview: false,
            data:this.state.prevData
        })
    }
    onSubmit = async(e, type) => {
        e.preventDefault();
        let temp = this.state.data;
        if(type === 'reg' || type ==='change'){
            await axios.post(process.env.REACT_APP_API+"/meta/insert/", this.state.data).then( res => {
                axios.post(process.env.REACT_APP_API+"/history/inserthistory/", this.state.history).then(res =>{
                if(res.status===200) {
                    localStorage.removeItem('type');
                    localStorage.removeItem('data');
                    alert("등록 완료");
                setTimeout(() => {
                    this.props.router.navigate(-1)
                }, 1000);}
                })
            })
        } else if(type === 'update'){
            let prevData = this.state.prevData, nextData= this.state.data;
            if(JSON.stringify(prevData) === JSON.stringify(temp)){
                localStorage.removeItem('type');
                localStorage.removeItem('data');
                alert("변경된 내용이 없습니다.");
                this.props.closeWrite(e);
            } else {
                console.log("changed");
                await axios.post(process.env.REACT_APP_API+"/meta/deleteall/",{keyword:this.state.data.topic_name})
                await axios.post(process.env.REACT_APP_API+"/meta/insert/", this.state.data).then( res => {
                    axios.post(process.env.REACT_APP_API+"/history/inserthistory/", this.state.history).then(res =>{
                    if(res.status===200) {
                        localStorage.removeItem('type');
                        localStorage.removeItem('data');
                        alert("수정 완료");
                        setTimeout(() => {
                        this.props.closeWrite(e);
                    }, 1000);}
                    })
                })
            }
        }
    }

    onChangeValueJSON = (e, index, whatisit) =>{
        e.preventDefault();
        this.setState({
            ...this.state,
            json:e.target.value
        })
    }

    readonly = (name, schema=null) => {
        if(!this.state.preview) {
        // console.log(name, schema);
            if(schema !== 'key') {
                var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id","is_null","default","revision","schema_id","meta_version","last_mod_id","last_mod_dt","subject"];
                let result = tmp.filter(ele => ele === name)
                return result.length > 0 ? true : false
            } else { return true; }
        } else { return true;}
    }
    hideField = (name) =>{
        let tmp = ["last_mod_dt","last_mod_id","subject","is_used","meta_version","revision","_class"];
        let result = tmp.filter(ele => ele === name )
        return result.length > 0 ? "d-none" : "d-block"
    }
    goBack = () => {
        this.props.router.navigate(-1)
    }
    render()
    {
        return (
            <div className="metawrite">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item"><a href="#">Meta</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Write</li>
                    </ol>
                </nav>
                <div className={ this.state.preview ? "onpreview":"write"}>
                        <div className="d-flex flex-wrap my-5">
                        {Object.keys(this.state.data).map(field => {
                            // common field
                            const data = this.state.data;
                            // console.log(field, data[field]);
                            if(typeof(data[field]) !== "object" || data[field] === null){
                                if(field === 'topic_desc') {
                                    return (
                                        <div className={this.hideField(field)+" form-group col-md-12 mb-5 "+field}>
                                            <div className={field}><p className="field-label">{helpers.translate(field, "entokr")}</p></div>
                                            <div className={"value-"+field+" value"}>
                                                <textarea name={field} className={"input-"+field+" input-value w-100"} value={data[field]} onChange={(e)=> this.onChangeValue(e, field)} readOnly={this.readonly(field)}/>
                                            </div>
                                            <span className={"text-danger "+field}>{this.state.error[field]}</span>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={this.hideField(field)+" form-group col-md-3 mb-5 "+field}>
                                            <div className={field}><p className="field-label">{helpers.translate(field, "entokr")}</p></div>
                                            <div className={"value-"+field+" value"}>
                                                <input type="text" name={field} className={"input-"+field+" input-value w-75"} value={data[field]} onChange={(e)=> this.onChangeValue(e, field)} readOnly={this.readonly(field)}/>
                                            </div>
                                            <span className={"text-danger "+field}>{this.state.error[field]}</span>
                                        </div>
                                    )
                                }
                            } else {
                                if(field === 'related_topics'){
                                    return (
                                        <div className="form-group field col-md-3 mb-5">
                                                <div className={field}><p className="field-label">{helpers.translate(field, "entokr")}</p></div>
                                                <div className={"value-"+field+" value"}>
                                                    <input type="text" name={field} className={"input-"+field+" input-value w-75"} value={data[field]} onChange={(e)=> this.onChangeValue(e, field)} readOnly={this.readonly(field)}/>
                                                </div>
                                                <span className={"text-danger "+field}>{this.state.error[field]}</span>
                                            </div>
                                        )
                                    } else {
                                        if(data[field] && data[field].length > 0 ){
                                            return(
                                                <div className="col-md-12">
                                                <h3 className="h3 schema-field mt-5">{field} Schema</h3>
                                                <table className={"table my-1 "+field}>
                                                    {data[field].map((meta_field, index) => {
                                                        return (
                                                            <>
                                                             {index === 0 ?
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">번호</th>
                                                                        {Object.keys(meta_field).map((field2, index) => {
                                                                           var tmp = field === "value" ? [2, 1, 2, 3, 1, 1, 2] : [3,3,3,3];
                                                                            return (
                                                                                <>
                                                                                    <th scope="col" className={"text-center col-"+tmp[index]}>{helpers.translate(field2,"entokr")}</th>
                                                                                </>
                                                                            );
                                                                        })
                                                                        }
                                                                    </tr>
                                                                </thead>
                                                            :<></>}
                                                           <tbody>
                                                                <tr>
                                                                <th scope="row">{index+1}</th>
                                                                {Object.keys(meta_field).map((field2) => {
                                                                        return (
                                                                            <td><input type="text" name={field2} className={"field-input "+field2} value={data[field][index][field2]} onChange={(e)=>this.onChangeValueTemp(e, index, field)} readOnly={this.readonly(field2, field)} /></td>
                                                                        );

                                                                    })
                                                                }
                                                                </tr>
                                                            </tbody>
                                                        </>)})}
                                                </table>
                                                </div>)
                                        } else {
                                            return (
                                                <>
                                                    <div className="col-md-12 d-none">
                                                    <h3 className="h3 schema-field mt-5 mb-2">등록된 {field} schema가 없습니다</h3>
                                                    </div>
                                                </>
                                            )
                                        }
                                    }
                                }
                            })
                        }
                        </div>
                        <div className="action text-center">
                        { this.state.preview === false ?
                        <>
                            <button type="button" className="btn btn-primary me-1" onClick={e=>this.onPreview(e, this.state.type)}>저장 전 미리 보기</button><button type="button" className="btn btn-secondary" onClick={this.goBack}>뒤로가기</button></>
                            :<><button type="button" className="btn btn-primary me-1" onClick={e=>this.onSubmit(e, this.state.type)}>{ this.state.type === 'reg' ? "등록":"저장"}</button><button type="button" className="btn btn-secondary" onClick={e=>this.onPreviewClose(e)}>뒤로가기</button></>}

                        </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(Metawrite)