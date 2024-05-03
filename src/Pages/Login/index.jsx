import { jwtDecode } from "jwt-decode";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../apiHandlers";
import login from "../../Auth";

export function SignIn() {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState(""); // Added state for error message
  const [loading, setLoading] = useState(false); // Added state for loading

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!loginName) {
      setError("ID raqam kiritilishi shart."); // Input requirement error
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      // const req = new FormData();
      // req.append("bino_id", loginName);
      //   req.append("password", password);

      // const res = await signIn(loginName);
      //   localStorage.setItem("jwt_token", res.access_token);
      setLoading(false); // Set loading state back to false
      localStorage.setItem("bino_id", loginName);
      login.login();
      navigate("/", { replace: true });
    } catch (error) {
      setLoading(false); // Set loading state back to false
      console.log(error);
      if (error.code == "ERR_NETWORK")
        setError("Server bilan ulanishda xatolik");
      else {
        setError("Serverda xatolik");
      }
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-2/5 mt-24 mx-auto bg-blue-gray-50/50 p-[5%]">
        <div className="text-center"></div>
        <form onSubmit={(e) => submitHandler(e)} className="my-8  mx-auto ">
          <div className="m flex flex-col gap-6 text-center">
            <Typography
              color="blue-gray"
              className="mb-3 font-medium text-2xl "
            >
              ID raqamni kiriting
            </Typography>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <Input
              labelProps={{
                className: "hidden",
              }}
              type="number"
              value={loginName}
              placeholder="12345..."
              onChange={(e) => setLoginName(e.target.value)}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              }
              className={` !border-t-blue-gray-200 focus:!border-t-gray-900`}
            />
            {/* <Typography color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <PasswordInput
              labelProps={{
                className: "hidden",
              }}
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={` !border-t-blue-gray-200 focus:!border-t-gray-900 `}
            /> */}
          </div>

          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={loading || !loginName} // Disable the button when loading is true or login/password is empty
          >
            {loading ? (
              // Render loading icon when loading is true
              <i className="fas fa-spinner animate-spin mr-2"></i>
            ) : (
              // Render "Sign In" text when loading is false
              "Kirish"
            )}
          </Button>

          {/* ---------Forgot Password --------- */}

          {/* <div className="flex items-center justify-between gap-2 mt-6">
         
            <Typography variant="small" className="font-medium -900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div> */}
        </form>
      </div>
    </section>
  );
}
export default SignIn;
