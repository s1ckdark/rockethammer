import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link } from "react-router-dom";
import axios from "axios"

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
    axios.get('http://localhost:8080/api/user/get')
      .then(res => {
       this.setState({userData:res.data})
      });
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    this.fetchData()
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }


  action(e, type, userid) {
    e.preventDefault();
    switch(type) {
      case 'update':
        console.log("update");
        break;
      case 'reset':
        console.log("reset");
        break;
      case 'delete':
        console.log("delete");
        axios.delete('http://localhost:8080/api/user/delete/'+userid,
          { headers: { 'authorization': localStorage.getItem('token') } })
        break;
    }
    window.location.reload();
  }

  onChangeValue = (e,index) =>{
    this.setState(prevState=>({
      ...prevState.userData,
      userData:{
        ...prevState.userData, 
      [e.target.name]: e.target.value
    }
    }))
  }
  

  render() {
    return (
      <div className="admin">
        <div className="card">
          <h1 className="heading-1">Admin</h1>
        </div>
        <table>
          <thead>
          <tr className="text-center">
            <th>NO</th>
            <th>id</th>
            <th>username</th>
            <th>name</th>
            <th>dept</th>
            <th>group</th>
            <th>update_dt</th>
            <th>last_login</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
            {this.state.userData.map((user,index)=>(
              <tr className="text-center" key={user.id}>
                <td className="index col-md-1"><p className="value">{index+1}</p></td>
                <td className="id col-md-1"><p className="value">{user.id}</p>
                <input type="text" name="id" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].name} /></td>
                <td className="username col-md-2"><p className="value">{user.username}</p>
                <input type="text" name="username" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].username} /></td>
                <td className="name col-md-1"><p className="value">{user.name}</p>
                <input type="text" name="name" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].name} /></td>
                <td className="dept col-md-1"><p className="value">{user.dept}</p>
                <input type="text" name="dept" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].dept} /></td>                
                <td className="group col-md-1"><p className="value">{user.group}</p>
                <select className="form-control" name="group" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].group}><option value="normal">Normal</option><option value="admin">Admin</option></select></td>
                <td className="update_dt col-md-1"><p className="value">{user.update_dt}</p>
                <input type="text" name="update_dt" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].update_dt} /></td>
                <td className="last_login_dt col-md-1"><p className="value">{user.last_login_dt}</p>
                <input type="text" name="last_login_dt" className="form-control" onChange={(e)=>this.onChangeValue(index)} value={this.state.userData[index].lastg_login_dt} /></td>
                <td className="action d-inline col-md-2">
                  <button className="btn" onClick={(e)=> this.action(e,"update", user.id)}>Update</button>
                  <button className="btn" onClick={(e)=> this.action(e,"reset", user.id)}>Reset</button>
                  <button className="btn" onClick={(e)=> this.action(e,"delete",user.id)}>Del</button>
                </td>
             </tr>
          ))}
          </tbody>
            </table>
      </div>
    );
  }
}



