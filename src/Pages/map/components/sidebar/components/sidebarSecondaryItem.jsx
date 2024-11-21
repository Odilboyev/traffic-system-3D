import DropPanel from "../../../../../components/dropPanel";
import { IconButton } from "@material-tailwind/react";

const SidebarSecondaryItem = ({
  icon: Icon,
  label,
  activeSecondaryPanel,
  setActiveSecondaryPanel,
  component,
  ...rest
}) => {
  const dropDownHandler = () => {
    if (setActiveSecondaryPanel) {
      if (activeSecondaryPanel === label) {
        setActiveSecondaryPanel(null);
      } else {
        setActiveSecondaryPanel(label);
      }
    }
  };
  return (
    <>
      {" "}
      {component ? (
        <DropPanel
          {...rest}
          label={label}
          sndWrapperClass="max-w-[15vw]"
          icon={Icon}
          isDropOpen={label === activeSecondaryPanel}
          hanleDropDownOpen={dropDownHandler}
        >
          {component}
        </DropPanel>
      ) : (
        <IconButton onClick={rest.onClick}>
          <Icon className="w-6 h-6" />
        </IconButton>
      )}
    </>
  );
};

export default SidebarSecondaryItem;
