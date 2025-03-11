import React from 'react';
import { mockFAQs } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

const HelpSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('help.title')}</h2>
      <div className="space-y-4">
        {mockFAQs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">{faq.question[currentLanguage]}</h3>
            <p className="text-gray-600">{faq.answer[currentLanguage]}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">{t('help.needMoreHelp')}</h3>
        <button
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => alert(t('help.supportRequested'))}
        >
          {t('help.requestSupport')}
        </button>
      </div>
    </div>
  );
};

export default HelpSection;