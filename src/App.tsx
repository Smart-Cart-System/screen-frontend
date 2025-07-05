import { useState, useEffect, useCallback, useRef } from 'react';
import { NavSection, CartItemResponse, ItemReadResponse, WeightErrorType } from './types';
import CartView from './components/Cart/CartView';
import Navbar from './components/Navigation/Navbar';
import RightPanel from './components/RightPanel/RightPanel';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import ItemPreview from './components/Preview/ItemPreview';
import WeightErrorPopup from './components/Preview/WeightErrorPopup';
import ConfigScreen from './components/ConfigScreen';
import SessionInitializer from './components/SessionInitializer';
import ThankYouScreen from './components/ThankYouScreen';
import { useTranslation } from 'react-i18next';
import { CartWebSocket, CartWebSocketMessage } from './services/websocket';
import { fetchCartItems, fetchItemByBarcode } from './services/api';
import { useCart } from './hooks/useCart';
import { useTokenExpiration } from './hooks/useTokenExpiration';
import './utils/generatePasswordHash'; // For development password hash generation

function App() {
  const { cartId, sessionId, token, resetSession } = useCart();
  const [activeSection, setActiveSection] = useState<NavSection>('offers');
  const [cartData, setCartData] = useState<CartItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previewItem, setPreviewItem] = useState<ItemReadResponse | null>(null);
  const [weightError, setWeightError] = useState<WeightErrorType>(null);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const webSocketRef = useRef<CartWebSocket | null>(null);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  // Debug logging
  console.log('App render - cartId:', cartId, 'sessionId:', sessionId, 'token:', token);  console.log('App render - current state:', {
    hasCartId: !!cartId,
    hasSessionId: !!sessionId,
    hasToken: !!token,
    cartDataItems: cartData?.items?.length || 0
  });  // Handle token expiration
  const handleTokenExpired = useCallback(() => {
    console.log('🔐 Token expired, resetting session state (preserving cart ID)');
    
    // Disconnect WebSocket if connected
    if (webSocketRef.current) {
      console.log('Disconnecting WebSocket due to token expiration');
      webSocketRef.current.disconnect();
      webSocketRef.current = null;
    }
    
    // Clear session-related state and data
    setCartData(null);
    setPreviewItem(null);
    setWeightError(null);
    setActiveSection('offers');
    setIsLoading(false);
    setShowThankYou(false);
    
    // Reset session data only (this will trigger re-render and show SessionInitializer)
    // Cart ID will be preserved for reconnection
    resetSession();
  }, [resetSession]);

  // Check token expiration
  useTokenExpiration({
    token,
    onTokenExpired: handleTokenExpired,
    checkInterval: 30000 // Check every 30 seconds
  });

  // Listen for token expiration events from API calls
  useEffect(() => {
    const handleApiTokenExpired = () => {
      console.log('🔐 Token expired event received from API call');
      handleTokenExpired();
    };

    window.addEventListener('tokenExpired', handleApiTokenExpired);
    
    return () => {
      window.removeEventListener('tokenExpired', handleApiTokenExpired);
    };
  }, [handleTokenExpired]);

  // Set the correct document direction when language changes
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  // Load cart data function
  const loadCartData = useCallback(async () => {
    if (!sessionId) return;
    
    console.log('🛒 Loading cart data...');
    setIsLoading(true);
    try {
      const data = await fetchCartItems(parseInt(sessionId, 10));
      console.log('Cart data loaded:', data);
      setCartData(data);
    } catch (error) {
      console.error('Failed to load cart data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: CartWebSocketMessage) => {
    console.log('🔔 WebSocket message handler called with:', message);
    console.log('🔔 Message type received:', JSON.stringify(message.type));
    
    // Extract barcode from message data
    let barcode: number | null = null;
    
    if (message.data) {
      if (typeof message.data === 'number') {
        barcode = message.data;
      } else if (typeof message.data === 'object' && message.data && 'barcode' in message.data) {
        barcode = message.data.barcode;
      }
    }
    
    console.log('Extracted barcode:', barcode);
    
    if (message.type === 'cart-updated') {
      console.log('🛒 Cart updated, refreshing data...');
      // Clear weight error when cart is updated
      setWeightError(null);
      // Refresh cart data
      loadCartData();
    } else if (message.type === 'item-read' && barcode) {
      console.log('📱 Item scanned, fetching preview for barcode:', barcode);
      // Show preview for scanned item
      fetchItemByBarcode(barcode)
        .then(itemInfo => {
          console.log('Item preview fetched:', itemInfo);
          setPreviewItem(itemInfo);
        })
        .catch(error => {
          console.error('Failed to fetch preview item:', error);
        });    } else if (message.type === 'weight increased') {
      console.log('⚠️ Weight increased detected');
      setWeightError('increased');
    } else if (message.type === 'weight decreased') {
      console.log('⚠️ Weight decreased detected');
      setWeightError('decreased');    } else if (message.type === 'Payment successful') {
      console.log('💳 Payment successful, showing thank you screen');
      setShowThankYou(true);
      // Note: Session will be cleared when thank you screen is completed
    }
  }, [loadCartData]);  // Initialize WebSocket connection
  useEffect(() => {
    if (!sessionId) return;
    
    console.log('🔌 Initializing WebSocket connection for session:', sessionId);
    console.log('🔌 Current WebSocket ref status:', webSocketRef.current ? 'exists' : 'null');
    
    // Always disconnect existing WebSocket if it exists
    if (webSocketRef.current) {
      console.log('Disconnecting existing WebSocket');
      webSocketRef.current.disconnect();
      webSocketRef.current = null;
    }
    
    // Create new WebSocket connection with current session ID
    const ws = new CartWebSocket(parseInt(sessionId, 10));
    webSocketRef.current = ws;
    
    // Add the message handler to the WebSocket
    ws.addMessageHandler(handleWebSocketMessage);
    console.log('Added message handler to WebSocket');
    console.log('WebSocket handlers count after adding:', ws.handlers.length);
    
    // Connect after the handler is set up
    ws.connect();
    console.log('WebSocket connect called for session:', sessionId);
    
    // Fetch initial cart data
    loadCartData();
    // For testing purposes, log a message every 5 seconds to verify component is still alive
    const intervalId = setInterval(() => {
      if (webSocketRef.current?.handlers?.length === 0) {
        console.warn('⚠️ No message handlers attached to WebSocket!');
      }
      console.log('🔄 App component is still alive, WebSocket should be active');
      console.log('🔄 Current WebSocket handlers count:', webSocketRef.current?.handlers?.length || 0);
    }, 5000);
    
    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      console.log('🔌 WebSocket handlers count before cleanup:', webSocketRef.current?.handlers?.length || 0);
      clearInterval(intervalId);
      if (webSocketRef.current) {
        webSocketRef.current.removeMessageHandler(handleWebSocketMessage);
        console.log('🔌 WebSocket handlers count after removing handler:', webSocketRef.current.handlers.length);
        if (webSocketRef.current.handlers.length === 0) {
          console.log('🔌 No more handlers, disconnecting WebSocket');
          webSocketRef.current.disconnect();
        }
      }
    };
  }, [handleWebSocketMessage, loadCartData, sessionId]);
  const handleClosePreview = () => {
    setPreviewItem(null);
  };  const handleThankYouComplete = () => {
    console.log('🎉 Thank you screen completed, resetting UI state');
    console.log('🎉 Current state before reset:', { cartId, sessionId, token });
    setShowThankYou(false);
    
    // Reset all UI state and return to SessionInitializer
    if (webSocketRef.current) {
      console.log('Disconnecting WebSocket due to session completion');
      webSocketRef.current.disconnect();
      webSocketRef.current = null;
    }
    
    // Clear UI state
    setCartData(null);
    setPreviewItem(null);
    setWeightError(null);
    setActiveSection('offers');
    setIsLoading(false);
    
    // Clear session data now (after thank you screen is completed)
    console.log('🔐 Clearing session data after thank you screen completion');
    resetSession();
    
    console.log('🎉 UI state reset complete, should return to SessionInitializer');
  };
  // Conditional rendering AFTER all hooks have been called
  if (!cartId) {
    console.log('No cartId, showing ConfigScreen');
    return <ConfigScreen />;
  }

  if (!sessionId) {
    console.log('No sessionId, showing SessionInitializer');
    return <SessionInitializer cartId={cartId} />;
  }
  if (showThankYou) {
    console.log('Payment completed, showing ThankYou screen');
    return <ThankYouScreen sessionId={parseInt(sessionId!, 10)} onComplete={handleThankYouComplete} />;
  }

  console.log('Both cartId and sessionId available, showing main cart interface');
  return (
    <div className="flex h-screen">
      <LanguageSwitcher />
      <div className={`flex flex-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {isRTL ? (
          <>
            <RightPanel activeSection={activeSection} />
            <CartView
              cartData={cartData}
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <CartView
              cartData={cartData}
              isLoading={isLoading}
            />
            <RightPanel activeSection={activeSection} />
          </>
        )}
        <Navbar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      
      {/* Item Preview Popup */}
      {previewItem && (
        <ItemPreview 
          item={previewItem} 
          onClose={handleClosePreview} 
        />
      )}      
      {/* Weight Error Popup */}
      <WeightErrorPopup errorType={weightError} />
    </div>
  );
}

export default App;
