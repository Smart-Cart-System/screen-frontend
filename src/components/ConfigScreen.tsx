import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

const ConfigScreen: React.FC = () => {
  const [inputCartId, setInputCartId] = useState('');
  const [error, setError] = useState('');
  const { setCartId } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that input is a number
    const cartIdNumber = parseInt(inputCartId.trim(), 10);
    if (isNaN(cartIdNumber) || cartIdNumber <= 0) {
      setError('Please enter a valid cart ID (positive number)');
      return;
    }

    // Save to localStorage and reload page
    setCartId(inputCartId.trim());
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Cart Configuration
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="cartId" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cart ID
            </label>
            <input
              type="text"
              id="cartId"
              value={inputCartId}
              onChange={(e) => {
                setInputCartId(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter cart ID (e.g., 123)"
              required
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Save Configuration
          </button>
        </form>
        
        <p className="mt-4 text-xs text-gray-500 text-center">
          This cart ID will be used to generate QR codes for customer pairing.
        </p>
      </div>
    </div>
  );
};

export default ConfigScreen;
