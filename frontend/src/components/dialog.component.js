import React, { Component } from "react";
import { withRouter } from "../common/withRouter"

class Dialog extends Component {
    constructor(props) {
      super(props);
    }

  render(){
    const { message, type, callback } = this.props
    return(
      <div className={"dialog dialog-"+type}>
        <div className="box" role={type}>
          <div className="inner">
          <div className="dialog-main">
            {message}
           </div>

        <div className="dialog-btn-group">
          <div className={"btn-group btn-"+type}>
          {type === 'confirm' ?
          <>
            <button className="btn btn-no" onClick={() => callback('no')}>No</button>
            <button className="btn btn-yes" onClick={() =>callback('yes')}>Yes</button>
            </>
            :<>
            <button className="btn btn-close" onClick={() => callback('close')}>닫기</button>
            </>
          }
            </div>
        </div>
        </div>
        </div>

    </div>
    )
  }
}

export default withRouter(Dialog)