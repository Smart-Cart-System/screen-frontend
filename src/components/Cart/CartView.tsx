import React from 'react';
import { CartItem } from '../../types';
import CartItemCard from './CartItemCard';
import { useTranslation } from 'react-i18next';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartView: React.FC<CartViewProps> = ({ items, onUpdateQuantity }) => {
  const { t } = useTranslation();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="h-screen w-1/2 bg-gray-50 flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{t('cart.title')}</h2>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">{t('cart.empty')}</p>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))
          )}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t shadow-lg p-6">
        <div className="text-xl font-bold flex justify-between items-center">
          <span>{t('cart.total')}</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartView;