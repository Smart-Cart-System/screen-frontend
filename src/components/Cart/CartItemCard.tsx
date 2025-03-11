import React from 'react';
import { CartItem } from '../../types';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';
  
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={item.image}
        alt={item.name[currentLanguage]}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name[currentLanguage]}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            className="p-1 bg-gray-200 rounded"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span>{item.quantity}</span>
          <button
            className="p-1 bg-gray-200 rounded"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <p className="font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;