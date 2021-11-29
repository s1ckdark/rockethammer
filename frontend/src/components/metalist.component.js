import React, { Component } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { Link } from 'react-router-dom';

export default class Metalist extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meta:[],
          schema:[]
        };
      }
    componentDidMount(){
        console.log(this.props);
    }
    componentDidUpdate(){
        console.log(this.props.data);
        console.log(this.props.schema);
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
            <table className="metalist bg-light p-5 table table-hover">
                <thead>
                    <tr className="text-center">
                        <th scope="col" className="col-md-1">#</th>
                        <th scope="col" className="col-md-5">스키마명</th>
                        <th scope="col" className="col-md-1">스키마버전</th>
                        <th scope="col" className="col-md-1">스키마Id</th>
                        <th scope="col" className="col-md-1">등록여부</th>
                        <th scope="col" className="col-md-2"></th>

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
        );
    }
}