// API service for cart and item operations
import { CartItemResponse, ItemReadResponse } from "../types";

const API_BASE_URL = "https://duckycart.me";

export const fetchCartItems = async (sessionId: number): Promise<CartItemResponse> => {
  console.log(`Fetching cart items for session: ${sessionId}`);
  
  try {
    // Direct API call with no fancy options
    const response = await fetch(`${API_BASE_URL}/cart-items/session/${sessionId}`);
    console.log('Response status:', response.status);
    
    // Get response as text first
    const text = await response.text();
    console.log('Response text:', text);
    
    // Try to parse JSON
    const data = text ? JSON.parse(text) : {};
    console.log('Parsed data:', data);
    
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
    const response = await fetch(`${API_BASE_URL}/items/read/${barcode}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};
