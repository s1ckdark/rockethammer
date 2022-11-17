import React, { Component } from "react";
import axios from 'axios';
import AuthService from "../services/auth.service";

import Pagination from "react-js-pagination";

import helpers from "../common/helpers";

export default class Weblog extends Component {
    constructor(props) {
        super(props);
        this.state = {
          log:{
              totalcnt:0,
              current:0,
              activePage: 1,
              pageSize:5,
              dataList:[]
          }
        };
        this.handleMetaPageChange = this._handleMetaPageChange.bind(this);
    }

    _handleMetaPageChange(pageNumber) {
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
        await axios.post(process.env.REACT_APP_API+"/user/loadsesshistory",{size:5,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                log: res.data,
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
        return (
            <>
                <div className="webLogHisory">
                <div className="d-flex justify-content-around">
                    <div className="logList col-md-12 my-5 transition">
                        <table className="metalist table table-hover">
                            <thead>
                                <tr className="text-center my-3">
                                    <th scope="col" className="col-md-1">번호</th>
                                    <th scope="col" className="col-md-6" data-tooltip="User-Agent: Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>">로그<span className="info-icon">&#x24D8;</span></th>
                                    <th scope="col" className="col-md-2">접속IP</th>
                                    <th scope="col" className="col-md-1">유저ID</th>
                                    <th scope="col" className="col-md-2">로그인일시</th>
                                </tr>
                            </thead>
                            <tbody>
                        {this.state.log.dataList && this.state.log.dataList.length > 0 ? this.state.log.dataList.map((item,index) => {
                            return(
                                    <tr data-index={index} className="text-center align-middle py-5" key={5*parseInt(this.state.log.current)+index+1}>
                                        <th scope="row">{5*parseInt(this.state.log.current)+index+1}</th>
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
                <div className="paging text-center mx-auto py-1">
                        <Pagination
                            activePage={this.state.log.current+1}
                            itemsCountPerPage={this.state.log.size}
                            totalItemsCount={this.state.log.count}
                            pageRangeDisplayed={5}
                            onChange={this.handleMetaPageChange}
                            itemClass="page-item"
                            activeLinkClass="page-active"
                            linkClass="page-link"
                            innerClass="pagination d-flex justify-content-center"
                        />
                </div>
            </div>
            </>
        );
    }
}

