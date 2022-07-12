import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
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
    this.initCanvasDark();
  }


  update = () => {
   this.setState({
      time: new Date()
    })
  };

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
      // Your code goes here!
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
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state
    const h = this.state.time.getHours()
    const m = this.state.time.getMinutes()
    const s = this.state.time.getSeconds()

    return (
      <>
    <canvas className="star_black"></canvas>
     <div className="profile col-md-12">
           <div className="card card-container">
            {(this.state.userReady) ?
              <div className="card-body">
                  <header className="jumbotron">
                    <img src="./img/rh_logo.png" alt="rockerhammer" className="w-100"/>
                  </header>
                  <div className="card-text">
                    <h3><strong>{currentUser.name}</strong>님</h3>
                    {/* <h4>현재 방문 시각은<br/> {h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'AM' : 'PM'} 입니다.<br/> </h4>  */}
                    <p><label>이 름:</label>{" "} {currentUser.name}</p>
                    <p><label>소 속:</label>{" "}{currentUser.dept}</p>
                    <p><label>Authorities:</label>{" "}{currentUser.group && currentUser.group ? currentUser.group : null}</p>
                  </div>
            </div>: null}
          </div>

   </div>
   </>
    );
  }
}
