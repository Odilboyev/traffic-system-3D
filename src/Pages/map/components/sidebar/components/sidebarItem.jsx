import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

const SidebarItem = ({
  icon,
  label,
  isOpen,
  activeSidePanel,
  setActiveSidePanel,
  subItems = [],
  content,
  extraContent,
  t,
}) => {
  const handleExpand = () => {
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
          isOpen ? "justify-start" : "justify-center"
        } w-full px-4 py-3 items-center flex-nowrap hover:bg-gray-700 cursor-pointer transition-all duration-300 `}
      >
        {icon}
        <span
          className={`ml-4 text-base font-medium transition-all duration-300 ${
            isOpen ? "visible block" : "invisible hidden"
          }`}
        >
          {t(label) || label}
        </span>

        {(subItems.length > 0 || extraContent) && isOpen && (
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

      <div className="flex flex-col pl-8 space-y-2 ">
        <div
          className={activeSidePanel === label && isOpen ? "visible" : "hidden"}
        >
          {extraContent}
        </div>
      </div>

      {/* Extra content inside collapsed item */}
      {/* {isOpen && extraContent && <div className="mt-4">{extraContent}</div>} */}
    </div>
  );
};
export default SidebarItem;
