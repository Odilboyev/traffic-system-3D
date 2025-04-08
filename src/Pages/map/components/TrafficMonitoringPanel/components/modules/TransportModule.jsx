import { useEffect, useState } from "react";

import { FaBus } from "react-icons/fa";
import PropTypes from "prop-types";
import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { getBusWidgets } from "../../../../../../api/api.handlers";
import { useTranslation } from "react-i18next";
import { useTransport } from "../../../../context/TransportContext";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

// Visualization controls component
const LeftSidePanelContent = ({
  visualizationType,
  onVisualizationChange,
  t,
}) => {
  return (
    <div className="p-4 bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <FaBus className="text-cyan-400 text-lg" />
        <h3 className="text-lg font-semibold text-cyan-100">
          {t("Visualization")}
        </h3>
      </div>
      <div className="space-y-2">
        <div
          className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
            visualizationType === "lines" ? "bg-cyan-800/50" : "bg-gray-700/50"
          }`}
          onClick={() => onVisualizationChange("lines")}
        >
          <span className="text-sm text-gray-300">{t("Route Lines")}</span>
        </div>
        <div
          className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
            visualizationType === "heatmap"
              ? "bg-cyan-800/50"
              : "bg-gray-700/50"
          }`}
          onClick={() => onVisualizationChange("heatmap")}
        >
          <span className="text-sm text-gray-300">{t("Heat Map")}</span>
        </div>
      </div>
    </div>
  );
};

// Stats panel component
const RightSidePanelContent = ({ busData, t }) => {
  if (!busData?.widget_1) return null;

  const { route_data, bus_stop_data } = busData.widget_1;

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaBus className="text-cyan-400 text-lg" />
              <div className="text-sm text-cyan-500/70">
                {t("Total Routes")}
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-200 mt-1">
              {route_data.reduce((sum, item) => sum + item.count_route, 0)}
            </div>
          </div>
          <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaBus className="text-cyan-400 text-lg" />
              <div className="text-sm text-cyan-500/70">{t("Total Stops")}</div>
            </div>
            <div className="text-2xl font-bold text-cyan-200 mt-1">
              {bus_stop_data.count}
            </div>
          </div>
        </div>

        {/* Route statistics */}
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-lg font-semibold text-cyan-100 mb-3">
            {t("Route Types")}
          </h3>

          {/* Combined progress bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex mb-4">
            {route_data.map((route, index) => {
              const totalRoutes = route_data.reduce(
                (sum, r) => sum + r.count_route,
                0
              );
              const percentage = (route.count_route / totalRoutes) * 100;
              const colors = [
                "bg-cyan-400",
                "bg-purple-400",
                "bg-emerald-400",
                "bg-amber-400",
              ];

              return (
                <div
                  key={index}
                  className={`h-full ${colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                />
              );
            })}
          </div>

          {/* Route type details */}
          <div className="space-y-3">
            {route_data.map((route, index) => {
              const totalRoutes = route_data.reduce(
                (sum, r) => sum + r.count_route,
                0
              );
              const percentage = (
                (route.count_route / totalRoutes) *
                100
              ).toFixed(1);
              const colors = [
                "text-cyan-400",
                "text-purple-400",
                "text-emerald-400",
                "text-amber-400",
              ];

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${colors[
                        index % colors.length
                      ].replace("text-", "bg-")}`}
                    />
                    <span className="text-sm text-gray-300">
                      {route.type_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">
                        {route.count_route}
                      </span>
                      <span className="text-xs text-gray-400">
                        {t("routes")}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        colors[index % colors.length]
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransportModule = () => {
  const conditionMet = useZoomPanel();
  const [busData, setBusData] = useState(null);
  const { t } = useTranslation();

  const { visualizationType, setVisualizationType } = useTransport();

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await getBusWidgets();
        setBusData(response);
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    fetchBusData();
    const interval = setInterval(fetchBusData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (!busData) return null;

  return (
    <div>
      <SlidePanel
        isOpen={conditionMet}
        side="right"
        className="right-side-panel"
        content={<RightSidePanelContent busData={busData} t={t} />}
      />
      <SlidePanel
        side="left"
        isOpen={conditionMet}
        content={
          <LeftSidePanelContent
            visualizationType={visualizationType}
            onVisualizationChange={setVisualizationType}
            t={t}
          />
        }
      />
    </div>
  );
};

LeftSidePanelContent.propTypes = {
  visualizationType: PropTypes.oneOf(["lines", "heatmap"]).isRequired,
  onVisualizationChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

RightSidePanelContent.propTypes = {
  busData: PropTypes.shape({
    widget_1: PropTypes.shape({
      name: PropTypes.string,
      route_data: PropTypes.arrayOf(
        PropTypes.shape({
          count_route: PropTypes.number,
          type_name: PropTypes.string,
        })
      ),
      bus_stop_data: PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    }),
  }),
  t: PropTypes.func.isRequired,
};

export default TransportModule;
