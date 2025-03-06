import React from 'react';
import { NavSection } from '../../types';
import {
  ShoppingCartIcon,
  MapIcon,
  NewspaperIcon,
  ClipboardIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface NavbarProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'offers' as NavSection, icon: ShoppingCartIcon, label: "Today's Offers" },
    { id: 'map' as NavSection, icon: MapIcon, label: 'Store Map' },
    { id: 'magazine' as NavSection, icon: NewspaperIcon, label: 'Offer Magazine' },
    { id: 'checklist' as NavSection, icon: ClipboardIcon, label: 'Shopping List' },
    { id: 'help' as NavSection, icon: QuestionMarkCircleIcon, label: 'Help' },
    { id: 'checkout' as NavSection, icon: CreditCardIcon, label: 'Checkout' },
  ];

  return (
    <nav className="bg-gray-800 h-screen w-16 fixed right-0 flex flex-col items-center py-4">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onSectionChange(id)}
          className={`p-3 mb-4 rounded-lg ${
            activeSection === id ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          title={label}
        >
          <Icon className="h-6 w-6 text-white" />
        </button>
      ))}
    </nav>
  );
};

export default Navbar;