import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:[]
        };
      }
    componentDidMount(){
        console.log(this.props);
    }
    componentDidUpdate(){
        console.log(this.props.data);

    }

    onChangeValue = (e,index) =>{
        this.setState({
          ...this.state,
          meta:{
            ...this.state.data[index],
            [e.target.name]:e.target.value
          }
        }) 
      }
    
    iterateObj = (dupeObj) => {
        var retObj = new Object();
        if (typeof (dupeObj) == 'object') {
            if (typeof (dupeObj.length) == 'number')
                retObj = new Array();
    
            for (var objInd in dupeObj) {
                if (dupeObj[objInd] == null)
                    dupeObj[objInd] = "Empty";
                if (typeof (dupeObj[objInd]) == 'object') {
                    retObj[objInd] = this.iterateObj(dupeObj[objInd]);
                } else if (typeof (dupeObj[objInd]) == 'string') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) == 'number') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) == 'boolean') {
                    ((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
                }       
            }
        }
        return retObj;
    }

    getTopics = (obj) => {
        if(typeof obj !== 'object') return [];
        if(obj.fields) return [obj.fields];
        var res = [];
        for(var i in obj){
          res.push(...this.getTopics(obj[i]));
        }
        return res;
     }
     getKey = (obj) =>{
      const isObject = val =>
          typeof val === 'object' && !Array.isArray(val);
    
      const addDelimiter = (a, b) =>
          a ? `${a}.${b}` : b;
    
      const paths = (obj = {}, head = '') => {
          return Object.entries(obj)
              .reduce((product, [key, value]) => 
                  {
                      let fullPath = addDelimiter(head, key)
                      return isObject(value) ?
                          product.concat(paths(value, fullPath))
                      : product.concat(fullPath)
                  }, []);
      }
    
      return paths(obj);
    }

    flatten = (function (isArray, wrapped) {
        return function (table) {
            return reduce("", {}, table);
        };
    
        function reduce(path, accumulator, table) {
            if (isArray(table)) {
                var length = table.length;
    
                if (length) {
                    var index = 0;
    
                    while (index < length) {
                        var property = path + "[" + index + "]", item = table[index++];
                        if (wrapped(item) !== item) accumulator[property] = item;
                        else reduce(property, accumulator, item);
                    }
                } else accumulator[path] = table;
            } else {
                var empty = true;
    
                if (path) {
                    for (var property in table) {
                        var item = table[property], property = path + "." + property, empty = false;
                        if (wrapped(item) !== item) accumulator[property] = item;
                        else reduce(property, accumulator, item);
                    }
                } else {
                    for (var property in table) {
                        var item = table[property], empty = false;
                        if (wrapped(item) !== item) accumulator[property] = item;
                        else reduce(property, accumulator, item);
                    }
                }
    
                if (empty) accumulator[path] = table;
            }
    
            return accumulator;
        }
    }(Array.isArray, Object));

    unflatten = (table)=>{
        var result = {};
    
        for (var path in table) {
            var cursor = result, length = path.length, property = "", index = 0;
    
            while (index < length) {
                var char = path.charAt(index);
    
                if (char === "[") {
                    var start = index + 1,
                        end = path.indexOf("]", start),
                        cursor = cursor[property] = cursor[property] || [],
                        property = path.slice(start, end),
                        index = end + 1;
                } else {
                    var cursor = cursor[property] = cursor[property] || {},
                        start = char === "." ? index + 1 : index,
                        bracket = path.indexOf("[", start),
                        dot = path.indexOf(".", start);
    
                    if (bracket < 0 && dot < 0) var end = index = length;
                    else if (bracket < 0) var end = index = dot;
                    else if (dot < 0) var end = index = bracket;
                    else var end = index = bracket < dot ? bracket : dot;
    
                    var property = path.slice(start, end);
                }
            }
    
            cursor[property] = table[path];
        }
    
        return result[""];
    }

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    render()
    {
        return (
            <div className="metalist bg-light p-5">
            {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                var temp = {};
                var mapping = {};
                // var schema = this.flatten(JSON.parse(item.schema));
                var schema = JSON.parse(item.schema);
                Object.keys(item).map((res,index) => {
                        this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                })
                // temp = this.flatten(temp);
                console.log(temp);
                // console.log(this.unflatten(temp));
                mapping['topic_name'] = item.subject;
                mapping['schema_id'] = item.id;
                mapping['doc_id'] = index;
                mapping['schema_version'] = item.version;
                mapping['doc_version'] = index;
                mapping['recycle_pol'] = "60일";
                mapping['op_name'] = "데브옵스 1팀";
                mapping['service'] = "Kasan 평점검색";
                mapping['related_topics'] = ["rating_01", "rating_03"];
                mapping['last_mod_dt'] = "20211025 14:20:10";
                mapping['last_mod_id'] = "전지현08";
                return(
                    <div className="meta-item shadow-sm bg-white p-5 mb-5" key={item._id}>
                        <div className="_id">
                            <div className="d-flex">
                                <div className="label mr-3">_id</div>
                                <div className="_id">{item._id}</div>
                            </div>
                        </div>
                        <div className="schemas">
                            { schema.fields.map((ele, index) => {
                                var meta = {}
                                var tmp=[];
                                meta.memo = "메모테스트";
                                meta.p_name = ele.name;
                                meta.p_type = ele.type[0];
                                meta.l_name = "평점번호";
                                meta.l_def = "평점처리를 위한 고유 식별자";
                                meta.is_null = ele.type.filter(item => item === "null") ? "y":"n";
                                meta.default = ele.type.length < 3 ? "없음": ele.typep[2]
                                console.log(ele);
                                console.log(meta);
                                tmp[index]=meta;
                                mapping.meta = tmp;
                                console.log(mapping);
                                return (
                                Object.keys(ele).map((fields) => {
                                    console.log(fields, schema[`fields`][index][fields]);
                                    return (
                                        <div className="d-flex">
                                            <div className="meta mr-5">{"meta"+index}</div>
                                            <div className="label mr-5"><p>{fields}</p></div>
                                            <div className={fields}>{schema[`fields`][index][fields]}</div>
                                        </div>
                                    );
                                    
                                })
                                );
                            })
                            }
                        </div>
                        <div className="deleted">{item.deleted}</div>
                        <div className="subject">{item.subject}</div>
                        <div className="id">{item.id}</div>
                        <div className="version">{item.version}</div>
                        <div className="save">
                            <button className="btn" onChange={this.onSubmit}>SAVE</button>
                            <button className="btn" onChange={this.reset}>CANCEL</button>
                        </div>
                    </div>
                    );
                }): <h3 className="p-5 m-5 text-center">검색된 meta data가 없습니다</h3>    
                }
            </div>
        );
    }
}

// {
//     p_name: "rating_id", {"schemas.schema.fields.name"}
//     p_type: "string", {"schemas.schema.fields.type[0]"}
//     l_name: "평점 번호", {input}
//     l_def : "평점처리를 위한 고유 식별자", {input}
//     is_null : "y", {"schemas.schema.fields.type[1]"}
//     default: "없음" {"schemas.schema.fields.type[2]"}
//       memo: "" {input}
// },