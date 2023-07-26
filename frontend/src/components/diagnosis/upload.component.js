import React, { Component } from "react";
import UploadService from "../../services/upload.service";
import axios from "axios";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFiles = this.selectFiles.bind(this);
    this.upload = this.upload.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: [],
      filesInfo: [],
      filesName:[]
    };
  }

  componentDidMount() {
    const list = this.props.list || [];
    this.setState({
      ...this.state,
      filesInfo: list
    })
    // UploadService.getFiles().then((response) => {
    //   this.setState({
    //     fileInfos: response.data,
    //   });
    // });
  }

  selectFiles(event) {
    let filesNameArr = this.state.filesName.length > 0 ? this.state.filesName:[];
    for(let i = 0; i < event.target.files.length; i++){
        // Get the current file name
        let fileName =  event.target.files[i].name;
        // Push file
        filesNameArr.push(fileName);
    }
    this.setState({
      ...this.state,
      progressInfos: [],
      selectedFiles: event.target.files,
      filesName: filesNameArr
    },()=> this.uploadFiles())


  }

  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];
    console.log(_progressInfos)
    UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
      this.setState({
        ...this.state,
        progressInfos:_progressInfos,
      });
    })
      .then((response) => {
        this.setState((prev) => {
          console.log(prev)
          const newFilesInfo = response.data.data
          let nextMessage = [...prev.message, "Uploaded the file successfully: " + response.data.data.name];
          let nextFilesInfo = [...prev.filesInfo, response.data.data]
          console.log(prev.filesInfo, response.data.data)
          return {
            message: nextMessage,
            filesInfo: nextFilesInfo
          };
        // console.log(this.state)
        // let test = [...this.state.message, response.data.data.name]
        // console.log(test)
        // this.setState({
        //   ...this.state,
        //   message:[...this.state.message, "Uploaded the file successfully: " + response.data.data.name],
        //   filesInfo:[...this.state.filesInfo, response.data.data]
        },()=>{
          this.handleCall(this.state.filesInfo);
        });
        // return UploadService.getFiles();
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        this.setState((prev) => {
          let nextMessage = [...prev.message, "Could not upload the file: " + file.name];
          return {
            progressInfos: _progressInfos,
            message: nextMessage
          };
        });
      });
  }

  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;

    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        // message: [],
        // filesInfo:[]
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );
  }

  handleCall = (val) => {
    this.props.handleCallback(val)
  }
  downloadFile = (e,url,name) => {
    e.preventDefault();
    window.open("/api/files/get/"+ url + "/"+name)
  }

  deleteFile = (e, url, name) => {
    e.preventDefault();
    axios.get("/api/files/del/"+ url).then(res => {
      if(res.status === 200) {
        var tmpInfo = this.state.filesInfo.filter(item => { return item.url !== url})
        var tmpName = this.state.filesName.filter(item => {return item !== name})

        this.setState({
          ...this.state,
          filesInfo: tmpInfo,
          filesName: tmpName
        },()=> {this.handleCall(this.state.filesInfo)})
      }
    }
    )
  }
  render() {
    const { selectedFiles, progressInfos, message, filesInfo, filesName } = this.state;
    return (
      <>
         {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="progressinfo" style={{display: progressInfo.percentage === 100 ? "none":"block"}} key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%"}}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <div className="file-uploader">
          <div className="file-selector">
              <input className="upload-name" value={filesName && filesName.length > 0 ? filesName.toString():''} placeholder="첨부파일" />
              <label htmlFor="file">파일찾기</label>
              <input id="file" type="file" multiple onChange={this.selectFiles} />
              <button
              className="btn btn-upload"
              // disabled={!selectedFiles}
              onClick={this.uploadFiles}
            >
              파일 업로드
            </button>
          </div>


          <div className="upload-result">
          {filesInfo && filesInfo.length > 0 ? filesInfo.map((item, i)=>{
                return (
                <div className="uploaded-file" key={i}>
                  <div className="fileName"><p>{item.name}</p></div>
                  <div className="btn-group">
                    {/* <button className="btn btn-download" onClick={(e)=>this.downloadFile(e,item.url, item.name)}>다운로드</button> */}
                    <button className="btn btn-delete" onClick={(e)=>this.deleteFile(e,item.url, item.name)}>&#x2715;</button>
                  </div>
                </div>)
              }):<></>}
          </div>
        </div>

        {/* {message.length > 0 && (
          <div className="alert" role="alert">
            <ul>
              {message.map((item, i) => {
                return <li key={i}>Uploaded the file successfully: <a href={item.url}>{item.name}</a></li>;
              })}
            </ul>
          </div>
        )} */}

        {/* <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div> */}
      </>
    );
  }
}
