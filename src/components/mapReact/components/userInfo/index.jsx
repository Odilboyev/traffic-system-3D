import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { MdSettings, MdLogout, MdLock } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { toast } from "react-toastify";
import { getInfoAboutCurrentUser } from "../../../../api/api.handlers";

const UserInfoWidget = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    window.location.reload(); // Reload the page to reset the state
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword) {
        console.log("password changed");
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
        <IconButton color="black" className="" onClick={handleLogout}>
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
  );
};

export default UserInfoWidget;
