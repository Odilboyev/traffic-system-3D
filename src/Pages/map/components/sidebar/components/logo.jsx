import { LiaTrafficLightSolid } from "react-icons/lia";

/**
 * Displays the name of the user who is currently logged in.
 *
 * @returns {React.ReactElement} A React component displaying the user's name.
 */
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
          <>
            <LiaTrafficLightSolid className="w-6 h-6 text-red-500" />
          </>
          <div className="text-lg font-bold text-gray-300">
            {t("logo_name")}
          </div>
        </>
      ) : (
        <>
          <LiaTrafficLightSolid className="w-6 h-6 text-red-500" />
        </>
      )}
    </div>
  );
};

export default Logo;
