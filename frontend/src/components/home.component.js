import React, { Component } from "react";

import UserService from "../services/user.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="home">
        <header className="jumbotron">
        </header>
        <h3>Welcome RocketHammer</h3>
      </div>
    );
  }
}