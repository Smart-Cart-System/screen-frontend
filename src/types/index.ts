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

export type NavSection = 'offers' | 'map' | 'magazine' | 'checklist' | 'help' | 'checkout';

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
  image?: string; // Assuming this might be available
}

export interface ItemReadResponse {
  item_no_: number;
  description: string;
  description_ar: string;
  unit_price: number;
  product_size: string;
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