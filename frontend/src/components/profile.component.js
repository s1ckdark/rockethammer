import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      time: new Date()
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }


  update = () => {
   this.setState({
      time: new Date()
    })
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state
    const h = this.state.time.getHours()
    const m = this.state.time.getMinutes()
    const s = this.state.time.getSeconds()

    return (
     <div className="profile col-md-12">
           <div className="card card-container">
            {(this.state.userReady) ?
              <div className="card-body">
                  <header className="jumbotron">
                    <img src="./img/rh_logo.png" alt="rockerhammer" className="w-100"/>
                    <h3><strong>{currentUser.name}</strong>님</h3>
                    <h4>현재 방문 시각은<br/> {h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'AM' : 'PM'} 입니다.<br/> </h4> 
                  </header>
                  <div className="card-text">
                    <p><strong>이 름:</strong>{" "} {currentUser.name}</p>
                    <p><strong>소 속:</strong>{" "}{currentUser.dept}</p>
                    <p><strong>Authorities:</strong>{" "}{currentUser.group && currentUser.group ? currentUser.group : null}</p>
                  </div>
            </div>: null}
              <div className="serviceIcon">
              <div className="icon icon-1"><Link to={"/confluent"}><img alt="c3" src={'./img/confluent.png'} /></Link></div>
              <div className="icon icon-3"><Link to={"/meta"}><img alt="meta" src={'./img/meta.png'} /></Link></div>
              <div className="icon icon-4"><Link to={"/connector"}><img alt="connector" src={'./img/connector.png'} /></Link></div>
              <div className="icon icon-5"><Link to={"/kafkamonitor"}><img alt="kafka monitor" src={'./img/kafkamonitor.png'} /></Link></div>
              <div className="icon icon-6"><Link to={"/k8monitor"}><img alt="k8 monitor" src={'./img/k8monitor.png'} /></Link></div>
              <div className="icon icon-7"><Link to={"/metric"}><img alt="metric" src={'./img/metric.png'} /></Link></div>
              {currentUser.group === 'admin' ? <div className="icon icon-8"><Link to={"/admin"}><img alt="admin" src={'./img/admin.png'} /></Link></div> :null}
            </div>
          </div>

   </div>
    );
  }
}
