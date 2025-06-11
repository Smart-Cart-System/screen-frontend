// API service for cart and item operations
import { CartItemResponse, ItemReadResponse, ApiCartItem, Promotion, PaymentRequest, PaymentResponse } from "../types";

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

export const createPayment = async (sessionId: number, paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/create-payment/${sessionId}`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(paymentData)
      }
    );

    if (!response.ok) {
      throw new Error(`Payment creation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Payment created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Store Map API functions
export const fetchStoreMap = async (): Promise<{
  positions: Array<{
    id: number;
    x: number;
    y: number;
    is_walkable: boolean;
    aisle_id: number;
  }>;
  connections: Array<[number, number]>;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/layout/map`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch store map: ${response.status}`);
    }

    const data = await response.json();
    console.log('Store map fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching store map:', error);
    throw error;
  }
};

export const navigateToPromotion = async (sessionId: number, targetPromotionId: number): Promise<{
  path: Array<{
    aisle_id: number;
    name: string;
    x: number;
    y: number;
    promotions_count: number;
  }>;
  total_distance: number;
  total_promotions: number;
  target_promotion_id: number;
  target_aisle_id: number;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/layout/navigate`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          session_id: sessionId,
          target_promotion_id: targetPromotionId
        })
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Could not create navigation path. Check that session has a location and promotion exists.');
      }
      throw new Error(`Failed to calculate navigation path: ${response.status}`);
    }

    const data = await response.json();
    console.log('Navigation path calculated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error calculating navigation path:', error);
    throw error;
  }
};

// Promotions API functions
export const fetchAllPromotions = async (skip: number = 0, limit: number = 100): Promise<Array<{
  index: number;
  item_no_: number;
  promotion_description: string;
  discount_amount: number;
  promotion_starting_date: string;
  promotion_ending_date: string;
  product_description: string;
  product_description_ar: string;
  unit_price: number;
  discounted_price: number;
  discount_percentage: number;
  image_url: string;
  aisle_id: number;
  aisle_name: string;
}>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/promotions/?skip=${skip}&limit=${limit}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch promotions: ${response.status}`);
    }

    const data = await response.json();
    console.log('All promotions fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const fetchSessionPromotions = async (sessionId: number, skip: number = 0, limit: number = 100): Promise<Array<{
  index: number;
  item_no_: number;
  promotion_description: string;
  discount_amount: number;
  promotion_starting_date: string;
  promotion_ending_date: string;
  product_description: string;
  product_description_ar: string;
  unit_price: number;
  discounted_price: number;
  discount_percentage: number;
  image_url: string;
  aisle_id: number;
  aisle_name: string;
}>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/promotions/session/${sessionId}?skip=${skip}&limit=${limit}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No location found for this session');
      }
      throw new Error(`Failed to fetch session promotions: ${response.status}`);
    }

    const data = await response.json();
    console.log('Session promotions fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching session promotions:', error);
    throw error;
  }
};

export const fetchAislePromotions = async (aisleId: number): Promise<Array<{
  index: number;
  item_no_: number;
  promotion_description: string;
  discount_amount: number;
  promotion_starting_date: string;
  promotion_ending_date: string;
  product_description: string;
  product_description_ar: string;
  unit_price: number;
  discounted_price: number;
  discount_percentage: number;
  image_url: string;
  aisle_id: number;
  aisle_name: string;
}>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/promotions/aisle/${aisleId}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Aisle not found');
      }
      throw new Error(`Failed to fetch aisle promotions: ${response.status}`);
    }

    const data = await response.json();
    console.log('Aisle promotions fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching aisle promotions:', error);
    throw error;
  }
};
