import React, {Component} from 'react';
import { Routes, Route  } from "react-router-dom";
import { withRouter } from '../common/withRouter';

import Home from "../components/home.component";
import Login from "../components/login.component";
import Register from "../components/register.component";
import Profile from "../components/profile.component";
import KafkaAdmin from "../components/kafkaadmin.component";
import KafkaMonitor from "../components/kafkamonitor.component";
import Metric from "../components/metric.component";
import Admin from "../components/admin.component.js";
import Terminal from "../components/terminal.component.js";
import UserRegister from "../components/admin/userRegister.component";
import UserHistory from "../components/admin/userHistory.component";
import UserWeblog from "../components/admin/userWeblog.component";
import UserManager from "../components/admin/userManager.component";
import Metawrite from "../components/meta/write.component";
import Metalist from "../components/meta/list.component";
import Metaview from "../components/meta/view.component";
import Historylist from "../components/history/list.component";
import Historyview from "../components/history/view.component";
import Notfound from "../components/notfound.component";
import PrivateRoute from '../common/privateroute';

class Container extends Component {
    render(){
      const { isAllowed } = this.props;
        return (
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/home" element={<Home />} />
              {/* <Route path="/login" element={<PrivateRoute isAllowed={!isAllowed} redirectTo="/profile"><Login /></PrivateRoute>} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Profile /></PrivateRoute>} />
              <Route path="/manager" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><KafkaAdmin /></PrivateRoute>} />
              <Route path="/monitor" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><KafkaMonitor /></PrivateRoute>} />
              <Route path="/collector" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metric /></PrivateRoute>} />
              <Route path="/meta" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metalist /></PrivateRoute>} />
              <Route path="/meta/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metalist /></PrivateRoute>} />
              <Route path="/meta/view/:type/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metaview /></PrivateRoute>} />
              <Route path="/meta/view/" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metalist /></PrivateRoute>} />
              <Route path="/meta/:type/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Metawrite /></PrivateRoute>} />
              <Route path="/meta/history" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Historylist/></PrivateRoute>} />
              <Route path="/meta/history/list" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Historylist/></PrivateRoute>} />
              <Route path="/meta/history/list/:topic_name/" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Historylist/></PrivateRoute>} />
              <Route path="/meta/history/list/:topic_name/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Historylist/></PrivateRoute>} />
              <Route path="/meta/history/view/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Historyview/></PrivateRoute>} />
              <Route path="/terminal" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Terminal /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><Admin /></PrivateRoute>} />
              <Route path="/admin/userhistory/" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserHistory /></PrivateRoute>} />
              <Route path="/admin/userhistory/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserHistory /></PrivateRoute>} />
              <Route path="/admin/weblog" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserWeblog /></PrivateRoute>} />
              <Route path="/admin/weblog/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserWeblog /></PrivateRoute>} />
              <Route path="/admin/register" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserRegister /></PrivateRoute>} />
              <Route path="/admin/manager" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserManager /></PrivateRoute>} />
              <Route path="/admin/manager/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/home"><UserManager /></PrivateRoute>} />
              <Route path="/*" element={<Notfound />} />
            </Routes>
      )
    }
}
export default withRouter(Container)