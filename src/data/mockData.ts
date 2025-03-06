export const mockOffers = [
  {
    id: '1',
    name: {
      en: 'Fresh Organic Bananas',
      ar: 'موز عضوي طازج'
    },
    price: 2.99,
    image: 'https://placehold.co/200x200?text=Bananas',
    discount: {
      en: '20% off',
      ar: 'خصم 20%'
    }
  },
  {
    id: '2',
    name: {
      en: 'Whole Grain Bread',
      ar: 'خبز القمح الكامل'
    },
    price: 3.49,
    image: 'https://placehold.co/200x200?text=Bread',
    discount: {
      en: 'Buy 1 Get 1 Free',
      ar: 'اشتر 1 واحصل على 1 مجاناً'
    }
  },
];

export const mockCartItems = [
  {
    id: 'cart1',
    name: {
      en: 'Organic Milk',
      ar: 'حليب عضوي'
    },
    price: 4.99,
    quantity: 1,
    image: 'https://placehold.co/200x200?text=Milk'
  },
  {
    id: 'cart2',
    name: {
      en: 'Fresh Apples',
      ar: 'تفاح طازج'
    },
    price: 3.99,
    quantity: 3,
    image: 'https://placehold.co/200x200?text=Apples'
  },
  {
    id: 'cart3',
    name: {
      en: 'Chicken Breast',
      ar: 'صدور دجاج'
    },
    price: 8.99,
    quantity: 2,
    image: 'https://placehold.co/200x200?text=Chicken'
  },
  {
    id: 'cart4',
    name: {
      en: 'Pasta',
      ar: 'معكرونة'
    },
    price: 1.99,
    quantity: 1,
    image: 'https://placehold.co/200x200?text=Pasta'
  }
];

export const mockShoppingList = [
  { id: '1', name: { en: 'Milk', ar: 'حليب' }, completed: false },
  { id: '2', name: { en: 'Eggs', ar: 'بيض' }, completed: true },
  { id: '3', name: { en: 'Bread', ar: 'خبز' }, completed: false },
];

export const mockFAQs = [
  {
    question: {
      en: 'How does the smart cart work?',
      ar: 'كيف تعمل العربة الذكية؟'
    },
    answer: {
      en: 'Our smart cart automatically tracks items as you add them, showing real-time updates on the display.',
      ar: 'تتبع عربتنا الذكية العناصر تلقائيًا عند إضافتها، وتعرض تحديثات في الوقت الفعلي على الشاشة.'
    }
  },
  {
    question: {
      en: 'Can I pay directly through the cart?',
      ar: 'هل يمكنني الدفع مباشرة من خلال العربة؟'
    },
    answer: {
      en: 'Yes, you can complete your purchase directly through the cart using our secure payment system.',
      ar: 'نعم، يمكنك إتمام عملية الشراء مباشرة من خلال العربة باستخدام نظام الدفع الآمن لدينا.'
    }
  },
];

// Updated coordinates to use a 400x300 base grid
export const storeMapSections = [
  { id: 'produce', name: { en: 'Produce', ar: 'خضروات وفواكه' }, coordinates: { x: 20, y: 20, width: 160, height: 120 } },
  { id: 'dairy', name: { en: 'Dairy', ar: 'منتجات الألبان' }, coordinates: { x: 220, y: 20, width: 160, height: 120 } },
  { id: 'bakery', name: { en: 'Bakery', ar: 'مخبوزات' }, coordinates: { x: 20, y: 160, width: 160, height: 120 } },
  { id: 'meat', name: { en: 'Meat & Seafood', ar: 'لحوم ومأكولات بحرية' }, coordinates: { x: 220, y: 160, width: 160, height: 120 } },
];

export const sectionProducts = {
  produce: [
    { id: 'p1', name: { en: 'Organic Apples', ar: 'تفاح عضوي' }, price: 3.99, image: 'https://placehold.co/200x200?text=Apples', section: 'produce', inStock: true },
    { id: 'p2', name: { en: 'Fresh Bananas', ar: 'موز طازج' }, price: 2.99, image: 'https://placehold.co/200x200?text=Bananas', section: 'produce', inStock: true },
    { id: 'p3', name: { en: 'Carrots', ar: 'جزر' }, price: 1.99, image: 'https://placehold.co/200x200?text=Carrots', section: 'produce', inStock: true },
  ],
  dairy: [
    { id: 'd1', name: { en: 'Whole Milk', ar: 'حليب كامل الدسم' }, price: 4.99, image: 'https://placehold.co/200x200?text=Milk', section: 'dairy', inStock: true },
    { id: 'd2', name: { en: 'Greek Yogurt', ar: 'زبادي يوناني' }, price: 5.99, image: 'https://placehold.co/200x200?text=Yogurt', section: 'dairy', inStock: true },
    { id: 'd3', name: { en: 'Cheese Block', ar: 'قطعة جبن' }, price: 6.99, image: 'https://placehold.co/200x200?text=Cheese', section: 'dairy', inStock: false },
  ],
  bakery: [
    { id: 'b1', name: { en: 'Sourdough Bread', ar: 'خبز العجين المخمر' }, price: 4.99, image: 'https://placehold.co/200x200?text=Sourdough', section: 'bakery', inStock: true },
    { id: 'b2', name: { en: 'Croissants', ar: 'كرواسون' }, price: 3.99, image: 'https://placehold.co/200x200?text=Croissants', section: 'bakery', inStock: true },
    { id: 'b3', name: { en: 'Muffins', ar: 'كعك المافن' }, price: 2.99, image: 'https://placehold.co/200x200?text=Muffins', section: 'bakery', inStock: true },
  ],
  meat: [
    { id: 'm1', name: { en: 'Chicken Breast', ar: 'صدور دجاج' }, price: 8.99, image: 'https://placehold.co/200x200?text=Chicken', section: 'meat', inStock: true },
    { id: 'm2', name: { en: 'Salmon Fillet', ar: 'فيليه سلمون' }, price: 12.99, image: 'https://placehold.co/200x200?text=Salmon', section: 'meat', inStock: true },
    { id: 'm3', name: { en: 'Ground Beef', ar: 'لحم بقري مفروم' }, price: 7.99, image: 'https://placehold.co/200x200?text=Beef', section: 'meat', inStock: false },
  ],
};