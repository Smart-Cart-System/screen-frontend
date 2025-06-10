// API service for cart and item operations
import { CartItemResponse, ItemReadResponse, ApiCartItem, Promotion } from "../types";

const API_BASE_URL = "https://api.duckycart.me";

// Get the authentication token from localStorage
const getAuthToken = (): string => {
  const token = localStorage.getItem('auth_token');
  // Fallback to hardcoded token for testing if no real token is available
  return token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbWFyIiwiZXhwIjoxNzQ1OTI3MjIyfQ.2uCMiozrIWseDpuTVIxBv4949m7Y4JhuvdUtMa6WEM8";
};

// Common headers for all API requests
const getHeaders = () => {
  return {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  };
};

export const fetchCartItems = async (sessionId: number): Promise<CartItemResponse> => {
  console.log(`Fetching cart items for session: ${sessionId}`);
  
  try {
    // API call with auth headers
    const response = await fetch(
      `${API_BASE_URL}/cart-items/session/${sessionId}`, 
      { headers: getHeaders() }
    );
    console.log('Response status:', response.status);
    
    // Get response as text first
    const text = await response.text();
    console.log('Response text:', text);
    
    // Try to parse JSON
    const data = text ? JSON.parse(text) : {};
    console.log('Parsed data:', data);
    
    // Process items to ensure image_url is used when available
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item: ApiCartItem) => {
        if (item.product) {
          // No need to modify anything; the type definitions now handle image_url
          return item;
        }
        return item;
      });
    }
    
    // Return with fallbacks for missing properties
    return {
      items: data.items || [],
      total_price: data.total_price || 0,
      item_count: data.item_count || 0
    };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    // Return empty data on error rather than throwing
    return {
      items: [],
      total_price: 0,
      item_count: 0
    };
  }
};

export const fetchItemByBarcode = async (barcode: number): Promise<ItemReadResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/read/${barcode}`,
      { headers: getHeaders() }
    );
    const data = await response.json();
    
    // Log the received data to confirm image_url is present
    console.log('Item data received:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

export const fetchPromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/promotions/`,
      { headers: getHeaders() }
    );
    
    // Get response as text first for debugging
    const text = await response.text();
    console.log('Promotions response text:', text);
    
    // Parse the JSON
    const data = text ? JSON.parse(text) : [];
    console.log('Parsed promotions data:', data);
    
    // Return the promotions array or an empty array if not found
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return []; // Return empty array on error
  }
};
