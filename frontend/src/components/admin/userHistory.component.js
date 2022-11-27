import React, { Component } from "react";
import AuthService from "../../services/auth.service";

import axios from "axios"
import Pagination from "react-js-pagination";
import { withRouter } from "../../common/withRouter";
import helpers from "../../common/helpers";
import Breadcrumb from "../breadcrumb.component";
class UserHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      history:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:5,
        currentTableData:[],
      },
      user:{
        data:[],
        totalcnt:0,
        currentPage: 1,
        pageSize:5,
        currentTableData:[],
        show:true,
        select:''
      },
      edit:{
        data:{
          userid:'',
          password:'',
          name:'',
          depth:'',
          group:''
        },
        show:false
      },
      compare:{
        newPassword:'',
        confirmPassword:'',
        show:false,
        result:true,
        work:false
      },
      toggle:1,
      currentUser: { userid: "" },
      inputfield:'',
      time: new Date()
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.fetchData(0)
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({
      ...this.state,
      user:{
        ...this.state.user,
        currentPage: pageNumber
      }
    });
    this.fetchData(pageNumber);
  }

  fetchData = () => {
    axios.post(process.env.REACT_APP_API+"/user/history")
      .then(res => {
        console.log(res)
      const firstPageIndex = (this.state.history.currentPage - 1) * this.state.history.pageSize;
      const lastPageIndex = firstPageIndex + this.state.history.pageSize;
      console.log(res);
      // if(res.data[0].history.length > 0){
      if(res.data && res.data.length > 0){
      this.setState({
          ...this.state,
          history:{
            ...this.state.history,
            data: res.data,
            totalcnt: res.data.length,
            currentTableData:res.data.slice(firstPageIndex, lastPageIndex)
          }
        })
    } else {
      this.setState({
          ...this.state,
          history:{
            ...this.state.history,
            data: [],
            totalcnt: 0,
            currentTableData:[]
          }
        })
    }
      })
  }

  render() {
    return (
      <div className="admin userHistory">
        <div className="page-header userWeblog">
            <Breadcrumb/>
        </div>
        <div className="listing">
          <div className="history-list">
            <table className="table-list">
              <thead>
                <tr>
                <th>NO</th>
                <th>수정자</th>
                <th>유저ID</th>
                <th>수정내역</th>
                <th>수정시간</th>
                </tr>
              </thead>
              <tbody>
                {this.state.history.totalcnt > 0 ? this.state.history.currentTableData.map((log, index)=>{
                  return (
                    <tr>
                      <td>{index + this.state.history.pageSize * (this.state.history.currentPage - 1) + 1}</td>
                      <td>admin</td>
                      <td>{log.userid}</td>
                      <td>{log.mod_item}</td>
                      <td>{helpers.krDateTime(log.mod_dt)}</td>
                    </tr>
                  );
                }):
                  <tr className="nothing">
                    <td colspan="5">남겨진 내역이 없습니다</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="paging">
            <Pagination
              activePage={this.state.history.currentPage}
              itemsCountPerPage={this.state.history.pageSize}
              totalItemsCount={this.state.history.totalcnt}
              itemClass="page-item"
              activeLinkClass="page-active"
              linkClass="page-link"
              innerClass="pagination"
            />
          </div>
       </div>
      </div>
    );
  }
}

export default withRouter(UserHistory);

