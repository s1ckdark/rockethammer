import React, { Component } from 'react'
import { gsap } from "gsap/all";
import { Navigate } from "react-router-dom";
import "./App.scss";
import { withRouter } from './common/withRouter';
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
      currentUser: undefined
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

  componentWillUnmount() {
    EventBus.remove("logout");
  }

 logOut() {
   this.setState({
     currentUser: undefined,
   });
    AuthService.logout();
    window.location.reload();
  }

  render() {
    const { currentUser } = this.state;
    const pathname = this.props.router.location.pathname.split('/')
    pathname.shift()

    return (
      <>
      <Seo />
        <Header pathname={pathname} currentUser={currentUser} logOut={this.logOut} />
        <Container pathname={pathname} isAllowed={!!currentUser}/>
        <Footer pathname={pathname} isAllowed={!!currentUser} />
      </>
    );
  }
}

export default withRouter(App);
