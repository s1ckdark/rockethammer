import React, { Component } from "react";
import Iframe from 'react-iframe'
// import UserService from "../services/user.service";


export default class Confluent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      count:0,
      isRunning:false,
      delay:5000
    };
     // this.handleIsRunningChange = this.handleIsRunningChange.bind(this)
  }

  componentDidMount() {
    // UserService.getUserBoard().then(
    //   response => {
    //     this.setState({
    //       content: response.data
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       content:
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString()
    //     });
    //   }
    // );
    // this.interval = setInterval(this.tick, this.state.delay);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.isRunning){
  //     if (prevState.delay !== this.state.delay) {
  //       clearInterval(this.interval);
  //     }  
  //     this.interval =  setInterval(this.tick, this.state.delay)
  //   } else {this.interval =  null}
    
  // }
  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }
  // tick = () => {
  //   if(this.state.isRunning) {
  //   this.setState({
  //     count: this.state.count + 1
  //   });} else { this.setState({count:0})}
  // }

  // handleDelayChange = (e) => {
  //   this.setState({ delay: Number(e.target.value) });
  // }

  // handleIsRunningChange(e) {
  //   this.setState({ isRunning: e.target.checked});
  // }

  render() {
    return (
      <div className="container">
      {/*<div className="counter">
         <h1>{this.state.count}</h1>
         <input className="delay" value={this.state.delay} onChange={this.handleDelayChange} />
         Running<input type="checkbox" checked={this.state.isRunning} onChange={this.handleIsRunningChange} />
         </div>*/}
        <Iframe url="http://172.41.41.199:9021"
        key={this.state.count}
        id="confluent"
        className="cors-iframe"
        />
      </div>
    );
  }
}

