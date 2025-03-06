export const mockOffers = [
  {
    id: '1',
    name: 'Fresh Organic Bananas',
    price: 2.99,
    image: 'https://placehold.co/200x200?text=Bananas',
    discount: '20% off'
  },
  {
    id: '2',
    name: 'Whole Grain Bread',
    price: 3.49,
    image: 'https://placehold.co/200x200?text=Bread',
    discount: 'Buy 1 Get 1 Free'
  },
];

export const mockCartItems = [
  {
    id: 'cart1',
    name: 'Organic Milk',
    price: 4.99,
    quantity: 1,
    image: 'https://placehold.co/200x200?text=Milk'
  },
  {
    id: 'cart2',
    name: 'Fresh Apples',
    price: 3.99,
    quantity: 3,
    image: 'https://placehold.co/200x200?text=Apples'
  },
  {
    id: 'cart3',
    name: 'Chicken Breast',
    price: 8.99,
    quantity: 2,
    image: 'https://placehold.co/200x200?text=Chicken'
  },
  {
    id: 'cart4',
    name: 'Pasta',
    price: 1.99,
    quantity: 1,
    image: 'https://placehold.co/200x200?text=Pasta'
  }
];

export const mockShoppingList = [
  { id: '1', name: 'Milk', completed: false },
  { id: '2', name: 'Eggs', completed: true },
  { id: '3', name: 'Bread', completed: false },
];

export const mockFAQs = [
  {
    question: 'How does the smart cart work?',
    answer: 'Our smart cart automatically tracks items as you add them, showing real-time updates on the display.'
  },
  {
    question: 'Can I pay directly through the cart?',
    answer: 'Yes, you can complete your purchase directly through the cart using our secure payment system.'
  },
];

// Updated coordinates to use a 400x300 base grid
export const storeMapSections = [
  { id: 'produce', name: 'Produce', coordinates: { x: 20, y: 20, width: 160, height: 120 } },
  { id: 'dairy', name: 'Dairy', coordinates: { x: 220, y: 20, width: 160, height: 120 } },
  { id: 'bakery', name: 'Bakery', coordinates: { x: 20, y: 160, width: 160, height: 120 } },
  { id: 'meat', name: 'Meat & Seafood', coordinates: { x: 220, y: 160, width: 160, height: 120 } },
];

export const sectionProducts = {
  produce: [
    { id: 'p1', name: 'Organic Apples', price: 3.99, image: 'https://placehold.co/200x200?text=Apples', section: 'produce', inStock: true },
    { id: 'p2', name: 'Fresh Bananas', price: 2.99, image: 'https://placehold.co/200x200?text=Bananas', section: 'produce', inStock: true },
    { id: 'p3', name: 'Carrots', price: 1.99, image: 'https://placehold.co/200x200?text=Carrots', section: 'produce', inStock: true },
  ],
  dairy: [
    { id: 'd1', name: 'Whole Milk', price: 4.99, image: 'https://placehold.co/200x200?text=Milk', section: 'dairy', inStock: true },
    { id: 'd2', name: 'Greek Yogurt', price: 5.99, image: 'https://placehold.co/200x200?text=Yogurt', section: 'dairy', inStock: true },
    { id: 'd3', name: 'Cheese Block', price: 6.99, image: 'https://placehold.co/200x200?text=Cheese', section: 'dairy', inStock: false },
  ],
  bakery: [
    { id: 'b1', name: 'Sourdough Bread', price: 4.99, image: 'https://placehold.co/200x200?text=Sourdough', section: 'bakery', inStock: true },
    { id: 'b2', name: 'Croissants', price: 3.99, image: 'https://placehold.co/200x200?text=Croissants', section: 'bakery', inStock: true },
    { id: 'b3', name: 'Muffins', price: 2.99, image: 'https://placehold.co/200x200?text=Muffins', section: 'bakery', inStock: true },
  ],
  meat: [
    { id: 'm1', name: 'Chicken Breast', price: 8.99, image: 'https://placehold.co/200x200?text=Chicken', section: 'meat', inStock: true },
    { id: 'm2', name: 'Salmon Fillet', price: 12.99, image: 'https://placehold.co/200x200?text=Salmon', section: 'meat', inStock: true },
    { id: 'm3', name: 'Ground Beef', price: 7.99, image: 'https://placehold.co/200x200?text=Beef', section: 'meat', inStock: false },
  ],
};