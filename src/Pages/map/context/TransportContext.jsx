import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
  const [visualizationType, setVisualizationType] = useState('lines');
  const [selectedRouteTypes, setSelectedRouteTypes] = useState([]);

  return (
    <TransportContext.Provider 
      value={{ 
        visualizationType, 
        setVisualizationType,
        selectedRouteTypes,
        setSelectedRouteTypes
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

TransportProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};
