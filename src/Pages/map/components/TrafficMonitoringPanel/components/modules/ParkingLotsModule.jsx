import React from 'react';
import { FaParking, FaCarSide, FaMapMarkerAlt } from 'react-icons/fa';

const PARKING_TYPES = [
  { type: 'Area', icon: <FaMapMarkerAlt className="text-cyan-400" />, count: 8 },
  { type: 'Line', icon: <FaCarSide className="text-cyan-400" />, count: 12 }
];

const ParkingLotsModule = () => {
  return (
    <div className="space-y-4">
      {/* Overall Parking Status */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <FaParking className="mr-2 text-cyan-400" />
          Parking Status
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PARKING_TYPES.map((type) => (
            <div 
              key={type.type}
              className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between"
            >
              <div className="flex items-center">
                {type.icon}
                <span className="text-sm text-gray-300 ml-2">{type.type}</span>
              </div>
              <span className="text-lg font-bold text-cyan-300">{type.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Parking Occupancy */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3">
          Occupancy Rates
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Central Parking', capacity: 150, available: 45 },
            { name: 'North Plaza', capacity: 120, available: 20 },
            { name: 'South Avenue', capacity: 100, available: 98 },
            { name: 'Mall Underground', capacity: 200, available: 75 }
          ].map((lot) => (
            <div 
              key={lot.name}
              className="p-3 rounded-md bg-gray-700/50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{lot.name}</span>
                <span className="text-xs text-gray-400">
                  {lot.available}/{lot.capacity} spots
                </span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${((lot.capacity - lot.available) / lot.capacity) * 100}%`,
                    backgroundColor: lot.available < lot.capacity * 0.2 ? '#ef4444' : 
                                   lot.available < lot.capacity * 0.5 ? '#f59e0b' : '#22c55e'
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

export default ParkingLotsModule;
