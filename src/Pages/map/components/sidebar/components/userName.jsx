import { useEffect, useState } from "react";

import { getInfoAboutCurrentUser } from "../../../../../api/api.handlers";

/**
 * Displays the name of the user who is currently logged in.
 *
 * @returns {React.ReactElement} A React component displaying the user's name.
 */
const UserName = ({ t, isSidebarOpen }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getInfoAboutCurrentUser();
        setUserInfo(response.user_info);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);
  return (
    <div className=" bg-blue-gray-900/10 py-2 backdrop-blur-xl text-center flex flex-col w-full">
      {isSidebarOpen ? (
        <>
          <div className="text-lg font-bold text-gray-300">
            {userInfo?.name}
          </div>
          <div className="text-sm  text-gray-300">{t(userInfo?.role)}</div>
        </>
      ) : (
        <div className="text-sm font-bold">{t(userInfo?.role)}</div>
      )}
    </div>
  );
};

export default UserName;
