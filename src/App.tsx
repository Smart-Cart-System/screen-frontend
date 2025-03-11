import { useState, useEffect, useCallback, useRef } from 'react';
import { NavSection, CartItemResponse, ItemReadResponse } from './types';
import CartView from './components/Cart/CartView';
import Navbar from './components/Navigation/Navbar';
import RightPanel from './components/RightPanel/RightPanel';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import ItemPreview from './components/Preview/ItemPreview';
import { useTranslation } from 'react-i18next';
import { CartWebSocket, CartWebSocketMessage } from './services/websocket';
import { fetchCartItems, fetchItemByBarcode } from './services/api';

// For testing purposes - these would normally come from authentication
// const DEFAULT_CART_ID = 1;
const DEFAULT_SESSION_ID = 3;

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('offers');
  const [cartData, setCartData] = useState<CartItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previewItem, setPreviewItem] = useState<ItemReadResponse | null>(null);
  const webSocketRef = useRef<CartWebSocket | null>(null);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Set the correct document direction when language changes
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Load cart data function
  const loadCartData = useCallback(async () => {
    console.log('🛒 Loading cart data...');
    setIsLoading(true);
    try {
      const data = await fetchCartItems(DEFAULT_SESSION_ID);
      console.log('Cart data loaded:', data);
      setCartData(data);
    } catch (error) {
      console.error('Failed to load cart data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: CartWebSocketMessage) => {
    console.log('🔔 WebSocket message handler called with:', message);
    
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
        });
    }
  }, [loadCartData]);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection...');
    
    // Initialize WebSocket only if it hasn't been initialized yet
    if (!webSocketRef.current) {
      const ws = new CartWebSocket(DEFAULT_SESSION_ID);
      webSocketRef.current = ws;
      
      // Add the message handler to the WebSocket
      ws.addMessageHandler(handleWebSocketMessage);
      console.log('Added message handler to WebSocket');
      
      // Connect after the handler is set up
      ws.connect();
      console.log('WebSocket connect called');
    } else {
      console.log('WebSocket already initialized, reusing existing connection');
      // If WebSocket is already initialized, just add the handler
      webSocketRef.current.addMessageHandler(handleWebSocketMessage);
    }
    
    // Fetch initial cart data
    loadCartData();
    
    // For testing purposes, log a message every 5 seconds to verify component is still alive
    const intervalId = setInterval(() => {
      if (webSocketRef.current?.handlers?.length === 0) {
        console.warn('⚠️ No message handlers attached to WebSocket!');
      }
      console.log('🔄 App component is still alive, WebSocket should be active');
    }, 5000);
    
    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      clearInterval(intervalId);
      if (webSocketRef.current) {
        webSocketRef.current.removeMessageHandler(handleWebSocketMessage);
        if (webSocketRef.current.handlers.length === 0) {
          webSocketRef.current.disconnect();
        }
      }
    };
  }, [handleWebSocketMessage, loadCartData]);

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

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
    </div>
  );
}

export default App;