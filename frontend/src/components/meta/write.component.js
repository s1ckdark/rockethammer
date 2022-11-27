import React, { Component } from "react";
import {useNavigate, Redirect, Link, useLocation } from 'react-router-dom';
import AuthService from "../../services/auth.service";
import axios from "axios"
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";

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

    fetch = async(topic_name) => {
        try {
            return await axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:topic_name})
        } catch (err) {
            console.log(err)
        }
    }

    componentDidMount(){
        const {type, data } = this.props.router.location.state;
        console.log(type,data);
        const schema = JSON.parse(data.schema)
        let meta = typeof(data.meta_join) === 'string' ? helpers.parse(data.meta_join):{}
        if(helpers.isEmptyObj(data) === false && ( type === 'reg' || type ==='change')){
            const schemas = async() => {
                const res = await this.fetch(schema.subject.replace(/(-value|-key)/g, ""))
                if (res) {
                    console.log(res.data)
                    Object.keys(res.data).map( kind => {
                        if(res.data[kind].length > 0){
                            let toJson = JSON.parse(res.data[kind][0].schema);
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
                                if(kind === 'value') json.pii = '';
                                if(kind === 'value') json.retension = '';
                                jsons[idx] = json;
                            })
                            console.log("jsons",jsons);

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
                            is_used: true,
                            [kind]:jsons
                        }
                    }
                    })

                    this.setState({
                        ...this.state,
                        data:meta,
                        prevData:meta,
                        type:type
                    })
                  }
                }
            schemas();
        } else if(data && type ==='update') {
            delete meta['_id'];
            delete meta['_class']
            meta['revision'] = meta['revision'] + 1;
            meta['last_mod_dt'] = new Date().toISOString();
            meta['last_mod_id'] = AuthService.getCurrentUser().userid;
            this.setState({
                ...this.state,
                data: meta,
                prevData:helpers.parseNested(JSON.stringify(data.meta_join)),
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
                    alert("등록 완료");
                setTimeout(() => {
                    this.props.router.navigate(-1)
                }, 1000);}
                })
            })
        } else if(type === 'update'){
            let prevData = this.state.prevData, nextData= this.state.data;
            if(JSON.stringify(prevData) === JSON.stringify(temp)){
                alert("변경된 내용이 없습니다.");
                this.props.closeWrite(e);
            } else {
                console.log("changed");
                await axios.post(process.env.REACT_APP_API+"/meta/deleteall/",{keyword:this.state.data.topic_name})
                await axios.post(process.env.REACT_APP_API+"/meta/insert/", this.state.data).then( res => {
                    axios.post(process.env.REACT_APP_API+"/history/inserthistory/", this.state.history).then(res =>{
                    if(res.status===200) {
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

    goBack = () => {
        this.props.router.navigate(-1)
    }
    inputfield = ( field_name, field_type = 'input') => {
        const data = this.state.data;
        return (
            <div className={"form-group "+field_name}>
                <div className={"label-"+field_name}><p className="field-label">{helpers.translate(field_name, "entokr")}</p></div>
                <div className={"value-"+field_name+" value"}>
                 {field_type === 'textarea' ?
                    <textarea name={field_name} className={"input-"+field_name+" input-value w-100"} value={data[field_name]} onChange={(e)=> this.onChangeValue(e, field_name)} readOnly={this.readonly(field_name)} placeholder={helpers.translate(field_name, "entokr")+"를 입력하세요"}/>
                :<input name={field_name} className={"input-"+field_name+" input-value w-100"} value={data[field_name]} onChange={(e)=> this.onChangeValue(e, field_name)} readOnly={this.readonly(field_name)} placeholder={helpers.translate(field_name, "entokr")+"를 입력하세요"}/>}
                    </div>
                <span className={"input-validator input-validator-"+field_name}>{this.state.error[field_name]}</span>
            </div>
        )
    }
    render()
    {
        const {type, data } = this.props.router.location.state;
        const schema = JSON.parse(data.schema)
        let meta = type === 'update' ? helpers.parse(data.meta_join):{}
        delete meta['_id']
        console.log(type,meta);
        return (
            <div className="meta">
                <div className="page-header write">
                    <Breadcrumb/>
                </div>
                <div className={ this.state.preview ? "onpreview":"writing"}>
                    {this.inputfield("topic_name")}
                    <div className="required">
                        {this.inputfield("schema_id")}
                        {this.inputfield("schema_version")}
                        {this.inputfield("op_name")}
                        {this.inputfield("service")}
                        {this.inputfield("related_topics")}
                        {this.inputfield("topic_desc", 'textarea')}
                    </div>
                        {Object.keys(meta).map(field => {
                            console.log(field, meta[field])
                            if(meta[field] && typeof(meta[field]) === "object" && helpers.isEmpty(meta[field]) === false ){

                                return(
                                    <div className={field+"-schema"}>
                                        <h3 className="h3 schema-field mt-5">{field} Schema</h3>
                                        <table className={"table my-1 "+field}>
                                            {meta[field].map((meta_field, index) => {
                                                console.log(meta_field)
                                                return (
                                                    <>
                                                    {index === 0 ?
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" claasName="col-1">번호</th>
                                                                {Object.keys(meta_field).map((field2, index) => {
                                                                    return (
                                                                        <>
                                                                            <th scope="col" className="text-center">{helpers.translate(field2,"entokr")}</th>
                                                                        </>
                                                                    );
                                                                })
                                                                }
                                                            </tr>
                                                        </thead>
                                                    :<></>}
                                                    <tbody>
                                                        <tr>
                                                        <td scope="row">{index+1}</td>
                                                        {Object.keys(meta_field).map((field2) => {
                                                                return (
                                                                    <td><input type="text" name={field2} className={"field-input "+field2} value={data[field][index][field2]} onChange={(e)=>this.onChangeValueTemp(e, index, field)} readOnly={this.readonly(field2, field)} /></td>
                                                                );

                                                            })
                                                        }
                                                        </tr>
                                                    </tbody>

                                                </>)
                                            })}

                                        </table>
                                    </div>)
                                }
                            })
                        }
                        <div className="btn-group text-center">
                        { this.state.preview === false ?
                        <>
                            <button type="button" className="btn btn-write" onClick={e=>this.onPreview(e, this.state.type)}>저장 전 미리 보기</button><button type="button" className="btn btn-back" onClick={this.goBack}>뒤로가기</button></>
                            :<><button type="button" className="btn btn-write" onClick={e=>this.onSubmit(e, this.state.type)}>{ this.state.type === 'reg' ? "등록":"저장"}</button><button type="button" className="btn btn-back" onClick={e=>this.onPreviewClose(e)}>뒤로가기</button></>}

                        </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(Metawrite)