import React, { useState } from 'react';
import { FaGasPump, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa';
import { RiGasStationFill, RiOilFill } from 'react-icons/ri';

const FuelStationsModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelType, setFuelType] = useState('all');
  
  // Sample fuel station data
  const fuelStations = [
    { id: 1, name: 'Uzbekneftgaz #12', address: 'Toshkent, Chilonzor tumani', 
      types: ['AI-80', 'AI-92', 'AI-95', 'Dizel'], status: 'open', distance: '1.2 km' },
    { id: 2, name: 'UzGaz Station', address: 'Toshkent, Yunusobod tumani', 
      types: ['Metan', 'Propan'], status: 'open', distance: '2.5 km' },
    { id: 3, name: 'Lukoil', address: 'Toshkent, Mirzo Ulug\'bek tumani', 
      types: ['AI-92', 'AI-95', 'Premium'], status: 'open', distance: '3.7 km' },
    { id: 4, name: 'Uzbekneftgaz #8', address: 'Toshkent, Sergeli tumani', 
      types: ['AI-80', 'AI-92', 'Dizel'], status: 'closed', distance: '5.1 km' },
    { id: 5, name: 'EcoGas', address: 'Toshkent, Bektemir tumani', 
      types: ['Metan', 'Propan'], status: 'open', distance: '6.3 km' },
  ];
  
  // Filter stations based on search term and fuel type
  const filteredStations = fuelStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          station.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuelType = fuelType === 'all' || station.types.some(type => {
      if (fuelType === 'benzin') return ['AI-80', 'AI-92', 'AI-95', 'Premium'].includes(type);
      if (fuelType === 'gaz') return ['Metan', 'Propan'].includes(type);
      if (fuelType === 'dizel') return type === 'Dizel';
      return false;
    });
    
    return matchesSearch && matchesFuelType;
  });
  
  // Fuel price data
  const fuelPrices = [
    { type: 'AI-80', price: '4,800' },
    { type: 'AI-92', price: '5,300' },
    { type: 'AI-95', price: '5,800' },
    { type: 'Premium', price: '6,500' },
    { type: 'Dizel', price: '5,200' },
    { type: 'Metan', price: '3,200' },
    { type: 'Propan', price: '3,800' },
  ];
  
  return (
    <div className="fuel-stations-module space-y-4">
      {/* Fuel Prices */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <RiOilFill className="mr-2 text-cyan-400" />
          Yoqilg'i Narxlari
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {fuelPrices.map((fuel, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md bg-gray-700/50 flex items-center justify-between"
            >
              <span className="text-sm text-gray-300">{fuel.type}</span>
              <span className="text-md font-bold text-cyan-300">{fuel.price} so'm</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fuel Stations */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3 flex items-center">
          <RiGasStationFill className="mr-2 text-cyan-400" />
          Yoqilg'i Stansiyalari
        </h3>
        
        {/* Search and Filter */}
        <div className="flex space-x-2 mb-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full bg-gray-700/70 text-gray-200 px-3 py-2 pl-9 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            className="bg-gray-700/70 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option value="all">Barchasi</option>
            <option value="benzin">Benzin</option>
            <option value="gaz">Gaz</option>
            <option value="dizel">Dizel</option>
          </select>
        </div>
        
        {/* Stations List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {filteredStations.length > 0 ? (
            filteredStations.map(station => (
              <div 
                key={station.id} 
                className="p-3 rounded-md bg-gray-700/50 hover:bg-gray-700/80 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-md font-medium text-cyan-100">{station.name}</h4>
                    <p className="text-xs text-gray-400 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1" /> {station.address}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${station.status === 'open' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {station.status === 'open' ? 'Ochiq' : 'Yopiq'}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {station.types.map((type, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-600/50 rounded-full text-gray-300">
                        {type}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{station.distance}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">
              Yoqilg'i stansiyalari topilmadi
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelStationsModule;
