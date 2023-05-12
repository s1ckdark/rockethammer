import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Link } from "react-router-dom";
import "../App.scss";
import logoDark from "../img/logo_dark.svg";
import logo from "../img/logo.png";
import metaServiceBlue from "../img/meta-service.svg";
import metaServiceWhite from "../img/meta-service-gray.svg";
import metaServiceColor from "../img/meta-service-color.svg";
import managerServiceBlue from "../img/manager-service.svg";
import managerServiceWhite from "../img/manager-service-gray.svg";
import managerServiceColor from "../img/manager-service-color.svg";
import monitorServiceBlue from "../img/monitor-service.svg";
import monitorServiceWhite from "../img/monitor-service-gray.svg";
import monitorServiceColor from "../img/monitor-service-color.svg";
import collectorServiceBlue from "../img/collector-service.svg";
import collectorServiceWhite from "../img/collector-service-gray.svg";
import collectorServiceColor from "../img/collector-service-color.svg";
import terminalServiceColor from "../img/terminal-service-color.svg";
import terminalServiceBlue from "../img/terminal-service.svg";
import terminalServiceWhite from "../img/terminal-service-gray.svg";
import diagServiceColor from "../img/diag-service-color.svg";
import diagServiceBlue from "../img/diag-service.svg";
import diagServiceWhite from "../img/diag-service-gray.svg";
import adminServiceBlue from "../img/admin-service.svg";
import adminServiceWhite from "../img/admin-service-gray.svg";
import adminServiceColor from "../img/admin-service-gray.svg";
import logoutServiceBlue from "../img/logout.svg";
import logoutServiceWhite from "../img/logout-gray.svg";
import logoutServiceColor from "../img/logout-gray.svg";

import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/withRouter";


