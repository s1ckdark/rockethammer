import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import axios from 'axios';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vuserid = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The userid must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vname = value => {
  if (value.length < 2 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The name must be between 6 and 40 characters.
      </div>
    );
  }
};

const vdept = value => {
  if (value.length < 0 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The dept must be between 6 and 40 characters.
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
      message: ""
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
            password: this.state.password
          }
          ).then(res => console.log(res));
          axios.post(process.env.REACT_APP_API+"/user/upthistory",
            {
              userid: this.state.userid,
              mod_item: this.state.userid+" 사용자 등록"
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

  render() {
    return (
      <div className="register">
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
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
                <div className="form-group">
                  <label htmlFor="userid">userid</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="userid"
                    value={this.state.userid}
                    onChange={this.onChangeValue}
                    validations={[required, vuserid]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangeValue}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeValue}
                    validations={[required, vname]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dept">Dept</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="dept"
                    value={this.state.dept}
                    onChange={this.onChangeValue}
                    validations={[required, vdept]}
                  />
                </div>

                  <Input
                    type="hidden"
                    name="group"
                    value={this.state.group}
                    onChange={this.onChangeValue}
                  />
  
                <div className="action-btn mt-3">
                    <button className="btn btn-primary btn-block me-2">Sign Up</button>
                    <button type="button" className="btn btn-primary btn-block" onClick={this.handleCancelClick}>Cancel</button>
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