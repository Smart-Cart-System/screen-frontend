// filepath: c:\Users\omara\Desktop\VSCODE\Graduation\screen-frontend\src\components\Preview\WeightErrorPopup.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WeightErrorType } from '../../types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface WeightErrorPopupProps {
  errorType: WeightErrorType;
}

const WeightErrorPopup: React.FC<WeightErrorPopupProps> = ({ errorType }) => {
  const { t } = useTranslation();

  if (!errorType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex flex-col items-center mb-4 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold">{t('weightError.title')}</h3>
          
          <div className="my-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 w-full">
            <p className="font-medium mb-2">
              {errorType === 'increased' 
                ? t('weightError.increased') 
                : t('weightError.decreased')
              }
            </p>
            <p className="text-gray-600">
              {t('weightError.scanRequest')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightErrorPopup;