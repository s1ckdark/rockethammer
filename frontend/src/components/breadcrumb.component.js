import React, { Component} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../common/withRouter";
import helpers from "../common/helpers";

class Breadcrumb extends Component {
  render(){
    const { pathname } = this.props.router.location;
    const path = pathname.split('/');
    if(helpers.isInt(path[path.length -1]) === 'number') path.pop()
    const current = path[path.length-1]
    return(
    <div className="breadcrumb">
      <div className="breadcrumb-navi" aria-label="breadcrumb">
          <img src={path[1] !=='admin' ? "/img/"+path[1]+"-service-color.svg":"/img/"+path[1]+"-service-white.svg"} alt={helpers.translate(path[1])}></img>
          <h3>{helpers.translate(path[1])}</h3>
          <ol className="current">
            {path.map((item, index) => {
              // console.log(index,item);
              const tmpPath = path.slice(0, index+1);
              let tmpUrl = index === 0 ? '/home':tmpPath.join('/')
              if(index !== path.length -1) {
                return (<li key={index} className="breadcrumb-item"><Link to={tmpUrl} className={"depth"+index}>{helpers.translate(item)}</Link></li>)}
                else {return (
                  <li key={index} className="breadcrumb-item active">{helpers.translate(item)}</li>)}

                })}
          </ol>
      </div>
      {path[1] === 'admin' ?
      <div className="admin-navi">
        <button className={current === 'register' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/register')}>사용자 등록</button>
        <button className={current === 'manager' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/manager/1')}>사용자 관리</button>
        <button className={current === 'history' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/history/1')}>사용자 이력</button>
        <button className={current === 'weblog' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/weblog/1')}>사용자 로그</button>
      </div>
      :<></>}
    </div>
    )
  }
}

export default withRouter(Breadcrumb)

