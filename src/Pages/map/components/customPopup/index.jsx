import "./popup.style.css";

import { Popup, Tooltip } from "react-leaflet";
import { memo, useRef } from "react";

import Records from "./records";
import { Typography } from "@material-tailwind/react";
import { t } from "i18next";

const CameraDetails = memo(
  function CameraDetails({ marker = {}, isLoading, cameraData, L }) {
    const popupRef = useRef(null);

    return (
      <>
        {" "}
        <Popup
          eventHandlers={{
            mouseover: (e) => {
              const element = e.target.getElement();
              const draggable = new L.Draggable(element);
              draggable.enable();
            },
          }}
          ref={popupRef}
          maxWidth={"100%"}
          minHeight={"100%"}
          interactive
          closeOnClick={false}
          autoClose={false}
          keepInView={false}
          autoPan={false}
          className="!p-0 !m-0 z-[50000000] select-none custom-popup text-white"
        >
          {!isLoading && cameraData && cameraData?.streams?.length > 0 ? (
            <>
              <Records
                videos={cameraData?.streams}
                isLoading={isLoading}
                name={cameraData?.name}
              />
            </>
          ) : (
            t("loading")
          )}
        </Popup>
        <Tooltip direction="top" className="rounded-md">
          <div
            style={{
              minWidth: "8vw",
              minHeight: "6vw",
              overflow: "hidden",
            }}
          >
            {!isLoading ? (
              <>
                {cameraData?.streams?.map((v, i) => (
                  <img
                    src={v.screenshot_url}
                    key={i}
                    className="w-full"
                    alt=""
                  />
                ))}

                <Typography className="my-0">{marker?.cname}</Typography>
              </>
            ) : (
              <>
                <Typography className="my-0">{t("loading")}</Typography>
              </>
            )}
          </div>
        </Tooltip>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if marker data changes
    return (
      prevProps.marker.cid === nextProps.marker.cid &&
      prevProps.marker.type === nextProps.marker.type
    );
  }
);

export default CameraDetails;
