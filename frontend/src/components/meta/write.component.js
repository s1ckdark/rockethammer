import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";
import Dialog from "../dialog.component";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/webpack-resolver";

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
                // last_mod_id:'',
                // last_mod_dt:'',
                is_used: true,
                op_name:'',
                service:'',
                related_topics:'',
                // retension:'',
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
                // last_mod_id:'',
                // last_mod_dt:'',
                is_used: true,
                op_name:'',
                service:'',
                // rentesion:'',
                topic_desc:''
            },
            prevJson:{
                key:[],
                value:[]
            },
            chklist:[],
            tmpJson:'',
            invalids:[],
            message:'',
            messageType:'',
            successful:false,
            theme:'monokai'
        };
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeValueJSON = this.onChangeValueJSON.bind(this);
        this.onChangeValueTemp = this.onChangeValueTemp.bind(this);
    }

    componentDidMount(){
        const {schema, meta_join, type, topic_name} = this.props.router.location.state;
        let meta ={}
        var chklist = ["topic_name","subject","schema_id","meta_version","revision","is_used","p_name","p_type","default","is_null"]
        switch(type) {
            case 'reg':
                axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:topic_name}).then( res => {
                    const {data, status } = res;
                    if(status === 200) {
                        meta['topic_name'] = topic_name
                        meta['subject'] = schema.subject
                        meta['schema_id'] = schema.id
                        meta['schema_version'] = schema.version
                        meta['meta_version'] = 1
                        meta['revision'] = 1
                        // meta['last_mod_id']=''
                        // meta['last_mod_dt']=''
                        meta['is_used'] = true
                        meta['op_name'] = ''
                        meta['service'] = ''
                        meta['related_topics'] = ''
                        // meta['retension'] = ''
                        meta['topic_desc'] = ''
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
                                json=this.transformFields(tmpJson.fields)
                                meta[kind] = json
                            }
                        })

                        }
                        this.setState({
                            ...this.state,
                            data: meta,
                            userReady:true,
                            type: type,
                            prevJson:{
                                ...this.state.prevJson,
                                key: this.getKeys(meta),
                                value: this.findValues(meta, chklist)
                            },
                            tmpJson:meta,
                            chklist: chklist
                        })
                    }
                )

            break;

            case 'changed':
                axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:topic_name}).then( res => {
                    const {data, status } = res;
                    if(status === 200) {
                        meta['topic_name'] = topic_name
                        meta['subject'] = schema.subject
                        meta['schema_id'] = schema.id
                        meta['schema_version'] = schema.version
                        meta['meta_version'] = 1
                        meta['revision'] = 1
                        // meta['last_mod_id']=''
                        // meta['last_mod_dt']=''
                        meta['is_used'] = true
                        meta['op_name'] = ''
                        meta['service'] = ''
                        meta['related_topics'] = ''
                        // meta['retension'] = ''
                        meta['topic_desc'] = ''
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
                                json=this.transformFields(tmpJson.fields)
                                meta[kind] = json
                            }
                        })
                        }
                        this.setState({
                            ...this.state,
                            data: meta,
                            userReady:true,
                            type: type,
                            tmpJson: meta_join,
                            prevJson:{
                                ...this.state.prevJson,
                                key: this.getKeys(meta),
                                value: this.findValues(meta, chklist)
                            },
                            chklist: chklist
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
                    type: type,
                    tmpJson: meta_join,
                    prevJson:{
                        ...this.state.prevJson,
                        key: this.getKeys(meta_join),
                        value: this.findValues(meta_join, chklist)
                    },
                    chklist: chklist
                })

            break;
            default:

        }
}
    setDefaultValue = (field) => {
    if ('default' in field) {
        let defaultValue = field['default'];
        delete field['default'];
        return defaultValue;
    } else {
        return "";
    }
}

    transformFields= (fields)=>{
        for (let field of fields) {
            if ('name' in field) {
                field['p_name'] = field['name'];
                delete field['name'];
            }
            if ('type' in field) {
                if (typeof field['type'] === 'object') {
                    this.transformFields(field['type']['fields']);
                    field['type']['p_name'] = field['type']['name'];
                    delete field['type']['name'];
                    field['p_type'] = field['type']['type'];
                    delete field['type']['type'];
                } else {
                    field['p_type'] = field['type'];
                    delete field['type'];
                }
            }
            field["l_name"] = "";
            field["l_def"] = "";
            field["is_null"] = helpers.isNull(field['p_type']);
            field["default"] = this.setDefaultValue(field);
            // field["pii"] = "";
        }
        return fields;
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

        console.log(temp)

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
                // console.log("submit")
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

    areArraysEqual = (a, b) => {
        // Check if the arrays have the same length
        if (a.length !== b.length) {
          return false;
        }

        // Recursive function to compare arrays
        const compareArrays = (arr1, arr2) => {
          // Base case: check if the arrays are equal
          if (arr1.length !== arr2.length) {
            return false;
          }

          // Recursive case: compare each element in the arrays
          return arr1.every((element, index) => {
            // Check if the elements are arrays
            if (Array.isArray(element) && Array.isArray(arr2[index])) {
              // Recursively compare nested arrays
              return compareArrays(element, arr2[index]);
            }

            // Check if the elements have the same content
            return element === arr2[index];
          });
        };

        // Start the recursive comparison
        // console.log(a,b,compareArrays(a,b))
        return compareArrays(a, b);
      };

    compareValueArray = (a, b) => {
        // Check if the arrays have the same length
        if (a.length !== b.length) {
          return false;
        }

        // Iterate over each element in the arrays
        return a.every((arr, index) => {
          // Check if the elements are arrays and have the same content
          return Array.isArray(arr) && Array.isArray(b[index]) && JSON.stringify(arr) === JSON.stringify(b[index]);
        });
      };


    renderAnnotations = (annotations) => {
        return annotations.map((annotation, index) => {
            const { row, column, text, type } = annotation;
            const position = { row, column };

            return {
            type: type || 'error',
            text: text || 'Annotation',
            row,
            column,
            position,
            key: index
            };
        });
     };

    getAllKeys = (json_object, ret_array=[]) => {
        if(typeof(json_object) !=='object') return false
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


    findValues = (obj, key)=>{
        if(typeof key !=='object') return this.findValueHelpers(obj, key, []);
        return key.map( k => this.findValueHelpers(obj, k))
    }

    findValueHelpers = (obj, key, list=[]) => {
      if (!obj) return list;
      if (obj instanceof Array) {
        for (var i in obj) {
            list = list.concat(this.findValueHelpers(obj[i], key, []));
        }
        return list;
      }
      if (obj[key]) list.push(obj[key]);

      if ((typeof obj == "object") && (obj !== null) ){
          var children = Object.keys(obj);
          if (children.length > 0){
              for (i = 0; i < children.length; i++ ){
                list = list.concat(this.findValueHelpers(obj[children[i]], key, []));
              }
          }
      }
      return list;
    }

    areObjectsEqual = (obj1, obj2) => {
        // Check if the objects have the same number of keys
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
          return false;
        }

        // Check if the values of each key are equal
        for (let key of keys1) {
          const value1 = obj1[key];
          const value2 = obj2[key];

          if (typeof value1 !== typeof value2) {
            return false;
          }

          if (typeof value1 === 'object' && typeof value2 === 'object') {
            // Recursively compare nested objects
            if (!this.areObjectsEqual(value1, value2)) {
              return false;
            }
          } else {
            // Compare primitive values
            if (value1 !== value2) {
              return false;
            }
          }
        }

        return true;
      };

    onChangeValueJSON = async (value, e) =>{
        const {chklist}=this.state
        var tmp = JSON.parse(helpers.replaceKey(value, "krtoen"))
        console.log(this.getKeys(tmp), this.findValues(tmp, chklist))
        var valueCompare = await this.areObjectsEqual(this.state.prevJson.value, this.findValues(tmp, chklist))
        var keyCompare = await this.areArraysEqual(this.state.prevJson.key, this.getKeys(tmp))
        if(keyCompare && valueCompare) {
            this.setState({
                ...this.state,
                data:JSON.parse(helpers.replaceKey(tmp, "krtoen")),
                tmpJson:tmp
            })
        } else {
              this.setState({
                ...this.state,
                message: keyCompare && !valueCompare ? "value는 변경될 수 없습니다":"key는 변경될 수 없습니다",
                messageType:'alert',
                successful:false
            },()=>document.querySelector(".dialog .btn-close").focus())
        }
    }

    closeErr = () => {
        this.setState({
            ...this.state,
            successful: false,
            errors:{
                topic_name:'',
                subject:'',
                schema_id:'',
                schema_version:'',
                meta_version:'',
                revision:'',
                // last_mod_id:'',
                // last_mod_dt:'',
                is_used: true,
                op_name:'',
                service:'',
                // rentesion:'',
                topic_desc:''
            },
        })
    }

    findTheDifference = (s, t) => {
        function sortString(str) {
          return str.split('').sort()
        }

        var str1 = sortString(s)
        var str2 = sortString(t)

        var longestStrArr = str1.length > str2.length ? str1 : str2
        for (var i = 0; i < str1.length; i++) {
          if(str1[i] !== str2[i]){
            return longestStrArr[i]
          }
        }
        return longestStrArr[longestStrArr.length - 1]
    };

    onChangeTheme = async (e) => {
        this.setState({
            ...this.state,
            theme: e.target.value
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

    readonly = (name, schema=null) => {
        if(!this.state.preview) {
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
        const {userReady, data, type, tmpJson, successful} = this.state;
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
                            {helpers.depth(data) <= 4 ?
                            <>
                            <div className="default-group">
                                <div className="inner">
                                    {this.inputfield("topic_name")}
                                    {this.inputfield("schema_id")}
                                    {this.inputfield("schema_version")}
                                    {this.inputfield("op_name")}
                                    {this.inputfield("service")}
                                    {this.inputfield("related_topics")}
                                    {/* {this.inputfield("retension")} */}
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
                        <>
                        <div className="theme-selector">
                            <p className="control">
                                <span className="select">
                                    <select name="Theme" onChange={this.onChangeTheme}>
                                        <option value="monokai">monokai</option>
                                        <option value="github">github</option>
                                        <option value="tomorrow">tomorrow</option>
                                        <option value="kuroir">kuroir</option>
                                        <option value="twilight">twilight</option>
                                        <option value="xcode">xcode</option>
                                        <option value="textmate">textmate</option>
                                        <option value="solarized_dark">solarized_dark</option>
                                        <option value="solarized_light">solarized_light</option>
                                        <option value="terminal">terminal</option>
                                    </select>
                                </span>
                            </p>
                        </div>

                        <AceEditor
                            mode="json"
                            theme={this.state.theme}
                            name={schema._id}
                            value = {typeof tmpJson === 'object' ? helpers.replaceKey(tmpJson,"entokr"):tmpJson}
                            onLoad={editor => {
                                const session = editor.getSession();
                                const undoManager = session.getUndoManager();

                                session.setUndoManager(undoManager);
                                const {key, value} = this.state.prevJson
                                const {chklist}=this.state
                                // editor.commands.on("exec", function(e) {
                                //     var rowCol = editor.selection.getCursor();
                                //     var currline = editor.getSelectionRange().start.row;
                                //     var wholelinetxt = session.getLine(currline);
                                //     var regexRules = /(\[|]|\{|}|},|],)/g, ex='', checkKey = false
                                //     if(!regexRules.test(wholelinetxt)) {
                                //         ex = wholelinetxt.replaceAll(regexRules, "").trim().slice(-1) === ',' ? JSON.parse("{"+wholelinetxt.trim().slice(0,-1)+"}"):JSON.parse("{"+wholelinetxt.trim()+"}")
                                //         checkKey = Array.isArray(Object.keys(ex)) && chklist.includes(Object.keys(ex)[0]) ? true : false
                                //     } else {
                                //         checkKey = true
                                //     }
                                //     console.log(ex, checkKey)

                                //     if(checkKey && rowCol.row === currline) {
                                //             e.preventDefault();
                                //             e.stopPropagation();
                                //     }
                                //   });

                                //   editor.getSession().on("changeAnnotation", function () {
                                //     var annot = editor.getSession().getAnnotations();

                                //     for (var key in annot) {
                                //       if (annot.hasOwnProperty(key))
                                //         console.log(annot[key].text + "on line " + " " + annot[key].row);
                                //     }
                                //   });

                                // session.selection.on('changeCursor', function(e) {
                                    // console.log(e)
                                    // var rowCol = editor.selection.getCursor();
                                    // var currline = editor.getSelectionRange().start.row;
                                    // var wholelinetxt = session.getLine(currline);
                                    // var regexRules = /(\[|]|\{|}|},|],)/g, ex='', checkKey = false
                                    // if(!regexRules.test(wholelinetxt)) {
                                    //     ex = wholelinetxt.replaceAll(regexRules, "").trim().slice(-1) === ',' ? JSON.parse("{"+wholelinetxt.trim().slice(0,-1)+"}"):JSON.parse("{"+wholelinetxt.trim()+"}")
                                    //     checkKey = Array.isArray(Object.keys(ex)) && chklist.includes(Object.keys(ex)[0]) ? true : false
                                    // } else {
                                    //     checkKey = true
                                    // }
                                    // console.log(ex, checkKey)
                                // })

                                editor.session.on('change', function(delta,e) {
                                    // console.log(e, delta)
                                    function getByteB(str){
                                        var byte = 0;
                                        for (var i=0; i<str.length; ++i) {
                                            (str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
                                        }
                                        return byte;
                                    }
                                    const ex = ['"','[',':',']','{','}',',']
                                    if(delta.action === 'remove' && ex.includes(delta.lines[0]) && getByteB(delta.lines[0] === 1)) {
                                        // editor.session.insert(delta.start, delta.lines[0])
                                        undoManager.undo()
                                    } else if(delta.action === 'insert' && ex.includes(delta.lines[0]) && getByteB(delta.lines[0] === 1)) {
                                        // editor.session.insert(delta.start, delta.lines[0])
                                        undoManager.undo()
                                    }
                               });

                                if(type === 'preview') session.setReadOnly(true)
                                session.setMode(`ace/mode/json`, () => {
                                    const rules = session.$mode.$highlightRules.getRules();
                                    if (Object.prototype.hasOwnProperty.call(rules, 'start')) {
                                        rules.start = [
                                        {
                                            token: 'variable',
                                            regex: '"(토픽명|스키마ID|물리스키마버전|메타버전|관리부서|업무시스템|논리스키마버전|연관토픽|토픽설명|최종수정시간|최종수정자|물리명|데이터 타입|논리명|설명|널 여부|기본값|key|_id|value|p_name|p_type|l_name|l_def|is_null|default|pii|op_name|topic_name|subject|schema_id|schema_version|meta_version|revision|last_mod_id|last_mod_dt|is_used|service|related_topics|topic_desc)"',
                                        },
                                        {
                                            token: 'separator',
                                            regex: '(\{|\}|\[|\]|\,\|\:\s)'
                                        },
                                        {
                                            token: 'value',
                                            regex: '"[0-9A-Za-z]*"'
                                        }
                                        ];
                                    }
                                    // force recreation of tokenizer
                                    session.$mode.$tokenizer = null;
                                    session.bgTokenizer.setTokenizer(session.$mode.getTokenizer());
                                    // force re-highlight whole document
                                    session.bgTokenizer.start(0);
                                });
                            }}
                            editorProps={{$blockScrolling: true}}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                // enableLiveAutocompletion: true,
                                // enableSnippets: true,
                                showLineNumbers: true,
                                tabSize: 2,
                                useWorker: true
                            }}
                            readOnly={this.state.preview ? true:false}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            onChange={this.onChangeValueJSON}
                            fontSize= {14}
                            width= "100%"
                            height="500px"
                            />
                            {!successful ? <></>:
                            <div className={"input-validator-json error-msg"}><span className="close-btn close" onClick={this.closeErr}>&times;</span>{Object.keys(this.state.errors).map(item => {
                                return <p>{this.state.errors[item]}</p>})}</div>
                            }
                            </>
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
