import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";

export default class Metalists extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:{
              topic_name:'',
              schema_id:'',
              meta_id:'',
              schema_version:'',
              recycle_pol:'',
              op_name:'',
              service:'',
              related_topics:[],
              last_mod_dt:'',
              last_mod_id:'',
              schema:[]
          },
          mapping:[],
          temp:{
              p_name:'',
              p_type:'',
              l_name:'',
              l_def:'',
              is_null:'',
              default:'',
              memo:''
          },
          data:this.props.data
        };
      }
    componentDidMount(){
        this.setState({
            data:this.props.data
        })
 
        var mapping = [];
      if(this.props.data.length > 0) {
          this.props.data.map((item,index) => {
               mapping[index] = this.state.meta;
          // var schema = this.flatten(JSON.parse(item.schema));
          var meta = this.state.meta;
          // this.setState(prevState => ({
          //     mapping:[
          //         ...prevState.mapping,
          //         mapping
          //     ]
          // }))
          var schema = JSON.parse(item.schema);
          const tmp = this.state.temp;
          schema.fields.map((item,idx) => {
              mapping[index].schema[idx]= tmp
          })
          // this.setState(prevState => ({
          //     meta: {
          //         ...prevState.meta,
          //         schema: mapping
          //     }   
          // }))
          // this.setState(prevState => ({
          //     mapping: [...prevState.mapping, index]   
          // }))
      })  
      console.log(mapping);
      this.setState(prevState => ({
              mapping: mapping 
          }))

        }
        console.log(this.state.mapping);

    }
    componenWillUpdate(){
        
}

    componentDidUpdate(){
        console.log(this.state.mapping);
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

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    onChangeValue = (e,index) =>{
        e.preventDefault();
        // this.setState({
        //   ...this.state,
        //   meta:[
        //     ...this.state.meta,
        //     [e.target.name]:e.target.value
        //   ]
        // }) 
        this.setState(prevState => ({
         meta: {
             ...prevState.meta,
             [e.target.name]:e.target.value
         }   
        }))
      }

    onChangeValueTemp = (e,index) =>{
        e.preventDefault();
        // this.setState({
        //   ...this.state,
        //   mapping:[
        //     ...this.state.mapping[index],
        //     [e.target.name]:e.target.value
        //   ]
        // }) 
        // console.log(index, e.target.name, e.target.value)
        // let temp = this.state.temp;
        // const target = e.target.name;
        // console.log(temp);       
        // temp[index].target=e.target.value;
        // console.log(temp);
        // this.setState({...this.state,
        //  temp:{
        //      ...this.state.temp,
        //      [e.target.name]:e.target.value
        //  }
        // })
        // this.setState(prevState => ({
        //     ...prevState,
        //     mapping: this.state.mapping.map()
        // })
        this.setState(prevState => ({    
            ...prevState,
            mapping:this.state.mapping.map((x,i) => 
                i === index 
                ? {
                    ...x,
                    [e.target.name]:e.target.value

                }:x,
             ),
        }));
    }

    render()
    {
        return (
            <div className="metalist bg-light p-5">
            {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                var temp = {};

                // var tmp=[];
                var mapping = [];
                // var schema = this.flatten(JSON.parse(item.schema));
                var schema = JSON.parse(item.schema);
                Object.keys(item).map((res,index) => {
                    this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                })
                console.log(temp);
                // console.log(this.unflatten(temp));
                // mapping['topic_name'] = item.subject.replace(/-value/g, "");
                // mapping['schema_id'] = item.id;
                // mapping['doc_id'] = index;
                // mapping['schema_version'] = item.version;
                // mapping['doc_version'] = index;
                // mapping['recycle_pol'] = "60일";
                // mapping['op_name'] = "데브옵스 1팀";
                // mapping['service'] = "Kasan 평점검색";
                // mapping['related_topics'] = ["rating_01", "rating_03"];
                // mapping['last_mod_dt'] = "20211025 14:20:10";
                // mapping['last_mod_id'] = "김소연";
                // const tmp = this.state.temp;
                // schema.fields.map((item,index) => {
                //     mapping[index] = tmp
                //     console.log(index);
                // })
      
              
                return(
                    <div className="meta-item shadow-sm bg-white p-5 mb-5" key={item._id}>
                        <div className="_id">
                            <div className="d-flex">
                                <div className="label col-md-3">_id</div>
                                <div className="_id">{item._id}</div>
                            </div>
                        </div>
                        <div className="schemas">
                            { schema.fields.map((ele, idx) => {
                                console.log(index);
                                // var meta = {}
                                // meta.memo = "메모테스트"+index;
                                // meta.p_name = ele.name;
                                // meta.p_type = ele.type[0];
                                // meta.l_name = "평점번호";
                                // meta.l_def = "평점처리를 위한 고유 식별자";
                                // meta.is_null = ele.type.filter(item => item === "null") ? "y":"n";
                                // meta.default = ele.type.length < 3 ? "없음": ele.typep[2]
                                // console.log(ele);
                                // console.log(meta);
                                // tmp[index]=meta;
                                // console.log(tmp);
                                return (
                                    <div className="meta" key={"schema"+index+"-"+idx}>
                                        <p>&#123;</p>
                                        <div className="p_name">
                                        <div className="d-flex">
                                            <div className="label col-md-3">p_name</div>
                                            <div className="schema"><input type="text" name="p_name" className="p_name" value={this.state.meta[`p_name`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="p_type">
                                        <div className="d-flex">
                                            <div className="label col-md-3">p_type</div>
                                            <div className="schema"><input type="text" name="p_type" className="p_type" value={this.state.meta[`p_type`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="l_name">
                                        <div className="d-flex">
                                            <div className="label col-md-3">l_name</div>
                                            <div className="schema"><input type="text" name="l_name" className="l_name" value={this.state.meta[`l_name`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="l_def">
                                        <div className="d-flex">
                                            <div className="label col-md-3">l_def</div>
                                            <div className="schema"><input type="text" name="l_def" className="l_def" value={this.state.meta[`l_def`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="is_null">
                                        <div className="d-flex">
                                            <div className="label col-md-3">is_null</div>
                                            <div className="schema"><input type="text" name="is_null" className="is_null" value={this.state.meta[`is_null`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="default">
                                        <div className="d-flex">
                                            <div className="label col-md-3">default</div>
                                            <div className="schema"><input type="text" name="default" className="default" value={this.state.meta[`default`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <div className="memo">
                                        <div className="d-flex">
                                            <div className="label col-md-3">memo</div>
                                            <div className="schema"><input type="text" name="memo" className="memo" value={this.state.meta[`memo`]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                        </div>
                                        </div>
                                        <p>&#125;</p>
                                    </div>
                                )
                                // return (
                                // Object.keys(ele).map((fields) => {
                                //     console.log(fields, schema[`fields`][index][fields]);
                                //     console.log(this.state.data);
                                //     return (
                                //         <div className="d-flex">
                                //             <div className="meta mr-5">{"meta"+index}</div>
                                //             <div className="label mr-5"><p>{fields}</p></div>
                                //             <div className={fields}>{schema[`fields`][index][fields]}</div>
                                //             <div className="meta"><input type="text" name={fields} className={fields} value={this.state.meta[fields]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                //         </div>
                                //     );
                                    
                                // })
                                // );
                            })
                            }
                        </div>
                        <div className="topic_name">
                            <div className="d-flex">
                                <div className="label col-md-3">topic_name</div>
                                {/* <div className="value">{item.subject}</div> */}
                                <div className="meta"><input type="text" name="topic_name" className="topic_name" value={this.state.meta.topic_name} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="schema_id">
                            <div className="d-flex">
                                <div className="label col-md-3">schema_id</div>
                                {/* <div className="value">{item.id}</div> */}
                                <div className="meta"><input type="text" name="schema_id" className="schema_id" value={this.state.meta.schema_id} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="doc_id">
                            <div className="d-flex">
                                <div className="label col-md-3">doc_id</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="doc_id" className="doc_id" value={this.state.meta.doc_id} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="schema_version">
                            <div className="d-flex">
                                <div className="label col-md-3">schema_version</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="schema_version" className="schema_version" value={this.state.meta.schema_version} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="doc_version">
                            <div className="d-flex">
                                <div className="label col-md-3">doc_version</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="doc_version" className="doc_version" value={this.state.meta.doc_version} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="recycle_pol">
                            <div className="d-flex">
                                <div className="label col-md-3">recycle_pol</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="recycle_pol" className="recycle_pol" value={this.state.meta.recycle_pol} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="op_name">
                            <div className="d-flex">
                                <div className="label col-md-3">op_name</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="op_name" className="op_name" value={this.state.meta.op_name} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="service">
                            <div className="d-flex">
                                <div className="label col-md-3">service</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="service" className="service" value={this.state.meta.service} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="related_topics">
                            <div className="d-flex">
                                <div className="label col-md-3">related_topics</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="related_topics" className="related_topics" value={this.state.meta.related_topics} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="last_mod_dt">
                            <div className="d-flex">
                                <div className="label col-md-3">last_mod_dt</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="last_mod_dt" className="last_mod_dt" value={this.state.meta.last_mod_dt} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
                        <div className="last_mod_id">
                            <div className="d-flex">
                                <div className="label col-md-3">last_mod_id</div>
                                {/* <div className="value">{item.version}</div> */}
                                <div className="meta"><input type="text" name="last_mod_id" className="last_mod_id" value={this.state.meta.last_mod_id} onChange={(e) => this.onChangeValue(e,index)} /></div>
                            </div>
                        </div>
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
