import React from 'react';
import { CartItemResponse, ApiCartItem } from '../../types';
import CartItemCard from './CartItemCard';
import { useTranslation } from 'react-i18next';

interface CartViewProps {
  cartData: CartItemResponse | null;
  isLoading: boolean;
}

const CartView: React.FC<CartViewProps> = ({ cartData, isLoading }) => {
  const { t } = useTranslation();
  
  // Get the currency symbol from i18n
  const currencySymbol = t('common.currency');
  
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-500">{t('cart.loading')}</p>;
    }
    
    if (!cartData || cartData.items.length === 0) {
      return <p className="text-gray-500">{t('cart.empty')}</p>;
    }
    
    return cartData.items.map((item: ApiCartItem) => (
      <CartItemCard
        key={item.item_id}
        item={item}
      />
    ));
  };

  return (
    <div className="h-screen w-1/2 bg-gray-50 flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{t('cart.title')}</h2>
        <div className="space-y-4">
          {renderContent()}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t shadow-lg p-6">
        <div className="text-xl font-bold flex justify-between items-center">
          <span>{t('cart.total')}</span>
          <span>{(cartData?.total_price?.toFixed(2) || '0.00')} {currencySymbol}</span>
        </div>
      </div>
    </div>
  );
};

export default CartView;