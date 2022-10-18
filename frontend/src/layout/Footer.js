import React, {Component} from 'react';
import { withRouter } from '../common/withRouter';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state={
          currentUser:undefined
        }
      }

    render(){
        let { isAllowed } = this.props;
        return(
             <footer className={isAllowed ? "footer border-top pt-3 mt-3":"d-none"}>
                <div className="container">
                    <span className="text-muted">Service by GoodusData</span>
                </div>
           </footer>
        )
    }
}
export default withRouter(Footer)