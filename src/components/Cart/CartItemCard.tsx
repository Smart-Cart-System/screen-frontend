import React from 'react';
import { ApiCartItem } from '../../types';
import { useTranslation } from 'react-i18next';

interface CartItemCardProps {
  item: ApiCartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  if (!item.product) {
    return null; // If no product data, don't render
  }

  const itemName = currentLanguage === 'en' 
    ? item.product.description 
    : item.product.description_ar;
  
  const placeholderImage = 'https://placehold.co/200x200?text=Product';
  // Use image_url if available, fallback to image field, then placeholder
  const imageUrl = item.product.image_url || item.product.image || placeholderImage;
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');
  
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={imageUrl}
        alt={itemName}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{itemName}</h3>
        <p className="text-gray-600">{item.product.unit_price.toFixed(2)} {currencySymbol}</p>
        <p className="text-sm text-gray-500">{item.product.product_size}</p>
        <div className="mt-2">
          <span className="font-medium">Qty: {item.quantity}</span>
        </div>
      </div>
      <div className="flex items-center">
        <p className="font-semibold">
          {(item.product.unit_price * item.quantity).toFixed(2)} {currencySymbol}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;