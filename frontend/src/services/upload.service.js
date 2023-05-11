import axios from 'axios';

class UploadService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("files", file);

    return axios.post(process.env.REACT_APP_API+"/files/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return axios.post(process.env.REACT_APP_API+"/files/list");
  }
}

export default new UploadService();