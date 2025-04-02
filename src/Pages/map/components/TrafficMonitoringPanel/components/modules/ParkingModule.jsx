import { useEffect, useState } from "react";

import { FaUsers } from "react-icons/fa";
import { IoCarSport } from "react-icons/io5";
import { MdLocalParking } from "react-icons/md";
import PropTypes from "prop-types";
import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { getParkingWidgets } from "../../../../../../api/api.handlers";
import { useMapContext } from "../../../../context/MapContext";
import { useTranslation } from "react-i18next";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

const ParkingWidget = ({ title, data, t }) => {
  console.log(data, "data in parkingwidget");
  if (!data) return null;

  return (
    <div className="relative p-4">
      <div className="relative mb-4 flex items-center gap-2 bg-gradient-to-l from-transparent py-1 via-black/90 to-transparent">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase text-center tracking-[0.2em] font-medium text-cyan-200 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center gap-2">
          <span className="text-cyan-500/50">|</span>
          {title}
          <span className="text-cyan-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      <div className="space-y-4">
        {/* Summary row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <MdLocalParking className="text-cyan-400 text-lg" />
              <div className="text-sm text-cyan-500/70">
                {t("parking.total_parkings")}
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-200 mt-1">
              {data.parkings_count}
            </div>
          </div>
          <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <IoCarSport className="text-cyan-400 text-lg" />
              <div className="text-sm text-cyan-500/70">
                {t("parking.total_spaces")}
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-200 mt-1">
              {data.space_max_sum}
            </div>
          </div>
        </div>

        {/* Occupancy status */}
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-4">
          <div className="space-y-4">
            {/* Occupied spaces */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-sm text-cyan-500/70">
                    {t("parking.occupied")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-cyan-500/70">
                    {t("parking.free")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-200 font-medium">
                  {data.space_busy_sum}
                </span>
                <span className="text-cyan-200 font-medium">
                  {data.space_free_sum}
                </span>
              </div>
              <div className="h-1.5 bg-green-400/50  rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full transition-all"
                  style={{
                    width: `${
                      (data.space_busy_sum / data.space_max_sum) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightSidePanelContent = ({ parkingData, t }) => {
  if (!parkingData) return null;

  return (
    <div className="relative w-[25vw] space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      {parkingData.widget_1?.data && (
        <ParkingWidget
          title={parkingData.widget_1.name}
          data={parkingData.widget_1.data[0]}
          t={t}
        />
      )}
      {parkingData.widget_2?.data && (
        <ParkingWidget
          title={parkingData.widget_2.name}
          data={parkingData.widget_2.data[0]}
          t={t}
        />
      )}
      {parkingData.widget_3?.data && (
        <ParkingWidget
          title={parkingData.widget_3.name}
          data={parkingData.widget_3.data[0]}
          t={t}
        />
      )}
    </div>
  );
};

const LeftSidePanelContent = ({ parkingData, t, map }) => {
  if (!parkingData?.widget_4?.data) return null;

  return (
    <div className="relative w-[25vw] p-4 ">
      <div className="relative  mb-4  flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase  text-center tracking-[0.2em] font-medium text-cyan-200 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center gap-2">
          <span className="text-cyan-500/50">|</span>
          {parkingData.widget_4.name}
          <span className="text-cyan-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      <div className="space-y-2 max-h-[65vh] overflow-y-auto scrollbar-hide">
        {parkingData.widget_4.data.map((parking) => (
          <div
            key={parking.id}
            className="flex items-center justify-between gap-3 text-sm p-3 bg-black/30 border border-cyan-500/20 hover:bg-cyan-950/30 transition-colors rounded-lg group backdrop-blur-sm cursor-pointer"
            onClick={() => {
              console.log(parking.location_center, "clicked");
              console.log(
                JSON.parse(parking.location_center),
                "clicked with json"
              );
              map.flyTo({
                center: [
                  JSON.parse(parking.location_center)[1],
                  JSON.parse(parking.location_center)[0],
                ],
                zoom: 17,
                duration: 1000,
              });
            }}
          >
            <div className="flex items-center gap-3 min-w-[200px] max-w-[200px]">
              <div className="w-1.5 h-1.5 max-h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></div>
              <span
                className="text-cyan-100 truncate block"
                title={parking.name}
              >
                {parking.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-cyan-300">
              <div
                className="flex items-center gap-2 bg-cyan-500/10 px-3 py-1.5 rounded-lg"
                title={`${t("parking.occupancy")}: ${parking.load_percent}%`}
              >
                <FaUsers className="text-cyan-400 text-sm" />
                <span className="font-medium">{parking.load_percent}%</span>
              </div>
              <div
                className="flex items-center gap-2 bg-cyan-500/10 px-3 py-1.5 rounded-lg"
                title={`${t("parking.free")}: ${parking.space_free}`}
              >
                <IoCarSport className="text-cyan-400 text-sm" />
                <span className="font-medium">{parking.space_free}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParkingModule = () => {
  const conditionMet = useZoomPanel();
  const [parkingData, setParkingData] = useState(null);
  const { t } = useTranslation();
  const { map } = useMapContext();
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await getParkingWidgets();
        setParkingData(response);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkingData();
    const interval = setInterval(fetchParkingData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (!parkingData) return null;

  return (
    <div>
      <SlidePanel
        isOpen={conditionMet}
        side="right"
        className="right-side-panel"
        content={<RightSidePanelContent parkingData={parkingData} t={t} />}
      />
      <SlidePanel
        side="left"
        isOpen={conditionMet}
        content={
          <LeftSidePanelContent parkingData={parkingData} t={t} map={map} />
        }
      />
    </div>
  );
};

ParkingWidget.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    parkings_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    space_max_sum: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    space_busy_sum: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    space_free_sum: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

RightSidePanelContent.propTypes = {
  parkingData: PropTypes.shape({
    widget_1: PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
    widget_2: PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
    widget_3: PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  }),
  t: PropTypes.func.isRequired,
};

export default ParkingModule;
