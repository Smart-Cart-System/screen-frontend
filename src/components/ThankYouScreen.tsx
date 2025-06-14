import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FeedbackScreen from './Feedback/FeedbackScreen';

interface ThankYouScreenProps {
  sessionId: number;
  onComplete: () => void;
  displayDuration?: number; // in milliseconds, default 5 seconds
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ 
  sessionId,
  onComplete, 
  displayDuration = 5000 
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(Math.ceil(displayDuration / 1000));
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-complete timer - show feedback after thank you screen
    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, displayDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [displayDuration]);

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    onComplete();
  };

  const handleFeedbackSkip = () => {
    setShowFeedback(false);
    onComplete();
  };

  const handleContinueNow = () => {
    setShowFeedback(true);
  };

  if (showFeedback) {
    return (
      <FeedbackScreen
        sessionId={sessionId}
        onComplete={handleFeedbackComplete}
        onSkip={handleFeedbackSkip}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg 
              className="w-16 h-16 text-white animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>        {/* Thank You Message */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
            {t('thankYou.title', 'Thank You!')}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-6">
            {t('thankYou.paymentSuccessful', 'Your payment was successful')}
          </p>
          <p className="text-lg text-gray-500">
            {t('thankYou.enjoyShopping', 'Thank you for shopping with DuckyCart!')}
          </p>
        </div>

        {/* Shopping Success Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2M7 13l-2.293 2.293A1 1 0 005 16v6a1 1 0 001 1h1m0 0V9a1 1 0 011-1h2.586l1.414 1.414A1 1 0 0012 10v7a1 1 0 001 1h1m-6 0V9a1 1 0 011-1h2.586l1.414 1.414A1 1 0 0012 10v7a1 1 0 001 1h1" />
              </svg>
            </div>            <p className="text-sm text-gray-600">{t('thankYou.smartShopping', 'Smart Shopping')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{t('thankYou.securePayment', 'Secure Payment')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{t('thankYou.fastCheckout', 'Fast Checkout')}</p>
          </div>
        </div>        {/* Countdown and Next Steps */}
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-600 mb-2">
            {t('thankYou.nextCustomer')}
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {countdown}
          </div>
          <button
            onClick={handleContinueNow}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('thankYou.continue')}
          </button>
        </div>

        {/* Footer Message */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('thankYou.nextCustomerMessage', 'Ready for the next customer')} 🛒
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouScreen;
