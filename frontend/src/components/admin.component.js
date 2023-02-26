import React, { Component } from "react";
import Breadcrumb from "./breadcrumb.component";
import { withRouter } from "../common/withRouter";

class Admin extends Component {
  render() {
    return (
      <div className="admin overview">
        <div className="page-header admin-home">
          <Breadcrumb/>
        </div>
        <div className="overviewing">
        <div className="inner">
            <div className="info">
              <div className="info-userRegister" onClick={(e) => this.props.router.navigate('/admin/register')}>
                <h1>사용자 등록</h1>
                <p>신규 사용자를 등록하고 권한을 부여합니다</p>
              </div>
              <div className="info-userManager" onClick={(e) => this.props.router.navigate('/admin/manager')}>
                <h1>사용자 관리</h1>
                <p>사용자에 대한 변경 및 삭제, 관리 합니다</p>
              </div>
              <div className="info-userHistory" onClick={(e) => this.props.router.navigate('/admin/history')}>
                <h1>사용자 이력</h1>
                <p>사용자의 사용 현황을 확인 합니다</p>
              </div>
              <div className="info-userWeblog" onClick={(e) => this.props.router.navigate('/admin/weblog')}>
                <h1>사용자 로그</h1>
                <p>사용자의 접속 로그를 확인합니다</p>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
  }
}

export default withRouter(Admin)