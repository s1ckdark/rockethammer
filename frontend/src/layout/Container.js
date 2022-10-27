import React, {Component} from 'react';
import { Routes, Route } from "react-router-dom";
import { withRouter } from '../common/withRouter';

import Home from "../components/home.component";
import Login from "../components/login.component";
import Register from "../components/register.component";
import Profile from "../components/profile.component";
import Confluent from "../components/confluent.component";
import Meta from "../components/meta.component";
import KafkaAdmin from "../components/kafkaadmin.component";
import KafkaMonitor from "../components/kafkamonitor.component";
import K8Monitor from "../components/k8monitor.component";
import Metric from "../components/metric.component";
import Admin from "../components/admin.component.js";
import Metawrite from "../components/metawrite.component";
import Metalist from "../components/metalist.component";
import Metaview from "../components/metaview.component";
import History from "../components/history.component";
import Historylist from "../components/historylist.component";
import Historyview from "../components/historyview.component";
import Notfound from "../components/notfound.component";
import PrivateRoute from '../common/privateroute.component';

class Container extends Component {
    constructor(props){
      super(props)
    }
    render(){
      const { isAllowed } = this.props;
        return (
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<PrivateRoute isAllowed={!isAllowed} redirectTo="/profile"><Login /></PrivateRoute>} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Profile /></PrivateRoute>} />
              <Route path="/confluent" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Confluent /></PrivateRoute>} />
              <Route path="/meta" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Meta /></PrivateRoute>} />
              <Route path="/meta/list/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Metalist /></PrivateRoute>} />
              <Route path="/meta/view/:type/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Metaview /></PrivateRoute>} />
              <Route path="/meta/write/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Metawrite /></PrivateRoute>} />
              <Route path="/meta/view/history/list/:topic_name/:currentPage" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Historylist/></PrivateRoute>} />
              <Route path="/meta/view/history/view/:topic_name" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Historyview/></PrivateRoute>} />
              <Route path="/kafkaadmin" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><KafkaAdmin /></PrivateRoute>} />
              <Route path="/kafkamonitor" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><KafkaMonitor /></PrivateRoute>} />
              <Route path="/k8monitor" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><K8Monitor /></PrivateRoute>} />
              <Route path="/metric" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Metric /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute isAllowed={isAllowed} redirectTo="/login"><Admin /></PrivateRoute>} />
              <Route path="/*" element={<Notfound />} />
            </Routes>
      )
    }
}
export default withRouter(Container)