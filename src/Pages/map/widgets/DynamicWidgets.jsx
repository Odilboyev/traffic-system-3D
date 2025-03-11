import Control from "../../../components/customControl";
import CrossroadWidget from "./crossroadData";
import InfoWidget from "./infoWidget";
import PropTypes from "prop-types";
import UserInfoWidget from "./userInfo";
import WeatherWidget from "./weather";
const DynamicWidgets = ({ widgets, t }) => {
  return (
    <>
      {Object.keys(widgets).map((item) => {
        if (item === item) {
          return (
            <Control position="topright" key={item}>
              {widgets[item] &&
                (widgets[item] === "crossroad" ? (
                  <CrossroadWidget t={t} />
                ) : widgets[item] === "info" ? (
                  <InfoWidget t={t} />
                ) : widgets[item] === "userInfo" ? (
                  <UserInfoWidget t={t} />
                ) : widgets[item] === "weather" ? (
                  <WeatherWidget t={t} />
                ) : (
                  <div style={{ display: "none" }}></div>
                ))}
            </Control>
          );
        }
        return <div style={{ display: "none" }} key={item}></div>;
      })}
    </>
  );
};

DynamicWidgets.propTypes = {
  widgets: PropTypes.object,
  t: PropTypes.func,
};

export default DynamicWidgets;
