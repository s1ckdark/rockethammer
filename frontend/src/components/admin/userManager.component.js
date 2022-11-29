import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import Pagination from "react-js-pagination";
import { withRouter } from "../../common/withRouter";
import helpers from "../../common/helpers";
import Breadcrumb from "../breadcrumb.component";

class UserManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userReady: false,
      history:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:5,
        currentTableData:[],
      },
      data:{},
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
      currentUser: { userid: "" },
      inputfield:'',
      time: new Date()
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.props.router.navigate('/admin/manager/'+pageNumber)
    this.fetchData(pageNumber-1)
  }

  fetchData = async(page ) => {
    await axios.post(process.env.REACT_APP_API+"/user/getall",{size:10,page:page})
      .then(res => {
          this.setState({
            ...this.state,
            userReady: true,
            data:res.data
          })
      });
  }

  componentDidMount() {
      this.fetchData(0)
    }

  writeHistory(e, type, userid, index){
    e.preventDefault();
    axios.post(process.env.REACT_APP_API+"/user/upthistory",
      {
        userid: userid,
        mod_item:type
      }
    ).then(res => {
      this.fetchData();
      // this.fetchHistoryData();
    })
  }

  async action(e, type, userid, index) {
    e.preventDefault();
    console.log(e,type,userid,index)
    let conType, historytype;
    if(type === 'update') conType = "업데이트";
    if(type === 'delete') conType = "삭제";
    if(type === 'add') conType = "사용자 등";

    switch(type) {
      case 'update':
        if(this.state.compare.result === false) {alert("비밀번호를 확인해주세요");return false;}
        if(window.confirm(userid+"업데이트 하겠습니까?")) {
          let ele = [];
          axios.post(process.env.REACT_APP_API+"/user/get",{userid:userid}).then(res => {
            console.log(res);
            if(this.state.compare.work) ele.push("비밀번호 변경")
            if(res.data.name !== this.state.user.data[index].name) ele.push("이름을 {"+res.data.name+"} -> {"+this.state.user.data[index].name+"} "+conType)
            if(res.data.dept !== this.state.user.data[index].dept) ele.push("소속을 {"+res.data.dept+"} -> {"+this.state.user.data[index].dept+"} "+conType)
            if(res.data.group !== this.state.user.data[index].group) ele.push("그룹을 {"+res.data.group+"} -> {"+this.state.user.data[index].group+"} "+conType)
          })
          console.log(ele);
          // historytype = ele.join("\r\n");
          axios.post(process.env.REACT_APP_API+"/user/update/"+userid, this.state.edit.data).then(res => res.status === 200 ? this.fetchData():null)
          ele.forEach(item => this.writeHistory(e, item , userid, index))
          this.handlePageChange(this.state.user.currentPage);
        } else {
          alert("취소됩니다");
        }

        this.setState({
          ...this.state,
          user:{
            ...this.state.user,
            show:true
          },
          edit:{
            show:false,
            dept:'',
            group:'',
            password:'',
            userid:'',
            name:''
          }
        })
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
        break;

      case 'delete':
        if(userid !== 'admin') {
          historytype = userid+"를 "+conType;
          if (window.confirm(userid+"를 정말 삭제합니까?")) {
            axios.post(process.env.REACT_APP_API+'/user/delete',{keyword:userid}).then(res => {
                this.setState({
                  ...this.state,
                  edit:{
                    show:false,
                    dept:'',
                    group:'',
                    password:'',
                    userid:'',
                    name:''}
                  },()=> this.writeHistory(e, historytype, userid, index)
                )
              }
            )
          } else {
            alert("취소합니다.");
          }
        } else {
           alert("admin은 삭제가 불가능합니다.");
        }
        break;

      default:
        console.log("do nothing")

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
    const { data, userReady } = this.state;
    if(userReady){
      return (
        <div className="admin userManager">
          <div className="page-header userManager">
              <Breadcrumb/>
          </div>
          <div className="listing">
            <div className="user-list">
            <table className="table-list">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유저ID</th>
                  <th>사용자명</th>
                  <th>부서명</th>
                  <th>그룹명</th>
                  <th>마지막 접속일시</th>
                  <th>기능</th>
                </tr>
              </thead>
              <tbody>
              {data.list && data.list.length > 0 ? data.list.map((item,index)=>(
                <tr data-index={index} key={data.size*parseInt(data.current)+index+1}>
                  <td className="index">{data.size*parseInt(data.current)+index+1}</td>
                  <td className="userid">{item.userid}</td>
                  <td className="name">{item.name}</td>
                  <td className="dept">{item.dept}</td>
                  <td className="group">{item.group ==='ADMIN' ? "관리자":"일반"}</td>
                  <td className="last_login_dt">{helpers.krDateTime(item.last_login_dt)}</td>
                  <td className="btn-group">
                    <button className="btn btn-modify" data-tooltip="사용자 수정" onClick={(e)=> this.action(e,"edit", item.userid, index + data.pageSize * (data.currentPage - 1))}>수정</button>
                    <button className="btn btn-delete" data-tooltip="사용자 삭제" onClick={(e)=> this.action(e,"delete",item.userid, index + data.pageSize * (data.currentPage - 1))}>삭제</button>
                  </td>
                </tr>
                )): <tr><td colSpan="9">등록된 사용자가 없습니다</td></tr>}
            </tbody>
          </table>
          <div className="paging">
            <Pagination
                activePage={data.current+1}
                itemsCountPerPage={data.size}
                totalItemsCount={data.count}
                onChange={this.handlePageChange}
                itemClass="page-item"
                activeLinkClass="page-active"
                linkClass="page-link"
                innerClass="pagination"
            />
          </div>
        </div>

      {/* <div className="editlayer">
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
    <div className="form-group group">
      <p className="field-label">그룹</p>
      <select className="form-control" name="group" onChange={e=>this.onChangeValue(e)} value={this.state.edit.data.group}>
        <option disabled hidden value=''>선택</option>
        <option value="ADMIN">관리자</option>
        <option value="USER">일반</option>
      </select>
    </div>
    <div className="actionBtn d-flex justify-content-center align-items-center mt-5 mb-3">
      <button className="btn btn-primary me-1" onClick={(e)=> this.action(e,"update", this.state.edit.data.userid, this.state.user.select)}>수정</button>
      <button className="btn btn-primary" onClick={this.onCancel}>취소</button>
    </div>
    </div>
  </div> */}
  </div>
      </div>
      );
  }
  }
}

export default withRouter(UserManager)

