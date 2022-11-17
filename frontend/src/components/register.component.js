import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from 'react-validation/build/select';
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import axios from 'axios';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        필수정보 입니다
      </div>
    );
  }
};

const vuserid = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        유저ID는 3자에서 20자 사이로 입력해주세요.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        비밀반호는 6자에서 40자 사이로 입력해주세요.
      </div>
    );
  }
};

const vname = value => {
  if (value.length < 2 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
       이름은 최소 1자에서 40자 사이로 입력해주세요.
      </div>
    );
  }
};

const vdept = value => {
  if (value.length < 0 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        부서명은 최소 6자에서 40자 사이로 입력해주세요.
      </div>
    );
  }
};

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);

    this.state = {
      userid: "",
      password: "",
      name:"",
      dept:"",
      group:"USER",
      successful: false,
      message: "",
      compare:{
        newPassword:"",
        confirmPassword:"",
        result:false
      },
    };
  }

  onChangeValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleCancelClick = (e) => {
    console.log("click cancel");
    this.setState({
      userid: "",
      password: "",
      name:"",
      dept:"",
      group:"USER",
      compare:{
        newPassword:"",
        confirmPassword:"",
        result:false
      },
      successful: false,
      message: ""
    })
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.userid,
        this.state.password,
        this.state.name,
        this.state.dept,
        this.state.group
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
          axios.post(process.env.REACT_APP_API+"/grafana/adduser",
          {
            name: this.state.name,
            email: this.state.userid,
            login: this.state.name,
            password: this.state.password,
          }
          ).then(res => console.log(res));
          axios.post(process.env.REACT_APP_API+"/user/upthistory",
            {
              userid: this.state.userid,
              mod_item: "사용자 등록"
            }
          ).then( res => {this.props.fetchData();this.props.fetchHistoryData()})
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
      this.state.compare.newPassword === this.state.compare.confirmPassword ? this.setState({...this.state,password:this.state.compare.confirmPassword,compare:{...this.state.compare,result:true}}):this.setState({...this.state,compare:{...this.state.compare,result:false}})
    })
  }

  render() {
    return (
      <div className="register">
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src={'./img/avatar_2x.png'}
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group mb-3">
                  <label htmlFor="userid">유저ID</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="userid"
                    value={this.state.userid}
                    onChange={this.onChangeValue}
                    validations={[required, vuserid]}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password">패스워드</label>
                  <Input
                    type="hidden"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangeValue}
                    validations={[required, vpassword]}
                  />
                </div>
                <div className="passwordLayer">
                  <div className="comparePassword my-3">
                    <input type="password" name="newPassword" className="form-control mb-3" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.newPassword} placeholder="비밀번호를 입력하세요" validations={[required, vpassword]}/>
                    <input type="password" name="confirmPassword" className="form-control" onClick={this.clear} onChange={e=>this.onPasswordChangeValue(e)} value={this.state.compare.confirmPassword} placeholder="비밀번호를 다시 입력해주세요" validations={[required, vpassword]}/>
                  </div>
                  <div className={this.state.compare.newPassword && this.state.compare.confirmPassword ? "d-block compareResult":"d-none"}>입력된 비밀번호가 {this.state.compare.result ? "일치합니다":"다릅니다"}</div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="name">사용자명</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeValue}
                    validations={[required, vname]}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="dept">부서명</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="dept"
                    value={this.state.dept}
                    onChange={this.onChangeValue}
                    validations={[required, vdept]}
                  />
                </div>

                {/* <div className="form-group mb-5">
                  <label htmlFor="dept">그룹</label>
                  <Select className="form-control" name="group" value={this.state.group} onChange={this.onChangeValue} validations={[required]}>
                    <option disabled={true} selected value="">--그룹 선택--</option>
                    <option value="ADMIN">관리자</option>
                    <option value="USER">일반</option>
                  </Select>
                </div> */}
  
                <div className="action-btn d-flex justify-content-center align-items-center mt-5">
                    <button className="btn btn-primary btn-block me-2">회원 가입</button>
                    <button type="button" className="btn btn-danger btn-block" onClick={this.handleCancelClick}>취소</button>
                  </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
      </div>
    );
  }
}