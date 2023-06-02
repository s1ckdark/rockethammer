import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import Dialog from "../dialog.component";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"

class Metawrite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userReady: false,
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
                retension:'',
                topic_desc:'',
                key:[],
                value:[]
            },
            history:{
                topic_name:'',
                before:'',
                after:'',
                last_mod_dt:'',
                last_mod_id:''
            },
            prev:{},
            type:'',
            preview: false,
            errors:{
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
                rentesion:'',
                topic_desc:''
            },
            prevJsonKey:[],
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

                    console.log(data)
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
                                    console.log(item);
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
                            type: type,
                            prevJsonKey: this.getKeys(meta)
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

    onChangeValueTemp = (e, index, field) =>{
        e.preventDefault();
        let metas = [...this.state.data[field]];
        metas.forEach((ele, idx) => {
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

    compareArray = (prev, current) => {
        return prev.every((element, index) => element === current[index])
    }

    getAllKeys = (json_object, ret_array=[]) => {
        for (var json_key in json_object) {
            if (typeof(json_object[json_key]) === 'object' && !Array.isArray(json_object[json_key])) {
                ret_array.push(json_key);
                this.getAllKeys(json_object[json_key], ret_array);
            } else if (Array.isArray(json_object[json_key])) {
                ret_array.push(json_key);
                var first_element = json_object[json_key][0];
                if (typeof(first_element) === 'object') {
                    this.getAllKeys(first_element, ret_array);
                }
            } else {
                ret_array.push(json_key);
            }
        }
        return ret_array
    }

    getKeys = object => (keys => [
        ...keys.flatMap(key => object[key] && typeof object[key] === 'object'
            ? [key, ...this.getKeys(object[key])]
            : [key]
        )
    ])(Object.keys(object))

    onChangeValueJSON = (value) =>{

        console.log(this.state.prevJsonKey)
        console.log(this.getKeys(JSON.parse(value)))
        console.log(this.getAllKeys(JSON.parse(value)))
        console.log(this.compareArray(this.state.prevJsonKey, this.getAllKeys(JSON.parse(value))))
        if(this.state.prevJsonKey.length > 0 && this.compareArray(this.state.prevJsonKey, this.getKeys(JSON.parse(value)))) {
            this.setState({
                ...this.state,
                data:JSON.parse(value),
            })
            console.log(true)
        } else {
            alert("key가 변경되었습니다")
        }



    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            data:this.state.prev
        })
        this.goBack()
    }

    readonly = (name, schema=null) => {
        if(!this.state.preview) {
            if(schema !== 'key') {
                var tmp = ["p_name","p_type","topic_name","schema_id","schema_version","_id","is_null","default","revision","schema_id","meta_version","last_mod_id","last_mod_dt","subject","retnesion"];
                let result = tmp.filter(ele => ele === name)
                return result.length > 0 ? true : false
            } else { return true; }
        } else { return true;}
    }

    goBack = () => {
        this.props.router.navigate(-1)
    }

    depth = (o) => {
        var values;
        if (Array.isArray(o)) values = o;
        else if (typeof o === "object") values = Object.keys(o).map(k=>o[k]);
        return values ? Math.max.apply(0, values.map(this.depth))+1 : 1;
    }
    inputfield = ( field_name, field_type = 'input') => {
        const data = this.state.data;
        return (
            <div className={"input-group "+field_name}>
                <label htmlFor='field_name' className="field-label">{helpers.translate(field_name, "entokr")}</label>
                 {field_type === 'textarea' ?
                    <textarea name={field_name} className={"input-"+field_name} value={data[field_name]} onChange={(e)=> this.onChangeValue(e, field_name)} readOnly={this.readonly(field_name)} placeholder={helpers.translate(field_name, "entokr")+"를 입력하세요"}/>
                :<input name={field_name} className={"input-"+field_name} value={data[field_name]} onChange={(e)=> this.onChangeValue(e, field_name)} readOnly={this.readonly(field_name)} placeholder={helpers.translate(field_name, "entokr")+"를 입력하세요"}/>}
                <span className={"input-validator error-msg input-validator-"+field_name}>{this.state.errors[field_name]}</span>
            </div>
        )
    }

    render()
    {
        const {userReady, data} = this.state;

        if(userReady){
            let schema = Object.keys(data).map(field => {
                if(typeof(data[field]) === 'object' && data[field].length > 0) return field
            }).filter(ele => ele)
            return (
                <div className="meta">
                    <div className="page-header write">
                        <Breadcrumb/>
                    </div>
                    <div className={ this.state.preview ? "writing preview":"writing"}>
                            {this.depth(data) <=4 ?
                            <>
                            <div className="default-group">
                                <div className="inner">
                                    {this.inputfield("topic_name")}
                                    {this.inputfield("schema_id")}
                                    {this.inputfield("schema_version")}
                                    {this.inputfield("op_name")}
                                    {this.inputfield("service")}
                                    {this.inputfield("related_topics")}
                                    {this.inputfield("retension")}
                                    {this.inputfield("topic_desc", 'textarea')}
                                </div>
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
                                                            <th scope="row">{index+1}</th>
                                                                {Object.keys(field).map((field2) => {
                                                                    return (
                                                                        <td><input type="text" name={field2} className={"field-input "+field2} value={field[field2]} onChange={(e)=>this.onChangeValueTemp(e, index, ele)} readOnly={this.readonly(field2, field)} placeholder="-"/></td>
                                                                    );
                                                                })}
                                                        </tr>
                                                        </>
                                                    )
                                                })}
                                            </table>
                                        </div>
                                        )
                                    })}
                            </div>
                            </>
                        :
                        <AceEditor
                            mode="json"
                            theme="tomorrow"
                            name={schema._id}
                            value = {JSON.stringify(this.state.data, null, 4)}
                            // editorProps={{ $blockScrolling: true }}
                            onLoad={editor => {
                                const session = editor.getSession();
                                const undoManager = session.getUndoManager();
                                undoManager.reset();
                                session.setUndoManager(undoManager);
                                // session.$worker.call("")


                                session.selection.on('changeCursor', function(e) {
                                    // delta.start, delta.end, delta.lines, delta.action
                                    // console.log(this.state.prevJsonKey)
                                    // console.log(this.compareArray(this.state.prevJsonKey, this.getAllKeys(this.state.data)))
                                    console.log(session.selection.cursor)
                                });
                              }}
                            onChange={this.onChangeValueJSON}
                            // commands={[{
                            //     exec: (editor,e) => {
                            //     var rowCol = editor.selection.getCursor();
                            //     console.log(rowCol)
                            //     if ((rowCol.row === 0) || ((rowCol.row + 1) === editor.session.getLength())) {
                            //       e.preventDefault();
                            //       e.stopPropagation();
                            //     }
                            // }}]}
                            fontSize= {14}
                            width= "100%"
                            height="500px"
                            />
                    }

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

export default withRouter(Metawrite)