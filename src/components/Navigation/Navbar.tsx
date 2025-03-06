import React from 'react';
import { NavSection } from '../../types';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const navItems = [
    { id: 'offers' as NavSection, icon: ShoppingCartIcon, label: t('navbar.offers') },
    { id: 'map' as NavSection, icon: MapIcon, label: t('navbar.map') },
    { id: 'magazine' as NavSection, icon: NewspaperIcon, label: t('navbar.magazine') },
    { id: 'checklist' as NavSection, icon: ClipboardIcon, label: t('navbar.checklist') },
    { id: 'help' as NavSection, icon: QuestionMarkCircleIcon, label: t('navbar.help') },
    { id: 'checkout' as NavSection, icon: CreditCardIcon, label: t('navbar.checkout') },
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