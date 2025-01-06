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
        className="dark:bg-gray-800 min-w-[320px] max-w-[400px] rounded-xl"
        animate={{
          mount: { scale: 1, opacity: 1 },
          unmount: { scale: 0.9, opacity: 0 },
        }}
        size="sm"
      >
        <DialogHeader className="dark:text-white flex pl-5 items-center gap-3 border-b dark:border-gray-700 pb-3">
          <FiLogOut className="w-6 h-6 text-red-500" />
          <span>{t("confirm_logout")}</span>
        </DialogHeader>
        <DialogBody className="dark:text-gray-300 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-900/10 p-3 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-500">
                  {userInfo?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {userInfo?.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t(userInfo?.role)}
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2 border-t dark:border-gray-700 pt-3">
          <Button
            variant="text"
            color="gray"
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 dark:text-gray-300 dark:hover:bg-gray-700 normal-case"
            ripple={true}
          >
            <span>{t("cancel")}</span>
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={confirmLogout}
            className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 normal-case"
            ripple={true}
          >
            <span>{t("logout")}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UserName;
