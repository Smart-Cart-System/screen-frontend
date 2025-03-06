import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Set dir attribute for RTL/LTR support
    document.documentElement.dir = i18n.dir();
    // Set lang attribute for accessibility
    document.documentElement.lang = lng;
  };

  return (
    <div className="fixed bottom-4 left-20 z-10 bg-white rounded-lg shadow-lg p-1">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{t('common.language')}:</span>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 text-sm rounded-md ${
            currentLanguage === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {t('common.english')}
        </button>
        <button
          onClick={() => changeLanguage('ar')}
          className={`px-2 py-1 text-sm rounded-md ${
            currentLanguage === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {t('common.arabic')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;