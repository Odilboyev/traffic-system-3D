/**
 * Displays the name of the user who is currently logged in.
 *
 * @returns {React.ReactElement} A React component displaying the user's name.
 */
import logo from "../../../../../assets/icons/logo.png";
const Logo = ({ t, isSidebarOpen }) => {
  return (
    <div
      className={`${
        isSidebarOpen
          ? "justify-start gap-4 "
          : "justify-center hover:bg-gray-700 cursor-pointer "
      } bg-blue-gray-900/10 items-center px-4 py-3 backdrop-blur-xl flex  w-full`}
    >
      {isSidebarOpen ? (
        <>
          <div className="w-1/4">
            <img src={logo} alt="logo" className="w-full" />
          </div>
          <div className="text-lg font-bold text-gray-300">
            {t("logo_name")}
          </div>
        </>
      ) : (
        <div className="w-1/4">
          <img src={logo} alt="logo" className="w-full" />
        </div>
      )}
    </div>
  );
};

export default Logo;