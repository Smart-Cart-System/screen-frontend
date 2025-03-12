import React from 'react';
import { mockOffers } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

const OfferSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('offerSection.title')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {mockOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow p-4 relative">
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-red-600 text-white px-3 py-1 rounded-lg transform rotate-3 shadow-md font-medium text-sm flex items-center justify-center">
                {offer.discount[currentLanguage]}
              </div>
            </div>
            <img
              src={offer.image}
              alt={offer.name[currentLanguage]}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="font-semibold">{offer.name[currentLanguage]}</h3>
            <p className="text-gray-600">{offer.price.toFixed(2)} {currencySymbol}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferSection;