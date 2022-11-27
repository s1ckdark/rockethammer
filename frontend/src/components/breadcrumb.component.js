import React, { Component} from "react";
import { withRouter } from "../common/withRouter";
import helpers from "../common/helpers";

class Breadcrumb extends Component {
  render(){
    const { pathname } = this.props.router.location;
    let path = pathname.split('/')
    path.shift()
    const current = path[path.length-1]
    return(
    <div className="breadcrumb">
      <div className="breadcrumb-navi" aria-label="breadcrumb">
          <img src={"/img/"+path[0]+"_color.svg"} alt={helpers.translate(path[0])}></img>
          <h3>{helpers.translate(path[0])}</h3>
          <ol className="current">
            <li className="breadcrumb-item"><a href='/'>홈</a></li>
            {path.map((item, index) => {
              console.log(index, item);
              return (
                <li className="breadcrumb-item"><a href={'/item/'}>{helpers.translate(item)}</a></li>
              )
            })}
          </ol>
      </div>
      {path[0] === 'admin' ?
      <div className="admin-navi">
        <button className={current === 'register' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/register')}>사용자 생성</button>
        <button className={current === 'manager' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/manager')}>사용자 수정</button>
        <button className={current === 'history' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/history')}>사용자 이력</button>
        <button className={current === 'weblog' ? "btn active":"btn"} onClick={()=>this.props.router.navigate('/admin/weblog')}>사용자 로그</button>
      </div>
      :<></>}
    </div>
    )
  }
}

export default withRouter(Breadcrumb)