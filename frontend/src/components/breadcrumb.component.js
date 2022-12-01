import React, { Component} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../common/withRouter";
import helpers from "../common/helpers";

class Breadcrumb extends Component {
  render(){
    const { pathname } = this.props.router.location;
    let path = pathname.split('/');
    path.shift()
    if(helpers.isInt(path[path.length -1]) === 'number') path.pop()
    const current = path[path.length -1]
    return(
    <div className="breadcrumb">
      <div className="breadcrumb-navi" aria-label="breadcrumb">
          <img src={"/img/"+path[0]+"_color.svg"} alt={helpers.translate(path[0])}></img>
          <h3>{helpers.translate(path[0])}</h3>
          <ol className="current">
            <li className="breadcrumb-item"><Link to='/home'>홈</Link></li>
            {path.map((item, index) => {
              // console.log(index, this.isInt(item), typeof(this.isInt(item)));
              return (
                <li key={index} className={index === path.length - 1  ? "breadcrumb-item active":"breadcrumb-item"}><Link to={'/'+item+'/'}>{helpers.translate(item)}</Link></li>
              )
            })}
          </ol>
      </div>
      {path[0] === 'admin' ?
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