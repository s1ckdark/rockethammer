import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';

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

    onEdit = (e,item) => {
        e.preventDefault();
        console.log("edit");
        console.log(item)
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
                var schema = JSON.parse(item.schema);
                Object.keys(item).map((res,index) => {
                        this.IsJsonString(item[res]) ? temp[res] = JSON.parse(item[res]): temp[res]=item[res]
                })
                return(
                    <div className="meta-item shadow-sm bg-white p-3 mb-3" key={item._id}>
                        <div className="_id">
                            <div className="d-flex">
                                <div className="label mr-3">_id</div>
                                <div className="_id">{item._id}</div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                        <div className="physical-meta col-md-6">
                            {Object.keys(item).map((fields) => {
                            // console.log(fields, typeof(this.state.meta[fields]))
                                if(typeof(item[fields]) !== "object"){
                                    return (
                                        <div className="d-flex">
                                            <div className={fields+" col-md-2"}>{fields}</div>
                                            <div className={"value-"+fields+" value form-group"}>
                                            {item[fields]}
                                            </div>

                                        </div>
                                    );
                                }                            
                            })} 
                            <div className="schemas">
                                {/* { schema.fields.map((ele, index) => {
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
                                } */}
                            </div>
                        </div>
                            <div className="separate-line bg-light"></div>
                            <div className="logical-meta col-md-6">
                            </div>
                        </div>
                        <div className="action text-right">
                            <button type="button" className="btn btn-info mr-1"><Link to={{pathname:'/metaedit', data:item}}>EDIT</Link></button>
                            <button type="button" className="btn btn-primary mr-1" onClick={(e)=>this.onEdit(e,item)}>EDIT</button>
                            <button type="button" className="btn btn-secondary" onClick={this.reset}>DELETE</button>
                        </div>
                    </div>
                    );
                }): <h3 className="p-5 m-5 text-center">검색된 meta data가 없습니다</h3>    
                }
            </div>
        );
    }
}

