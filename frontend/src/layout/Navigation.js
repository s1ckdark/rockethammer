import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import AuthService from "../services/auth.service";
import Header from "./Header";
import Container from "./Container";
import Footer from "./Footer";

import helpers from "../components/helpers.component";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/withRouter";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      // showModeratorBoard: false,
      // showAdminBoard: false,
      currentUser: undefined
    };
  }
  componentDidMount() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        // showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    } else {
      return <Navigate to="/home"/>
    }
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  onMouseEnter = (e) => {
    e.preventDefault();
    var thisNode = e.currentTarget.querySelector('p');
    var thisNodeImg = e.currentTarget.querySelector('img');
    gsap.to(thisNode, {autoAlpha:1,y:'-30px',duration:1},0)
    gsap.to(thisNodeImg, {scale:"1.5",duration:1}, 0);
  };

  onMouseLeave = (e) => {
    e.preventDefault();
    var thisNode = e.currentTarget.querySelector('p');
    var thisNodeImg = e.currentTarget.querySelector('img');
    gsap.to(thisNode, {autoAlpha:0, y:'-30px'})
    gsap.to(thisNodeImg, {scale:"1"})
  }

 logOut() {
    AuthService.logout();
    this.setState({
      // showModeratorBoard: false,
      // showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render(){
    let {currentUser, logOut} = this.props;
    const { currentLocation } = this.props.router.location;
    return(
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <span className="navbar-brand">
            <img src={process.env.PUBLIC_URL+'/img/rh_logo.png'} alt="ROCKETHAMMER" className="logo"/>
          </span>
          <div className="navbar-nav mx-auto">
            <ul>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/home"} className="nav-link">
                    <img alt="Home" src={process.env.PUBLIC_URL+'/img/home.png'} />
                <p>홈</p></Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/meta"} className="nav-link">
                  <img alt="Meta" src={process.env.PUBLIC_URL+'/img/meta-white.png'} />
                <p>메타관리</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkaadmin"} className="nav-link">
                  <img alt="kafkadmin" src={process.env.PUBLIC_URL+'/img/kafka-ui.png'} />
                <p>카프카<br/>어드민</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkamonitor"} className="nav-link">
                  <img alt="kafkamonitor" src={process.env.PUBLIC_URL+'/img/grafana.png'} />
                <p>카프카<br/>모니터링</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/metric"} className="nav-link">
                  <img alt="metric" src={process.env.PUBLIC_URL+'/img/promethus.png'} />
                <p>로그<br/>수집기</p>
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-nav ml-auto">
            {currentUser && currentUser.group === 'ADMIN' ?
                        <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        <Link to={"/admin"} className="nav-link">
                          <img alt="service" src={process.env.PUBLIC_URL+'/img/admin-white.png'} />
                        <p>설정</p>
                        </Link>
                      </li>
          :<></>}
        {!currentUser ?
        <>
            <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                 로그인
                </Link>
              </li>
              <li className="nav-item">
                <a href="/register" className="nav-link" onClick={this.props.logOut}>
                 회원등록
                </a>
              </li>!
        </>:
        <>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.name}님
                </Link>
              </li>
              <li className="nav-item">
                <a href="/home" className="nav-link" onClick={this.props.logOut}>
                  Log out
                </a>
              </li>
        </>}
            </div>
         </nav>
    )
        }
      }
export default withRouter(Navigation)