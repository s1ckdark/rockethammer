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
        const { isAllowed, pathname } = this.props;

        return(
             <footer className={pathname[0] === '' ? "footer home":"footer "+pathname[0]}>
                <div className="inner">
                    <p>Serviced by GoodusData</p>
                </div>
           </footer>
        )
    }
}
export default withRouter(Footer)