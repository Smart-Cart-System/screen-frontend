export interface CartItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  quantity: number;
  image: string;
}

export interface ShoppingListItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  completed: boolean;
}

export type NavSection = 'offers' | 'map' | 'checklist' | 'help' | 'checkout';

export interface StoreSection {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SectionProduct {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  image: string;
  section: string;
  inStock: boolean;
}

// API Response Types based on the OpenAPI schema
export interface CartItemResponse {
  items: ApiCartItem[];
  total_price: number;
  item_count: number;
}

export interface ApiCartItem {
  session_id: number;
  item_id: number;
  quantity: number;
  saved_weight: number | null;
  product: ApiProduct | null;
}

export interface ApiProduct {
  item_no_: number;
  description: string;
  description_ar: string;
  unit_price: number;
  product_size: string;
  barcode?: number;
  image_url?: string; // Added image_url field
  image?: string; // Keeping the old field for backwards compatibility
}

export interface ItemReadResponse {
  item_no_: number;
  description: string;
  description_ar: string;
  unit_price: number;
  product_size: string;
  barcode?: number;
  image_url?: string;
}

export interface Session {
  user_id: number;
  cart_id: number;
  session_id: number;
  created_at: string;
  is_active: boolean;
}

// For the preview popup
export interface PreviewItem extends ItemReadResponse {
  isPreview: boolean;
}

// Weight error type
export type WeightErrorType = 'increased' | 'decreased' | null;

// Promotion interface based on API data
export interface Promotion {
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
  image_url: string | null;
}

export interface PromotionResponse {
  promotions: Promotion[];
}

// Promotion Types
export interface PromotionItem {
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
}

// Payment related types
export interface PaymentRequest {
  payment_method: 'card' | 'cash';
  card_details?: {
    card_number: string;
    expiry_date: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  payment_id: string;
  session_id: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: 'card' | 'cash';
  created_at: string;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'retrying';

// WebSocket payment message types
export interface PaymentWebSocketMessage {
  type: 'payment-success' | 'payment-failed' | 'payment-retrying';
  data?: {
    payment_id: string;
    session_id: number;
    message?: string;
  };
}

// Store Map Types
export interface StorePosition {
  id: number;
  x: number;
  y: number;
  is_walkable: boolean;
  aisle_id: number;
}

export interface StoreMapData {
  positions: StorePosition[];
  connections: Array<[number, number]>;
}

export interface NavigationAisle {
  aisle_id: number;
  name: string;
  x: number;
  y: number;
  promotions_count: number;
}

export interface NavigationPath {
  path: NavigationAisle[];
  total_distance: number;
  total_promotions: number;
  target_promotion_id: number;
  target_aisle_id: number;
}