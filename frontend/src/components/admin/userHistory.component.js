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
      userReady: false,
      data:{},
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    const currentPage = this.props.router.params.currentPage || 1
    this.fetchData(currentPage-1);
  }

  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.props.router.navigate('/admin/history/'+pageNumber)
    this.fetchData(pageNumber-1)
  }

  fetchData = async(page=0) => {
    await axios.post(process.env.REACT_APP_API+"/user/history", {size:10,page:page})
      .then(res => {
        this.setState({
          ...this.state,
          data:res.data,
          userReady: true
        })
      })
  }

  render() {
    const { data, userReady } = this.state;
    if(userReady){
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
                {data.list && data.list.length > 0 ? data.list.map((item, index)=>{
                  return (
                    <tr data-index={index}>
                      <td>{data.count - (data.size * data.current) - index}</td>
                      <td>{item.modifier}</td>
                      <td>{item.userid}</td>
                      <td>{item.mod_item}</td>
                      <td>{helpers.krDateTime(item.mod_dt)}</td>
                    </tr>
                  );
                }):
                  <tr className="nothing">
                    <td colSpan="5">남겨진 내역이 없습니다</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="paging">
          <Pagination
                activePage={data.current+1}
                itemsCountPerPage={data.size}
                totalItemsCount={data.count}
                onChange={this.handlePageChange}
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
}
export default withRouter(UserHistory);

