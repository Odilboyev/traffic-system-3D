import "./styles.css";

import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Chip,
  IconButton,
  Option,
  Select,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import { getDistricts, getRegions } from "../../../../api/api.handlers";
import { useEffect, useRef, useState } from "react";

import { useFuelStations } from "../../hooks/useFuelStations";

const RegionDistrictFilter = ({ map, t }) => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegionsLoading, setIsRegionsLoading] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const [regionsError, setRegionsError] = useState(null);
  const [districtsError, setDistrictsError] = useState(null);
  const { stations, setStations, fetchStations } = useFuelStations();

  // Draggable functionality
  const [position, setPosition] = useState({ x: 16, y: 16 }); // Initial position (top-left)
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const filterRef = useRef(null);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegionsData = async () => {
      setIsRegionsLoading(true);
      setRegionsError(null);
      try {
        const data = await getRegions();
        if (Array.isArray(data) && data.length > 0) {
          setRegions(data);
        } else {
          setRegions([]);
          setRegionsError("No regions available");
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setRegionsError("Failed to load regions");
        setRegions([]);
      } finally {
        setIsRegionsLoading(false);
      }
    };
    fetchRegionsData();
  }, []);

  // Fetch districts when a region is selected
  useEffect(() => {
    const fetchDistrictsData = async () => {
      if (selectedRegion) {
        setIsDistrictsLoading(true);
        setDistrictsError(null);
        try {
          const data = await getDistricts(selectedRegion.id);
          if (Array.isArray(data) && data.length > 0) {
            setDistricts(data);
          } else {
            setDistricts([]);
            setDistrictsError("No districts available for this region");
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
          setDistrictsError("Failed to load districts");
          setDistricts([]);
        } finally {
          setIsDistrictsLoading(false);
        }
      } else {
        setDistricts([]);
        setDistrictsError(null);
      }
    };
    fetchDistrictsData();
  }, [selectedRegion]);

  // Filter stations based on selected region and district
  useEffect(() => {
    // Initial fetch of stations if needed
    if (!Array.isArray(stations) || stations.length === 0) {
      fetchStations();
      return;
    }
  }, []); // Only run once on component mount

  // Track when filters change to trigger a refresh
  const [filterChangeCounter, setFilterChangeCounter] = useState(0);

  // Handle filter changes
  useEffect(() => {
    // When selectedDistrict changes to null but region is still selected,
    // we need to refresh the data and then apply just the region filter
    if (!selectedDistrict && selectedRegion) {
      // Increment the counter to trigger the filtering effect
      setFilterChangeCounter((prev) => prev + 1);
    }
  }, [selectedDistrict, selectedRegion]);

  // Apply filters when region or district selection changes
  useEffect(() => {
    const applyFilters = async () => {
      try {
        // If no filters are selected, restore original data
        if (!selectedRegion && !selectedDistrict) {
          await fetchStations();
          return;
        }

        // If we don't have stations data yet, fetch it first
        if (!Array.isArray(stations) || stations.length === 0) {
          await fetchStations();
        }

        // Get a fresh copy of stations
        let allStations = [...stations];

        // Apply region filter if selected
        if (selectedRegion && selectedRegion.id) {
          allStations = allStations.filter(
            (station) => station && station.region_id === selectedRegion.id
          );
        }

        // Apply district filter if selected
        if (selectedDistrict && selectedDistrict.id) {
          allStations = allStations.filter(
            (station) => station && station.district_id === selectedDistrict.id
          );
        }

        // Only update if we have filtered results
        if (allStations.length > 0) {
          setStations(allStations);
        } else {
          console.warn("No stations match the current filters");
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    };

    applyFilters();
  }, [selectedRegion, selectedDistrict, filterChangeCounter, fetchStations]);

  // Initial data load
  useEffect(() => {
    if (!Array.isArray(stations) || stations.length === 0) {
      fetchStations();
    }
  }, [fetchStations, stations, setStations]);

  const handleRegionChange = (regionId) => {
    const region = regions.find((r) => r.id === parseInt(regionId));
    setSelectedRegion(region);
    setSelectedDistrict(null);

    // Fly to region location
    if (region && map && region.location) {
      try {
        const location = JSON.parse(region.location);

        console.log(location, "the location before flyto");

        map.flyTo({ center: [location.lng, location.lat], zoom: 12 });
      } catch (error) {
        console.error("Error parsing region location:", error);
      }
    }
  };

  const handleDistrictChange = (districtId) => {
    const district = districts.find((d) => d.id === parseInt(districtId));
    setSelectedDistrict(district);

    // Fly to district location
    if (district && map && district.location) {
      try {
        const location = JSON.parse(district.location);
        if (
          location &&
          typeof location.lng === "number" &&
          typeof location.lat === "number"
        ) {
          map.flyTo({ center: [location.lng, location.lat], zoom: 14 });
        }
      } catch (error) {
        console.error("Error parsing district location:", error);
      }
    }
  };

  const clearFilters = () => {
    setSelectedRegion(null);
    setSelectedDistrict(null);
    // Restore original stations data
    fetchStations();
  };

  const refreshRegions = async () => {
    setIsRegionsLoading(true);
    setRegionsError(null);
    try {
      const data = await getRegions();
      if (Array.isArray(data) && data.length > 0) {
        setRegions(data);
      } else {
        setRegionsError("No regions available");
      }
    } catch (error) {
      console.error("Error refreshing regions:", error);
      setRegionsError("Failed to refresh regions");
    } finally {
      setIsRegionsLoading(false);
    }
  };

  // Handle mouse/touch down for dragging - optimized version
  const handleDragStart = (e) => {
    if (filterRef.current) {
      const rect = filterRef.current.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (clientX && clientY) {
        // Update the ref directly for immediate access during drag
        dragOffsetRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };

        // Also update the state for React (less critical for performance)
        setDragOffset(dragOffsetRef.current);

        // Update both the ref and state for dragging status
        isDraggingRef.current = true;
        setIsDragging(true);

        // Prevent default behavior to avoid text selection during drag
        e.preventDefault();
      }
    }
  };

  // Alias for mouse events
  const handleMouseDown = handleDragStart;

  // Use refs for position to avoid re-renders during drag
  const positionRef = useRef(position);
  const dragOffsetRef = useRef(dragOffset);
  const isDraggingRef = useRef(isDragging);

  // Update refs when state changes
  useEffect(() => {
    positionRef.current = position;
    dragOffsetRef.current = dragOffset;
    isDraggingRef.current = isDragging;
  }, [position, dragOffset, isDragging]);

  // Handle mouse/touch move during drag - optimized version
  useEffect(() => {
    // Use requestAnimationFrame for smoother performance
    let animationFrameId = null;

    const handleMove = (e) => {
      // Cancel any pending animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Schedule the position update on the next animation frame
      animationFrameId = requestAnimationFrame(() => {
        if (isDraggingRef.current) {
          const clientX = e.clientX || (e.touches && e.touches[0].clientX);
          const clientY = e.clientY || (e.touches && e.touches[0].clientY);

          if (clientX && clientY) {
            const newX = clientX - dragOffsetRef.current.x;
            const newY = clientY - dragOffsetRef.current.y;

            // Update the DOM directly for smoother dragging
            if (filterRef.current) {
              filterRef.current.style.left = `${newX}px`;
              filterRef.current.style.top = `${newY}px`;
            }

            // Store the current position for when dragging ends
            positionRef.current = { x: newX, y: newY };
          }
        }
      });
    };

    const handleEnd = () => {
      // On drag end, update the React state with the final position
      setPosition(positionRef.current);
      setIsDragging(false);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Only add listeners when dragging starts
    if (isDragging) {
      // Mouse events
      document.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("mouseup", handleEnd);

      // Touch events
      document.addEventListener("touchmove", handleMove, { passive: true });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
    }

    return () => {
      // Clean up all event listeners and any pending animation frame
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging]); // Only depend on isDragging, not position or dragOffset

  return (
    <div
      ref={filterRef}
      className="absolute z-[9999999] bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 max-w-xs region-filter-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "auto",
        transition: isDragging ? "none" : "box-shadow 0.2s ease",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-2 drag-handle"
            onMouseDown={handleMouseDown}
            onTouchStart={handleDragStart}
          >
            <div className="flex items-center gap-1">
              <ArrowsPointingOutIcon className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t ? t("Filter by Location") : "Filter by Location"}
              </h3>
            </div>
            <Tooltip content="Filter fuel stations by region and district">
              <InformationCircleIcon className="h-4 w-4 text-blue-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content="Refresh regions data">
              <IconButton
                size="sm"
                variant="text"
                className="p-1 h-6 w-6 flex items-center justify-center"
                onClick={refreshRegions}
                disabled={isRegionsLoading}
              >
                <ArrowPathIcon
                  className={`h-4 w-4 ${
                    isRegionsLoading ? "animate-spin" : ""
                  }`}
                />
              </IconButton>
            </Tooltip>
            {(selectedRegion || selectedDistrict) && (
              <Tooltip content="Clear all filters">
                <IconButton
                  size="sm"
                  variant="text"
                  className="p-1 h-6 w-6 flex items-center justify-center"
                  onClick={clearFilters}
                >
                  <XMarkIcon className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Region Select */}
          <div>
            <Select
              label={t ? t("Select Region") : "Select Region"}
              value={selectedRegion?.id?.toString() || ""}
              onChange={handleRegionChange}
              className="text-sm"
              disabled={isRegionsLoading || regions.length === 0}
            >
              {regions.map((region) => (
                <Option key={region.id} value={region.id.toString()}>
                  {region.name}
                </Option>
              ))}
            </Select>

            {isRegionsLoading && (
              <div className="flex items-center justify-center mt-1">
                <Spinner className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-500 ml-2">
                  Loading regions...
                </span>
              </div>
            )}

            {regionsError && (
              <div className="flex items-center mt-1 text-red-500">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">{regionsError}</span>
              </div>
            )}
          </div>

          {/* District Select - Only show when a region is selected */}
          {selectedRegion && (
            <div>
              <Select
                label={t ? t("Select District") : "Select District"}
                value={selectedDistrict?.id?.toString() || ""}
                onChange={handleDistrictChange}
                className="text-sm"
                disabled={isDistrictsLoading || districts.length === 0}
              >
                {districts.map((district) => (
                  <Option key={district.id} value={district.id.toString()}>
                    {district.name}
                  </Option>
                ))}
              </Select>

              {isDistrictsLoading && (
                <div className="flex items-center justify-center mt-1">
                  <Spinner className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-500 ml-2">
                    Loading districts...
                  </span>
                </div>
              )}

              {districtsError && (
                <div className="flex items-center mt-1 text-red-500">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">{districtsError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Display active filters */}
        {(selectedRegion || selectedDistrict) && (
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="w-full text-xs text-gray-500 dark:text-gray-400 mb-1">
              Active filters:
            </div>
            {selectedRegion && (
              <Chip
                value={selectedRegion.name}
                variant="outlined"
                color="blue"
                icon={<MapPinIcon className="h-3 w-3" />}
                onClose={() => {
                  setSelectedRegion(null);
                  setSelectedDistrict(null);
                  fetchStations();
                }}
                className="text-xs"
              />
            )}
            {selectedDistrict && (
              <Chip
                value={selectedDistrict.name}
                variant="outlined"
                color="green"
                icon={<MapPinIcon className="h-3 w-3" />}
                onClose={() => {
                  // Just clear the district selection
                  // The useEffect hook will handle the re-filtering
                  setSelectedDistrict(null);
                }}
                className="text-xs"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionDistrictFilter;
