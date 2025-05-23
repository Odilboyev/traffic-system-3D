import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

const SidebarItem = ({
  icon,
  label,
  isSidebarOpen,
  setIsSidebarOpen,

  activeSidePanel,
  setActiveSidePanel,
  subItems = [],
  content,
  extraContent,
  t,
}) => {
  const handleExpand = () => {
    setIsSidebarOpen(true);
    activeSidePanel === label
      ? setActiveSidePanel(null)
      : setActiveSidePanel(label);
  };

  return (
    <div className="w-full">
      {/* Main item */}

      <div
        onClick={handleExpand}
        className={`flex items-center ${
          isSidebarOpen ? "justify-start" : "justify-center"
        } w-full px-4 py-3 items-center flex-nowrap dark:hover:bg-gray-700 hover:bg-gray-300 cursor-pointer transition-all duration-300`}
      >
        {icon}
        <span
          className={`ml-4 text-sm transition-all duration-300 ${
            isSidebarOpen ? "visible block" : "invisible hidden"
          }`}
        >
          {t(label) || label}
        </span>

        {(subItems.length > 0 || extraContent) && isSidebarOpen && (
          <div className="ml-auto">
            {activeSidePanel === label ? (
              <IoIosArrowDown size={18} />
            ) : (
              <IoIosArrowBack size={18} />
            )}
          </div>
        )}
      </div>
      {content}
      {/* Collapsible sub-items */}

      <div className="flex flex-col space-y-2 dark:bg-gray-900/50 bg-gray-300/50">
        <div
          className={
            activeSidePanel === label && isSidebarOpen ? "visible" : "hidden"
          }
        >
          {extraContent}
        </div>
      </div>

      {/* Extra content inside collapsed item */}
      {/* {isSidebarOpen && extraContent && <div className="mt-4">{extraContent}</div>} */}
    </div>
  );
};
export default SidebarItem;