class Header extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      currentUser: undefined,
      mode:'',
      terminal:{},
      selected:''
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        terminal:JSON.parse(process.env.REACT_APP_TERMINAL)
      });
    }
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  // componentWillMount() {
  //   const user = AuthService.getCurrentUser();
  //   if (user) {
  //     this.setState({
  //       currentUser: user,
  //     });
  //   }
  // }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  onMouseEnter = (e, mode) => {
    e.preventDefault();
    if(e.currentTarget.className.includes('active') === false) {
      var thisNode = e.currentTarget.querySelector('p');
      var thisNodeImg = e.currentTarget.querySelector('img');
      var img = thisNodeImg.className.replace(/(White|Blue)/gi, '')+'Color'
      gsap.to(thisNode, {autoAlpha:1,x:2})
      gsap.set(thisNodeImg, {attr:{src:this.navImg(img) }});
      gsap.to(thisNodeImg, {duration:1}, 0);
    } else {
      gsap.set(thisNode, {display:"block"});
    }
  };

  onMouseLeave = (e, mode) => {
    e.preventDefault();
    if(e.currentTarget.className.includes('active') === false) {
      var thisNode = e.currentTarget.querySelector('p');
      var thisNodeImg = e.currentTarget.querySelector('img');
      var img = thisNodeImg.className.replace(/(White|Blue)/gi, '')+mode;
      gsap.set(thisNodeImg, {attr:{src:this.navImg(img) }});
      gsap.to(thisNode, {autoAlpha:0,x:0})
    }
  }

 logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
    this.props.router.navigate('/home')
    window.location.reload();
  }

  navImg = (img)=> {
    const images = {
    metaServiceBlue,
    metaServiceWhite,
    metaServiceColor,
    managerServiceBlue,
    managerServiceWhite,
    managerServiceColor,
    monitorServiceBlue,
    monitorServiceWhite,
    monitorServiceColor,
    collectorServiceBlue,
    collectorServiceWhite,
    collectorServiceColor,
    terminalServiceColor,
    terminalServiceBlue,
    terminalServiceWhite,
    diagServiceColor,
    diagServiceBlue,
    diagServiceWhite,
    adminServiceBlue,
    adminServiceWhite,
    adminServiceColor,
    logoutServiceBlue,
    logoutServiceWhite,
    logoutServiceColor
    }
    return images[img];
  }

  onChangeValue = (e) =>{
    console.log(e.target.value)
    this.setState({
      ...this.state,
      selected:e.target.value
    }, ()=> this.openInNewTab(this.state.terminal[this.state.selected])
    )
  }

  openInNewTab = (url) => {
    window.open('http://'+url, '_blank', 'noopener, noreferrer');
  };

  navItem = (uri, mode, serviceName) => {
    let ext, classDef;
    const {terminal, selected} = this.state
    const tmp = this.props.router.location.pathname.split('/')
    classDef = tmp[1] === uri ? uri+"-service-"+mode+" active nav-item": uri+"-service-"+mode+" nav-item"
    if(mode === 'Blue') {ext = uri+"ServiceBlue"}
    else if(mode === 'White') {ext = uri+"ServiceWhite"}
    if(tmp[1] === uri && tmp[1] !== 'admin') {ext = uri+"ServiceColor"}
    if(tmp[1] === uri && tmp[1] === 'admin' && mode === 'White') {ext = uri+"ServiceBlue"}
    if(uri !== 'terminal') {
      return (
        <li className={classDef} onMouseEnter={(e)=>this.onMouseEnter(e,mode)} onMouseLeave={(e)=>this.onMouseLeave(e,mode)}>
        <Link to={"/"+uri} className="nav-link" role={ext}>
          <img className={ext} src={this.navImg(ext)}></img>
          <p>{serviceName}</p>
        </Link>
      </li>
      )
    } else {
      return (
        <li className={classDef} onMouseEnter={(e)=>this.onMouseEnter(e,mode)} onMouseLeave={(e)=>this.onMouseLeave(e,mode)}>
        <Link className="nav-link" role={ext}>
          <img className={ext} src={this.navImg(ext)}></img>
          <p>{serviceName}</p>
          <p><select className="cluster-name" name="cluster-Name" onChange={this.onChangeValue} defaultValue="default">
              <option key="default" value="default" disabled>서버 선택</option>
              {Object.keys(terminal).map(item => {
                return (
                  <option key={item} value={item}>{item} - {terminal[item]}</option>
                )
              }
                )
              }
              </select>
              </p>
        </Link>
      </li>
      )
    }

  }
  render(){
    let {currentUser, pathname} = this.props;
    const {terminal} = this.state;
    const tmp = pathname;
    let mode = tmp[0] === 'home' || tmp[0] === 'register' || tmp[0] === 'login' || tmp[0] === 'admin' || tmp[0] === '' || tmp[0] === 'profile'? "Blue":"White";
    let logoMode = mode === 'Blue' ? logo:logoDark;
    return(
      <header className={"header h-"+tmp[0]}>
        <nav className={mode+' navigation'}>
          <Link to={"/home"} className="logo"><img src={logoMode} alt="ROCKETHAMMER" className="logoImg"/></Link>
          <div className="navbar-nav nav">
            <ul>
              {this.navItem('meta',mode,"메타 관리")}
              {this.navItem('manager',mode,"카프카 어드민")}
              {this.navItem('monitor',mode,"카프카 모니터링")}
              {this.navItem('collector',mode,"로그 수집기")}
              {this.navItem('terminal',mode,"웹터미널")}
              {this.navItem('diag',mode,"지원 내역")}
            </ul>
          </div>
          <div className="navbar-nav auth">
            <ul>
              {!currentUser ?
              <>
                 <li className={mode+" nav-item"}><Link to={"/login"} className="nav-link"><p>로그인</p></Link></li>
                </>:
              <>
                <li className={"profile-service-"+mode+" nav-item profile-service"}>
                  <Link to={"/profile"} className="nav-link">
                    <p>{currentUser.name} 님</p>
                  </Link>
                </li>
                <li className={"logout-service-"+mode+" nav-item"} onMouseEnter={(e)=>this.onMouseEnter(e,mode)} onMouseLeave={(e)=>this.onMouseLeave(e,mode)} onClick={this.props.logOut}>
                  <Link className="nav-link" role="logout">
                  <img className="logoutService" src={mode === 'Blue' ? logoutServiceBlue:logoutServiceColor} />
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