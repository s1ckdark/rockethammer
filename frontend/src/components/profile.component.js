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
        <div>
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong>님
          </h3>
          <h4>
          현재 방문 시각은<br/>
          {h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'AM' : 'PM'} 입니다.<br/>
          </h4>
        </header>
        {/*<p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>*/}
        {/*<p>
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </p>*/}
        <p>
          <strong>이 름:</strong>{" "}
          {currentUser.name}
        </p>
        <p>
          <strong>소 속:</strong>{" "}
          {currentUser.dept}
        </p>
        {/*<strong>Authorities:</strong>
        <ul>
          {currentUser.groups &&
            currentUser.groups.map((group, index) => <li key={index}>{group}</li>)}
        </ul>*/}
      </div>: null}
       <div className="serviceIcon">
          <div className="icon icon-1"><Link to={"/confluent"}><img src={'./img/confluent.png'} /></Link></div>
          <div className="icon icon-2"><Link to={"/gitlab"}><img src={'./img/gitlab.png'} /></Link></div>
          <div className="icon icon-3"><Link to={"/grafana"}><img src={'./img/grafana.png'} /></Link></div>
          <div className="icon icon-6"><Link to={"/portainer"}><img src={'./img/portainer.png'} /></Link></div>
          <div className="icon icon-7"><Link to={"/meta"}><img src={'./img/meta.png'} /></Link></div>
          <div className="icon icon-7"><Link to={"/airflow"}><img src={'./img/airflow.png'} /></Link></div>
          <div className="icon icon-9"><Link to={"/airflow"}><img src={'./img/elk.png'} /></Link></div>
          <div className="icon icon-8"><Link to={"/admin"}><img src={'./img/admin.png'} /></Link></div>
        </div>
      </div>
    </div>
    );
  }
}

