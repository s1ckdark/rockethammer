import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/withRouter";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReady: false,
      currentUser: {},
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if(currentUser && currentUser.token) this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="home">
        <div className="rocket-group">
          <div className="bg_rocket"></div>
          <div className="rocket"></div>
        </div>
        <div className="welcome-msg">
          <hgroup>
            <h1 className="thin">WELCOME</h1>
            <h1 className="bold">ROCKET</h1>
            <h1 className="bold">HAMMER</h1>
          </hgroup>
          {this.state.userReady ?
          <div className="user-profile">
              <h3>{currentUser.name}&ensp;님&ensp;환영합니다!</h3>
              <p><label>소&emsp;&ensp;&emsp;&ensp;&nbsp;속&ensp;:</label>{currentUser.dept}</p>
              <p><label>사용자&ensp;그룹&ensp;:</label>{currentUser.group}</p>
          </div>
          :<div className="button-group">
            <button className="btn btn-dark" onClick={()=> this.props.router.navigate('/login')}>로그인</button>
            {/* <button className="btn btn-gray" onClick={()=> this.props.router.navigate('/register')}>회원등록</button> */}
          </div>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Home);