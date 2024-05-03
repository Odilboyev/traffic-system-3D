import axios from "axios";
import config from "./api.config";

const signIn = async (body) => {
  try {
    const res = await config.post(
      import.meta.env.VITE_SIGN_IN + `?bino_id=${body}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const sendIn = async (body) => {
  try {
    const res = await config.post(
      import.meta.env.VITE_SEND_IN + `?bino_id=${body.bino_id}&loc=${body.loc}`,
      body.body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
export { signIn, sendIn };
