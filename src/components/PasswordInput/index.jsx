import { useState } from "react";
import { Button, IconButton, Input } from "@material-tailwind/react";
import {
  EyeDropperIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
const PasswordInput = ({ value, onChange, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="relative flex w-full">
      <Input
        // labelProps={{
        //   className: "hidden",
        // }}
        {...rest}
        type={isPasswordVisible ? "text" : "password"}
        onChange={onChange}
        value={value}
        className="pr-20"
        containerProps={{
          className: "min-w-0",
        }}
      />
      <IconButton
        variant="text"
        color="gray"
        onClick={togglePasswordVisibility}
        className="!absolute right-0 rounded dark:text-white"
      >
        {isPasswordVisible ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </IconButton>
    </div>
  );
};

export default PasswordInput;
