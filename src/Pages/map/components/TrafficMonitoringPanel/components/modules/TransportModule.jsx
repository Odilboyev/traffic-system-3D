import React from 'react';
import { FaBus, FaCar, FaTrafficLight } from 'react-icons/fa';

const TransportModule = () => {
  return (
    <div className="transport-module space-y-4">
      {/* Traffic Lights Status */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <FaTrafficLight className="mr-2 text-cyan-400" />
          Svetofor Holati
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {['Normal', 'Nosoz', 'Ta\'mirda', 'O\'chirilgan'].map((status, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between"
            >
              <span className="text-sm text-gray-300">{status}</span>
              <span className="text-lg font-bold text-cyan-300">{Math.floor(Math.random() * 20)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Public Transport */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <FaBus className="mr-2 text-cyan-400" />
          Jamoat Transporti
        </h3>
        <div className="space-y-3">
          {[
            { type: 'Avtobus', count: 128, active: 98 },
            { type: 'Metro', count: 42, active: 42 },
            { type: 'Tramvay', count: 36, active: 28 }
          ].map((item, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between"
            >
              <span className="text-sm text-gray-300">{item.type}</span>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">Faol: {item.active}/{item.count}</span>
                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400" 
                    style={{ width: `${(item.active / item.count) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Congestion */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <FaCar className="mr-2 text-cyan-400" />
          Yo'l Tirbandligi
        </h3>
        <div className="space-y-2">
          {[
            { area: 'Markaziy Shahar', level: 'Yuqori', percentage: 78 },
            { area: 'Shimoliy Yo\'l', level: 'O\'rta', percentage: 45 },
            { area: 'Janubiy Yo\'l', level: 'Past', percentage: 23 },
            { area: 'G\'arbiy Yo\'l', level: 'O\'rta', percentage: 52 }
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.area}</span>
                <span className="text-xs text-gray-400">{item.level} ({item.percentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    item.percentage > 70 ? 'bg-red-500' : 
                    item.percentage > 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportModule;
