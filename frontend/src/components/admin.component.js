import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
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
dotenv.config();

export default class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      userData:[],
      history:[],
      totalcnt:0,
      currentPage: 1,
      pageSize:10,
      currentTableData:[],
      toggle:1,
      lock:[],
      currentUser: { username: "" },
      inputfield:'',
       showHide : false,
      time: new Date()
    };
    this.handlePageChange = this._handlePageChange.bind(this);
  }

  // handleModalShowHide(e, type, userid, index){ 
  //       this.setState({ showHide: !this.state.showHide })
  //       switch(type) {
  //         case 'update':
  //         this.action(e, type, userid, index);
  //         break;
  //         case 'delete':
  //         this.action(e, type, userid, index);
  //         break;
  //         case 'lock':
  //         this.action(e, type, userid, index);
  //         break;
  //       }
  //   }

  _handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({currentPage: pageNumber});
    this.fetchData();
  }

  fetchData = () => {
    axios.get(process.env.REACT_APP_API+"/user/getall")
      .then(res => 
        {
          console.log(res);
          const firstPageIndex = (this.state.currentPage - 1) * this.state.pageSize;
          const lastPageIndex = firstPageIndex + this.state.pageSize;
        this.setState({
          userData: res.data,
          totalcnt: res.data.length,
          currentTableData:res.data.slice(firstPageIndex, lastPageIndex)
        })
        res.data.map((res, index)=>{
         this.setState(prevState => ({
          lock: [...prevState.lock, true]
        }))
        })
      }
        );
  }

  fetchHistoryData = (id) => {
    axios.get(process.env.REACT_APP_API+"/user/history")
      .then(res => this.setState({history:res.data[0].history}))
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
    const currenttime = new Date().toISOString();
    axios.post(process.env.REACT_APP_API+"/user/upthistory",
      {
        userid: this.state.userData[index].userid,
        mod_item:type,
        mod_dt:currenttime
      }
    ).then(res => this.fetchData())
  }
  async action(e, type, userid, index) {
    e.preventDefault();
    switch(type) {
      case 'update':
        let ele = [];
        await axios.post(process.env.REACT_APP_API+"/user/get",{
          userid:userid
        }).then(res => {
          console.log(res.data)
          if(res.data.password !== this.state.userData[index].password) ele.push("password")
          if(res.data.name !== this.state.userData[index].name) ele.push("name")
          if(res.data.dept !== this.state.userData[index].dept) ele.push("dept")
          if(res.data.group !== this.state.userData[index].group) ele.push("group")
        })
        type = type +" "+ ele.toString();
        axios.post(process.env.REACT_APP_API+"/user/update/"+userid,
          this.state.userData[index]).then(res => this.writeHistory(e,type , userid, index))
        break;
      case 'lock':
        const tmp = this.state.lock;
        tmp[index] = tmp[index] ? false : true;
        this.setState({lock:tmp})
        this.writeHistory(e, type, userid, index)
        console.log("lock/unlock");
        break;
      case 'delete':
        if(userid !== 'admin') {
          if (window.confirm(userid+"를 정말 삭제합니까?")) {
            axios.delete(process.env.REACT_APP_API+'/user/delete/'+userid,
          { headers: { 'authorization': localStorage.getItem('token') } }).then(res => {this.writeHistory(e, type, userid, index);alert("삭제되었습니다.");}); 
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
    let compare =  Object.assign(this.state.userData);
    compare[index][e.target.name] = e.target.value;
    this.setState({compareUserData:compare}) 
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
        <div className="tab d-flex justify-content-center">
          <div className={this.state.toggle === 1 ? "active border border-info tab usertab m-5 px-5 py-3" : "border usertab m-5 px-5 py-3" } onClick={(e)=>this.toggle(1)}>User</div>
          <div className={this.state.toggle === 2 ? "active border border-primary tab historytab m-5 px-5 py-3": "border historytab m-5 px-5 py-3"} onClick={(e)=>this.toggle(2)}>History</div>
          <div className={this.state.toggle === 3 ? "active border border-dark tab addusertab m-5 px-5 py-3": "border addusertab m-5 px-5 py-3"} onClick={(e)=>this.toggle(3)}>Add user</div>
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
            {this.state.currentTableData ? this.state.currentTableData.map((user,index)=>(
              <tr className="text-center align-middle" key={index}>
                <td className="index"><p className="form-control value">{index + this.state.pageSize * (this.state.currentPage - 1) + 1}</p></td>
                <td className="id d-none"><p className="d-none value">{user.id}</p>
                <input disabled={this.state.lock[index]} type="hidden" name="id" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.userData[index].id} /></td>
                <td className="userid"><p className="d-none value">{user.userid}</p>
                <input disabled={this.state.lock[index]} type="text" name="userid" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].userid} /></td>
                <td className="password">
                <input disabled={this.state.lock[index]} type="password" name="password" className="form-control" onClick={this.clear} onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].password} /></td>
                <td className="name"><p className="d-none value">{user.name}</p>
                <input disabled={this.state.lock[index]} type="text" name="name" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].name} /></td>
                <td className="dept"><p className="d-none value">{user.dept}</p>
                <input disabled={this.state.lock[index]} type="text" name="dept" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.userData[index].dept} /></td>                
                <td className="group"><p className="d-none value">{user.group}</p>
                <select disabled={this.state.lock[index]} className="form-control" name="group" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].group}><option disabled hidden value=''></option><option value="normal">Normal</option><option value="admin">Admin</option></select></td>
                <td className="last_login_dt"><p className="d-none value">{user.last_login_dt}</p>
                <input disabled={this.state.lock[index]} type="text" name="last_login_dt" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].last_login_dt} /></td>
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
              activePage={this.state.currentPage}
              itemsCountPerPage={this.state.pageSize}
              totalItemsCount={this.state.totalcnt}
              onChange={this.handlePageChange}
            />
    </div>
    <div className={this.state.toggle === 2  ? "history active":"history"}>
        {this.state.history ? this.state.history.map(log=>{
          return (
          <div className="log">{JSON.stringify(log)}</div>
          );
        }): <div className="nothing"><h2 className="text-center">남겨진 내역이 없습니다</h2></div>}
    </div>
    <div className={this.state.toggle ===3 ? "adduser active":"adduser"}>
      <Register />
      </div>
    </div>
    );
  }
}



