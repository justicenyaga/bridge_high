import axios from "axios";

const getBaseUrl = () => {
  let url;
  switch (process.env.REACT_APP_API_URL) {
    case "production":
      url = "https://bridge-app-qcn53.ondigitalocean.app";
      break;
    case "development":
    default:
      url = "http://127.0.0.1:8000";
  }

  return url;
};

axios.defaults.baseURL = getBaseUrl();

export default {
  request: axios.request,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
