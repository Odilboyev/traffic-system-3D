import React from 'react';
import SlidePanel from '../../../../../components/SlidePanel/SlidePanel';
import TopPanelContent from './TopPanelContent';

const TopPanel = ({ isOpen = true }) => {
  return (
    <div className="top-panel">
      <SlidePanel 
        side="top" 
        isOpen={isOpen} 
        content={<TopPanelContent />} 
      />
    </div>
  );
};

export default TopPanel;
