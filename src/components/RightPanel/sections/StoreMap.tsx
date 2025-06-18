import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StoreMapData, NavigationPath } from '../../../types';
import { fetchStoreMap } from '../../../services/api';

const StoreMap: React.FC = () => {
  const { t } = useTranslation();
  const [mapData, setMapData] = useState<StoreMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAisle, setSelectedAisle] = useState<number | null>(null);
  const [navigationPath, setNavigationPath] = useState<NavigationPath | null>(null);  // Load store map on component mount
  useEffect(() => {
    const loadStoreMap = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStoreMap();
        setMapData(data);
      } catch (err) {
        console.error('Failed to load store map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load store map');
      } finally {
        setLoading(false);
      }
    };

    loadStoreMap();
  }, []);
  const handleAisleClick = (aisleId: number) => {
    setSelectedAisle(aisleId);
    // Clear any existing navigation path when selecting a new aisle
    setNavigationPath(null);
  };

  const isAisleInPath = (aisleId: number): boolean => {
    return navigationPath?.path.some(pathAisle => pathAisle.aisle_id === aisleId) || false;
  };

  const getAisleName = (aisleId: number): string => {
    if (navigationPath) {
      const pathAisle = navigationPath.path.find(p => p.aisle_id === aisleId);
      if (pathAisle) return pathAisle.name;
    }
    return `Aisle ${aisleId}`;
  };
  if (loading) {
    return (
      <div className="space-y-6 max-w-full pr-4">
        <h2 className="text-2xl font-bold">{t('storeMap.title')}</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">{t('storeMap.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-full pr-4">
        <h2 className="text-2xl font-bold">{t('storeMap.title')}</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{t('storeMap.error')}: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {t('storeMap.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="space-y-6 max-w-full pr-4">
        <h2 className="text-2xl font-bold">{t('storeMap.title')}</h2>
        <p>No map data available</p>
      </div>
    );
  }

  // Calculate map bounds
  const minX = Math.min(...mapData.positions.map(p => p.x));
  const maxX = Math.max(...mapData.positions.map(p => p.x));
  const minY = Math.min(...mapData.positions.map(p => p.y));
  const maxY = Math.max(...mapData.positions.map(p => p.y));
  const mapWidth = maxX - minX + 1;
  const mapHeight = maxY - minY + 1;
  return (
    <div className="space-y-6 max-w-full pr-4">      <h2 className="text-2xl font-bold">{t('storeMap.title')}</h2>
      
      {/* Navigation Path Display */}
      {navigationPath && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">{t('storeMap.navigation')}</h3>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-700">
              {t('storeMap.pathFound')} {t('storeMap.distance')}: {navigationPath.total_distance} {t('storeMap.steps')}, 
              {t('storeMap.promotionsAlongPath')}: {navigationPath.total_promotions}
            </p>
            <div className="mt-2">
              <p className="text-xs text-gray-600">Path:</p>
              {navigationPath.path.map((aisle, index) => (
                <span key={aisle.aisle_id} className="text-xs">
                  {aisle.name}
                  {index < navigationPath.path.length - 1 ? ' → ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Store Map Grid */}
      <div className="relative w-full bg-gray-100 rounded-lg border overflow-auto" style={{ minHeight: '400px' }}>
        <div 
          className="relative"
          style={{
            width: `${mapWidth * 60}px`,
            height: `${mapHeight * 60}px`,
            margin: '20px auto'
          }}
        >
          {/* Render connections as lines */}
          <svg 
            className="absolute inset-0 pointer-events-none" 
            width="100%" 
            height="100%"
            style={{ zIndex: 1 }}
          >
            {mapData.connections.map(([from, to], index) => {
              const fromPos = mapData.positions.find(p => p.aisle_id === from);
              const toPos = mapData.positions.find(p => p.aisle_id === to);
              
              if (!fromPos || !toPos) return null;
              
              const x1 = (fromPos.x - minX) * 60 + 30;
              const y1 = (fromPos.y - minY) * 60 + 30;
              const x2 = (toPos.x - minX) * 60 + 30;
              const y2 = (toPos.y - minY) * 60 + 30;
              
              return (
                <line
                  key={`connection-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#cbd5e0"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Highlight navigation path */}
            {navigationPath && navigationPath.path.length > 1 && 
              navigationPath.path.slice(0, -1).map((aisle, index) => {
                const currentPos = mapData.positions.find(p => p.aisle_id === aisle.aisle_id);
                const nextAisle = navigationPath.path[index + 1];
                const nextPos = mapData.positions.find(p => p.aisle_id === nextAisle.aisle_id);
                
                if (!currentPos || !nextPos) return null;
                
                const x1 = (currentPos.x - minX) * 60 + 30;
                const y1 = (currentPos.y - minY) * 60 + 30;
                const x2 = (nextPos.x - minX) * 60 + 30;
                const y2 = (nextPos.y - minY) * 60 + 30;
                
                return (
                  <line
                    key={`nav-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#3b82f6"
                    strokeWidth="4"
                  />
                );
              })
            }
          </svg>

          {/* Render aisle positions */}
          {mapData.positions.map((position) => {
            const x = (position.x - minX) * 60;
            const y = (position.y - minY) * 60;
            const isSelected = selectedAisle === position.aisle_id;
            const isInPath = isAisleInPath(position.aisle_id);
            const isWalkable = position.is_walkable;
            
            return (
              <div
                key={position.id}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: '60px',
                  height: '60px',
                  zIndex: 2
                }}
                className={`
                  border-2 cursor-pointer transition-all duration-200 rounded-lg
                  flex items-center justify-center text-xs font-medium
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-100 scale-110' 
                    : isInPath
                    ? 'border-green-500 bg-green-100'
                    : isWalkable
                    ? 'border-gray-400 bg-white hover:border-blue-300 hover:bg-blue-50'
                    : 'border-red-400 bg-red-100'
                  }
                `}
                onClick={() => isWalkable && handleAisleClick(position.aisle_id)}
                title={`${getAisleName(position.aisle_id)} (${position.x}, ${position.y})`}
              >
                <div className="text-center">
                  <div className="text-xs font-bold">{position.aisle_id}</div>
                  {!isWalkable && <div className="text-red-600">✕</div>}
                  {isInPath && <div className="text-green-600">→</div>}
                </div>
              </div>
            );          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">{t('storeMap.legend')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-gray-400 bg-white rounded mr-2"></div>
            <span>{t('storeMap.walkableAisle')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-red-400 bg-red-100 rounded mr-2"></div>
            <span>{t('storeMap.nonWalkable')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 bg-blue-100 rounded mr-2"></div>
            <span>{t('storeMap.selected')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded mr-2"></div>
            <span>{t('storeMap.navigationPath')}</span>
          </div>
        </div>
      </div>      {/* Selected Aisle Info */}
      {selectedAisle && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">{t('storeMap.selectedAisle')}: {getAisleName(selectedAisle)}</h3>
          <p className="text-sm text-gray-600">
            {t('storeMap.aisleInfo')}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreMap;