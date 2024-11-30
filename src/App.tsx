import { useState } from 'react';
import { NavSection, CartItem } from './types';
import CartView from './components/Cart/CartView';
import Navbar from './components/Navigation/Navbar';
import RightPanel from './components/RightPanel/RightPanel';
import { mockCartItems } from './data/mockData';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('offers');
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="flex h-screen">
      <CartView
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
      />
      <RightPanel activeSection={activeSection} />
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </div>
  );
}

export default App;