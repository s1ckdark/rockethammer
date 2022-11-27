import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "../App.scss";

import AuthService from "../services/auth.service";
import helpers from "../common/helpers";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/withRouter";

class Header extends Component {
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
    // var thisNode = e.currentTarget.querySelector('p');
    // var thisNodeImg = e.currentTarget.querySelector('img');
    // gsap.to(thisNode, {autoAlpha:1,y:'-30px',duration:1},0)
    // gsap.to(thisNodeImg, {scale:"1.5",duration:1}, 0);
  };

  onMouseLeave = (e) => {
    e.preventDefault();
    // var thisNode = e.currentTarget.querySelector('p');
    // var thisNodeImg = e.currentTarget.querySelector('img');
    // gsap.to(thisNode, {autoAlpha:0, y:'-30px'})
    // gsap.to(thisNodeImg, {scale:"1"})
  }

 logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render(){
    let {currentUser, logOut} = this.props;
    const { currentLocation } = this.props.router.location;
    return(
      <header className="header">
        <nav className="navigation blue">
          <Link to={"/home"}><img src={process.env.PUBLIC_URL+'/img/logo.png'} alt="ROCKETHAMMER" className="logo"/></Link>
          <div className="navbar-nav nav">
            <ul>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/meta"} className="nav-link">
                  <img alt="Meta" src={process.env.PUBLIC_URL+'/img/meta.svg'} />
                <p>메타관리</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkaadmin"} className="nav-link">
                  <img alt="kafkadmin" src={process.env.PUBLIC_URL+'/img/manager.svg'} />
                <p>카프카 어드민</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkamonitor"} className="nav-link">
                  <img alt="kafkamonitor" src={process.env.PUBLIC_URL+'/img/monitor.svg'} />
                <p>카프카 모니터링</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/metric"} className="nav-link">
                  <img alt="metric" src={process.env.PUBLIC_URL+'/img/collector.svg'} />
                <p>로그 수집기</p>
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-nav auth">
            <ul>
              {!currentUser ?
              <>
                <li className="nav-item"><Link to={"/login"} className="nav-link">로그인</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link" onClick={this.props.logOut}>회원등록</Link></li>!
                </>:
              <>
                <li className="nav-item"><Link to={"/profile"} className="nav-link"> {currentUser.name}님</Link></li>
                <li className="nav-item"><Link className="nav-link" onClick={this.props.logOut}><img alt="service" src={process.env.PUBLIC_URL+'/img/logout.svg'}/><p>로그아웃</p></Link></li>
              </>}
              {currentUser && currentUser.group === 'ADMIN' ?
                <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}><Link to={"/admin"} className="nav-link"><img alt="service" src={process.env.PUBLIC_URL+'/img/admin.svg'} /><p>설정</p></Link></li>
                :<></>}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}
export default withRouter(Header)