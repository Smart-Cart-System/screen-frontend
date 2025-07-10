import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../hooks/useCart';
import { createPayment } from '../../../services/api';
import { PaymentStatus } from '../../../types';
import { CartWebSocket, CartWebSocketMessage } from '../../../services/websocket';

const Checkout: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { t } = useTranslation();
  const { sessionId, resetSession } = useCart();

  // WebSocket connection for payment notifications
  useEffect(() => {
    if (!sessionId) return;

    const sessionIdNum = parseInt(sessionId, 10);
    if (isNaN(sessionIdNum)) return;

    const wsClient = new CartWebSocket(sessionIdNum);
    
    const handlePaymentMessage = (message: CartWebSocketMessage) => {
      switch (message.type) {        
        case 'Payment successful':
          console.log('💳 Payment successful in Checkout component, clearing session');
          setPaymentStatus('success');
          setPaymentError(null);
          setIsCreatingPayment(false);
          setShowPaymentModal(false);
          // Clear session ID and auth token from localStorage immediately on payment success
          resetSession();
          break;
        case 'payment-failed':
          setPaymentStatus('failed');
          setPaymentError(message.data?.message || t('checkout.paymentFailed'));
          setIsCreatingPayment(false);
          setShowPaymentModal(false);
          break;
        case 'payment-retrying':
          setPaymentStatus('retrying');
          setPaymentError(null);
          break;
      }
    };

    wsClient.addMessageHandler(handlePaymentMessage);
    wsClient.connect();

    return () => {
      wsClient.removeMessageHandler(handlePaymentMessage);
      wsClient.disconnect();
    };
  }, [sessionId, t]);

  const handleCreatePayment = async () => {
    if (!sessionId) {
      setPaymentError(t('checkout.noSession'));
      return;
    }

    setIsCreatingPayment(true);
    setPaymentStatus('processing');
    setPaymentError(null);    
    
    try {
      // Create payment - the backend will handle payment processing
      // The mobile app will complete the actual payment
      await createPayment(parseInt(sessionId, 10), { payment_method: 'card' });
      
      // Payment created successfully, show modal and wait for mobile app completion
      setPaymentStatus('processing');
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Payment creation failed:', error);
      setPaymentStatus('failed');
      setPaymentError(error instanceof Error ? error.message : t('checkout.creationFailed'));
      setIsCreatingPayment(false);
    }
  };
  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentError(null);
    setIsCreatingPayment(false);
    setShowPaymentModal(false);
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'processing':
        return isCreatingPayment ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-blue-600">{t('checkout.creating')}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-pulse rounded-full h-8 w-8 bg-yellow-500 mx-auto mb-4"></div>
            <p className="text-lg text-yellow-600 font-semibold">{t('checkout.paymentCreated')}</p>
            <p className="text-sm text-gray-600 mt-2">{t('checkout.completeOnPhone')}</p>
            <p className="text-xs text-gray-500 mt-4">{t('checkout.waitingForPayment')}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="rounded-full h-8 w-8 bg-green-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-green-600 font-semibold">{t('checkout.paymentSuccess')}</p>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center">
            <div className="rounded-full h-8 w-8 bg-red-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-semibold">{t('checkout.paymentFailed')}</p>
            {paymentError && (
              <p className="text-sm text-red-500 mt-2">{paymentError}</p>
            )}
          </div>
        );
      case 'retrying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-lg text-orange-600">{t('checkout.paymentRetrying')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('checkout.title')}</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        {paymentStatus === 'idle' ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600 mb-6">
              {t('checkout.completeOnPhone')}
            </p>
            <button
              className="w-full py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleCreatePayment}
              disabled={!sessionId || isCreatingPayment}
            >
              {t('checkout.createPayment')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {getStatusDisplay()}
            
            {(paymentStatus === 'failed' || paymentStatus === 'success') && (
              <div className="space-y-3">
                <button
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={resetPayment}
                >
                  {paymentStatus === 'success' 
                    ? t('checkout.createAnother')
                    : t('checkout.createPayment')
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="animate-pulse rounded-full h-16 w-16 bg-blue-500 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('checkout.modal.sessionComplete')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('checkout.modal.payOnPhone')}
              </p>
              <div className="text-sm text-gray-500">
                {t('checkout.modal.sessionEnded')}
              </div>
            </div>
            
            <div className="animate-pulse text-blue-600 font-medium">
              {t('checkout.modal.waitingPayment')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;