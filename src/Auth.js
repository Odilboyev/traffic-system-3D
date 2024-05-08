let token = localStorage.getItem("big_monitoring_token");

class Auth {
  constructor() {
    this.authenticated = token ? true : false;
    // this.authenticated = true;
  }

  login() {
    this.authenticated = true;
  }

  logout() {
    this.authenticated = false;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}
const login = new Auth();
export default login;
