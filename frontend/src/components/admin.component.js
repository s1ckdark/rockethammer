import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";

import axios from "axios"
import PropTypes from 'prop-types';
import Pagination from "react-js-pagination";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashAlt,
  faUserEdit,
  faLockOpen,
  faLock
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Register from './register.component'
import { Button,Modal } from 'react-bootstrap'

window.React = React;
// import dotenv from "dotenv"
// dotenv.config();

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
        pageSize:10,
        currentTableData:[],
      },
      user:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:10,
        currentTableData:[],
      },
      lock:[],
      toggle:1,
      currentUser: { userid: "" },
      inputfield:'',
      showHide : false,
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
    axios.get(process.env.REACT_APP_API+"/user/getall")
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
        res.data.map((res, index)=>{
         this.setState(prevState => ({
            lock: [...prevState.lock, true]
          }))
        })
      }
        );
  }

  fetchHistoryData = () => {
    axios.get(process.env.REACT_APP_API+"/user/history")
      .then(res => {
      const firstPageIndex = (this.state.history.currentPage - 1) * this.state.history.pageSize;
      const lastPageIndex = firstPageIndex + this.state.history.pageSize;
      console.log(res);
      // if(res.data[0].history.length > 0){
      if(res.data[0].length > 0){
      this.setState({
          ...this.state,
          history:{
            ...this.state.history,
            data: res.data[0].history,
            totalcnt: res.data[0].history.length,
            currentTableData:res.data[0].history.slice(firstPageIndex, lastPageIndex)
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
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    this.fetchData()
    this.fetchHistoryData(currentUser.id)
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    }

  writeHistory(e, type, userid, index){
    e.preventDefault();
    axios.post(process.env.REACT_APP_API+"/user/upthistory",
      {
        userid: this.state.user.data[index].userid,
        mod_item:type
      }
    ).then(res => {this.fetchData();this.fetchHistoryData();})
  }
  async action(e, type, userid, index) {
    e.preventDefault();
    let conType, historytype;
    if(type === 'update') { conType = "업데이트";}
    else if(type ==='delete') {conType = "삭제";}
    else if(type ==='add') {conType = "사용자 등"}
    switch(type) {
      case 'update':
        if(window.confirm(userid+"업데이트 하겠습니까?")) {
        let ele = [];
        await axios.post(process.env.REACT_APP_API+"/user/get",{
          userid:userid
        }).then(res => {
            if(res.data.password !== this.state.user.data[index].password) ele.push("비밀번호 변경")
          if(res.data.name !== this.state.user.data[index].name) ele.push("이름을 {"+res.data.name+"} -> {"+this.state.user.data[index].name+"} "+conType)
          if(res.data.dept !== this.state.user.data[index].dept) ele.push("소속을 {"+res.data.dept+"} -> {"+this.state.user.data[index].dept+"} "+conType)
          if(res.data.group !== this.state.user.data[index].group) ele.push("그룹을 {"+res.data.group+"} -> {"+this.state.user.data[index].group+"} "+conType)
        })
        console.log(ele);
        // historytype = ele.join("\r\n");
        axios.post(process.env.REACT_APP_API+"/user/update/"+userid,
          this.state.user.data[index])
        ele.forEach(item => {
          this.writeHistory(e, item , userid, index)
        })} else {
        alert("취소됩니다");
      } 
        break;
      case 'lock':
        const tmp = this.state.lock;
        tmp[index] = tmp[index] ? false : true;
        this.setState({lock:tmp})
        console.log("lock/unlock");
        break;
      case 'delete':
        if(userid !== 'admin') {
          historytype = userid+"를 "+conType;
          if (window.confirm(userid+"를 정말 삭제합니까?")) {
            axios.delete(process.env.REACT_APP_API+'/user/delete/'+userid,
          { headers: { 'authorization': localStorage.getItem('token') } }).then(res => {this.writeHistory(e, historytype, userid, index);alert("삭제되었습니다.");}); 
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
  onChangeValue = (e,index) =>{
    let compare =  Object.assign(this.state.user.data);
    compare[index][e.target.name] = e.target.value;
    this.setState({
      ...this.state,
      user:{
        ...this.state.user,
        [e.target.name]:e.target.value
      }
    }) 
  }
  toggle = (id) => {
    this.setState({
      toggle:id
    })
  }

  render() {
    return (
      <div className="admin">
      <Modal show={this.state.showHide}>
                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.handleModalShowHide()}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
        <h1 className="heading-1">Admin</h1>
        <div className="tab d-flex justify-content-center mb-5">
          <div className={this.state.toggle === 1 ? "active border border-info tab usertab mx-2 px-5 py-3" : "border usertab mx-2 px-5 py-3" } onClick={(e)=>this.toggle(1)}>User</div>
          <div className={this.state.toggle === 2 ? "active border border-primary tab historytab mx-2 px-5 py-3": "border historytab mx-2 px-5 py-3"} onClick={(e)=>this.toggle(2)}>History</div>
          <div className={this.state.toggle === 3 ? "active border border-dark tab addusertab mx-2 px-5 py-3": "border addusertab mx-2 px-5 py-3"} onClick={(e)=>this.toggle(3)}>Add user</div>
      </div>
      <div className={this.state.toggle ===1 ? "userManage active":"userManage"}>
              <table className="list">
          <thead>
          <tr className="text-center">
            <th>번호</th>
            <th className="d-none">id</th>
            <th className="col-md-2">유저 ID</th>
            <th className="col-md-1">비밀번호</th>
            <th className="col-md-2">사용자명</th>
            <th className="col-md-2">소속</th>
            <th className="col-md-1">그룹명</th>
            <th className="col-md-2">마지막 접속일시</th>
            <th className="col-md-2"></th>
          </tr>
          </thead>
          <tbody>
            {this.state.user.totalcnt > 0 ? this.state.user.currentTableData.map((user,index)=>(
              <tr className="text-center align-middle" key={index}>
                <td className="index"><p className="form-control value">{index + this.state.user.pageSize * (this.state.user.currentPage - 1) + 1}</p></td>
                <td className="id d-none"><p className="d-none value">{user.id}</p>
                <input disabled={this.state.lock[index]} type="hidden" name="id" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.user.data[index].id} /></td>
                <td className="userid"><p className="d-none value">{user.userid}</p>
                <input disabled={this.state.lock[index]} type="text" name="userid" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.user.data[index].userid} /></td>
                <td className="password">
                <input disabled={this.state.lock[index]} type="password" name="password" className="form-control" onClick={this.clear} onChange={(e)=>this.onChangeValue(e,index)} value={this.state.user.data[index].password} /></td>
                <td className="name"><p className="d-none value">{user.name}</p>
                <input disabled={this.state.lock[index]} type="text" name="name" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.user.data[index].name} /></td>
                <td className="dept"><p className="d-none value">{user.dept}</p>
                <input disabled={this.state.lock[index]} type="text" name="dept" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.user.data[index].dept} /></td>                
                <td className="group"><p className="d-none value">{user.group}</p>
                <select disabled={this.state.lock[index]} className="form-control" name="group" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.user.data[index].group}><option disabled hidden value=''>선택</option><option value="USER">Normal</option><option value="ADMIN">Admin</option></select></td>
                <td className="last_login_dt"><p className="d-none value">{user.last_login_dt}</p>
                <input disabled={this.state.lock[index]} type="text" name="last_login_dt" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.user.data[index].last_login_dt} /></td>
                <td className="action d-inline">
                  <button className="btn" onClick={(e)=> this.action(e,"lock", user.userid, index)}>{this.state.lock[index] ? <FontAwesomeIcon icon={faLock} size="1x" alt="unlock"/> :  <FontAwesomeIcon icon={faLockOpen} size="1x" alt="lock"/> }</button>
                  <button className="btn" onClick={(e)=> this.action(e,"delete",user.userid, index)}><FontAwesomeIcon icon={faTrashAlt} size="1x" alt="delete user"/></button>
                  <button className="btn" onClick={(e)=> this.action(e,"update", user.userid, index)}><FontAwesomeIcon icon={faUserEdit} size="1x" alt="update user"/></button>
                </td>
              </tr>
              )): <h3 className="text-center">등록된 사용자가 없습니다</h3>}
          </tbody>
        </table>
         <Pagination
              activePage={this.state.user.currentPage}
              itemsCountPerPage={this.state.user.pageSize}
              totalItemsCount={this.state.user.totalcnt}
              onChange={this.handleUserPageChange}
            />
    </div>
    <div className={this.state.toggle === 2  ? "history active":"history"}>
           <table className="table w-100">
           <thead>
              <tr>
              <th className="text-center my-3 p-3 col-md-1">NO</th>
              <th className="text-center my-3 p-3 col-md-2">수정자</th>
              <th className="text-center my-3 p-2 col-md-2">유저ID</th>
              <th className="text-center my-3 p-3 col-md-4">수정내역</th>
              <th className="text-center my-3 p-3 col-md-3">수정시간</th>
              </tr>
              </thead>
              <tbody>
        {this.state.history.totalcnt > 0 ? this.state.history.currentTableData.map((log, index)=>{
          return (
          <tr>
            <td className="text-center my-3 p-3 col-md-1">{index + this.state.history.pageSize * (this.state.history.currentPage - 1) + 1}</td>
            <td className="text-center my-3 p-3 col-md-2">admin</td>
            <td className="text-center my-3 p-3 col-md-2">{log.userid}</td>
            <td className="text-start my-3 p-3 col-md-4">{log.mod_item}</td>
            <td className="text-center my-3 p-3 col-md-3">{log.mod_dt}</td>
          </tr>
          );
        }): <tr className="nothing"><td colspan="4"><h2 className="text-center">남겨진 내역이 없습니다</h2></td></tr>}
        </tbody>
    </table>
       <Pagination
        activePage={this.state.history.currentPage}
        itemsCountPerPage={this.state.history.pageSize}
        totalItemsCount={this.state.history.totalcnt}
        onChange={this.handleHistoryPageChange}
      />
    </div>
    <div className={this.state.toggle ===3 ? "adduser active":"adduser"}>
      <Register fetchData={this.fetchData} fetchHistoryData={this.fetchHistoryData} />
      </div>
    </div>
    );
  }
}



