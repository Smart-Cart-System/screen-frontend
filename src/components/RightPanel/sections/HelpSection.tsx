import React from 'react';
import { mockFAQs } from '../../../data/mockData';

const HelpSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      <div className="space-y-4">
        {mockFAQs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Need More Help?</h3>
        <button
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => alert('Support request submitted!')}
        >
          Request Support
        </button>
      </div>
    </div>
  );
};

export default HelpSection;