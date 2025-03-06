export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
}

export type NavSection = 'offers' | 'map' | 'magazine' | 'checklist' | 'help' | 'checkout';

export interface StoreSection {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SectionProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  section: string;
  inStock: boolean;
}