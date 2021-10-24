import React, { useRef, useState, useEffect, Component } from 'react'
import { TimelineMax, Expo } from "gsap/all";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Home from "./components/home.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
// import BoardUser from "./components/board-user.component";
// import BoardModerator from "./components/board-moderator.component";
// import BoardAdmin from "./components/board-admin.component";
import Confluent from "./components/confluent.component";
import Grafana from "./components/grafana.component";
import Gitlab from "./components/gitlab.component";
import Meta from "./components/meta.component";
import Portainer from "./components/portainer.component";
import Admin from "./components/admin.component";
import Airflow from "./components/airflow.component";
import Seo from "./components/seo.component";
import Elk from "./components/elk.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      // showModeratorBoard: false,
      // showAdminBoard: false,
      currentUser: undefined
    };
    // this.onMouseEnter = this.onMouseEnter.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
      });
    }
     this.animation = new TimelineMax({paused:true});   
    }


onMouseEnter = (e) => {
          e.preventDefault();
          var thisNode = e.currentTarget.querySelector('p');
          var thisNodeImg = e.currentTarget.querySelector('img');
          // console.log(e.currentTarget);
          thisNodeImg.style.opacity="0.6"
          thisNode.style.visibility="visible";
          thisNode.style.opacity="1";
          thisNode.style.top="50%";
          thisNode.style.transform="translate(-50%,-50%)";
          // this.animation.staggerFromTo(thisNode, 1, {autoAlpha:0,y:'30px' },{autoAlpha:1,y:'0px' }, 0.3); 
          // // TweenMax.staggerTo(thisNode.querySelector('img'), 1, {scale:"1.5"});
          // this.animation.play();
        };
onMouseLeave = (e) => {
        e.preventDefault();
        var thisNode = e.currentTarget.querySelector('p');
        var thisNodeImg = e.currentTarget.querySelector('img');
        // console.log(thisNode);
        thisNodeImg.style.opacity="1"
        thisNode.style.visibility="hidden";
        thisNode.style.opacity="0";
        thisNode.style.top="100%";
        thisNode.style.transform="translate(-50%,0)";
        // TweenMax.staggerTo(thisNode, 1, {scale:"1"});
         // this.animation.reverse();
        }
  

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div ref={el => { this.container = el;}}>
      <Seo />
    {currentUser ? 
      currentUser.group === 'ADMIN' ?
      (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <span className="navbar-brand">
            Goodusdata
          </span>
          <div className="navbar-nav mr-auto">
            <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <Link to={"/home"} className="nav-link">
                  <img src={'./img/home.png'} />
              <p>홈</p></Link>
            </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <Link to={"/confluent"}  className="nav-link">
               <img src={'./img/confluent-white.png'} />
              <p>모니터링 </p>
              </Link>
              </li>     
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/gitlab"} className="nav-link">
                  <img src={'./img/gitlab.png'} />
                <p>소스관리</p>
                </Link>
              </li>          
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/grafana"} className="nav-link">
                  <img src={'./img/grafana.png'} alt="대쉬보드"/>
                <p>시각화</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/meta"} className="nav-link">
                  <img src={'./img/meta-white.png'} />
                <p>메타관리</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/portainer"} className="nav-link">
                  <img src={'./img/portainer.png'} />
                <p>이미지관리</p>
                </Link>
              </li>              
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/airflow"} className="nav-link">
                  <img src={'./img/airflow.png'} />
                <p>작업관리</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/elk"} className="nav-link">
                  <img src={'./img/elk.png'} />
                <p>검색</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/admin"} className="nav-link">
                  <img src={'./img/admin-white.png'} />
                <p>관리자</p>
                </Link>
              </li>             
            </div>
        
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}님
                </Link>
              </li>
              <li className="nav-item">
                <a href="/home" className="nav-link" onClick={this.logOut}>
                  Log out
                </a>
              </li>
            </div>
         </nav>
          ) :null 
      : null
    }


        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/confluent" component={Confluent} />
            <Route exact path="/grafana" component={Grafana} />
            <Route exact path="/gitlab" component={Gitlab} />
            <Route exact path="/meta" component={Meta} />
            <Route exact path="/portainer" component={Portainer} />
            <Route exact path="/airflow" component={Airflow} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/elk" component={Elk} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
