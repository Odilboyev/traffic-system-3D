import { useEffect, useState } from 'react';
import { FaBus } from 'react-icons/fa';
import { getBusWidgets } from '../../../../../../../api/api.handlers';

const TransportWidgets = () => {
  const [widgetData, setWidgetData] = useState({
    totalBuses: 0,
    activeBuses: 0,
    routes: []
  });

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const data = await getBusWidgets();
        setWidgetData(data);
      } catch (error) {
        console.error('Error fetching bus widgets:', error);
      }
    };

    fetchWidgetData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Public Transport Stats */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <FaBus className="mr-2 text-cyan-400" />
          Public Transport Status
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between">
            <span className="text-sm text-gray-300">Total Buses</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-cyan-300">{widgetData.totalBuses}</span>
            </div>
          </div>
          <div className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between">
            <span className="text-sm text-gray-300">Active Buses</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-cyan-300">{widgetData.activeBuses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Statistics */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3">Route Statistics</h3>
        <div className="space-y-2">
          {widgetData.routes.map((route, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Route {route.name}</span>
                <span className="text-xs text-gray-400">
                  Active: {route.activeVehicles}/{route.totalVehicles}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400"
                  style={{ 
                    width: `${(route.activeVehicles / route.totalVehicles) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportWidgets;
