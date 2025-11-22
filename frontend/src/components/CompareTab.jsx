import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

// Helper component to display animal silhouettes
const AnimalSilhouette = ({ animal, className = 'w-8 h-8' }) => {
  const { theme } = useTheme();
  if (!animal) return null;
  
  const isDark = theme === 'dark';
  // Map animal names to file names
  const animalNameMap = {
    'deer': 'Deer',
    'elk': 'Elk',
    'bear': 'Bear',
    'moose': 'Moose',
    'turkey': 'Turkey',
    'hogs': 'Boar', // Wild Hog maps to Boar
    'boar': 'Boar',
    'caribou': 'Caribou'
  };
  
  const animalName = animalNameMap[animal.toLowerCase()] || (animal.charAt(0).toUpperCase() + animal.slice(1).replace(/s$/, ''));
  const silhouettePath = `/silhouettes/${animalName}-${isDark ? 'White' : 'Black'}.svg`;
  
  return (
    <img 
      src={silhouettePath} 
      alt={animal}
      className={className}
      title={animal.charAt(0).toUpperCase() + animal.slice(1).replace(/s$/, '')}
      onError={(e) => { 
        console.warn(`Failed to load silhouette for ${animal}: ${silhouettePath}`);
        e.target.style.display = 'none'; 
      }}
    />
  );
};

// Color palette for builds
const BUILD_COLORS = [
  'bg-blue-500 dark:bg-gray-600',
  'bg-green-500 dark:bg-green-400',
  'bg-orange-500 dark:bg-orange-400',
  'bg-purple-500 dark:bg-purple-400',
  'bg-pink-500 dark:bg-pink-400',
  'bg-yellow-500 dark:bg-yellow-400',
  'bg-red-500 dark:bg-red-400',
  'bg-cyan-500 dark:bg-cyan-400'
];

const BUILD_COLORS_TEXT = [
  'text-blue-600 dark:text-gray-300',
  'text-green-600 dark:text-green-400',
  'text-orange-600 dark:text-orange-400',
  'text-purple-600 dark:text-purple-400',
  'text-pink-600 dark:text-pink-400',
  'text-yellow-600 dark:text-yellow-400',
  'text-red-600 dark:text-red-400',
  'text-cyan-600 dark:text-cyan-400'
];

const BUILD_COLORS_BORDER = [
  'border-blue-500 dark:border-gray-600',
  'border-green-500 dark:border-green-400',
  'border-orange-500 dark:border-orange-400',
  'border-purple-500 dark:border-purple-400',
  'border-pink-500 dark:border-pink-400',
  'border-yellow-500 dark:border-yellow-400',
  'border-red-500 dark:border-red-400',
  'border-cyan-500 dark:border-cyan-400'
];

