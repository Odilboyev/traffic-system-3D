import { useState } from "react";
import { getMarkerData } from "../../../api/api.handlers";

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const getDataHandler = async () => {
    setAreMarkersLoading(true);
    try {
      setAreMarkersLoading(false);
      const myData = await getMarkerData();

      setMarkers(
        myData.data.map((marker) => ({
          ...marker,
          isPopupOpen: false,
        }))
      );
    } catch (error) {
      setAreMarkersLoading(false);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage("You are offline. Please try again");
      }
      throw new Error(error);
    }
  };
  const clearMarkers = () => setMarkers([]);
  const updateMarkers = (data) => data && setMarkers(data);

  return {
    markers,
    setMarkers,
    areMarkersLoading,
    errorMessage,
    getDataHandler,
    clearMarkers,
    updateMarkers,
  };
};
