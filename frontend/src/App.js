import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Navigate } from "react-router-dom";
import "./App.scss";

import AuthService from "./services/auth.service";
import Header from "./layout/Header";
import Container from "./layout/Container";
import Footer from "./layout/Footer";

import Seo from "./components/seo.component";
import EventBus from "./common/EventBus";

class App extends Component {
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
    gsap.fromTo(thisNode, {autoAlpha:0,y:'0px'},{autoAlpha:1,y:'-30px',duration:1},0)
    gsap.fromTo(thisNodeImg, {scale:"1"},{scale:"1.5",duration:1}, 0);
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

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <>
      <Seo />
        <Header currentUser={currentUser} logOut={this.logOut} />
        <Container isAllowed={!!currentUser}/>
        <Footer isAllowed={!!currentUser} />
      </>
    );
  }
}

export default App;
