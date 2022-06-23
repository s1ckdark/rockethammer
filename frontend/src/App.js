import React, { useRef, useState, useEffect, Component } from 'react'
import { TimelineMax, Expo } from "gsap/all";
import { Routes, Route, Link } from "react-router-dom";
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
import Meta from "./components/meta.component";
import Seo from "./components/seo.component";
import Connector from "./components/connector.component";
import KafkaAdmin from "./components/kafkaadmin.component";
import KafkaMonitor from "./components/kafkamonitor.component";
import K8Monitor from "./components/k8monitor.component";
import Metric from "./components/metric.component";
import Admin from "./components/admin.component.js";
import Metawrite from "./components/metawrite.component";

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
            <img src={'./img/rh_logo.png'} alt="ROCKETHAMMER" className="logo"/>
          </span>
          <div className="navbar-nav mx-auto">
            <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <Link to={"/home"} className="nav-link">
                  <img alt="Home" src={'./img/home.png'} />
              <p>홈</p></Link>
            </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <Link to={"/confluent"}  className="nav-link">
               <img alt="Confluent" src={'./img/confluent-white.png'} />
              <p>C3 </p>
              </Link>
              </li>     
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/meta"} className="nav-link">
                  <img alt="Meta" src={'./img/meta-white.png'} />
                <p>메타관리</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkaadmin"} className="nav-link">
                  <img alt="kafkadmin" src={'./img/kafka-ui.png'} />
                <p>카프카<br/>어드민</p>
                </Link>
              </li> 
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/kafkamonitor"} className="nav-link">
                  <img alt="kafkamonitor" src={'./img/grafana.png'} />
                <p>카프카<br/>모니터링</p>
                </Link>
              </li>              
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/metric"} className="nav-link">
                  <img alt="metric" src={'./img/promethus.png'} />
                <p>메트릭<br/>수집기</p>
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Link to={"/admin"} className="nav-link">
                  <img alt="service" src={'./img/admin-white.png'} />
                <p>설정</p>
                </Link>
              </li>             
            </div>
        
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.name}님
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/confluent" element={<Confluent />} />
            <Route path="/meta" element={<Meta />} />
            <Route path="/metawrite" element={<Metawrite />} />
            <Route path="/kafkaadmin" element={<KafkaAdmin />} />
            <Route path="/kafkamonitor" element={<KafkaMonitor />} />
            <Route path="/k8monitor" element={<K8Monitor />} />
            <Route path="/metric" element={<Metric />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
