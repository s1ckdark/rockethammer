import React, { Component } from "react";
import Iframe from 'react-iframe'
import UserService from "../services/user.service";


export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   content: ""
    // };
  }

  // componentDidMount() {
  //   UserService.getUserBoard().then(
  //     response => {
  //       this.setState({
  //         content: response.data
  //       });
  //     },
  //     error => {
  //       this.setState({
  //         content:
  //           (error.response &&
  //             error.response.data &&
  //             error.response.data.message) ||
  //           error.message ||
  //           error.toString()
  //       });
  //     }
  //   );
  // }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
        <Iframe url="http://172.41.41.194:9021"
        id="myId"
        width="100%"
        position="absolute"
        className="myClassname"
        display="initial"
        position="relative"
        styles={{height: "100%"},{top:"0"}}/>
      </div>
    );
  }
}

