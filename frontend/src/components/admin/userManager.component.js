import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios"
import Pagination from "react-js-pagination";
import { withRouter } from "../../common/withRouter";
import helpers from "../../common/helpers";
import Breadcrumb from "../breadcrumb.component";
import Dialog from "../dialog.component";

class UserManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userReady: false,
      type:'list',
      data:{},
      fields:{
        userid: "",
        password: "",
        name:"",
        dept:"",
        group:"USER"
      },
      errors:{
        password: "",
        name:"",
        dept:"",
        group:""
      },
      compare:{
        newPassword:"",
        confirmPassword:"",
        result:false
      },
      user:{},
      successful: false,
      message: "",
      messageType:'',
      passwd:false,
      act:{
        idx:'',
        type:''
      }
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.props.router.navigate('/admin/manager/'+pageNumber)
    this.fetchData(pageNumber-1)
  }

  fetchData = async(page = 0) => {
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
    const currentPage = this.props.router.params.currentPage || 1
    this.fetchData(currentPage-1);
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({
      ...this.state,
      user:user
    })
    }

  writeHistory(type, userid){
    axios.post(process.env.REACT_APP_API+"/user/upthistory",
      {
        modifier:this.state.user.userid,
        userid: userid,
        mod_item:type
      }
    ).then(res => {
      this.fetchData();
    })
  }

  callAction(e, type, index=null){
    e.preventDefault()
    console.log(type,index)
    const data = this.state.data.list[index]

    switch (type){
      case 'delete':
        this.setState({
          ...this.state,
          message:data.userid+"를 정말 삭제합니까?",
          messageType:'confirm',
          act:{
            idx:index,
            type:"delete"
          }
        })
      break;

      case 'edit':
        this.setState({
          ...this.state,
          act:{
            idx:index,
            type:"edit"
          }
        },()=> this.action(type))

      break;

      default:
        console.log("callAction")
      }
  }

  dialogCallback = (act) => {
    switch (act){
      case 'yes':
        this.action("delete")
        this.setState({...this.state,message:''})
      break;

      case 'no':
        this.setState({...this.state,message:''})
      break;

      case 'close':
        this.setState({
          ...this.state,
          message: ""
        })
      break;
      default:
        console.log("dialogCallback")
    }
  }

  passwdToggle = (e) => {
    e.preventDefault();
    this.state.passwd ? this.setState({...this.state, passwd: false}):this.setState({...this.state, passwd: true})
  }


  async action(type) {
    const {fields, act} = this.state
    const data = this.state.data.list[act.idx]
    let conType, historytype;
    if(type === 'update') conType = "업데이트";
    if(type === 'delete') conType = "삭제";
    if(type === 'add') conType = "사용자 등";

    switch(type) {
      case 'update':

        if(!this.validate()) return false;
        await axios.post(process.env.REACT_APP_API+"/user/update", this.state.fields).then(res => {
          if(res.status === 200) {
            axios.post(process.env.REACT_APP_API+"/user/upthistory", {userid: fields.userid,mod_item: "사용자 수정"}).then( res => {
              if(res.status === 200) {
                let ele = [];
                if(this.state.passwd && this.state.compare.result) ele.push("비밀번호 변경")
                if(data.name !== fields.name) ele.push("이름을 {"+data.name+"} -> {"+fields.name+"} "+conType)
                if(data.dept !== fields.dept) ele.push("소속을 {"+data.dept+"} -> {"+fields.dept+"} "+conType)
                if(data.group !== fields.group) ele.push("그룹을 {"+data.group+"} -> {"+fields.group+"} "+conType)
            ele.forEach(item => this.writeHistory(item , fields.userid))
            setTimeout(() => {
              this.setState({
                ...this.state,
                type:"list",
                successful: true,
                message: fields.userid+" 수정이 완료되었습니다",
                messageType:'alert'
              })
              if(this.state.successful === true) this.props.router.navigate('/admin/manager');
            }, 1000)
          }})

      }
    }
    , error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            ...this.state,
            successful: false,
            message: resMessage
          })
    })
      // }

      break;

      case 'edit':
        this.setState({
          ...this.state,
          fields:data,
          type:'edit'
        })
        break;

      case 'delete':
        if(data.group !== 'ADMIN') {
          historytype = data.userid+"를 "+conType;
          await axios.post(process.env.REACT_APP_API+'/user/delete',{keyword:data.userid}).then(res => {
                if(res.status === 200) {
                  this.writeHistory(historytype, data.userid, this.state.act.idx)
                  this.setState({
                    ...this.state,
                    messageType:'alert',
                    message:"삭제가 완료되었습니다"
                  })
                }
          })
        } else {
            this.setState({
              ...this.state,
              messageType:'alert',
              message:"admin은 삭제가 불가능합니다."
            })
        }
        break;

      default:
        console.log("do nothing")

    }
  }


  validate(){
    const { fields } = this.state;
    const errors = {
        password: "",
        name:"",
        dept:"",
        group:""
      }

    let formIsValid = true;

    if(this.state.passwd && !fields["password"]) {
      formIsValid = false;
      errors["password"] = "비밀 번호를 입력해주세요";
    }

    if (this.state.passwd && fields["password"].includes(" ")) {
      formIsValid = false;
      errors["password"] = "비밀 번호에는 공백이 허용되지 않습니다";
    }

    if(this.state.passwd && typeof fields["password"] !== "undefined") {
      // if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        if(fields["password"].length < 4 || fields['password'].length > 20){
        formIsValid = false;
        errors["password"] = "비밀 번호는 4자 이상으로 입력해주세요";
      }
    }

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "이름을 입력해주세요";
    }

    if(fields["name"].length < 3 || fields["name"].length > 20) {
      formIsValid = false;
      errors["name"] = "이름을 3자 이상 입력해주세요";
    }


    if (!fields["dept"]) {
      formIsValid = false;
      errors["dept"] = "소속 부서명을 입력해주세요";
    }

    if(fields["dept"].length < 3 || fields["dept"].length > 20) {
      formIsValid = false;
      errors["dept"] = "부서명을 3자 이상 입력해주세요";
    }

    if(formIsValid === false) {
      this.setState({
        ...this.state,
        errors: errors,
        message:"입력란에 잘못된 입력이 있습니다. 안내를 확인하시고 수정해주세요",
        messageType:'alert',
        successful: false
      });
  }

    return formIsValid;
}

  onChangeValue = (e) => {
    this.setState({
      ...this.state,
      fields:{
        ...this.state.fields,
        [e.target.name]: e.target.value
      },
      errors:{
        ...this.state.errors,
        [e.target.name]: ''
      }
    })
  }

  handleCancelClick = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      fields:{
        userid: "",
        password: "",
        name:"",
        dept:"",
        group:"USER",
      },
      errors:{
        password: "",
        name:"",
        dept:"",
        group:""
      },
      compare:{
        newPassword:"",
        confirmPassword:"",
        result:false
      },
      successful: false,
      message:"",
      type:'list'
    })
  }

  onPasswordChangeValue = (e) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      compare:{
        ...this.state.compare,
      [e.target.name]:e.target.value
      },
      errors:{
        ...this.state.errors,
        password:''
      }
    },()=>{
      this.state.compare.newPassword === this.state.compare.confirmPassword ?
      this.setState({
        ...this.state,
        fields:{
          ...this.state.fields,
          password:this.state.compare.confirmPassword
        },
        compare:{
          ...this.state.compare,
          result:true
        }}):this.setState({...this.state,compare:{...this.state.compare,result:false}})
    })
  }

  render() {
    const { data, userReady, type } = this.state;
    if(userReady && type ==='list') {
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
                  <td className="index">{data.count - (data.size * data.current) - index}</td>
                  <td className="userid">{item.userid}</td>
                  <td className="name">{item.name}</td>
                  <td className="dept">{item.dept}</td>
                  <td className="group">{item.group ==='ADMIN' ? "관리자":"일반"}</td>
                  <td className="last_login_dt">{item.last_login_dt ? helpers.krDateTime(item.last_login_dt):"-"}</td>
                  <td className="btn-group">
                    <button className="btn btn-modify" data-tooltip="사용자 수정" onClick={(e)=> this.callAction(e,"edit", index)}>수정</button>
                    <button className="btn btn-delete" data-tooltip="사용자 삭제" onClick={(e)=> this.callAction(e,"delete", index)}>삭제</button>
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
        {this.state.message && (
            <Dialog type={this.state.messageType} callback={this.dialogCallback} message={this.state.message}/>
        )}
        </div>
        </div>
        )} else {
          return(
            <div className="admin userManager">
            <div className="page-header userManager">
              <Breadcrumb/>
            </div>
            <div className="writing">
              <div className="form-group">
                <div className="input-group userid">
                  <label htmlFor="userid">유저ID</label>
                  <input type="text" className="input-userid" name="userid" value={this.state.fields.userid} onChange={this.onChangeValue} readOnly={true} />
                  {this.state.errors.userid && (<div className="error-msg">{this.state.errors.userid}</div>)}
                </div>
                <div className="input-group">
                  <label htmlFor="password">비밀번호</label>
                  <button className="passwordReset btn btn-reset" onClick={this.passwdToggle}>재설정</button>
                  <input type="hidden" className="input-password" name="password" value={this.state.fields.password} onChange={this.onChangeValue} />
                  <div className={this.state.passwd ? "active passwordLayer":"passwordLayer"}>
                    <div className="comparePassword my-3">
                      <input type="password" name="newPassword" className="input-newPassword" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.newPassword} placeholder="비밀번호를 입력하세요" />
                      <input type="password" name="confirmPassword" className="input-confrimPassword" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.confirmPassword} placeholder="비밀번호를 다시 입력해주세요" />
                    </div>
                    {this.state.errors.password && !this.state.compare.result && (<div className="error-msg">입력된 비밀번호가 일치하지 않습니다. {this.state.errors.password}</div>)}
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="name">사용자명</label>
                  <input type="text" className="input-name" name="name" value={this.state.fields.name} onChange={this.onChangeValue} placeholder="사용할 사용자명을 입력해주세요"/>
                  {this.state.errors.name && (<div className="error-msg">{this.state.errors.name}</div>)}
                </div>
                <div className="input-group">
                  <label htmlFor="dept">부서명</label>
                  <input type="text" className="input-dept" name="dept" value={this.state.fields.dept} onChange={this.onChangeValue} placeholder="소속 부서를 입력해주세요"/>
                  {this.state.errors.dept && (<div className="error-msg">{this.state.errors.dept}</div>)}
                </div>
                <div className="input-group">
                  <label htmlFor="dept">그룹</label>
                  <select className="input-select" name="group" value={this.state.fields.group} onChange={this.onChangeValue}>
                    <option disabled={true} selected value="">--그룹 선택--</option>
                    <option value="ADMIN">관리자</option>
                    <option value="USER">일반</option>
                  </select>
                  {this.state.errors.group && (<div className="error-msg">{this.state.errors.group}</div>)}
                </div>
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-register" onClick={(e)=> this.action("update")}>수정</button>
                <button type="button" className="btn btn-cancel" onClick={(e) => this.handleCancelClick(e)}>취소</button>
              </div>
              {this.state.message && (
                <Dialog type={this.state.messageType} callback={this.dialogCallback} message={this.state.message}/>
              )}
            </div>
          </div>
          )
         }
      }
    }

    export default withRouter(UserManager)


