import config from "./api.config";
import axios from "axios";
const signIn = async (body) => {
  const res = await axios.post(
    import.meta.env.VITE_MAIN_URL + import.meta.env.VITE_SIGN_IN,
    body
  );
  return res.data;
};
const getData = async () => {
  const res = await config.get(import.meta.env.VITE_DATA);
  return res.data;
};

const markerHandler = async (body) => {
  const res = await config.post(import.meta.env.VITE_MARKER, body);

  return res.data;
};
export { signIn, getData, markerHandler };
