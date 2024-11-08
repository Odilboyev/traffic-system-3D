import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/api.handlers";
import login from "../../Auth";
import bg from "../../assets/images/back.jpg";
import { FaSpinner } from "react-icons/fa6";
import { MdPassword, MdPerson } from "react-icons/md";
import { t } from "i18next";
import InputField from "../../components/InputField";
export function SignIn() {
  const navigate = useNavigate();
  console.log("page login");
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
      const res = await signIn({ login: loginName, password: password });

      setLoading(false); // Set loading state back to false
      const encryptedRole = btoa(res.role);
      localStorage.setItem("its_user_role", encryptedRole);
      localStorage.setItem("big_monitoring_token", res.token);
      localStorage.setItem("big_monitoring_token_expire", res.tokenexpire);
      login.login();
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      setLoading(false); // Set loading state back to false

      if (error.code == "ERR_NETWORK")
        setError("Server bilan ulanishda xatolik");
      else {
        setError("Serverda xatolik");
      }
    }
  };
  console.log("loginName");
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
      <div
        className={`w-full md:w-2/5 mx-auto p-[3%] shadow-lg bg-white dark:bg-blue-gray-900 dark:!text-white rounded`}
      >
        <form onSubmit={(e) => submitHandler(e)} className="my-2  mx-auto ">
          <div className="m flex flex-col gap-1 text-left">
            {error && (
              <div className="mb-2 text-red-500 text-center">{error}</div>
            )}
            <InputField
              label={"login"}
              icon={MdPerson}
              value={loginName}
              name="login"
              placeholder="12345..."
              onChange={(e) => setLoginName(e.target.value)}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900  mt-2`}
            />
            <br />
            <InputField
              inputType="password"
              label={"password"}
              icon={MdPassword}
              name="password"
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
            disabled={loading || !loginName} // Keep the disable logic
          >
            {loading && <FaSpinner className="animate-spin mx-auto" />}{" "}
            {t("enter")}
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
