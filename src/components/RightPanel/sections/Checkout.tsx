import React, { useState } from 'react';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                paymentMethod === 'card'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit Card
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                paymentMethod === 'cash'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              Cash
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="**** **** **** ****"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="***"
                />
              </div>
            </div>
          </form>
        )}

        <button
          className="mt-6 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => alert('Payment processed!')}
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
};

export default Checkout;