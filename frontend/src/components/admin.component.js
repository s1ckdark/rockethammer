import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import dotenv from "dotenv"
import axios from "axios"
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashAlt,
  faUserEdit,
  faLockOpen,
  faHistory
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

dotenv.config();

export default class Admin extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      redirect: null,
      userReady: false,
      userData:[],
      currentUser: { username: "" },
      time: new Date()
    };
  }
  fetchData = () => {
    axios.get(process.env.REACT_APP_API+"/user/get")
      .then(res => this.setState({userData:res.data}));
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    this.fetchData()
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    }

  writeHistory(e, type, userid, index){
    e.preventDefault();
    const currenttime = new Date().toISOString();
    axios.post(process.env.REACT_APP_API+"/user/upthistory/"+userid,
      {
        username: this.state.userData[index].username,
        mod_item:type,
        mod_dt:currenttime
      }
    ).then(res =>     this.fetchData())
  }
  action(e, type, userid, index) {
    e.preventDefault();
    switch(type) {
      case 'update':
        console.log(this.state.userData[index]);
        axios.post(process.env.REACT_APP_API+"/user/update/"+userid,
          this.state.userData[index]).then(res => this.writeHistory(e, type, userid, index))
        break;
      case 'reset':
        const pw = document.querySelectorAll(".list tr")[index+1].querySelector('[name="password"]');
        pw.readOnly ? pw.readOnly=false:pw.readOnly=true;
        console.log("reset");
        break;
      case 'delete':
             axios.delete(process.env.REACT_APP_API+'/user/delete/'+userid,
          { headers: { 'authorization': localStorage.getItem('token') } }).then(res =>  this.writeHistory(e, type, userid, index))
        break;
      case 'history':
        axios.post(process.env.REACT_APP_API+"/api/user/history/"+userid,
        {
          id:userid
        }).then(res =>  this.writeHistory(e, type, userid, index))
        break;
    }
  }

  onChangeValue = (e,index) =>{
    let userData =  Object.assign(this.state.userData);
    userData[index][e.target.name] = e.target.value;
    this.setState({userData}) 
  }
  

  render() {
    return (
      <div className="admin">
        <div className="card">
          <h1 className="heading-1">Admin</h1>
        </div>
        <div className="text-end"><Link to="/register">회원 추가</Link></div>
        <table className="list">
          <thead>
          <tr className="text-center">
            <th>NO</th>
            <th className="d-none">id</th>
            <th>username</th>
            <th>password</th>
            <th>name</th>
            <th>dept</th>
            <th>group</th>
            <th>last_login</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
            {this.state.userData.map((user,index)=>(
              <tr className="text-center align-middle" key={user.id}>
                <td className="index"><p className="form-control value">{index+1}</p></td>
                <td className="id col-md-1 d-none"><p className="d-none value">{user.id}</p>
                <input type="hidden" name="id" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.userData[index].id} /></td>
                <td className="username col-md-2"><p className="d-none value">{user.username}</p>
                <input type="text" name="username" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].username} /></td>
                <td className="password col-md-2">
                <input type="password" name="password" readOnly className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].password} /></td>
                <td className="name col-md-2"><p className="d-none value">{user.name}</p>
                <input type="text" name="name" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].name} /></td>
                <td className="dept col-md-2"><p className="d-none value">{user.dept}</p>
                <input type="text" name="dept" className="form-control" onChange={(e)=>this.onChangeValue(e, index)} value={this.state.userData[index].dept} /></td>                
                <td className="group col-md-1"><p className="d-none value">{user.group}</p>
                <select className="form-control" name="group" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].group}><option selected value="normal">Normal</option><option value="admin">Admin</option></select></td>
                <td className="last_login_dt col-md-2"><p className="d-none value">{user.last_login_dt}</p>
                <input type="text" name="last_login_dt" className="form-control" onChange={(e)=>this.onChangeValue(e,index)} value={this.state.userData[index].last_login_dt} /></td>
                <td className="action d-inline col-md-1">
                  <button className="btn" onClick={(e)=> this.action(e,"update", user.id, index)}><FontAwesomeIcon icon={faUserEdit} size="1x" alt="update user"/></button>
                  <button className="btn" onClick={(e)=> this.action(e,"reset", user.id, index)}><FontAwesomeIcon icon={faLockOpen} size="1x" alt="reset password"/></button>
                  <button className="btn" onClick={(e)=> this.action(e,"delete",user.id, index)}><FontAwesomeIcon icon={faTrashAlt} size="1x" alt="delete user"/></button>
                  <button className="btn" onClick={(e)=> this.action(e,"history",user.id, index)}><FontAwesomeIcon icon={faHistory} size="1x" alt="history view"/></button>
                </td>
             </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}



