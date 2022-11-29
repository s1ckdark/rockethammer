import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Link, Navigate } from "react-router-dom";
import "../App.scss";

import AuthService from "../services/auth.service";
import helpers from "../common/helpers";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/withRouter";
import metaComponent from '../components/meta.component';

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
    // gsap.to(thisNode, {autoAlpha:1,display:"block",x:'10px',duration:1},1)
    // gsap.to(thisNodeImg, {scale:"1.2",duration:1}, 0);
  };

  onMouseLeave = (e) => {
    e.preventDefault();
    // var thisNode = e.currentTarget.querySelector('p');
    // var thisNodeImg = e.currentTarget.querySelector('img');
    // gsap.to(thisNode, {autoAlpha:0, display:"none",x:'-10px',duration:1})
    // gsap.to(thisNodeImg, {scale:"1"})
  }

 logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
    this.props.router.navigate('/home')
    window.location.reload();
  }

  navItem = (uri, mode, serviceName) => {
    let ext, classDef;
    const tmp = this.props.router.location.pathname.split('/')
    classDef = tmp[1] === uri ? uri+"-service active nav-item":uri+"-service nav-item"
    if(mode === 'blue') {ext = ".svg"}
    else if(mode === 'white') {ext = "_gray.svg"}
    if(tmp[1] === uri) {ext = "_color.svg"}
    return (
      <li className={classDef} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      <Link to={"/"+uri} className="nav-link">
        <img alt={uri} src={process.env.PUBLIC_URL+'/img/'+uri+ext} />
        <p>{serviceName}</p>
      </Link>
    </li>
    )
  }
  render(){
    let {currentUser, logOut} = this.props;
    const tmp = this.props.router.location.pathname.split('/')
    let mode = tmp[1] === 'home' || tmp[1] === 'admin' ? "blue":"white";
    let logoMode = mode === 'blue' ? "logo.png":"logo_dark.svg";
    return(
      <header className="header">
        <nav className={mode+' navigation'}>
          <Link to={"/home"}><img src={process.env.PUBLIC_URL+'/img/'+logoMode} alt="ROCKETHAMMER" className="logo"/></Link>
          <div className="navbar-nav nav">
            <ul>
              {this.navItem('meta',mode,"메타 관리")}
              {this.navItem('manager',mode,"카프카 어드민")}
              {this.navItem('monitor',mode,"카프카 모니터링")}
              {this.navItem('collector',mode,"로그 수집기")}
            </ul>
          </div>
          <div className="navbar-nav auth">
            <ul>
              {!currentUser ?
              <>
                <li className="nav-item"><Link to={"/login"} className="nav-link"><p>로그인</p></Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link" onClick={this.props.logOut}><p>회원 등록</p></Link></li>
                </>:
              <>
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.name} 님
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.props.logOut}>
                    <img alt="service" src={mode === 'blue' ? process.env.PUBLIC_URL+'/img/logout.svg':process.env.PUBLIC_URL+'/img/logout_gray.svg'}/>
                    <p>로그아웃</p>
                  </Link>
                </li>
              </>}
              {currentUser && currentUser.group === 'ADMIN' ?
                 this.navItem('admin',mode,"설정")
                :<></>}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}
export default withRouter(Header)