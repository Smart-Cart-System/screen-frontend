import React, { useState } from 'react';
import { mockShoppingList } from '../../../data/mockData';
import { ShoppingListItem } from '../../../types';
import { useTranslation } from 'react-i18next';

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingListItem[]>(mockShoppingList);
  const [newItem, setNewItem] = useState('');
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar';

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      // Create a new item with support for both languages
      const newItemObj = {
        id: Date.now().toString(),
        name: {
          en: newItem.trim(),
          ar: newItem.trim(), // For simplicity, using same text for both languages
        },
        completed: false
      };
      setItems([...items, newItemObj]);
      setNewItem('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('shoppingList.title')}</h2>
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={t('shoppingList.addNew')}
          className="flex-1 rounded-lg border-gray-300 shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('shoppingList.add')}
        </button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="h-5 w-5 text-blue-500 rounded"
            />
            <span className={`ml-3 ${item.completed ? 'line-through text-gray-400' : ''}`}>
              {item.name[currentLanguage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;