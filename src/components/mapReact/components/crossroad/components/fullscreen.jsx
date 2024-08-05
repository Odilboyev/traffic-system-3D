import { ArrowsPointingInIcon } from "@heroicons/react/16/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import { IconButton } from "@material-tailwind/react";
import { useState } from "react";

const FullscreenBox = ({ children, ...rest }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isButtonVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`dark:bg-blue-gray-900 border  p-2 ${
        isFullscreen ? "fixed inset-0 z-[5000]" : "h-full"
      } `}
      onMouseOver={() => setIsVisible(true)}
      onMouseOut={() => setIsVisible(false)}
      {...rest}
    >
      <div className="relative h-full">
        <div
          className={`no-scrollbar ${
            isFullscreen
              ? "!h-screen !w-screen max-h-screen overflow-y-scroll"
              : "h-full overflow-y-scroll"
          }`}
        >
          {children}
        </div>
        {isButtonVisible && (
          <div
            className={`text-center px-3 absolute ${
              isFullscreen ? "top-3" : "bottom-3"
            } right-3`}
          >
            <IconButton
              onClick={handleFullscreenToggle}
              size="sm"
              variant={isButtonHovered ? "" : "outlined"}
              onMouseOver={() => setIsButtonHovered(true)}
              onMouseOut={() => setIsButtonHovered(false)}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-5 h-5" />
              ) : (
                <ArrowsPointingOutIcon className="w-5 h-5" />
              )}
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
export default FullscreenBox;
