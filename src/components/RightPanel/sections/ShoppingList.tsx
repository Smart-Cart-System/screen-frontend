import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Checklist, ChecklistItem } from '../../../types';
import { useTranslation } from 'react-i18next';
import { fetchPinnedChecklist, updateChecklistItem } from '../../../services/api';

const ShoppingList: React.FC = () => {
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const intervalRef = useRef<number | null>(null);

  const loadPinnedChecklist = useCallback(async () => {
    console.log('🔄 Loading pinned checklist...');
    try {
      const pinnedChecklist = await fetchPinnedChecklist();
      console.log('✅ Checklist loaded:', pinnedChecklist);
      setChecklist(pinnedChecklist);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load pinned checklist:', err);
      setError(t('shoppingList.failed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load pinned checklist on component mount and set up polling
  useEffect(() => {
    console.log('🚀 ShoppingList component mounted, starting polling...');
    
    // Load initially
    loadPinnedChecklist();
    
    // Set up polling interval
    intervalRef.current = window.setInterval(() => {
      console.log('⏰ Polling interval triggered');
      loadPinnedChecklist();
    }, 10000); // Poll every 10 seconds

    // Cleanup on unmount
    return () => {
      console.log('🛑 ShoppingList component unmounting, clearing interval...');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loadPinnedChecklist]);

  const toggleItem = async (item: ChecklistItem) => {
    if (!checklist) return;

    try {
      // Optimistically update the UI
      const updatedItems = checklist.items.map(i =>
        i.id === item.id ? { ...i, checked: !i.checked } : i
      );
      setChecklist({ ...checklist, items: updatedItems });

      // Update on server
      await updateChecklistItem(checklist.id, item.id, { checked: !item.checked });
    } catch (err) {
      console.error('Failed to update item:', err);
      // Revert optimistic update on error
      const revertedItems = checklist.items.map(i =>
        i.id === item.id ? { ...i, checked: item.checked } : i
      );
      setChecklist({ ...checklist, items: revertedItems });
      setError(t('shoppingList.updateFailed'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('shoppingList.title')}</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">{t('shoppingList.loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('shoppingList.title')}</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">{error}</div>
        </div>
        <button
          onClick={loadPinnedChecklist}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('shoppingList.retry')}
        </button>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('shoppingList.title')}</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 text-center">
            <p>{t('shoppingList.noChecklist')}</p>
            <p className="text-sm mt-2">{t('shoppingList.pinFromMobile')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('shoppingList.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {t('shoppingList.pinnedFrom')} "{checklist.name}"
        </p>
      </div>
      
      <div className="space-y-2">
        {checklist.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item)}
              className="h-5 w-5 text-blue-500 rounded cursor-pointer"
            />
            <span 
              className={`ml-3 cursor-pointer flex-1 ${
                item.checked ? 'line-through text-gray-400' : ''
              }`}
              onClick={() => toggleItem(item)}
            >
              {item.text}
            </span>
          </div>
        ))}
        
        {checklist.items.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            {t('shoppingList.empty')}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400 text-center">
        {t('shoppingList.syncedWith')}
      </div>
    </div>
  );
};

export default ShoppingList;