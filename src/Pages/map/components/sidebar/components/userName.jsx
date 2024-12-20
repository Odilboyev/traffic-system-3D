import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { FiLogOut } from "react-icons/fi";
import { getInfoAboutCurrentUser } from "../../../../../api/api.handlers";

/**
 * Displays the name of the user who is currently logged in.
 *
 * @returns {React.ReactElement} A React component displaying the user's name.
 */
const UserName = ({ t, isSidebarOpen }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
  const confirmLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className={`${
        isSidebarOpen
          ? "justify-between"
          : "justify-center hover:bg-gray-700 cursor-pointer"
      }   w-full bg-blue-gray-900/10 gap-5 px-4 py-3 backdrop-blur-xl flex  w-full`}
    >
      {isSidebarOpen ? (
        <>
          <div>
            <div className="text-lg font-bold">{userInfo?.name}</div>
            <div className="text-sm font-bold">{t(userInfo?.role)}</div>
          </div>
          <IconButton onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}>
            <FiLogOut className="w-6 h-6" />
          </IconButton>
        </>
      ) : (
        <div
          className=""
          onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
        >
          <FiLogOut className="w-6 h-6" />
        </div>
      )}

      <Dialog
        open={isLogoutModalOpen}
        handler={() => setIsLogoutModalOpen(false)}
        className="dark:bg-gray-800"
      >
        <DialogHeader className="dark:text-white">
          <div className="">{t("confirm_logout")}</div>{" "}
        </DialogHeader>
        <DialogBody className=" dark:text-gray-300 ">
          {/* Are you sure you want to logout? */}
          <div className="text-lg font-bold">{userInfo?.name}</div>
          {t("confirm_logout_message")}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setIsLogoutModalOpen(false)}
            className="mr-1 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmLogout}
            className="dark:bg-red-600 dark:hover:bg-red-700"
          >
            Logout
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UserName;
