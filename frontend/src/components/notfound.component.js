import React, { Component } from "react";
import { withRouter } from "../common/withRouter";

class Notfound extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>404 Not found</h3>
        </header>
      </div>
    );
  }
}

export default withRouter(Notfound)