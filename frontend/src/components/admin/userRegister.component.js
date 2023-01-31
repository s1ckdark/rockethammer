import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import axios from 'axios';
import Breadcrumb from "../breadcrumb.component";
import { withRouter } from "../../common/withRouter";
import Dialog from "../dialog.component";
class UserRegister extends Component {

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);

    this.state = {
      fields:{
        userid: "",
        password: "",
        name:"",
        dept:"",
        group:"USER"
      },
      errors:{
        userid: "",
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
      message: "",
      modal: false
    };
  }

  dialogReset = ()=>{
    this.setState({
      ...this.state,
      message: ""
    })
  }

  validate(){
    const { fields } = this.state;
    const errors = {
        userid: "",
        password: "",
        name:"",
        dept:"",
        group:""
      }
    let formIsValid = true;

    if (!fields["userid"]) {
      formIsValid = false;
      errors["userid"] = "아이디를 입력해주세요";
    }

    if (typeof fields["userid"] !== "undefined") {
      if (!fields["userid"].match(/^[a-z]+[a-z0-9]*$/)) {
        formIsValid = false;
        errors["userid"] = "아이디는 영문만 가능합니다";
      }
    }

    if (fields["userid"].includes(" ")) {
      formIsValid = false;
      errors["userid"] = "이이디에는 공백이 허용되지 않습니다";
    }

    if(fields["userid"].length < 3 || fields["userid"].length > 20) {
      formIsValid = false;
      errors["userid"] = "아이디는 3자 이상으로 입력해주세요";
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "비밀 번호를 입력해주세요";
    }

    if (fields["password"].includes(" ")) {
      formIsValid = false;
      errors["password"] = "비밀 번호에는 공백이 허용되지 않습니다";
    }

    if (typeof fields["password"] !== "undefined") {
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

    if(fields['group'].length < 0){
      formIsValid = false;
      errors["group"] = "그룹을 지정해주세요";
    }

    this.setState({
      ...this.state,
      errors: errors,
      successful:false,
      message:"입력란에 잘못된 입력이 있습니다. 안내를 확인하시고 수정해주세요"
    });

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
    this.props.router.navigate(-1)
  }

  handleRegister(e) {
    e.preventDefault();

    if(!this.validate()) {
      this.setState({
        fields:{
        userid: "",
        password: "",
        name:"",
        dept:"",
        group:"USER",
        },
        compare:{
          newPassword:"",
          confirmPassword:"",
          result:false
        },
        successful: false,
        message: ''
      })
      return false;
  }

    AuthService.register(
      this.state.fields.userid,
      this.state.fields.password,
      this.state.fields.name,
      this.state.fields.dept,
      this.state.fields.group
    ).then(response => {
        this.setState({
          message: response.data.message,
          successful: true
        });
        axios.post(process.env.REACT_APP_API+"/user/upthistory",
          {
            userid: this.state.fields.userid,
            mod_item: "사용자 등록"
          }
        ).then( res => {
          if(res.status === 200) {
            this.props.router.navigate('/admin/manager');
            // window.location.reload()
         }
        })
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          successful: false,
          message: resMessage
        });
      }
    );
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

  dialogFunc = (act) => {
    switch (act){
      case 'yes':

      break;

      case 'no':

      break;

      case 'close':
        this.setState({
          ...this.state,
          message: ""
        })
      break;
      default:
        console.log("dialogFunc")
    }
  }

  render() {
    return (
      <div className="admin userRegister">
        <div className="page-header userRegister">
          <Breadcrumb/>
        </div>
        <div className="writing">
         <div className="form-group">
              <div className="input-group userid">
                <label htmlFor="userid">유저ID</label>
                <input type="text" className="input-userid" name="userid" value={this.state.fields.userid} onChange={this.onChangeValue} placeholder="사용할 아이디를 입력해주세요" />
                {this.state.errors.userid && (<div className="error-msg">{this.state.errors.userid}</div>)}
              </div>
              <div className="input-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="hidden" className="input-password" name="password" value={this.state.fields.password} onChange={this.onChangeValue} />
                  <div className="passwordLayer">
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
              <button type="submit" className="btn btn-register" onClick={this.handleRegister}>회원 등록</button>
              <button type="button" className="btn btn-cancel" onClick={this.handleCancelClick}>취소</button>
            </div>
          {this.state.message && (
            <Dialog type="alert" callback={this.dialogFunc} message={this.state.message}/>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(UserRegister)