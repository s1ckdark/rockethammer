import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      time: new Date()
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }


  update = () => {
   this.setState({
      time: new Date()
    })
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state
    const h = this.state.time.getHours()
    const m = this.state.time.getMinutes()
    const s = this.state.time.getSeconds()

    return (
     <div className="profile col-md-12">
           <div className="card card-container">
            {(this.state.userReady) ?
              <div className="card-body">
                  <header className="jumbotron">
                    <img src="./img/rh_logo.png" alt="rockerhammer" className="w-100"/>
                  </header>
                  <div className="card-text">
                    <h3><strong>{currentUser.name}</strong>님</h3>
                    {/* <h4>현재 방문 시각은<br/> {h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'AM' : 'PM'} 입니다.<br/> </h4>  */}
                    <p><label>이 름:</label>{" "} {currentUser.name}</p>
                    <p><label>소 속:</label>{" "}{currentUser.dept}</p>
                    <p><label>Authorities:</label>{" "}{currentUser.group && currentUser.group ? currentUser.group : null}</p>
                  </div>
            </div>: null}
          </div>

   </div>
    );
  }
}
