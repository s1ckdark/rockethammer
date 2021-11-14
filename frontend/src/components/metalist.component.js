import React, { Component } from "react";

export default class Metalist extends Component {
    componentDidMount(){
        console.log(this.props);
    }
    componentDidUpdate(){
        console.log(this.props.data);
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
    render()
    {
        return (
            <div className="metalist">
            {this.props.data.length > 0 ? this.props.data.map((item,index) => {
                var schema = JSON.parse(item.schema);
                return(
                    <div className="meta-item" key={item._id}>
                        <div className="_id">{item._id}</div>
                        <div className="schemas">
                        {Object.keys(schema).map((res, index) => {
                            console.log(schema[res]);
                            Object.keys(schema[res]).map((ele, index)=> {
                                Object.keys(schema[res][ele]).map((ele2, index) => {
                                    return(
                                        <div className={ele2}>test</div>
                                    )
                                })
                            })
                        })} 
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
                }): <h3>검색된 meta data가 없습니다</h3>    
                }
            </div>
        );
    }
}

