import React, { Component } from "react";
import { withRouter } from "../common/withRouter";

class Notfound extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="page404">
        <h1>404 페이지를 찾을 수 없습니다</h1>
        <div className="inner">
          <div className="rocket floating"></div>
          <div className="bg_rocket rotate"></div>
        </div>
      </div>
    );
  }
}

export default withRouter(Notfound)