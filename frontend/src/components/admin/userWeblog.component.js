import React, { Component } from "react";
import axios from 'axios';
import AuthService from "../../services/auth.service";

import Pagination from "react-js-pagination";

import helpers from "../../common/helpers";
import { withRouter } from "../../common/withRouter";
import Breadcrumb from "../breadcrumb.component";

class UserWebLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{
              totalcnt:0,
              current:0,
              activePage: 1,
              pageSize:5,
              list:[]
          }
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber) {
      console.log(`active page is ${pageNumber}`);
      this.setState({
          ...this.state,
          meta:{
              ...this.state.log,
              current: pageNumber-1
          },
          detailVIEW:false
      }, ()=>{this.fetchLogData(pageNumber-1);})
    }

    componentDidMount(){
        this.fetchLogData(0);
    }

    fetchLogData = async(page) => {
        await axios.post(process.env.REACT_APP_API+"/user/loadsesshistory",{size:10,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                data: res.data,
              })
            })
        }

    parseUA = () => {
        //useragent strings are just a set of phrases each optionally followed by a set of properties encapsulated in paretheses
        const part = /\s*([^\s/]+)(\/(\S+)|)(\s+\(([^)]+)\)|)/g;
        //these properties are delimited by semicolons
        const delim = /;\s*/;
        //the properties may be simple key-value pairs if;
        const single = [
            //it is a single comma separation,
            /^([^,]+),\s*([^,]+)$/,
            //it is a single space separation,
            /^(\S+)\s+(\S+)$/,
            //it is a single colon separation,
            /^([^:]+):([^:]+)$/,
            //it is a single slash separation
            /^([^/]+)\/([^/]+)$/,
            //or is a special string
            /^(.NET CLR|Windows)\s+(.+)$/
        ];
        //otherwise it is unparsable because everyone does it differently, looking at you iPhone
        const many = / +/;
        //oh yeah, bots like to use links
        const link = /^\+(.+)$/;

        const inner = (properties, property) => {
            let tmp;

            if (tmp === property.match(link)) {
                properties.link = tmp[1];
            }
            else if (tmp === single.reduce((match, regex) => (match || property.match(regex)), null)) {
                properties[tmp[1]] = tmp[2];
            }
            else if (many.test(property)) {
                if (!properties.properties)
                    properties.properties = [];
                properties.properties.push(property);
            }
            else {
                properties[property] = true;
            }

            return properties;
        };

        return (input) => {
            const output = {};
            for (let match; match = part.exec(input); '') {
                output[match[1]] = {
                    ...(match[5] && match[5].split(delim).reduce(inner, {})),
                    ...(match[3] && {version:match[3]})
                };
            }
            return output;
        };
    }

    render()
    {
        const { data } = this.state;
        return (
            <div className="admin userWeblog">
                <div className="page-header userWeblog">
                    <Breadcrumb/>
                </div>
                <div className="listing">
                    <div className="weblog-list">
                        <table className="table-list">
                            <thead>
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col" data-tooltip="User-Agent: Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>">로그<span className="info-icon">&#x24D8;</span></th>
                                    <th scope="col">접속IP</th>
                                    <th scope="col">유저ID</th>
                                    <th scope="col">로그인 시간</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.list && data.list.length > 0 ? data.list.map((item,index) => {
                                    return(
                                        <tr data-index={index} className="text-center align-middle py-5" key={5*parseInt(data.current)+index+1}>
                                            <td scope="row">{10*parseInt(data.current)+index+1}</td>
                                            <td className="log">{item.log}</td>
                                            <td className="ipAddr">{item.ipAddr}</td>
                                            <td className="userid">{item.userid}</td>
                                            <td className="login_dt">{helpers.krDateTime(item.login_dt)}</td>
                                        </tr>
                                    );
                                    }): <tr><td colSpan="5"><h3 className="p-3 m-3 text-center">검색된 Log Data가 없습니다</h3></td> </tr>
                                    }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="paging">
                    <Pagination
                        activePage={data.current+1}
                        itemsCountPerPage={data.size}
                        totalItemsCount={data.count}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                        itemClass="page-item"
                        activeLinkClass="page-active"
                        linkClass="page-link"
                        innerClass="pagination"
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(UserWebLog)