export default function CompareTab({ savedBuilds }) {
  const { theme } = useTheme();
  const [selectedBuilds, setSelectedBuilds] = useState([]);
  const [buildsToCompare, setBuildsToCompare] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    if (selectedBuilds.length > 0) {
      const builds = savedBuilds.filter(b => selectedBuilds.includes(b._id));
      setBuildsToCompare(builds);
    } else {
      setBuildsToCompare([]);
    }
  }, [selectedBuilds, savedBuilds]);

  const toggleBuildSelection = (buildId) => {
    setSelectedBuilds(prev => {
      if (prev.includes(buildId)) {
        return prev.filter(id => id !== buildId);
      } else if (prev.length < 8) {
        return [...prev, buildId];
      }
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedBuilds([]);
  };

  const calculateTotal = (build) => {
    return build.components.reduce((sum, c) => sum + (c.grains || 0), 0);
  };

  const calculateFOC = (build) => {
    const { components, arrowLength } = build;
    const length = parseFloat(arrowLength || 28);
    const tip = components.find(c => c.name === 'tip')?.grains || 0;
    const insert = components.find(c => c.name === 'insert')?.grains || 0;
    const shaft = components.find(c => c.name === 'shaft')?.grains || 0;
    const fletching = components.find(c => c.name === 'fletching')?.grains || 0;
    const knock = components.find(c => c.name === 'knock')?.grains || 0;
    const total = tip + insert + shaft + fletching + knock;

    if (total === 0) return 0;

    const balancePoint =
      ((tip * length) +
        (insert * (length - 1)) +
        (shaft * (length / 2)) +
        (fletching * (length - 2)) +
        (knock * 0)) / total;

    const foc = ((balancePoint - (length / 2)) / length) * 100;
    return parseFloat(foc.toFixed(1));
  };

  const getComponentValue = (build, componentName) => {
    const comp = build.components.find(c => c.name === componentName);
    return comp ? comp.grains : 0;
  };

  const getMaxValue = (values) => {
    return Math.max(...values, 1);
  };

  const BarChart = ({ label, values, maxValue, formatValue }) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{label}</h3>
        <div className="space-y-3">
          {buildsToCompare.map((build, index) => {
            const value = values[index];
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const colorClass = BUILD_COLORS[index % BUILD_COLORS.length];
            const textColorClass = BUILD_COLORS_TEXT[index % BUILD_COLORS_TEXT.length];
            
            return (
              <div key={build._id} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                  {build.name}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} transition-all duration-500 ease-out rounded-full flex items-center justify-end pr-3`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-xs font-semibold text-white dark:text-gray-900">
                          {formatValue ? formatValue(value) : value}
                        </span>
                      )}
                    </div>
                  </div>
                  {percentage <= 15 && (
                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold ${textColorClass}`}>
                      {formatValue ? formatValue(value) : value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const builds = Array.isArray(savedBuilds) ? savedBuilds : [];
  const totalPages = Math.max(1, Math.ceil(builds.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBuilds = builds.slice(startIndex, endIndex);

  // Get selected build objects for display
  const selectedBuildObjects = builds.filter(b => selectedBuilds.includes(b._id));

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Compare Builds</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select up to 8 builds to compare with visual charts and detailed metrics.
          </p>
        </div>
        {selectedBuilds.length > 0 && (
          <button
            onClick={clearSelection}
            className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-800 text-white rounded shadow transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 transform relative overflow-hidden"
          >
            <span className="relative z-10">Clear ({selectedBuilds.length})</span>
            {theme === 'light' && (
              <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
            )}
            {theme === 'dark' && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
            )}
          </button>
        )}
      </div>

      {/* Selected Builds Summary Bar */}
      {selectedBuilds.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800/40 border border-blue-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-blue-900 dark:text-gray-200">Selected:</span>
            {selectedBuildObjects.map((build, index) => {
              const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'B' : 'A';
              return (
              <div
                key={build._id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${BUILD_COLORS[index % BUILD_COLORS.length]} text-white`}
              >
                  {build.animal && <AnimalSilhouette animal={build.animal} className="w-4 h-4" />}
                  <span className="font-bold">{typeLabel}</span>
                  <span className="truncate max-w-[100px]">{build.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBuildSelection(build._id);
                    }}
                    className="ml-1 hover:bg-black/20 rounded px-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Condensed Build Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select Builds {selectedBuilds.length > 0 && `(${selectedBuilds.length}/8 selected)`}
          </h3>
          {builds.length > pageSize && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded relative overflow-hidden ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="relative z-10">Prev</span>
                {currentPage > 1 && (
                  <>
                    {theme === 'light' && (
                      <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                    )}
                    {theme === 'dark' && (
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                    )}
                  </>
                )}
              </button>
              <span className="text-gray-600 dark:text-gray-400">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded relative overflow-hidden ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="relative z-10">Next</span>
                {currentPage < totalPages && (
                  <>
                    {theme === 'light' && (
                      <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                    )}
                    {theme === 'dark' && (
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {builds.length === 0 ? (
            <div className="col-span-full text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              No saved builds to compare. Create and save some builds first.
            </div>
          ) : (
            currentBuilds.map((build) => {
              const isSelected = selectedBuilds.includes(build._id);
              const selectedIndex = selectedBuilds.indexOf(build._id);
              const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow';
              const isBolt = typeLabel === 'Bolt';
              const colorClass = isSelected ? BUILD_COLORS_BORDER[selectedIndex % BUILD_COLORS_BORDER.length] : '';
              
              return (
                <div
                  key={build._id}
                  onClick={() => toggleBuildSelection(build._id)}
                  className={`p-2 rounded border-2 cursor-pointer transition transform ${
                    isSelected
                      ? `${colorClass} bg-opacity-10 dark:bg-opacity-20 scale-105`
                      : 'border-gray-200 dark:border-gray-600 hover:border-blaze-400 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate flex-1">{build.name}</h4>
                    {isSelected && (
                      <div className={`w-3 h-3 rounded-full ${BUILD_COLORS[selectedIndex % BUILD_COLORS.length]} flex-shrink-0`} />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {build.animal && (
                      <AnimalSilhouette animal={build.animal} className="w-5 h-5" />
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isBolt
                          ? 'bg-orange-500 dark:bg-orange-600/30 text-white dark:text-orange-200'
                          : 'bg-blaze dark:bg-blaze/70 text-white dark:text-blaze-100'
                      }`}
                    >
                      {typeLabel.charAt(0)}
                    </span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      {calculateTotal(build).toFixed(0)}gr | {calculateFOC(build).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Comparison Results */}
      {buildsToCompare.length > 0 && (
        <div className="space-y-8">
          {/* Visual Bar Charts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Visual Comparison</h3>
            
            {/* Total Weight Comparison */}
            <BarChart
              label="Total Weight (grains)"
              values={buildsToCompare.map(b => calculateTotal(b))}
              maxValue={getMaxValue(buildsToCompare.map(b => calculateTotal(b)))}
              formatValue={(v) => `${v.toFixed(0)} gr`}
            />

            {/* FOC Comparison */}
            <BarChart
              label="Front of Center (FOC) %"
              values={buildsToCompare.map(b => calculateFOC(b))}
              maxValue={getMaxValue(buildsToCompare.map(b => Math.abs(calculateFOC(b))))}
              formatValue={(v) => `${v.toFixed(1)}%`}
            />

            {/* Component Comparisons */}
            {['knock', 'fletching', 'shaft', 'insert', 'tip'].map((compName) => (
              <BarChart
                key={compName}
                label={`${compName.charAt(0).toUpperCase() + compName.slice(1)} Weight (grains)`}
                values={buildsToCompare.map(b => getComponentValue(b, compName))}
                maxValue={getMaxValue(buildsToCompare.map(b => getComponentValue(b, compName)))}
                formatValue={(v) => `${v.toFixed(0)} gr`}
              />
            ))}
          </div>

          {/* Detailed Table Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h3 className="text-xl font-bold mb-4 p-6 pb-0 text-gray-900 dark:text-white">Detailed Comparison Table</h3>
            <div className="overflow-x-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Metric</th>
                    {buildsToCompare.map((build, index) => (
                      <th key={build._id} className="px-4 py-3 text-center font-semibold min-w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${BUILD_COLORS[index % BUILD_COLORS.length]}`} />
                          <div>
                            <div className="text-gray-900 dark:text-white">{build.name}</div>
                            <div className="text-xs font-normal text-gray-600 dark:text-gray-400">
                              {(build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow'}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['knock', 'fletching', 'shaft', 'insert', 'tip'].map((compName) => (
                    <tr key={compName} className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{compName.charAt(0).toUpperCase() + compName.slice(1)}</td>
                      {buildsToCompare.map((build, index) => (
                        <td key={build._id} className={`px-4 py-3 text-center text-gray-700 dark:text-gray-300 ${BUILD_COLORS_TEXT[index % BUILD_COLORS_TEXT.length]}`}>
                          {getComponentValue(build, compName)} gr
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Total Weight</td>
                    {buildsToCompare.map((build, index) => (
                      <td key={build._id} className={`px-4 py-3 text-center font-bold ${BUILD_COLORS_TEXT[index % BUILD_COLORS_TEXT.length]}`}>
                        {calculateTotal(build).toFixed(0)} gr
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">FOC %</td>
                    {buildsToCompare.map((build, index) => {
                      const foc = calculateFOC(build);
                      const isGoodFOC = foc >= 10 && foc <= 20;
                      return (
                        <td key={build._id} className={`px-4 py-3 text-center font-bold ${isGoodFOC ? 'text-green-500' : 'text-red-500'}`}>
                          {foc.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Length</td>
                    {buildsToCompare.map((build, index) => (
                      <td key={build._id} className={`px-4 py-3 text-center text-gray-700 dark:text-gray-300 ${BUILD_COLORS_TEXT[index % BUILD_COLORS_TEXT.length]}`}>
                        {build.arrowLength}"
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">GPI</td>
                    {buildsToCompare.map((build, index) => (
                      <td key={build._id} className={`px-4 py-3 text-center text-gray-700 dark:text-gray-300 ${BUILD_COLORS_TEXT[index % BUILD_COLORS_TEXT.length]}`}>
                        {build.gpi || 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {buildsToCompare.length === 0 && builds.length > 0 && (
        <div className="bg-blue-50 dark:bg-gray-800/40 border border-blue-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <p className="text-blue-800 dark:text-gray-200">
            Select builds above to see a visual comparison with bar charts and detailed metrics.
          </p>
        </div>
      )}
    </div>
  );
}
