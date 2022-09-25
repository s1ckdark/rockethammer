import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Redirect, Link, Navigate } from "react-router-dom";

import axios from "axios"
import Pagination from "react-js-pagination";
import Register from './register.component';
import Weblog from './weblog.component';
import helpers from "./helpers.component";
import { Button } from 'react-bootstrap'

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
      <div className="admin">
         {this.state.redirect ? <Navigate to='/home' />:<></>}
        <h1 className="heading-1">관리자모드</h1>
        <div className="tab d-flex justify-content-center mb-5">
          <div className={this.state.toggle === 3 ? "active border tab addusertab mx-2 px-5 py-3": "border addusertab mx-2 px-5 py-3"} onClick={(e)=>this.toggle(3)}>사용자 생성</div>
          <div className={this.state.toggle === 1 ? "active border tab usertab mx-2 px-5 py-3" : "border usertab mx-2 px-5 py-3" } onClick={(e)=>this.toggle(1)}>사용자 수정</div>
          <div className={this.state.toggle === 2 ? "active border tab historytab mx-2 px-5 py-3": "border historytab mx-2 px-5 py-3"} onClick={(e)=>this.toggle(2)}>히스토리</div>
          <div className={this.state.toggle === 4 ? "active border tab weblogtab mx-2 px-5 py-3": "border weblogtab mx-2 px-5 py-3"} onClick={(e)=>this.toggle(4)}>사용자 로그</div>
      </div>
      <div className={this.state.toggle ===1 ? "userManage active":"userManage"}>
    {this.state.user.show && !this.state.edit.show ? 
    <div className="userlist">
        <table className="table w-100">
          <thead>
          <tr className="text-center my-3">
            <th className="col-1">번호</th>
            <th className="col-2">유저ID</th>
            <th className="col-2">사용자명</th>
            <th className="col-1">부서명</th>
            <th className="col-1">그룹명</th>
            <th className="col-3">마지막 접속일시</th>
            <th className="col-2">기능</th>
          </tr>
          </thead>
          <tbody>
            {this.state.user.totalcnt > 0 ? this.state.user.currentTableData.map((user,index)=>(
              <tr className="text-center align-middle py-5" key={index + this.state.user.pageSize * (this.state.user.currentPage - 1) + 1}>
                <td className="index col-1">{index + this.state.user.pageSize * (this.state.user.currentPage - 1) + 1}</td>
                <td className="userid col-2">{user.userid}</td>
                <td className="name col-2">{user.name}</td>
                <td className="dept col-1">{user.dept}</td>
                <td className="group col-1">{user.group ==='ADMIN' ? "관리자":"일반"}</td>
                <td className="last_login_dt col-3">{helpers.krDateTime(user.last_login_dt)}</td>
                <td className="action d-table-cell col-2">
                  <button className="btn btn-primary me-1" data-tooltip="사용자 수정" onClick={(e)=> this.action(e,"edit", user.userid, index + this.state.user.pageSize * (this.state.user.currentPage - 1))}>수정</button>
                  <button className="btn btn-danger" data-tooltip="사용자 삭제" onClick={(e)=> this.action(e,"delete",user.userid, index + this.state.user.pageSize * (this.state.user.currentPage - 1))}>삭제</button>
                </td>
              </tr>
              )): <tr><td colspan="9"><h3 className="text-center">등록된 사용자가 없습니다</h3></td></tr>}
          </tbody>
        </table>
        <Pagination
            activePage={this.state.user.currentPage}
            itemsCountPerPage={this.state.user.pageSize}
            totalItemsCount={this.state.user.totalcnt}
            onChange={this.handleUserPageChange}
            itemClass="page-item"
            activeLinkClass="page-active"
            linkClass="page-link"
            innerClass="pagination d-flex justify-content-center"
        />
        </div>
:<div className="editlayer">
        <div className="card card-container">
  <div className="form-group userid">
    <p className="field-label">유저ID</p>
    <input type="text" name="userid" className="form-control" onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.userid} />
  </div>
  <div className="form-group password">
    <p className="field-label">비밀번호</p>
    <button className="btn btn-danger" onClick={(e)=> this.changePasswd(e)}>비밀번호 변경</button>
    <input type="hidden" name="password" className="form-control hidden" onClick={this.clear} onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.password} />
    {this.state.compare.show ? 
    <div className="passwordLayer">
      <div className="comparePassword my-3">
        <input type="password" name="newPassword" className="form-control mb-3" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.newPassword} placeholder="변경할 비밀번호를 입력하세요" />
        <input type="password" name="confirmPassword" className="form-control" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.confirmPassword} placeholder="변경할 비밀번호를 다시 입력해주세요" />
      </div>
      <div className={this.state.compare.newPassword && this.state.compare.confirmPassword ? "d-block compareResult":"d-none"}>입력된 비밀번호가 {this.state.compare.result ? "일치합니다":"다릅니다"}</div>
    </div>
    :<></>}
  </div>
  <div className="form-group name">
  <p className="field-label">사용자이름</p>
    <input type="text" name="name" className="form-control" onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.name} />
  </div>
  <div className="form-group depth">
  <p className="field-label">부서명</p>
    <input type="text" name="dept" className="form-control" onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.dept} />
  </div>
  {/* <div className="form-group group">
    <p className="field-label">그룹</p>
    <select className="form-control" name="group" onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.group}>
      <option disabled hidden value=''>선택</option>
      <option value="ADMIN">관리자</option>
      <option value="USER">일반</option>
    </select>
  </div> */}
  <div className="actionBtn d-flex justify-content-center align-items-center mt-5 mb-3">
    <button className="btn btn-primary me-1" onClick={(e)=> this.action(e,"update", this.state.edit.data.userid, this.state.user.select)}>수정</button>
    <button className="btn btn-primary" onClick={this.onCancel}>취소</button>
  </div>
  </div>
