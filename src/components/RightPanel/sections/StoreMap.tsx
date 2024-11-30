import React, { useState } from 'react';
import { storeMapSections, sectionProducts } from '../../../data/mockData';
import SectionProducts from './SectionProducts';

const StoreMap: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setShowProducts(true);
  };

  const handleBackToMap = () => {
    setShowProducts(false);
  };

  if (showProducts && selectedSection) {
    const products = sectionProducts[selectedSection as keyof typeof sectionProducts];
    const sectionName = storeMapSections.find(s => s.id === selectedSection)?.name;
    
    return (
      <SectionProducts
        sectionName={sectionName || ''}
        products={products}
        onBack={handleBackToMap}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-2xl font-bold">Store Map</h2>
      <div className="relative w-full aspect-[4/3] border rounded-lg bg-gray-100">
        {storeMapSections.map((section) => {
          // Convert absolute coordinates to percentage-based positioning
          const left = (section.coordinates.x / 400) * 100;
          const top = (section.coordinates.y / 300) * 100;
          const width = (section.coordinates.width / 400) * 100;
          const height = (section.coordinates.height / 300) * 100;

          return (
            <div
              key={section.id}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={`border-2 ${
                selectedSection === section.id
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-400 hover:border-blue-300'
              } cursor-pointer transition-colors`}
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {section.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default StoreMap;