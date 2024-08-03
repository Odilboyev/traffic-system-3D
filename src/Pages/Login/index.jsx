import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../apiHandlers";
import login from "../../Auth";
import PasswordInput from "../../components/PasswordInput";
import bg from "../../../public/images/back.jpg";
export function SignIn() {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
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

      const res = await signIn({ login: loginName, password: password });
      console.log(res);
      setLoading(false); // Set loading state back to false
      localStorage.setItem("big_monitoring_token", res.token);
      localStorage.setItem("big_monitoring_token_expire", res.tokenexpire);
      login.login();
      navigate("/", { replace: true });
      window.location.reload();
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
    <section
      className="h-screen flex justify-center items-center gap-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className={`w-full  lg:w-2/5  mx-auto p-[3%]  shadow-lg rounded`}>
        <div className="text-center"></div>
        <form onSubmit={(e) => submitHandler(e)} className="my-2  mx-auto ">
          <div className="m flex flex-col gap-1 text-left">
            <Typography color="blue-gray" className="font-medium text-xl ">
              Login
            </Typography>
            {error && (
              <div className="mb-2 text-red-500 text-center">{error}</div>
            )}
            <Input
              labelProps={{
                className: "hidden",
              }}
              value={loginName}
              name="login"
              placeholder="12345..."
              onChange={(e) => setLoginName(e.target.value)}
              // onKeyDown={(evt) =>
              //   ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              // }
              className={` !border-t-blue-gray-200 focus:!border-t-gray-900 mt-2`}
            />
            <Typography color="blue-gray" className="mt-[5%] font-medium">
              Password
            </Typography>
            <PasswordInput
              labelProps={{
                className: "hidden",
              }}
              name="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={` !border-t-blue-gray-200 focus:!border-t-gray-900 mt-2`}
            />
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
