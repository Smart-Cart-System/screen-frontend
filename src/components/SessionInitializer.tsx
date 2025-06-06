import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import QRCode from 'react-qr-code';
import { useCart } from '../hooks/useCart';

interface SessionInitializerProps {
  cartId: string;
}

interface JWTPayload {
  cartid: number;
  exp: number;
}

interface SSEEventData {
  session_id: number;
  token: string;
  event_type: string;
}

const SessionInitializer: React.FC<SessionInitializerProps> = ({ cartId }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSessionId, setToken } = useCart();
  const fetchQRToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.duckycart.me/customer-session/qr/${cartId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch QR token: ${response.status}`);
      }
        const token = await response.text();
      // Remove quotes if the response is wrapped in quotes
      const cleanToken = token.replace(/^"|"$/g, '');
      
      console.log('Raw token response:', token);
      console.log('Clean token:', cleanToken);
      console.log('Token length:', cleanToken.length);
      
      setQrToken(cleanToken);
      setIsExpired(false);
      
      // Decode JWT to get expiration time
      try {
        const decoded = jwtDecode<JWTPayload>(cleanToken);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;
        
        if (timeUntilExpiration > 0) {
          // Set timeout to mark as expired when it actually expires
          setTimeout(() => {
            setIsExpired(true);
          }, timeUntilExpiration);
        } else {
          // Token is already expired
          setIsExpired(true);
        }
      } catch (decodeError) {
        console.error('Failed to decode JWT:', decodeError);
        setError('Invalid token received from server');
      }
      
    } catch (err) {
      console.error('Error fetching QR token:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch QR token');
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);  // Setup SSE connection when QR token is available
  useEffect(() => {
    if (!qrToken || isExpired) return;

    console.log('Setting up SSE connection for cart ID:', cartId);
    const sseUrl = `https://api.duckycart.me/sse/${cartId}`;
    console.log('SSE URL:', sseUrl);
    
    const sse = new EventSource(sseUrl);
    
    sse.onopen = (event) => {
      console.log('SSE connection opened successfully:', event);
    };
    
    sse.onmessage = (event) => {
      try {
        console.log('SSE Raw event received:', event);
        console.log('SSE Event data:', event.data);
        
        const data: SSEEventData = JSON.parse(event.data);
        console.log('SSE Parsed event data:', data);
        console.log('SSE Event type:', data.event_type);
        
        if (data.event_type === 'session-started') {
          console.log('Session started event received:', data);
          
          // Store the new token and session ID
          setToken(data.token);
          setSessionId(data.session_id.toString());
          
          console.log('Stored session ID:', data.session_id);
          console.log('Stored token:', data.token);
          
          // Do NOT close the SSE connection - keep it open for debugging
          console.log('SSE session started processed, keeping connection open for debugging');
        } else {
          console.log('SSE Other event type received:', data.event_type, data);
        }
      } catch (parseError) {
        console.error('Failed to parse SSE event data:', parseError);
        console.error('Raw event data was:', event.data);
      }
    };
      sse.onerror = (error) => {
      console.error('SSE connection error:', error);
      console.error('SSE readyState:', sse.readyState);
      console.error('SSE url:', sse.url);
      setError('Connection error. Please try again.');
    };
    
    // NO CLEANUP - KEEP SSE CONNECTION OPEN PERMANENTLY
    console.log('SSE connection established and will remain open');
  }, [qrToken, isExpired, cartId, setToken, setSessionId]);

  const handleQRClick = () => {
    if (!qrToken || !isExpired) {
      // First time or not expired - fetch new token
      fetchQRToken();
    } else {
      // Expired - refresh token
      fetchQRToken();
    }  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Smart Cart Pairing
        </h1>
        
        {!qrToken ? (
          <div>
            <p className="text-gray-600 mb-6">
              Click the button below to start pairing with your mobile app
            </p>
            <button
              onClick={handleQRClick}
              disabled={isLoading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Start Pairing'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Scan this QR code with your mobile app to start shopping
            </p>            <div className="mb-4">
              <div 
                className={`inline-block p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-200 ${
                  isExpired ? 'filter grayscale opacity-75' : 'hover:scale-105'
                }`}
                onClick={isExpired ? handleQRClick : undefined}
              >
                <QRCode 
                  value={qrToken} 
                  size={250}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>
            {isExpired ? (
              <div className="text-red-600">
                <p className="mb-2">QR code has expired</p>
                <p className="text-sm">Click the QR code to generate a new one</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Waiting for mobile app to scan...
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <p className="mt-6 text-xs text-gray-500">
          Cart ID: {cartId}
        </p>
      </div>
    </div>
  );
};

export default SessionInitializer;
