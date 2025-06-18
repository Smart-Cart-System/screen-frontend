import { useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

interface UseTokenExpirationProps {
  token: string | null;
  onTokenExpired: () => void;
  checkInterval?: number; // in milliseconds, default 30 seconds
}

export const useTokenExpiration = ({ 
  token, 
  onTokenExpired, 
  checkInterval = 30000 
}: UseTokenExpirationProps) => {
  
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const bufferTime = 5000; // 5 second buffer to account for network delays
      
      return (expirationTime - bufferTime) <= currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat invalid tokens as expired
    }
  }, []);

  const checkTokenExpiration = useCallback(() => {
    if (!token) return;
    
    if (isTokenExpired(token)) {
      console.log('Token has expired, triggering app state reset');
      onTokenExpired();
    }
  }, [token, isTokenExpired, onTokenExpired]);

  // Check token expiration on mount and periodically
  useEffect(() => {
    if (!token) return;

    // Check immediately on mount
    checkTokenExpiration();
    
    // Set up interval to check periodically
    const interval = setInterval(checkTokenExpiration, checkInterval);
    
    return () => clearInterval(interval);
  }, [token, checkTokenExpiration, checkInterval]);

  return { isTokenExpired: token ? isTokenExpired(token) : false };
};
