import { useState, useEffect } from 'react';
import { NavSection, CartItem } from './types';
import CartView from './components/Cart/CartView';
import Navbar from './components/Navigation/Navbar';
import RightPanel from './components/RightPanel/RightPanel';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import { mockCartItems } from './data/mockData';
import { useTranslation } from 'react-i18next';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('offers');
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Set the correct document direction when language changes
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="flex h-screen">
      <LanguageSwitcher />
      <div className={`flex flex-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {isRTL ? (
          <>
            <RightPanel activeSection={activeSection} />
            <CartView
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </>
        ) : (
          <>
            <CartView
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
            />
            <RightPanel activeSection={activeSection} />
          </>
        )}
        <Navbar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
    </div>
  );
}

export default App;