// apiCaller.js
import axios from "axios";

const apiCaller = async (
  method,
  type,
  { id = "", data = {}, params = {} } = {}
) => {
  try {
    const endpoint = import.meta.env[`VITE_${type.toUpperCase()}`]; // Map device type to endpoint
    const url = `${endpoint}${id ? `/${id}` : ""}`; // Build URL dynamically

    const response = await axios({
      method,
      url,
      data,
      params,
    });

    if (response.data?.status === 999) {
      localStorage.clear();
      window.location.reload();
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`API Error [${method.toUpperCase()} ${type}]:`, error);
    throw error;
  }
};

export default apiCaller;
