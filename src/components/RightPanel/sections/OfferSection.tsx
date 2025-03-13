import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPromotions } from '../../../services/api';
import { Promotion } from '../../../types';

const OfferSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');
  
  useEffect(() => {
    const getPromotions = async () => {
      try {
        setLoading(true);
        const data = await fetchPromotions();
        setPromotions(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
        setError('Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };
    
    getPromotions();
  }, []);
  
  // Function to format promotion data for display
  const getDiscountText = (promotion: Promotion): string => {
    return currentLanguage === 'en'
      ? `${promotion.discount_percentage.toFixed(0)}% off`
      : `خصم ${promotion.discount_percentage.toFixed(0)}%`;
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('offerSection.title')}</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('offerSection.title')}</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('offerSection.title')}</h2>
      {promotions.length === 0 ? (
        <div className="text-gray-500">{t('offerSection.noPromotions')}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {promotions.map((promotion) => (
            <div key={promotion.item_no_} className="bg-white rounded-lg shadow p-4 relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg transform rotate-3 shadow-md font-medium text-sm flex items-center justify-center">
                  {getDiscountText(promotion)}
                </div>
              </div>
              <img
                src={promotion.image_url || 'https://placehold.co/200x200?text=No+Image'}
                alt={currentLanguage === 'en' ? promotion.product_description : promotion.product_description_ar}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-semibold">
                {currentLanguage === 'en' ? promotion.product_description : promotion.product_description_ar}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">{promotion.discounted_price.toFixed(2)} {currencySymbol}</p>
                <p className="text-gray-400 line-through text-sm">{promotion.unit_price.toFixed(2)} {currencySymbol}</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">{promotion.promotion_description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferSection;