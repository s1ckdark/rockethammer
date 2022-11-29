import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link, Navigate } from "react-router-dom";

import axios from "axios"
import Pagination from "react-js-pagination";
import Register from './register.component';
import UserWeblog from './admin/userWeblog.component';
import UserManager from './admin/userManager.component';
import helpers from "../common/helpers";
import Breadcrumb from "./breadcrumb.component";

export default class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      history:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:5,
        currentTableData:[],
      },
      user:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:5,
        currentTableData:[],
        show:true,
        select:''
      },
      edit:{
        data:{
          userid:'',
          password:'',
          name:'',
          depth:'',
          group:''
        },
        show:false
      },
      compare:{
        newPassword:'',
        confirmPassword:'',
        show:false,
        result:true,
        work:false
      },
      toggle:1,
      currentUser: { userid: "" },
      inputfield:'',
      time: new Date()
    };
    this.handleUserPageChange = this._handleUserPageChange.bind(this);
    this.handleHistoryPageChange = this._handleHistoryPageChange.bind(this);
  }

  _handleUserPageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({
      ...this.state,
      user:{
        ...this.state.user,
        currentPage: pageNumber
      }
    });
    this.fetchData();
  }

   _handleHistoryPageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({
      ...this.state,
      history:{
        ...this.state.history,
        currentPage: pageNumber
      }
    });
    this.fetchHistoryData();
  }

  fetchData = () => {
    axios.post(process.env.REACT_APP_API+"/user/getall")
      .then(res =>
        {
          const firstPageIndex = (this.state.user.currentPage - 1) * this.state.user.pageSize;
          const lastPageIndex = firstPageIndex + this.state.user.pageSize;
        this.setState({
          ...this.state,
          user:{
            ...this.state.user,
            data: res.data,
            totalcnt: res.data.length,
            currentTableData:res.data.slice(firstPageIndex, lastPageIndex)
          }
        })
      }
        );
  }

  fetchHistoryData = () => {
    axios.post(process.env.REACT_APP_API+"/user/history")
      .then(res => {
      const firstPageIndex = (this.state.history.currentPage - 1) * this.state.history.pageSize;
      const lastPageIndex = firstPageIndex + this.state.history.pageSize;
      console.log(res);
      // if(res.data[0].history.length > 0){
      if(res.data && res.data.length > 0){
      this.setState({
          ...this.state,
          history:{
            ...this.state.history,
            data: res.data,
            totalcnt: res.data.length,
            currentTableData:res.data.slice(firstPageIndex, lastPageIndex)
          }
        })
    } else {
      this.setState({
          ...this.state,
          history:{
            ...this.state.history,
            data: [],
            totalcnt: 0,
            currentTableData:[]
          }
        })
    }
      })
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    console.log(user)
    if (user !== null ) {
      this.setState({
        ...this.state,
        currentUser: user,
      })
      setInterval(this.update, 1000)
      this.fetchData()
      this.fetchHistoryData(user.id)
    } else {
      console.log("not")
      this.setState({
        ...this.state,
        redirect: true
      })
    }
    }

  writeHistory(e, type, userid, index){
    e.preventDefault();
    axios.post(process.env.REACT_APP_API+"/user/upthistory",
      {
        userid: userid,
        mod_item:type
      }
    ).then(res => {this.fetchData();this.fetchHistoryData();})
  }

  async action(e, type, userid, index) {
    e.preventDefault();
    console.log(e,type,userid,index)
    let conType, historytype;
    if(type === 'update') { conType = "업데이트";}
    else if(type ==='delete') {conType = "삭제";}
    else if(type ==='add') {conType = "사용자 등"}
    switch(type) {
      case 'update':
        if(this.state.compare.result === false) {alert("비밀번호를 확인해주세요");return false;}
        if(window.confirm(userid+"업데이트 하겠습니까?")) {
        let ele = [];
        axios.post(process.env.REACT_APP_API+"/user/get",{
          userid:userid
        }).then(res => {
          console.log(res);
          console.log(this.state);
            if(this.state.compare.work) ele.push("비밀번호 변경")
            if(res.data.name !== this.state.user.data[index].name) ele.push("이름을 {"+res.data.name+"} -> {"+this.state.user.data[index].name+"} "+conType)
            if(res.data.dept !== this.state.user.data[index].dept) ele.push("소속을 {"+res.data.dept+"} -> {"+this.state.user.data[index].dept+"} "+conType)
            if(res.data.group !== this.state.user.data[index].group) ele.push("그룹을 {"+res.data.group+"} -> {"+this.state.user.data[index].group+"} "+conType)
        })
        console.log(ele);
        // historytype = ele.join("\r\n");
        axios.post(process.env.REACT_APP_API+"/user/update/"+userid,
          this.state.edit.data).then(res => res.status === 200 ? this.fetchData():null)
        ele.forEach(item => {
          this.writeHistory(e, item , userid, index)
        })
        this._handleUserPageChange(this.state.user.currentPage);
        } else {
        alert("취소됩니다");
        }
        this.setState({...this.state,user:{...this.state.user,show:true},edit:{show:false,dept:'',group:'',password:'',userid:'',name:''}})
        break;
      case 'edit':
        this.setState({
          ...this.state,
          user:{
            ...this.state.user,
            show: false,
            select:index
          },
          edit:{
            ...this.state.edit,
            data: this.state.user.data[index],
            show:true
          }
        })

        console.log("edit/save");
        break;
      case 'delete':
        if(userid !== 'admin') {
          historytype = userid+"를 "+conType;
          if (window.confirm(userid+"를 정말 삭제합니까?")) {
            axios.delete(process.env.REACT_APP_API+'/user/delete/'+userid,
          { headers: { 'authorization': localStorage.getItem('token') } }).then(res => {this.setState({...this.state,edit:{show:false,dept:'',group:'',password:'',userid:'',name:''}},()=>this.writeHistory(e, historytype, userid, index))})
          } else {
            alert("취소합니다.");
          }
        } else {
           alert("admin은 삭제가 불가능합니다.");
        }
        break;

    }
  }


  clear = (e)=>{
    e.target.value = '';
  }
  onChangeValue = (e) =>{
    e.preventDefault()
    this.setState({
      ...this.state,
      edit:{
        ...this.state.edit,
        data:{
          ...this.state.edit.data,
          [e.target.name]:e.target.value
        }
      }
    })
  }
  toggle = (id) => {
    this.setState({
      toggle:id
    })
  }


  onCancel =(e)=>{
    e.preventDefault()
    this.setState({
      ...this.state,
      user:{
        ...this.state.user,
        show: true,
      },
      edit:{
        ...this.state.edit,
        data: {},
        show:false
      }
    })
  }
  changePasswd = (e) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      compare:{
        ...this.state.compare,
        show:true,
        work:true
      }
    })
  }

  onPasswordChangeValue = (e) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      compare:{
        ...this.state.compare,
      [e.target.name]:e.target.value
      }
    },()=>{
      this.state.compare.newPassword === this.state.compare.confirmPassword ? this.setState({...this.state,edit:{...this.state.edit,data:{...this.state.edit.data,password:e.target.value}},compare:{...this.state.compare,result:true}}):this.setState({...this.state,compare:{...this.state.compare,result:false}})
    })
  }

  render() {
    return (
      <div className="admin overview">
        <div className="page-header admin">
          <Breadcrumb/>
        </div>
        <div className="overviewing">
          <div className="inner">
            <div className="info">
              <div className="info-userRegister">
                <h1>사용자 등록</h1>
                <p>신규 사용자를 등록하고 권한을 부여합니다</p>
              </div>
              <div className="info-userManager">
                <h1>사용자 관리</h1>
                <p>사용자에 대한 변경 및 삭제, 관리 합니다</p>
              </div>
              <div className="info-userHistory">
                <h1>사용자 로그</h1>
                <p>사용자의 사용 현황을 확인 합니다</p>
              </div>
              <div className="info-userWeblog">
                <h1>사용자 로그</h1>
                <p>사용자의 접속 로그를 확인합니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



