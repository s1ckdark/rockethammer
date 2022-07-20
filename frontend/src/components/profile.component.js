import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { gsap,CSSPlugin,Power0,Power1, Power3, MotionPathPlugin} from "gsap/all";
import { Timeline } from "react-gsap";
import { isAbsolute } from "path-browserify";
gsap.registerPlugin(CSSPlugin);
gsap.registerPlugin(MotionPathPlugin);

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      time: new Date()
    };
    this.tl = gsap.timeline({repeat:-1, onUpdate:this.mapToPath});
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    setInterval(this.update, 1000)
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    // gsap.set('.card',{css:{borderRadius:"50%",position:"absolute",width:"150%",height:"150%"}})
    // let tl = this.tl.fromTo('.ring1',{rotateX:"0"},{rotateX:"360",duration:5},0)
    //                 .fromTo('.ring2',{rotateY:"0"},{rotateY:"360",duration:5},0)
    this.initCanvasDark();
    // this.tl.defaultEase = Power0.easeNone;
    MotionPathPlugin.convertToPath("ellipse");
    gsap.to("#rocket", {
      motionPath: {
          path:"#orbit",
          align:"#orbit",
          alignOrigin: [0.5, 0.5],
          autoRotate: false
      },
      transformOrigin: "50% 50%",
      duration: 5,
      repeat:-1,
      ease: "power1.inOut"
  });

  }
    
  componentDidUpdate() {

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
      <svg id="universe" viewBox="0 0 700 700">
        <ellipse id="orbit" cx="350" cy="400" rx="350" ry="120" fill="none" stroke="none" stroke-Width="3" />
      </svg>
      <svg id="rocket" viewBox="0 0 512.016 512.016" style={{enableBackground:"new 0 0 512.016 512.016"}}>
        <g>
          <path style={{fill:"#FFCE54"}} d="M17.25,493.132c3.625-10.188,8.344-23.141,13.625-36.563c19.875-50.642,30.407-65.782,34.938-70.298  c6.781-6.797,15.188-11.375,24.313-13.266l3.156-0.656l35.344-35.75l42.312,48.875l-32.906,31.516l-0.688,3.235  c-1.875,9.125-6.469,17.531-13.25,24.344c-4.531,4.5-19.656,15.062-70.282,34.923C40.376,484.757,27.406,489.507,17.25,493.132z"/>
          <path style={{fill:"#F6BB42"}} d="M129.158,320.943L87.97,362.584c-10.719,2.219-21.126,7.609-29.688,16.172  C36.407,400.63,0,510.366,0,510.366s109.72-36.391,131.626-58.282c8.531-8.547,13.938-18.969,16.156-29.703l37.812-36.22  L129.158,320.943z M133.064,407.005l-4.781,4.594l-1.344,6.484c-1.469,7.079-5.062,13.642-10.375,18.954  c-1.75,1.75-13.219,11.578-66.563,32.517c-5.094,1.984-10.094,3.906-14.906,5.703c1.812-4.812,3.719-9.812,5.719-14.876  c20.938-53.36,30.75-64.829,32.531-66.579c5.313-5.328,11.876-8.906,18.938-10.359l6.312-1.312l4.531-4.578l24.969-25.281  l28.156,32.516L133.064,407.005z"/>
          <g>
            <path style={{fill:"#DA4453"}} d="M199.909,423.397c5.969-2.797,11.938-5.767,17.875-8.876l121.501-86.781   c4.969-4.641,9.875-9.391,14.719-14.203c2.781-2.812,5.563-5.625,8.282-8.469c-0.469,55.359-25.845,115.923-74.032,164.127   c-16.062,16.047-33.469,29.562-51.625,40.484c-0.125,0.078-0.845,0.5-0.845,0.5c-4.031,2.188-9.188,1.578-12.594-1.828   c-1.125-1.141-1.938-2.469-2.438-3.875c0,0-0.375-1.109-0.469-1.594l-21.938-78.767   C198.878,423.881,199.378,423.631,199.909,423.397z"/>
            <path style={{fill:"#DA4453"}} d="M207.534,150.269c-2.844,2.734-5.656,5.516-8.469,8.312c-4.813,4.828-9.563,9.734-14.188,14.703   c-21.281,3-86.812,121.517-86.812,121.517c-3.094,5.938-6.062,11.892-8.875,17.876c-0.25,0.516-0.469,1.031-0.719,1.547   L9.688,292.285c-0.469-0.094-1.594-0.469-1.594-0.469c-1.406-0.5-2.719-1.312-3.875-2.453c-3.406-3.406-4-8.547-1.812-12.594   c0,0,0.406-0.703,0.5-0.828c10.906-18.157,24.406-35.563,40.469-51.625C91.595,176.097,152.158,150.722,207.534,150.269z"/>
          </g>
          <path style={{fill:"#E6E9ED"}} d="M197.003,151.05c-60.408,60.422-103.97,129.438-128.252,196.299  c-1.281,3.75-0.469,8.031,2.531,11.016l82.907,82.938c3,2.969,7.281,3.797,11.031,2.516  c66.876-24.282,135.877-67.829,196.285-128.251c93.876-93.845,146.563-207.081,150.501-303.645c0.125-2.875-0.906-6.047-3.094-8.25  c-2.219-2.203-5.375-3.234-8.281-3.109C404.069,4.501,290.848,57.205,197.003,151.05z"/>
          <g>
            <path style={{fill:"#434A54"}} d="M317.598,237.535c-11.375,0-22.062-4.438-30.094-12.469c-8.031-8.047-12.469-18.735-12.469-30.11   s4.438-22.063,12.469-30.11c8.031-8.031,18.75-12.469,30.094-12.469c11.375,0,22.062,4.438,30.125,12.469   c16.595,16.61,16.595,43.625,0,60.22c-8.062,8.031-18.75,12.469-30.094,12.469C317.598,237.535,317.598,237.535,317.598,237.535z"/>
            <path style={{fill:"#434A54"}} d="M227.284,327.849c-11.375,0-22.062-4.422-30.094-12.469c-8.032-8.031-12.47-18.735-12.47-30.095   c0-11.375,4.438-22.078,12.47-30.125c8.031-8.031,18.719-12.469,30.094-12.469c11.376,0,22.063,4.438,30.126,12.469   c16.594,16.61,16.594,43.626,0,60.22C249.347,323.427,238.66,327.849,227.284,327.849L227.284,327.849z"/>
          </g>
          <g>
            <path style={{fill:"#CCD1D9"}} d="M355.254,157.331c-10.062-10.047-23.438-15.594-37.656-15.594c-14.188,0-27.562,5.547-37.625,15.594   c-10.031,10.047-15.594,23.422-15.594,37.625c0,14.219,5.562,27.579,15.594,37.641c10.062,10.046,23.438,15.578,37.625,15.578   c14.219,0,27.594-5.531,37.656-15.578C376.005,211.847,376.005,178.082,355.254,157.331z M340.192,217.535   c-6.25,6.234-14.406,9.359-22.594,9.359c-8.156,0-16.344-3.125-22.562-9.359c-12.469-12.469-12.469-32.688,0-45.157   c6.219-6.234,14.406-9.344,22.562-9.344c8.188,0,16.344,3.109,22.594,9.344C352.66,184.847,352.66,205.066,340.192,217.535z"/>
            <path style={{fill:"#CCD1D9"}} d="M227.284,232.067c-14.219,0-27.562,5.531-37.626,15.578c-10.062,10.046-15.594,23.422-15.594,37.641   c0,14.204,5.531,27.563,15.594,37.626c10.063,10.047,23.407,15.594,37.626,15.594c14.22,0,27.595-5.547,37.658-15.594   c20.75-20.75,20.75-54.517,0-75.267C254.879,237.598,241.504,232.067,227.284,232.067z M249.879,307.849   c-6.25,6.25-14.407,9.359-22.595,9.359c-8.156,0-16.344-3.109-22.562-9.359c-12.47-12.47-12.47-32.688,0-45.157   c6.219-6.235,14.406-9.344,22.562-9.344c8.188,0,16.345,3.109,22.595,9.344C262.348,275.16,262.348,295.379,249.879,307.849z"/>
          </g>
          <path style={{fill:"#DA4453"}} d="M479.225,145.816L366.755,33.361c45.813-19.922,91.47-31.063,133.876-32.797  c2.906-0.125,6.062,0.906,8.281,3.109c2.188,2.203,3.219,5.375,3.094,8.25C510.287,54.361,499.131,100.003,479.225,145.816z"/>
          </g>
        </svg>
        <div className="saturn">
        <div className="planet">
            {(this.state.userReady) ?
            <>
  
                  <div className="info-text">
                  <header className="jumbotron">
                    <img src="./img/rh_logo.png" alt="rockerhammer" className="w-100"/>
                  </header>
                  <div className="text">
                    <h3><strong>{currentUser.name}</strong>님</h3>
                    {/* <h4>현재 방문 시각은<br/> {h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'AM' : 'PM'} 입니다.<br/> </h4>  */}
                    <p><label>이 름:</label>{currentUser.name}</p>
                    <p><label>소 속:</label>{currentUser.dept}</p>
                    <p><label>Authorities:</label>{currentUser.group && currentUser.group ? currentUser.group : null}</p>
                  </div></div></>
           : null}
          </div>
          <div className="up"></div>
   </div>
   </div>
   </>
    );
  }
}
