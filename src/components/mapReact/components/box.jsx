import { Button } from "@material-tailwind/react";
import React from "react";

const Box = ({ marker, rotated, setrotated, handleMarkerRotate }) => {
  return (
    <div>
      this is a box
      {/* <div>
        <h3>
          {marker.type === 1
            ? "Zebra"
            : marker.type === 2
            ? "Camera"
            : "Crossroad"}
          <span className="ml-2"> {marker.id}</span>
        </h3>
        {marker.type === 1 && (
          <div>
            <div className="w-10 border p-1">
            </div>
            <div className="flex justify-center items-center w-full p-0">
              {" "}
              <input
                type="range"
                min="0"
                max="360"
                value={rotated}
                onChange={(event) => setrotated(Number(event.target.value))}
              />
              <Button
                size={"sm"}
                variant="outlined"
                className="rounded-lg py-0 px-3 ml-0.5"
                onClick={() => handleMarkerRotate(marker)}
              >
                {rotated}
              </Button>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Box;
