import { useState } from "react";
import { getInfoForCards } from "../../../api/api.handlers";

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [bottomSectionData, setBottomSectionData] = useState(null);

  const getDataHandler = async () => {
    setAreMarkersLoading(true);
    try {
      const bottomData = await getInfoForCards();
      setBottomSectionData(bottomData);
      setAreMarkersLoading(false);
    } catch (error) {
      setAreMarkersLoading(false);
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
    getDataHandler,
    clearMarkers,
    updateMarkers,
  };
};
