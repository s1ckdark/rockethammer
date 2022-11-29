import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/withRouter";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReady: false,
      currentUser: { username: "" },
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser, userReady: true })
    if(this.state.userReady) this.initCanvasDark();
  }

  initCanvasDark = () => {
    var win = document.window;
    document.querySelectorAll('.star_black').forEach(function(ele, index) {
      var canvas = ele;
      var ctx = canvas.getContext("2d");
      var fps = 30;
      var winWidth, winHeight;
      var mp; //max particles
      var particles = [];
      // var color;
      resizeHandler();

      function draw() {
        ctx.clearRect(0, 0, winWidth, winHeight);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        for(var i = 0; i < mp; i++) {
          var p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }

        ctx.fill();
        update();
      }

      function update() {
        for(var i = 0; i < mp; i++) {
          var p = particles[i];
          p.y += Math.cos(p.d) + 1 + p.r/2;
          if(p.y > winHeight) {
            if(i%3 > 0) //66.67% of the flakes
              {
                particles[i] = {x: Math.random() * winWidth, y: -10, r: p.r, d: p.d};
              }
            }
          }
        }

      function resizeHandler() {
        //canvas dimensions
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        canvas.width = winWidth;
        canvas.height = winHeight;
        mp = 0.18 * winWidth;
        particles = [];

        for(var i = 0; i < mp; i++){
          particles.push({
            x: Math.random() * winWidth, //x-coordinate
            y: Math.random() * winHeight, //y-coordinate
            r: Math.random() * 1.5, //radius
            d: Math.random() * mp //density
          })
        }
      };

      window.addEventListener("resize", function() {
          resizeHandler();
      });

      function step() {
        setTimeout(function() {
          draw();
          requestAnimationFrame(step);
          }, 1200 / fps);
        };
        step();
      });
    }

      render() {
        const { currentUser } = this.state;
        return (
          <div className="profile">
            <div className="star_black"></div>
            <div className="container">
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
                <button className="btn btn-gray" onClick={()=> this.props.router.navigate('/register')}>회원등록</button>
              </div>
              }
            </div>
          </div>
          </div>
        );
      }
    }

export default withRouter(Profile)