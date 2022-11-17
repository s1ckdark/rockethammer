import React, { Component } from "react";
import axios from "axios"

window.React = React;
// import dotenv from "dotenv"
// dotenv.config();

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema:[],
      data:[],
      keyword:''
    };
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_API+"/meta/get")
      .then(res => {
      //   var data = res.data
      //   data.map((item,index)=>{
      //     var tmp = JSON.parse(item.schema);
      //     item.schema = tmp;
      //     res.data[index] = item;
      //   })
      //   this.setState({data:res.data[0]});
      })
  }
  
  onChangeKeyword = (e,index) =>{
    this.setState({
      ...this.state,
      keyword:e.target.value
    }) 
  }

onSearch = async()=> {
  await axios.post(process.env.REACT_APP_API+"/meta/search",{keyword:this.state.keyword})
  .then(res => {
    this.setState({
      ...this.state,
      data:res.data
    }) 
  })
  await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword.replace(/-value/g, "")})
  .then(res => {
    this.setState({
      ...this.state,
      schema:res.data
    }) 
  })
}

  render() {
    return (
      <div className="meta">
        <div className="find mx-auto my-5 text-center d-block">
          <div className="form-inline justify-content-center">
            <input className="search form-control p-3" name="search" value={this.state.search} onChange = {this.onChangeKeyword} />
            <button type="button" className="btn btn-danger ml-1 searchbtn" onClick={this.onSearch}>검 색</button>
          </div>
        </div>
        {this.state.data.length > 0 ? 
        <div className="mapping bg-light">
         </div>
        : <></>
  }
      </div>
    );
  }
}
