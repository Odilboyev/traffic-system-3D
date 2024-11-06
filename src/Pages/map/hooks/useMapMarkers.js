import { useState } from "react";
import { getInfoForCards, getMarkerData } from "../../../api/api.handlers";

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [bottomSectionData, setBottomSectionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const getDataHandler = async () => {
    setAreMarkersLoading(true);
    try {
      setAreMarkersLoading(false);
      const [myData, bottomData] = await Promise.all([
        getMarkerData(),
        getInfoForCards(),
      ]);
      setMarkers(
        myData.data.map((marker) => ({
          ...marker,
          isPopupOpen: false,
        }))
      );
      setBottomSectionData(bottomData);
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
    bottomSectionData,
    errorMessage,
    getDataHandler,
    clearMarkers,
    updateMarkers,
  };
};
