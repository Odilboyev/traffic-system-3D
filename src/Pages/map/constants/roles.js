const role = atob(localStorage.getItem("its_user_role"));
const isPermitted = role === "admin" || role === "boss";
export { role, isPermitted };
