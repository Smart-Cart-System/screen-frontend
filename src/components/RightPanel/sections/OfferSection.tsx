import React from 'react';
import { mockOffers } from '../../../data/mockData';

const OfferSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Today's Offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {mockOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={offer.image}
              alt={offer.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="font-semibold">{offer.name}</h3>
            <p className="text-gray-600">${offer.price.toFixed(2)}</p>
            <p className="text-green-600 font-semibold">{offer.discount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferSection;