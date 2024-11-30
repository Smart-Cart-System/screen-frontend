import React from 'react';
import { CartItem } from '../../types';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            -
          </button>
          <span className="mx-3">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;