</div>}
</div>
    <div className={this.state.toggle === 2  ? "history active":"history"}>
           <table className="table w-100">
           <thead>
              <tr className="text-center my-3">
              <th className="text-center col-md-1">NO</th>
              <th className="text-center col-md-2">수정자</th>
              <th className="text-center col-md-2">유저ID</th>
              <th className="text-center col-md-4">수정내역</th>
              <th className="text-center col-md-3">수정시간</th>
              </tr>
              </thead>
              <tbody>
        {this.state.history.totalcnt > 0 ? this.state.history.currentTableData.map((log, index)=>{
          return (
          <tr className="text-center align-middle py-5">
            <td className="text-center col-md-1">{index + this.state.history.pageSize * (this.state.history.currentPage - 1) + 1}</td>
            <td className="text-center col-md-2">admin</td>
            <td className="text-center col-md-2">{log.userid}</td>
            <td className="text-start col-md-4">{log.mod_item}</td>
            <td className="text-center col-md-3">{helpers.krDateTime(log.mod_dt)}</td>
          </tr>
          );
        }): <tr className="nothing"><td colspan="5"><h2 className="text-center">남겨진 내역이 없습니다</h2></td></tr>}
        </tbody>
    </table>
       <Pagination
        activePage={this.state.history.currentPage}
        itemsCountPerPage={this.state.history.pageSize}
        totalItemsCount={this.state.history.totalcnt}
        onChange={this.handleHistoryPageChange}
        itemClass="page-item"
        activeLinkClass="page-active"
        linkClass="page-link"
        innerClass="pagination d-flex justify-content-center"
      />
    </div>
    <div className={this.state.toggle ===3 ? "adduser active":"adduser"}>
      <Register fetchData={this.fetchData} fetchHistoryData={this.fetchHistoryData} />
    </div>
    <div className={this.state.toggle ===4 ? "weblog active":"weblog"}>
      <Weblog />
      </div>
    </div>
    );
  }
}



