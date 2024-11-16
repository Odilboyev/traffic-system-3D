import { MdLogout } from "react-icons/md";
import { toast } from "react-toastify";
import { useState } from "react";

/**
 * UserInfoWidget is a React component that displays the current user's information
 * and provides functionality for logging out and changing the password.
 *
 * It fetches the user information on component mount and manages several UI states
 * including dropdown for user options, modal for logout confirmation, and a form
 * for password change.
 *
 * @returns {JSX.Element} A component rendering user info card with logout and password change options.
 */
const LogoutControl = ({ t }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword) {
        toast.success("Password changed successfully!");
        setIsPasswordChangeOpen(false); // Close the password change field
        setNewPassword(""); // Clear the input field
      } else {
        toast.error("Please enter a valid password.");
      }
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {" "}
      <div
        className="flex justify-between items-center px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md w-[6vw]"
        onClick={confirmLogout}
      >
        <div className="text-base font-bold">{t("logout")}</div>{" "}
        <MdLogout className="w-5 h-5" />
      </div>
      <div className="">
        {/* Dropdown Toggle */}

        {/* <div className="relative">
            {isDropdownOpen && (
              <div className="absolute top-full z-[99998] right-0 mt-2 w-48 bg-gray-900/80 backdrop-blur-md text-white shadow-md rounded-lg p-2">
                <div
                  className="flex items-center p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                  onClick={() => setIsPasswordChangeOpen(!isPasswordChangeOpen)}
                >
                  <MdLock className="mr-2" />
                  Change Password
                </div>

                <div
                  className="flex items-center p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                  onClick={handleLogout}
                >
                  <MdLogout className="mr-2" />
                  Logout
                </div>
              </div>
            )}
          </div> */}

        {/* Password Change Form */}
        {/* {isPasswordChangeOpen && (
            <div className="mt-3 w-full">
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-black w-full"
              />
              <IconButton
                color="green"
                className="mt-2"
                onClick={handleChangePassword}
              >
                <MdLock className="text-white" />
              </IconButton>
            </div>
          )} */}
      </div>
      {/* Logout Confirmation Modal */}
      {/* <Dialog
        open={isLogoutModalOpen}
        handler={() => setIsLogoutModalOpen(false)}
        className="dark:bg-gray-800"
      >
        <DialogHeader className="dark:text-white">Confirm Logout</DialogHeader>
        <DialogBody className="px-5 dark:text-gray-300">
          Are you sure you want to logout?
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
      </Dialog> */}
    </>
  );
};

export default LogoutControl;
