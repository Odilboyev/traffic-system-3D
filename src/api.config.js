import axios from "axios";
import { jwtDecode } from "jwt-decode";
// const auth =
//   localStorage.getItem("jwt_token") !== null
//     ? localStorage.getItem("jwt_token")
//     : null;
// let token;
// if (auth !== null && auth !== undefined) {
//   var decoded = jwtDecode(auth);
//   if (+new Date(decoded.exp * 1000) < +new Date()) {
//     localStorage.clear();
//     window.location.reload();
//     token = "";
//   } else {
//     token = auth;
//   }
// } else {
//   token = "";
// }
// console.log(token);

const config = axios.create({
  baseURL: import.meta.env.VITE_MAIN_URL,
});

// console.log(token, config);
// if (auth) config.defaults.headers.common["Authorization"] = `Bearer ${token}`;
export default config;
