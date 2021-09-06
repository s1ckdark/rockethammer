import React, { Component, useEffect } from "react";
// import UserService from "../services/user.service";
import axios from 'axios'
import { JsonToTable } from "react-json-to-table";
import data1 from "./data.json";
import data2 from "./data2.json";
import data3 from "./data3.json";

export default class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      data:""
    };
    this.switchData = this.switchData.bind(this);
  }


  switchData = (data) => {
    console.log(data);
    Array.from(document.querySelectorAll('.json-to-table')).map( i => i.style.display="none");
    document.querySelectorAll('.json-to-table')[data].style.display="block"
  }


  componentDidMount() {
    // const jsonData = data1;
    // axios.get(`./data1.json`)
    // // axios.get(`http://172.41.41.192:8081/subjects/av_test05-value/versions/latest`)
    //   .then(res => {
    //     const contentData = res.data;
    //     this.setState({content: contentData});
    //   })

  }
  


  render() {
    return (
      <div className="meta">
      <div className="demo">
        <button className="btn" onClick={() => this.switchData(0)}>Order</button>
        <button className="btn" onClick={() => this.switchData(1)}>Product</button>
        <button className="btn" onClick={() => this.switchData(2)}>User</button>
      </div>
      <div className="table">
         <JsonToTable json={data1} />
         <JsonToTable json={data2} />
         <JsonToTable json={data3} />
      </div>
      </div>
    );
  }
}


