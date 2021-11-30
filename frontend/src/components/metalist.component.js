import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';
import axios from 'axios';
import dotenv from "dotenv";
window.React = React;
dotenv.config();

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:[],
          idx:'',
        };
      }
    componentDidMount(){
        // console.log(this.props);
    }

    onEdit = (e,item) => {
        e.preventDefault();
        console.log("edit");
        console.log(item)
    }

    onSave = (e) => {
        e.preventDefault();
        // axios.post()
    }

    onDel = (e,_id) => {
        e.preventDefault();
        console.log(_id);
    }

    IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    detailView = (e, idx, _id) => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_API+"/meta/getmeta",{keyword:_id}).then(res => {
            res.data && res.data.length > 0 ? this.setState({...this.state, meta:res.data[0]}):this.setState({...this.state, meta:{},idx:idx})
        })
    }

    render()
    {
        return (
            <div className="result">
                <div className="d-flex">
                    <div className="schemaList col-md-8 p-5">
                        <table className="metalist bg-light table table-hover">
                            <thead>
                                <tr className="text-center p-3">
                                    <th scope="col" className="col-md-1">#</th>
                                    <th scope="col" className="col-md-6">스키마명</th>
                                    <th scope="col" className="col-md-2">스키마버전</th>
                                    <th scope="col" className="col-md-2">스키마Id</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.props.schema.length > 0 ? this.props.schema.map((item,index) => {
                            var temp = {};
                            var mapping = {};
                            var schema = JSON.parse(item.schema);
                            Object.keys(item).map((res,index) => {
                                    this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                            })
                            return(
                                        <tr className="text-center" onClick={(e)=>this.detailView(e, index, item.subject.replace(/-value/g, ""),index)}>
                                             <th scope="row">{index+1}</th>
                                            <td className="value-subject value form-group">
                                            {item.subject.replace(/-value/g, "")}
                                            </td>
                                            <td className="value-version value form-group">
                                            {item.version}
                                            </td>
                                            <td className="value-id value form-group">
                                            {item.id}
                                            </td>
                                        </tr>
                                );
                            }): <h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3>    
                            }
                            </tbody>
                        </table>
                    </div>
                   {Object.keys(this.state.meta).length > 0 ? 
                    <div className="detailview col-md-4 p-5 m-5 border-left">
                        <div className="detail ">
                            {Object.keys(this.state.meta).length > 0 ? 
                                <>
                                <h3>{this.state.meta.topic_name}</h3>
                                <p className="d-inline"><span className="mr-2">Schema Version</span>{this.state.meta.schema_id}</p>
                                <p><span className="mr-2">Meta Version</span>{this.state.meta.meta_id}</p>
                                <p>{this.state.meta.last_mod_id}</p>
                                <p>{this.state.meta.last_mod_dt}</p>
                                <button type="button" className="btn btn-info mr-1"><Link to={{pathname:'/metaupdate', data:this.state.meta, type:"update"}}>수정</Link></button><button type="button" className="btn btn-secondary" onClick={(e)=>this.onDel(e,this.state.meta._id)}>삭제</button></>                     
                                :
                                <>
                                <p>등록된 Meta가 존재하지 않습니다</p>
                                <button type="button" className="btn btn-primary mr-1"><Link to={{pathname:'/metasave', data:this.props.schema[this.state.idx], type:"reg"}}>등록</Link></button>
                                </>}
                        </div>
                    </div>
                    : <></>}
                </div>
            </div>

<<<<<<< HEAD
                    </tr>
                </thead>
                <tbody>
            {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                var temp = {};
                var mapping = {};
                var schema = JSON.parse(item.schema);
                Object.keys(item).map((res,index) => {
                        this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                })
                return(
                            <tr className="text-center">
                                 <th scope="row">{index+1}</th>
                                <td className="value-subject value form-group">
                                {item.subject.replace(/-value/g, "")}
                                </td>
                                <td className="value-version value form-group">
                                {item.version}
                                </td>
                                <td className="value-id value form-group">
                                {item.id}
                                </td>
                                <td className="value-id value form-group">
                                {this.props.schema.length > 0 ? "yes" : "no"}
                                </td>
                                <td className="action">
                                    {this.props.schema.length > 0 ?
                                   <><button type="button" className="btn btn-primary mr-1"><Link to={{pathname:'/metaedit', data:item, schema:this.props.schema, type:"edit"}}>EDIT</Link></button><button type="button" className="btn btn-secondary" onClick={(e)=>this.delete(item._id)}>DELETE</button></>:<><button type="button" className="btn btn-info mr-1"><Link to={{pathname:'/metaedit', data:item,schema:this.props.schema, type:"register"}}>등록</Link></button></> }
                                </td>
                            </tr>
                    );
                }): <h3 className="p-3 m-3 text-center">검색된 meta data가 없습니다</h3>    
                }
                </tbody>
            </table>
=======
>>>>>>> master
        );
    }
}
