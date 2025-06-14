import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuickFeedbackProps {
  onFeedbackClick: () => void;
  className?: string;
}

const QuickFeedback: React.FC<QuickFeedbackProps> = ({ onFeedbackClick, className = '' }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onFeedbackClick}
      className={`flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4.707 4.707z" />
      </svg>
      <span className="text-sm font-medium">{t('feedback.giveFeedback', 'Give Feedback')}</span>
    </button>
  );
};

export default QuickFeedback;
