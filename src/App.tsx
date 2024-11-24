import React, { useState } from 'react';
import './App.css';

type Page = 'offers' | 'page1' | 'page2' | 'page3';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('offers');

  const handlePageChange = (page: Page) => {
    setActivePage(page);
  };

  return (
    <div className="shopping-cart-screen">
      {/* Main Content */}
      <div className="main-content">
        {/* Cart View */}
        <section className="cart-view">
          <h2>Your Cart</h2>
          <p>Items in your cart: 0</p>
          {/* Display cart items here */}
        </section>

        {/* Offers/Other Pages */}
        <section className="page-view">
          {activePage === 'offers' && <div>Offers Page</div>}
          {activePage === 'page1' && <div>Page 1 Content</div>}
          {activePage === 'page2' && <div>Page 2 Content</div>}
          {activePage === 'page3' && <div>Page 3 Content</div>}
        </section>
      </div>

      {/* Sidebar (on the right) */}
      <aside className="sidebar">
        <button onClick={() => handlePageChange('offers')}>Offers</button>
        <button onClick={() => handlePageChange('page1')}>Page 1</button>
        <button onClick={() => handlePageChange('page2')}>Page 2</button>
        <button onClick={() => handlePageChange('page3')}>Page 3</button>
      </aside>
    </div>
  );
};

export default App;
