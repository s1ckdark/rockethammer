import React, { Component} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../common/withRouter";
import helpers from "../common/helpers";
import metaServiceColor from "../img/meta-service-color.svg";
import managerServiceColor from "../img/manager-service-color.svg";
import monitorServiceColor from "../img/monitor-service-color.svg";
import collectorServiceColor from "../img/collector-service-color.svg";
import terminalServiceColor from "../img/terminal-service-color.svg";
import adminServiceColor from "../img/admin-service-gray.svg";
import adminServiceWhite from "../img/admin-service-gray.svg";

class Breadcrumb extends Component {
  navImg = (img)=> {
    const images = {
      metaServiceColor,
      managerServiceColor,
      monitorServiceColor,
      collectorServiceColor,
      terminalServiceColor,
      adminServiceWhite,
      adminServiceColor,
    }
    return images[img];
  }

  render(){
    const { pathname } = this.props.router.location;
    const path = pathname.split('/').slice(0,3);
    if(helpers.isInt(path[path.length -1]) === 'number') path.pop()
    const current = path[path.length-1]
    const svg = path[1] !=='admin' ? path[1]+"ServiceColor":path[1]+"ServiceWhite.svg"
    return(
    <div className="breadcrumb">
      <div className="breadcrumb-navi" aria-label="breadcrumb">
          <img src={this.navImg(svg)}/>
          <h3>{helpers.translate(path[1])}</h3>
          <ol className="current">
            {path.map((item, index) => {
              const tmpPath = path.slice(0, index+1);
              let tmpUrl = index === 0 ? '/home':tmpPath.join('/')
              if(index !== path.length -1) {
                return (<li key={index} className="breadcrumb-item"><Link key={tmpUrl} to={tmpUrl} className={"depth"+index}>{helpers.translate(item)}</Link></li>)}
                else {return (
                  <li key={index} className="breadcrumb-item active">{helpers.translate(item)}</li>)}

                })}
          </ol>
      </div>
      {path[1] === 'admin' ?
      <div className="admin-navi">
        <button className={current === 'register' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/register')}>사용자 등록</button>
        <button className={current === 'manager' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/manager/1')}>사용자 관리</button>
        <button className={current === 'history' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/userhistory/1')}>사용자 이력</button>
        <button className={current === 'weblog' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/weblog/1')}>사용자 로그</button>
      </div>
      :<></>}
    </div>
    )
  }
}

export default withRouter(Breadcrumb)

