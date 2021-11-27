import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
window.React = React;
dotenv.config();

export default class Metaedit extends Component {
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
          data:this.props.location.data
        };
      }
    componentDidMount(){
          var mapping = [];
          var schema = JSON.parse(this.state.data.schema);
          const tmp = this.state.temp;
          schema.fields.map((item,idx) => {
              mapping[idx]= tmp
          })

          this.setState(prevState => ({
              meta: {
                  ...prevState.meta,
                  schema: mapping
              }   
          }))
          this.setState(prevState => ({
            mapping: mapping
        }))
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

    onChangeValue = (e) =>{
        e.preventDefault();
        this.setState(prevState => ({
         meta: {
             ...prevState.meta,
             [e.target.name]:e.target.value
         }   
        }))
      }

    onChangeValueTemp = (e, index) =>{
        e.preventDefault();
        console.log(index, e.target.name, e.target.value)
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
        this.setState(prevState => ({
            meta: {
                ...prevState.meta,
                schema:this.state.mapping
            }   
        }))
    }

    onSubmit = async(e) => {
        e.preventDefault();
        await axios.post(process.env.REACT_APP_API+"/meta/save",{
            data:this.state.meta
          })
    }

    render()
    {
        return (
            <div className="metalist bg-light p-5">
                 <div className="schemas">
                     <div className="meta">
                         <JSONInput
                            id          = {this.state.meta[`id`]}
                            placeholder = {this.state.meta}
                            locale      = { locale }
                            height      = '550px'
                            onChange    = {this.onChangeValue}
                            />
                        {/* jsoneditor 한글화 */}
                    {
                        Object.keys(this.state.meta).map((fields) => {
                            // console.log(fields, typeof(this.state.meta[fields]))
                            if(typeof(this.state.meta[fields]) !== "object"){
                                return (
                                    <div className="d-flex">
                                        <div className={fields+" col-md-2"}>{fields}</div>
                                        <div className={"value-"+fields+" value form-group"}>
                                        {this.state.meta[fields]}
                                        <input type="text" name={fields} className={"input-"+fields+" input-value"} value={this.state.meta[fields]} onChange={this.onChangeValue} />
                                        </div>

                                    </div>
                                );
                            }                            
                        }) 
                    }   

                        {/* <div className="topic_name">
                            <div className="d-flex">
                                <div className="label col-md-3">topic_name</div>
                                <div className="meta"><input type="text" name="topic_name" className="topic_name" value={this.state.meta.topic_name} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="schema_id">
                            <div className="d-flex">
                                <div className="label col-md-3">schema_id</div>
                                <div className="meta"><input type="text" name="schema_id" className="schema_id" value={this.state.meta.schema_id} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="doc_id">
                            <div className="d-flex">
                                <div className="label col-md-3">doc_id</div>
                                <div className="meta"><input type="text" name="doc_id" className="doc_id" value={this.state.meta.doc_id} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="schema_version">
                            <div className="d-flex">
                                <div className="label col-md-3">schema_version</div>
                                <div className="meta"><input type="text" name="schema_version" className="schema_version" value={this.state.meta.schema_version} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="doc_version">
                            <div className="d-flex">
                                <div className="label col-md-3">doc_version</div>
                                <div className="meta"><input type="text" name="doc_version" className="doc_version" value={this.state.meta.doc_version} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="recycle_pol">
                            <div className="d-flex">
                                <div className="label col-md-3">recycle_pol</div>
                                <div className="meta"><input type="text" name="recycle_pol" className="recycle_pol" value={this.state.meta.recycle_pol} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="op_name">
                            <div className="d-flex">
                                <div className="label col-md-3">op_name</div>
                                <div className="meta"><input type="text" name="op_name" className="op_name" value={this.state.meta.op_name} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="service">
                            <div className="d-flex">
                                <div className="label col-md-3">service</div>
                                <div className="meta"><input type="text" name="service" className="service" value={this.state.meta.service} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="related_topics">
                            <div className="d-flex">
                                <div className="label col-md-3">related_topics</div>
                                <div className="meta"><input type="text" name="related_topics" className="related_topics" value={this.state.meta.related_topics} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="last_mod_dt">
                            <div className="d-flex">
                                <div className="label col-md-3">last_mod_dt</div>
                                <div className="meta"><input type="text" name="last_mod_dt" className="last_mod_dt" value={this.state.meta.last_mod_dt} onChange={this.onChangeValue} /></div>
                            </div>
                        </div>
                        <div className="last_mod_id">
                            <div className="d-flex">
                                <div className="label col-md-3">last_mod_id</div>
                                <div className="meta"><input type="text" name="last_mod_id" className="last_mod_id" value={this.state.meta.last_mod_id} onChange={this.onChangeValue} /></div>
                            </div>
                        </div> */}
                            {this.state.meta.schema.map((ele, index) => {
                                return (
                                        <div className="json ml-5" key={"json-"+index}>
                                            <div className="meta mr-5"><p>{"Fileds "+index} : <span className="ml-3">&#123;</span></p></div>
                                           
                                                {Object.keys(ele).map((fields) => {
                                                        return (
                                                            <div className={fields+" ml-5"}>
                                                            <div className="d-flex">
                                                                <div className="label col-md-3"><p>{fields}</p></div>
                                                                <div className={fields}>{this.state.mapping[index][fields]}</div>
                                                                <div className="schema"><input type="text" name={fields} className={fields} value={this.state.mapping[index][fields]} onChange={(e) => this.onChangeValueTemp(e,index)} /></div>
                                                            </div>
                                                            </div>
                                                        );
                                                        
                                                    }) 
                                                }   
                                            {/* <div className="p_name">
                                            <div className="d-flex">
                                                <div className="label col-md-3">p_name</div>
                                                <div className="schema"><input type="text" name="p_name" className="p_name" value={this.state.mapping[index][`p_name`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="p_type">
                                            <div className="d-flex">
                                                <div className="label col-md-3">p_type</div>
                                                <div className="schema"><input type="text" name="p_type" className="p_type" value={this.state.mapping[index][`p_type`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="l_name">
                                            <div className="d-flex">
                                                <div className="label col-md-3">l_name</div>
                                                <div className="schema"><input type="text" name="l_name" className="l_name" value={this.state.mapping[index][`l_name`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="l_def">
                                            <div className="d-flex">
                                                <div className="label col-md-3">l_def</div>
                                                <div className="schema"><input type="text" name="l_def" className="l_def" value={this.state.mapping[index][`l_def`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="is_null">
                                            <div className="d-flex">
                                                <div className="label col-md-3">is_null</div>
                                                <div className="schema"><input type="text" name="is_null" className="is_null" value={this.state.mapping[index][`is_null`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="default">
                                            <div className="d-flex">
                                                <div className="label col-md-3">default</div>
                                                <div className="schema"><input type="text" name="default" className="default" value={this.state.mapping[index][`default`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div>
                                            <div className="memo">
                                            <div className="d-flex">
                                                <div className="label col-md-3">memo</div>
                                                <div className="schema"><input type="text" name="memo" className="memo" value={this.state.mapping[index][`memo`]} onChange={(e) => this.onChangeValueTemp(e, index)} /></div>
                                            </div>
                                            </div> */}
                                            <p>&#125;,</p>
                                        </div>
                                )})}
                            {this.state.meta.schema.map((ele, index) => {
                                return (
                                        <div className="table" key={"table-"+index}> 
                                            <table>
                                                <thead>
                                                    <tr>
                                                            <th scope="col">#</th>
                                                    {
                                                        Object.keys(ele).map((fields) => {
                                                            return (
                                                                <>
                                                                    <th scope="col" className="text-center">{fields}</th>
                                                                </>
                                                            );
                                                            
                                                        }) 
                                                    }   
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">{index}</th>
                                                        {
                                                            Object.keys(ele).map((fields) => {
                                                                return (
                                                                        <td><input type="text" name={fields} className={"fields-input "+fields} value={this.state.mapping[index][fields]} onChange={(e) => this.onChangeValueTemp(e,index)} /></td>
                                                                );
                                                                
                                                            }) 
                                                        }   
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                )
                            })}
                        </div>
                    </div>
                        <div className="action text-right">
                            <button type="button" className="btn btn-primary mr-3" onClick={this.onSubmit}>SAVE</button>
                            <button type="button" className="btn btn-secondary" onClick={this.reset}>CANCEL</button>
                        </div>
                    </div>
        );
    }
}