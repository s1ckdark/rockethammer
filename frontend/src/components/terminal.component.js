import React, { Component } from "react";
import Iframe from 'react-iframe'
import { withRouter } from "../common/withRouter";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";
import Breadcrumb from "./breadcrumb.component";

class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect:false,
          terminal:{},
          currentUser:'',
          userReady: false,
          selected:'vm01'
        };
    }

    componentDidMount(){
      const user = AuthService.getCurrentUser();
      if (user !== null ) {
        this.setState({
          ...this.state,
          currentUser: user,
          userReady: true,
          terminal:JSON.parse(process.env.REACT_APP_TERMINAL),
          selected:'vm01'
        })
      } else {
        this.setState({
          ...this.state,
          redirect: true
        })
      }
    }


    render(){
      const {userReady, selected, terminal} = this.state

      if(userReady){
        console.log(selected)
        console.log(terminal[selected])
      return (
            <>
                <div className="terminal" key={this.state.time}>
                    <div className="page-header list">
                        <Breadcrumb/>
                    </div>
                    <div className="terminal-window">
                    {this.state.redirect ? <Navigate to='/home' />:<></>}
                      <Iframe url={"http://"+terminal[selected]} id="Terminal" className="cors-iframe"/>
                    </div>
                  </div>
            </>
        );
    }
  }
}
export default withRouter(Terminal)