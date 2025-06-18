import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SatisfactionLevel, FeedbackItem } from '../../types';
import { fetchFeedbackItems, submitFeedback, getFeedbackForSession } from '../../services/api';

interface FeedbackScreenProps {
  sessionId: number;
  onComplete: () => void;
  onSkip: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ sessionId, onComplete, onSkip }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'emoji' | 'items' | 'loading' | 'submitted'>('loading');
  const [selectedSatisfaction, setSelectedSatisfaction] = useState<SatisfactionLevel | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if feedback already exists for this session
  useEffect(() => {
    const checkExistingFeedback = async () => {
      try {
        const existingFeedback = await getFeedbackForSession(sessionId);
        if (existingFeedback) {
          setStep('submitted');
        } else {
          setStep('emoji');
        }
      } catch (error) {
        console.error('Error checking existing feedback:', error);
        setStep('emoji'); // Continue with feedback flow if check fails
      }
    };

    checkExistingFeedback();
  }, [sessionId]);

  const handleSatisfactionSelect = async (satisfaction: SatisfactionLevel) => {
    setSelectedSatisfaction(satisfaction);
    setStep('loading');
    
    try {
      const items = await fetchFeedbackItems(satisfaction);
      setFeedbackItems(items);
      setStep('items');
    } catch (error) {
      console.error('Error fetching feedback items:', error);
      setError('Failed to load feedback options. Please try again.');
      setStep('emoji');
    }
  };

  const handleItemToggle = (itemId: number) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedSatisfaction) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await submitFeedback({
        session_id: sessionId,
        satisfaction: selectedSatisfaction,
        selected_item_ids: selectedItemIds,
        additional_comments: additionalComments.trim() || undefined
      });
      
      setStep('submitted');
      // Auto-complete after 3 seconds
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSatisfactionEmoji = (satisfaction: SatisfactionLevel) => {
    switch (satisfaction) {
      case 'sad': return '😞';
      case 'neutral': return '😐';
      case 'happy': return '😊';
    }
  };

  const getSatisfactionColor = (satisfaction: SatisfactionLevel) => {
    switch (satisfaction) {
      case 'sad': return 'bg-red-500 hover:bg-red-600';
      case 'neutral': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'happy': return 'bg-green-500 hover:bg-green-600';
    }
  };

  if (step === 'loading') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">{t('feedback.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('feedback.thankYou')}</h2>
          <p className="text-gray-600 mb-6">{t('feedback.submitted')}</p>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            {t('feedback.continue')}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'emoji') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('feedback.howWasExperience')}</h2>
            <p className="text-lg text-gray-600">{t('feedback.selectSatisfaction')}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {(['sad', 'neutral', 'happy'] as SatisfactionLevel[]).map((satisfaction) => (
              <button
                key={satisfaction}
                onClick={() => handleSatisfactionSelect(satisfaction)}
                className={`${getSatisfactionColor(satisfaction)} text-white p-8 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              >
                <div className="text-6xl mb-4">{getSatisfactionEmoji(satisfaction)}</div>
                <div className="text-xl font-semibold">{t(`feedback.satisfaction.${satisfaction}`)}</div>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={onSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('feedback.skip')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'items') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getSatisfactionEmoji(selectedSatisfaction!)}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('feedback.tellUsMore')}</h2>
            <p className="text-gray-600">{t('feedback.selectReasons')}</p>
          </div>

          {feedbackItems.length > 0 && (
            <div className="space-y-3 mb-6">
              {feedbackItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 flex-1">{item.text}</span>
                </label>
              ))}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('feedback.additionalComments')}
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder={t('feedback.commentsPlaceholder')}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep('emoji')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('feedback.back')}
            </button>
            <div className="space-x-3">
              <button
                onClick={onSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                {t('feedback.skip')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FeedbackScreen;
