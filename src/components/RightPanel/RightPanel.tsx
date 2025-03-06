import React from 'react';
import { NavSection } from '../../types';
import OfferSection from './sections/OfferSection';
import StoreMap from './sections/StoreMap';
import OfferMagazine from './sections/OfferMagazine';
import ShoppingList from './sections/ShoppingList';
import HelpSection from './sections/HelpSection';
import Checkout from './sections/Checkout';
import { useTranslation } from 'react-i18next';

interface RightPanelProps {
  activeSection: NavSection;
}

const RightPanel: React.FC<RightPanelProps> = ({ activeSection }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
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
        return <OfferSection />;
    }
  };

  // In RTL mode, the panel is actually on the left side of the screen due to flex-row-reverse
  return (
    <div 
      className={`h-screen w-1/2 p-6 ${isRTL ? 'ml-16 pr-20' : 'ml-16 pr-20'} overflow-y-auto`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {renderSection()}
    </div>
  );
};

export default RightPanel;