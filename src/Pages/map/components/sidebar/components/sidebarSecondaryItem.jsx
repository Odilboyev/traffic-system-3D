/* eslint-disable react/display-name */
import DropPanel from "../../../../../components/dropPanel";
import { IconButton } from "@material-tailwind/react";
import { memo } from "react";
import { useTheme } from "../../../../../customHooks/useTheme";

const SidebarSecondaryItem = memo(
  ({
    icon: Icon,
    label,
    activeSecondaryPanel,
    setActiveSecondaryPanel,
    component,
    ...rest
  }) => {
    const { theme } = useTheme();
    const dropDownHandler = () => {
      if (setActiveSecondaryPanel) {
        if (activeSecondaryPanel === label) {
          setActiveSecondaryPanel(null);
        } else {
          setActiveSecondaryPanel(label);
        }
      }
    };

    return component ? (
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
      <IconButton
        onClick={rest.onClick}
        color={theme === "dark" ? "black" : "white"}
        size="sm"
      >
        <Icon className="w-6 h-6" />
      </IconButton>
    );
  }
);

export default SidebarSecondaryItem;
