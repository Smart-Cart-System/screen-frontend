import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

// Hardcoded password hash (SHA-256 of "admin123")
const ADMIN_PASSWORD_HASH = "21297e6e966afbd06e8f08c4525ae2edcbd3696cc6bc436037e278d4b1e67b4d";

const ConfigScreen: React.FC = () => {
  const [inputCartId, setInputCartId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setCartId } = useCart();

  // Hash password using Web Crypto API
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check password first
      const hashedPassword = await hashPassword(password);
      if (hashedPassword !== ADMIN_PASSWORD_HASH) {
        setError('Invalid admin password. Please contact administrator.');
        setIsLoading(false);
        return;
      }

      // Validate that input is a number
      const cartIdNumber = parseInt(inputCartId.trim(), 10);
      if (isNaN(cartIdNumber) || cartIdNumber <= 0) {
        setError('Please enter a valid cart ID (positive number)');
        setIsLoading(false);
        return;
      }

      // Save to localStorage and reload page
      setCartId(inputCartId.trim());
      window.location.reload();
    } catch (error) {
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cart Setup Required
          </h1>
          <p className="text-gray-600 mt-2">
            Please contact admin to setup Cart
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>

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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Setup Cart'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 text-center">
            <strong>Admin Access Required</strong><br />
            This cart ID will be used to generate QR codes for customer pairing.
            Contact your system administrator for setup assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
