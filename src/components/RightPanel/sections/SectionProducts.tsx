import React from 'react';
import { SectionProduct } from '../../../types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface SectionProductsProps {
  sectionName: string;
  products: SectionProduct[];
  onBack: () => void;
}

const SectionProducts: React.FC<SectionProductsProps> = ({
  sectionName,
  products,
  onBack,
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold">{sectionName}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={product.image}
              alt={product.name[currentLanguage]}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="font-semibold">{product.name[currentLanguage]}</h3>
            <p className="text-gray-600">{product.price.toFixed(2)} {currencySymbol}</p>
            {!product.inStock && (
              <p className="text-red-500 text-sm mt-2">{t('common.outOfStock')}</p>
            )}
            {product.inStock && (
              <button className="mt-2 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {t('common.addToCart')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionProducts;