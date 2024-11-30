import React from 'react';
import { NavSection } from '../../types';
import OfferSection from './sections/OfferSection';
import StoreMap from './sections/StoreMap';
import OfferMagazine from './sections/OfferMagazine';
import ShoppingList from './sections/ShoppingList';
import HelpSection from './sections/HelpSection';
import Checkout from './sections/Checkout';

interface RightPanelProps {
  activeSection: NavSection;
}

const RightPanel: React.FC<RightPanelProps> = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'offers':
        return <OfferSection />;
      case 'map':
        return <StoreMap />;
      case 'magazine':
        return <OfferMagazine />;
      case 'checklist':
        return <ShoppingList />;
      case 'help':
        return <HelpSection />;
      case 'checkout':
        return <Checkout />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex-1 ml-1/2 mr-16 bg-white p-6 overflow-y-auto">
      {renderSection()}
    </div>
  );
};

export default RightPanel;