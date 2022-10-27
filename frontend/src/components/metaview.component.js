import React, { Component} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from 'axios';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import ReactDiffViewer from 'react-diff-viewer';
import Historylist from "./historylist.component";
import helpers from "./helpers.component";
import history from "./historyview.component";
import { withRouter } from "./withRouter.component";

class Metaview extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:{
              totalcnt:0,
              current:0,
              activePage: 1,
              pageSize:5,
              dataList:[]
          },
          history:{
              data:[],
              totalcnt:0,
              activePage: 1,
              pageSize:5,
              currentTableData:[]
          },
          schema:{},
          schemas:{},
          keyword:'',
          select:{
            idx:'',
            topic_name:"",
            subject:"",
            schema: false
          },
		  show:false,
          type:'list',
          view:"list",
          detail:{},
          changed:{
              before:'',
              after:''
          },
          delete:{},
          pass:{}
        };
    }

    componentDidMount(){

    }

    fetchMetaData = async(page) => {
        if(this.state.type ==='list'){
        await axios.post(process.env.REACT_APP_API+"/schema/getallschema",{size:5,page:page})
            .then(res => {
              this.setState({
                ...this.state,
                list:'list',
                data: res.data,
                show:false
              })
            })
        } else if(this.state.type ==='search'){
            await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword, size:5,page:page})
            .then(res => {
                this.setState({
                ...this.state,
                list:'search',
                meta:res.data,
                show:false
                })
            })
        }
        }

        onChangeKeyword = (e,index) =>{
            this.setState({
              ...this.state,
              keyword:e.target.value
            })
          }

        onMetaSearch = async(e)=> {
            e.preventDefault();
            if(this.state.keyword.length !=null){
                await axios.post(process.env.REACT_APP_API+"/schema/search",{keyword:this.state.keyword})
                .then(res => {
                    console.log(res);
                    this.setState({
                    ...this.state,
                    type:'search',
                    meta:res.data
                    })
                })
            }
        }

      fetchHistoryData = () => {
          const firstPageIndex = (this.state.history.activePage - 1) * this.state.history.pageSize;
          const lastPageIndex = firstPageIndex + this.state.history.pageSize;

          if(this.state.history.data.length > 0){
          this.setState({
              ...this.state,
              history:{
                ...this.state.history,
                totalcnt: this.state.history.data.length,
                currentTableData:this.state.history.data.slice(firstPageIndex, lastPageIndex)
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
      }

    write = (e, type)=> {
        e.preventDefault();
        this.setState({
            ...this.state,
           type:type,
           view:"list",
           pass:{
            ...this.state.pass,
            type:"write"
           }
        }, () => {this.props.router.navigate('/meta/write', {state:{data:this.state.data.dataList[this.state.select.idx],type:type,schemas:this.state.schemas}})})
    }

    view = (e, type) => {
        this.setState({
            ...this.state,
            view:type,
        })
    }
    goBack = ()=>{

    }
    close = () => {
        this.setState({
            ...this.state,
            view:false,
            changed:{
                ...this.state.changed,
                before: "",
                after: ""
            },
            show:false,
            view:"list",
            after:{},
            before:{},
            type:"list",
            pass:{
                ...this.state.pass,
                type: "list"
            }
        })
    }

    closeWrite = (e, idx=this.state.select.idx, topic_name=this.state.select.topic_name) => {
        e.preventDefault();
        console.log(idx,topic_name);
        this.detailView(e,idx, topic_name);
        this.setState({
            ...this.state,
           type:'',
           typeVIEW:false,
           changeVIEW:false,
           show:true
        })
        this.fetchMetaData(this.state.data.currrent)
    }



    onChangeJSON = (newValue) => {
        console.log("change", newValue);
    }

    detailView = (e, idx, topic_name, changed) => {
        e.preventDefault();
        if(topic_name) {
            const tn = topic_name.replace(/(-value|-key)/g, "");
            const schema = JSON.parse(this.state.data.dataList[idx].schema)
            const meta_join = JSON.parse(this.state.data.dataList[idx].meta_join) || {}
            if(meta_join != null > 0) {
                console.log("schema",schema)
                console.log("meta_join",meta_join)
                axios.post(process.env.REACT_APP_API+"/history/gethistory",{keyword:tn}).then(res => {
                    this.setState({
                        ...this.state,
                        schema:schema,
                        detail:meta_join,
                        delete:meta_join,
                        show:true,
                        type:'update',
                        history:res.data,
                        select:{
                            idx:idx,
                            topic_name:tn,
                            subject:topic_name,
                            changed:changed
                        }
                    })
                })
            } else {
                this.setState({
                    ...this.state,
                    schema:{},
                    select:{
                        idx:idx,
                        topic_name:tn,
                        subject:topic_name,
                        changed:changed
                    },
                    detail:{
                        schema_id:'',
                        revision:'',
                        last_mod_id:'',
                        last_mod_dt:''
                    },
                    delete:{},
                    type:'reg',
                    show:true,
                    history:{}
                })
            }

        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schemas:res.data})
            } else {
                this.setState({...this.state, schemas:{}})
            }
        })
    }
}

    notiforchange = async (e, index, topic_name) => {
        e.preventDefault();
        //schemas의 before, after를 api call로 가져와야한다.
        // api call limit(2), sort(reg_dt, -1)
        const meta_join = JSON.parse(this.state.data.dataList[index].meta_join)
        const schema = JSON.parse(this.state.data.dataList[index].schema)

        const tn = topic_name.replace(/(-value|-key)/g, "");
        await axios.post(process.env.REACT_APP_API+"/schema/changed", {"keyword":topic_name}).then(
            res => {
                if(res.data.length > 1) {
                let temp = [];
                res.data.map((item,index) => {
                    temp[index] = item;
                    temp[index]['schema']= JSON.parse(item.schema);
                })
                this.setState({
                    ...this.state,
                    view:'change',
                    changed:{
                      ...this.state.changed,
                      before: temp[1],
                      after: temp[0]
                    },
                    detail:JSON.parse(this.state.data.dataList[index].meta_join),
                    select:{
                        idx: index,
                        topic_name: topic_name,
                        subject: tn,
                        changed: this.changed(meta_join, schema)
                    }
                  })
                }}
        )
        axios.post(process.env.REACT_APP_API+"/schema/getschema",{keyword:tn}).then(res => {
            console.log(res.data);
            if(res.data && res.data.value.length > 0) {
                this.setState({...this.state, schema:res.data})
            } else {
                this.setState({...this.state, schema:{}})
            }
        })
    }

    pass = (e, data, key) => {
        e.preventDefault()
        this.props.pass(data,key)
    }

    tooltip = (e, action) => {
        e.preventDefault();
        const tooltip = e.target.querySelector('span');
        if(tooltip) {
            console.log(action, tooltip);
            tooltip.classList.toggle("visible")
        }
    }

    changed = (meta_join, schema) => {
        return meta_join && parseInt(schema.version.$numberLong) > parseInt(meta_join.schema_version) ? true : false
    }

    render(){
        const { type } = this.props.router.params;
        const { data, schemas } = this.props.router.location.state;
        const meta = helpers.parseData(data.meta_join)
        console.log(meta);
        // const { detail } = this.state
        return (
            <>
                <div className="metaview transition">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">Meta</a></li>
                            <li class="breadcrumb-item active" aria-current="page">View</li>
                        </ol>
                    </nav>
                    {type === 'json' ?
                        <div className="jsonViewLayer">
                            <div className="jsonView d-flex overflow-scroll">
                            <AceEditor
                                mode="json"
                                theme="tomorrow"
                                name={meta._id}
                                value = {helpers.replaceKey(meta,"entokr")}
                                onChange={this.onChangeJSON}
                                maxLines={Infinity}
                                fontSize= {14}
                                width="100%"
                            />
                            </div>
                            <div className="mt-5 btnArea d-flex justify-content-center">
                                <button type="button" className="btn btn-secondary" onClick={()=>this.props.router.navigate(-1)}>뒤로가기</button>
                            </div>
                        </div>
                    : <></>}
                    {type === 'change' ?
                        <div className="changeView">
                            <div className="d-flex pb-5">
                                <ReactDiffViewer leftTitle="Before" rightTitle="After" oldValue={JSON.stringify(this.state.changed.before, null, 4)} newValue={JSON.stringify(this.state.changed.after, null, 4)} splitView={true} />
                            </div>
                            <div className="btnArea d-flex justify-content-center mb-5">
                                <button type="button" className="btn btn-primary me-1" onClick={(e)=>this.write(e,"change")}>등록</button>
                                <button type="button" className="btn btn-secondary" onClick={()=>this.props.router.navigate(-1)}>뒤로가기</button>
                            </div>
                        </div>
                    : <></>}
                </div>
            </>
        );
    }
}

export default withRouter(Metaview)