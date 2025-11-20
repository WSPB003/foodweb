import axios from "axios";

const API = "https://foodweb-6rvj.onrender.com";
export default axios.create({
  baseURL: API,
});
export { API };











