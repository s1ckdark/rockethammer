import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Link } from "react-router-dom";
import "../App.scss";

import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/withRouter";

class Header extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      currentUser: undefined,
      mode:''
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
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
      var img = process.env.PUBLIC_URL+'/img/'+e.currentTarget.className.replace(/(white|blue) nav-item/gi, '')+'color.svg'
      gsap.to(thisNode, {autoAlpha:1,x:2})
      gsap.set(thisNodeImg, {attr:{src:img }});
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
      var img = process.env.PUBLIC_URL+'/img/'+e.currentTarget.className.replace(/(white|blue) nav-item/gi, '')+mode+'.svg'
      gsap.set(thisNodeImg, {attr:{src:img }});
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

  navItem = (uri, mode, serviceName) => {
    let ext, classDef;
    const tmp = this.props.router.location.pathname.split('/')
    classDef = tmp[1] === uri ? uri+"-service-"+mode+" active nav-item": uri+"-service-"+mode+" nav-item"
    if(mode === 'blue') {ext = "-service-blue.svg"}
    else if(mode === 'white') {ext = "-service-white.svg"}
    if(tmp[1] === uri && tmp[1] !== 'admin') {ext = "-service-color.svg"}
    if(tmp[1] === uri && tmp[1] === 'admin' && mode === 'white') {ext = "-service-blue.svg"}
    return (
      <li className={classDef} onMouseEnter={(e)=>this.onMouseEnter(e,mode)} onMouseLeave={(e)=>this.onMouseLeave(e,mode)}>
      <Link to={"/"+uri} className="nav-link">
        <img alt={uri} src={process.env.PUBLIC_URL+'/img/'+uri+ext} />
        <p>{serviceName}</p>
      </Link>
    </li>
    )
  }
  render(){
    let {currentUser, pathname} = this.props;
    const tmp = pathname;
    let mode = tmp[0] === 'home' || tmp[0] === 'register' || tmp[0] === 'login' || tmp[0] === 'admin' || tmp[0] === '' || tmp[0] === 'profile'? "blue":"white";
    let logoMode = mode === 'blue' ? "logo.png":"logo_dark.svg";
    return(
      <header className={"header h-"+tmp[0]}>
        <nav className={mode+' navigation'}>
          <Link to={"/home"} className="logo"><img src={process.env.PUBLIC_URL+'/img/'+logoMode} alt="ROCKETHAMMER" className="logoImg"/></Link>
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
                 <li className={mode+" nav-item"}><Link to={"/login"} className="nav-link"><p>로그인</p></Link></li>
                </>:
              <>
                <li className={mode+" nav-item profile-service"}>
                  <Link to={"/profile"} className="nav-link">
                    <p>{currentUser.name} 님</p>
                  </Link>
                </li>
                <li className={"logout-service-"+mode+" nav-item"} onClick={this.props.logOut} onMouseEnter={(e)=>this.onMouseEnter(e,mode)} onMouseLeave={(e)=>this.onMouseLeave(e,mode)}>
                    <img alt="service" src={mode === 'blue' ? process.env.PUBLIC_URL+'/img/logout-service-blue.svg':process.env.PUBLIC_URL+'/img/logout-service-white.svg'}/>
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