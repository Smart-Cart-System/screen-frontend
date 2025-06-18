import React from 'react';
import { ItemReadResponse } from '../../types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ItemPreviewProps {
  item: ItemReadResponse | null;
  onClose: () => void;
}

const ItemPreview: React.FC<ItemPreviewProps> = ({ item, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';

  if (!item) return null;

  const itemName = currentLanguage === 'en' ? item.description : item.description_ar;
  const placeholderImage = 'https://placehold.co/300x300?text=Preview';
  
  // Use image_url if available, fallback to placeholder
  const imageUrl = item.image_url || placeholderImage;
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{t('preview.title')}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <img
            src={imageUrl} 
            alt={itemName}
            className="w-40 h-40 object-contain rounded"
          />
          
          <div className="w-full text-center">
            <h4 className="font-medium text-lg">{itemName}</h4>
            <p className="text-gray-600">{item.product_size}</p>
            <p className="text-lg font-bold mt-2">{item.unit_price.toFixed(2)} {currencySymbol}</p>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            {t('preview.beingScanned')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPreview;