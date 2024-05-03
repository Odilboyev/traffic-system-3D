let token = localStorage.getItem("bino_id");

class Auth {
  constructor() {
    this.authenticated = token ? true : false;
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
