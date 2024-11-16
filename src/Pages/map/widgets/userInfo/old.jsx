import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { MdLogout } from "react-icons/md";
import { getInfoAboutCurrentUser } from "../../../../api/api.handlers";
import { toast } from "react-toastify";

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
const UserInfoWidget = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fetch user info on component mount
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

  if (!userInfo) {
    return <div></div>;
  }

  return (
    <>
      <Card className="w-[15vw]  bg-transparent text-white shadow-xl rounded-md bg-gradient-to-br from-blue-gray-900/60 to-black/80 backdrop-blur-md">
        <CardBody className="py-5 relative flex justify-between items-center overflow-visible">
          <div className="pl-5 mb-3 w-2/3">
            <Typography variant="h5" className="text-white font-bold">
              {userInfo.name}
            </Typography>
            <Typography variant="h6" className="text-gray-400">
              {userInfo.role}
            </Typography>
          </div>

          {/* Dropdown Toggle */}
          <IconButton color="black" className="" onClick={handleLogoutClick}>
            <MdLogout className="w-5 h-5" />
          </IconButton>
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
        </CardBody>
      </Card>

      {/* Logout Confirmation Modal */}
      <Dialog
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
      </Dialog>
    </>
  );
};

export default UserInfoWidget;
