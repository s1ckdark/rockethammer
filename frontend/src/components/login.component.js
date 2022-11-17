import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Navigate} from 'react-router-dom';
import AuthService from "../services/auth.service";
import { withRouter } from "../common/withRouter"
import axios from "axios"

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        필수 입력 항목입니다!
      </div>
    );
  }
};


class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeuserid = this.onChangeuserid.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      userid: "",
      password: "",
      loading: false,
      message: "",
      redirect: false
    }
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        redirect: true
      });
      return <Navigate to="/profile"/>
    } else {
      return <Navigate to="/home"/>
    }
  }

  onChangeuserid(e) {
    this.setState({
      userid: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.userid, this.state.password).then((user) => {
          axios.post(process.env.REACT_APP_API+'/user/insertsesshistory',{
            userid:user.userid,
            name:user.name,
            log:this.userAgent(),
            login_dt: new Date().toISOString(),
            ipAddr: this.internalIp
          }).then(res => {
            console.log(res);
            if(res.status === 200) {
              this.props.router.navigate('/profile');
              window.location.reload();
          }})
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

   // for write client log
  userAgent = ()=>{
    return navigator.userAgent;
  }

  internalIp = async () => {
    if (!RTCPeerConnection) {
        throw new Error("Not supported.")
    }

    const peerConnection = new RTCPeerConnection({ iceServers: [] })

    peerConnection.createDataChannel('')
    peerConnection.createOffer(peerConnection.setLocalDescription.bind(peerConnection), () => { })

    peerConnection.addEventListener("icecandidateerror", (event) => {
        throw new Error(event.errorText)
    })

    return new Promise(async resolve => {
        peerConnection.addEventListener("icecandidate", async ({candidate}) => {
            peerConnection.close()

            if (candidate && candidate.candidate) {
                const result = candidate.candidate.split(" ")[4]
                if (result.endsWith(".local")) {
                    const inputDevices = await navigator.mediaDevices.enumerateDevices()
                    const inputDeviceTypes = inputDevices.map(({ kind }) => kind)

                    const constraints = {}

                    if (inputDeviceTypes.includes("audioinput")) {
                        constraints.audio = true
                    } else if (inputDeviceTypes.includes("videoinput")) {
                        constraints.video = true
                    } else {
                        throw new Error("An audio or video input device is required!")
                    }

                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
                    mediaStream.getTracks().forEach(track => track.stop())
                    resolve(this.internalIp())
                }
                resolve(result)
            }
        })
    })
}

  render() {
    const {currentUser} = this.state;
     return (
      <div className="login col-md-12">
        <div className="card card-container">
          <img
            src={process.env.PUBLIC_URL+'/img/avatar_2x.png'}
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="userid">유저ID</label>
              <Input
                type="text"
                className="form-control"
                name="userid"
                value={this.state.userid}
                value={this.state.userid}
                onChange={this.onChangeuserid}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>

            <div className="form-group my-3">
              <button
                className="btn btn-primary btn-block mx-auto w-100"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger text-center" role="alert">
                  {this.state.message.split(". ")[0]}<br/>{this.state.message.split(". ")[1]}
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
    );
  }
}

export default withRouter(Login);