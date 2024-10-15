import axios from "axios";

// import { jwtDecode } from "jwt-decode";

// const token_expire =
//   localStorage.getItem("big_monitoring_token_expire") !== null
//     ? localStorage.getItem("big_monitoring_token_expire")
//     : null;
const token_monitoring = localStorage.getItem("big_monitoring_token");
// let token;
// if (token_expire !== null && token_expire !== undefined) {
//   if (+new Date(token_expire * 1000) < +new Date()) {
//     localStorage.clear();
//     window.location.reload();
//     token = "";
//   } else {
//     token = token_monitoring;
//   }
// } else {
//   token = "";
// }
// console.log(token);

const config = axios.create({
  baseURL: import.meta.env.VITE_MAIN_URL,
  // withCredentials: true,
});

// config.defaults.withCredentials = false;

// console.log(token, config);

config.defaults.headers.common["Authorization"] = `Bearer ${token_monitoring}`;

export default config;
