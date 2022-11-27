import React, { Component } from "react";
import { withRouter } from "../common/withRouter";
import AuthService from "../services/auth.service";

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
    this.initCanvasDark();
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
    const { currentUser } = this.state
    return (
      <>
        <canvas className="star_black"></canvas>
        <div className="profile col-md-12">
          {(this.state.userReady) ?
            <>
              <div className="info-text">
                <header className="jumbotron">
                  <img src="./img/rh_logo.png" alt="rockerhammer" className="w-100"/>
                </header>
                <div className="text">
                  <h3>Welcome <strong>{currentUser.name}</strong>님</h3>
                  <p><label>이 름:</label>{currentUser.name}</p>
                  <p><label>소 속:</label>{currentUser.dept}</p>
                  <p><label>Authorities:</label>{currentUser.group && currentUser.group ? currentUser.group : null}</p>
                </div>
              </div>
            </>
            :null}
          </div>
      </>
    );
  }
}
export default withRouter(Profile)