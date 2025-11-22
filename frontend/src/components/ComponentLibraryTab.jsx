import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

const COMPONENT_LIBRARY = {
  knock: [
    { name: 'Standard Nock', weight: 12, brand: 'Generic', material: 'Plastic' },
    { name: 'Lumenok', weight: 16, brand: 'Lumenok', material: 'Plastic' },
    { name: 'Fuse Nock', weight: 14, brand: 'Fuse', material: 'Carbon' },
    { name: 'Press-Fit Nock', weight: 13, brand: 'Generic', material: 'Plastic' },
    { name: 'Lighted Nock Pro', weight: 18, brand: 'Nockturnal', material: 'Plastic' }
  ],
  fletching: [
    { name: 'Standard 3-Fletch', weight: 20, brand: 'Generic', material: 'Feather' },
    { name: '4-Fletch Standard', weight: 28, brand: 'Generic', material: 'Feather' },
    { name: 'Vanetec 3-Fletch', weight: 22, brand: 'Vanetec', material: 'Plastic' },
    { name: 'Bohning 3-Fletch', weight: 24, brand: 'Bohning', material: 'Plastic' },
    { name: 'Blazer 2-Fletch', weight: 16, brand: 'Blazer', material: 'Plastic' }
  ],
  shaft: [
    { name: 'Easton FMJ', gpi: 10.2, brand: 'Easton', material: 'Carbon/Aluminum' },
    { name: 'Carbon Express Maxima', gpi: 9.8, brand: 'Carbon Express', material: 'Carbon' },
    { name: 'Gold Tip Hunter', gpi: 10.5, brand: 'Gold Tip', material: 'Carbon' },
    { name: 'Victory VAP', gpi: 9.2, brand: 'Victory', material: 'Carbon' },
    { name: 'Black Eagle X-Impact', gpi: 11.5, brand: 'Black Eagle', material: 'Carbon' }
  ],
  insert: [
    { name: 'Standard Insert', weight: 40, brand: 'Generic', material: 'Aluminum' },
    { name: 'Heavy Insert', weight: 70, brand: 'Generic', material: 'Aluminum' },
    { name: 'Tungsten Insert', weight: 100, brand: 'Generic', material: 'Tungsten' },
    { name: 'Half-Out Insert', weight: 60, brand: 'Generic', material: 'Aluminum' },
    { name: 'Weighted Insert', weight: 80, brand: 'Generic', material: 'Brass' }
  ],
  tip: [
    { name: '100gr Broadhead', weight: 100, brand: 'Generic', material: 'Steel' },
    { name: '125gr Broadhead', weight: 125, brand: 'Generic', material: 'Steel' },
    { name: '150gr Broadhead', weight: 150, brand: 'Generic', material: 'Steel' },
    { name: '175gr Broadhead', weight: 175, brand: 'Generic', material: 'Steel' },
    { name: '200gr Broadhead', weight: 200, brand: 'Generic', material: 'Steel' },
    { name: 'Field Point 100gr', weight: 100, brand: 'Generic', material: 'Steel' },
    { name: 'Field Point 125gr', weight: 125, brand: 'Generic', material: 'Steel' }
  ]
};

export default function ComponentLibraryTab({ onSelectComponent }) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('knock');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.keys(COMPONENT_LIBRARY);
  const filteredComponents = COMPONENT_LIBRARY[selectedCategory].filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectComponent = (component) => {
    if (onSelectComponent) {
      onSelectComponent({
        category: selectedCategory,
        component: component,
        weight: component.weight || (component.gpi ? `${component.gpi} GPI` : null)
      });
    } else {
      // If no callback, switch to calculator tab and load component
      window.dispatchEvent(new CustomEvent('loadComponent', { 
        detail: { category: selectedCategory, component } 
      }));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Component Library</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Browse common arrow and bolt components with their specifications. Click a component to use its weight.
      </p>

      <div className="mb-6">
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded capitalize transition-all duration-300 ease-out relative overflow-hidden ${
                selectedCategory === cat
                  ? 'bg-blaze text-white shadow-md transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-sm hover:scale-102 active:scale-95'
              }`}
            >
              <span className="relative z-10">{cat}</span>
              {selectedCategory === cat && (
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
          ))}
        </div>

        <input
          type="text"
          placeholder={`Search ${selectedCategory}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComponents.map((component, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectComponent(component)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{component.name}</h3>
              <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-gray-800 text-blue-800 dark:text-gray-200">
                {component.brand}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {component.weight ? `${component.weight} gr` : `${component.gpi} GPI`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Material:</span>
                <span className="text-gray-900 dark:text-white">{component.material}</span>
              </div>
            </div>
            <button
              className="mt-3 w-full px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors relative overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectComponent(component);
              }}
            >
              <span className="relative z-10">Use Weight</span>
              {theme === 'light' && (
                <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
              )}
              {theme === 'dark' && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

