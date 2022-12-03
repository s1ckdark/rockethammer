import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AuthService from "../services/auth.service";
import axios from "axios"
import { withRouter } from "../common/withRouter"

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeValue= this.onChangeValue.bind(this);

    this.state = {
      fields: {
        userid:'',
        password:''
      },
      errors: {
        userid:'',
        password:''
      },
      message:''
    }
  }

  componentDidMount() {
    // const user = AuthService.getCurrentUser();
    // if (user) {
    //   this.setState({
    //     currentUser: user,
    //     redirect: true
    //   });
    //   return <Navigate to="/profile"/>
    // } else {
    //   return <Navigate to="/home"/>
    // }
  }

  onChangeValue(e) {
    // let fields = this.state.fields;
    // fields[e.target.name] = e.target.value;
    // this.setState({
    //   fields
    // });
    this.setState({
      ...this.state,
      fields:{
        ...this.state.fields,
        [e.target.name]: e.target.value
      }
    })
  }

  validate() {
    const { fields } = this.state;
    const errors = {userid:'',password:''};
    let formIsValid = true;

     if (!fields["userid"]) {
      formIsValid = false;
      errors["userid"] = "아이디를 입력해주세요";
    }

    if (typeof fields["userid"] !== "undefined") {
      if (!fields["userid"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["userid"] = "아이디는 영문만 가능합니다";
      }
    }

    if (fields["userid"].includes(" ")) {
      formIsValid = false;
      errors["userid"] = "이이디에는 공백이 허용되지 않습니다";
    }

    if(fields["userid"].length < 4) {
      formIsValid = false;
      errors["userid"] = "아이디는 4글자 이상입니다";
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
        if(fields["password"].length < 4){
        formIsValid = false;
        errors["password"] = "비밀 번호는 4자 이상입니다";
      }
    }



    this.setState({
      errors: errors
    });

    return formIsValid;
  }


  handleLogin(e) {
    e.preventDefault();
    if (!this.validate()) {
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
          message: ""
        })
        return false;
    }

    AuthService.login(this.state.fields.userid, this.state.fields.password).then((user) => {
      axios.post(process.env.REACT_APP_API+'/user/insertsesshistory',{
            userid:user.userid,
            name:user.name,
            log:this.userAgent(),
            login_dt: new Date().toISOString(),
            ipAddr: this.internalIp
          }).then(res => {
            if(res.status === 200) {
              this.props.router.navigate('/profile');
              window.location.reload()
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
      <div className="login">
        <div className="login-box">
          <div className="logo_rocket"></div>
          <div className="inner">
            <h3>LOGIN</h3>
            <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <div className="input-group userid">
                <label htmlFor="userid">아이디</label>
                <input type="text" name="userid" className="input-userid" value={this.state.fields.userid} onChange={this.onChangeValue} placeholder="사용할 아이디를 입력해주세요"/>
                <div className="error-msg">{this.state.errors.userid}</div>
              </div>
              <div className="input-group group password">
                <label htmlFor="password">비밀번호</label>
                <input type="password" name="password" className="input-password"  value={this.state.fields.password} onChange={this.onChangeValue} placeholder="사용할 아이디의 비밀번호를 입력해주세요"/>
                <div className="error-msg">{this.state.errors.password}</div>
              </div>
            </div>
            <div className="btn-group">
              <button className="btn btn-login" onClick={this.handleLogin}>로그인</button>
              {/* <span>아직 회원이 아닌 경우 <Link to="/register">회원 등록</Link>을 해주세요</span> */}
            </div>
            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger text-center" role="alert">
                  {this.state.message.split(". ")[0]}<br/>{this.state.message.split(". ")[1]}
                </div>
              </div>
            )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);