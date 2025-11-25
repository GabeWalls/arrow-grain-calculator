import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../context/AuthContext';
import PresetsTab from './PresetsTab';
import ComponentLibraryTab from './ComponentLibraryTab';
import CompareTab from './CompareTab';
import API_BASE_URL from '../config/api';

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

export default function WorkspaceTab({ savedBuilds, setSavedBuilds, onLoadPreset, onOpenAuthModal }) {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('presets');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef({});
  
  // Update underline position when active section changes
  useEffect(() => {
    const activeButton = buttonRefs.current[activeSection];
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const navRect = activeButton.closest('nav')?.getBoundingClientRect();
      if (navRect) {
        setUnderlineStyle({
          width: rect.width,
          left: rect.left - navRect.left,
        });
      }
    }
  }, [activeSection]);

  const sections = [
    { id: 'presets', label: 'Presets', iconName: 'Presets' },
    { id: 'library', label: 'Component Library', iconName: 'Library' },
    { id: 'saved', label: 'Saved Builds', iconName: 'Builds' },
    { id: 'compare', label: 'Compare', iconName: 'Compare' },
    { id: 'export', label: 'Export', iconName: 'Export' }
  ];

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((Array.isArray(savedBuilds) ? savedBuilds.length : 0) / pageSize));
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [savedBuilds, pageSize, page]);

  const fetchBuilds = async () => {
    if (!isAuthenticated) {
      if (setSavedBuilds) {
        setSavedBuilds([]);
      }
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/builds`);
      const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
      if (setSavedBuilds) {
        setSavedBuilds(items);
      }
    } catch (err) {
      console.error('Error fetching builds:', err);
      if (setSavedBuilds) {
        setSavedBuilds([]);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && (activeSection === 'saved' || activeSection === 'export')) {
      fetchBuilds();
    } else if (!isAuthenticated) {
      if (setSavedBuilds) {
        setSavedBuilds([]);
      }
    }
  }, [isAuthenticated, activeSection]);

  const handleDeleteBuild = async (id) => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) {
        onOpenAuthModal('login');
      }
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/api/builds/${id}`);
      fetchBuilds();
    } catch (err) {
      console.error('Error deleting build:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        if (onOpenAuthModal) {
          onOpenAuthModal('login');
        }
      } else {
        alert('Error deleting build.');
      }
    }
  };

  const handleLoadBuild = (build) => {
    // Dispatch event to load build in CalculatorTab
    // App.js will listen for this and switch to calculator tab
    window.dispatchEvent(new CustomEvent('loadBuild', { detail: build }));
  };

  // Saved Builds Section
  const SavedBuildsSection = () => {
    const builds = Array.isArray(savedBuilds) ? savedBuilds : [];
    const totalPages = Math.max(1, Math.ceil(builds.length / pageSize));
    const startIdx = (page - 1) * pageSize;
    const pageItems = builds.slice(startIdx, startIdx + pageSize);
    const goToPage = (p) => setPage(Math.min(totalPages, Math.max(1, p)));
    const prevPage = () => goToPage(page - 1);
    const nextPage = () => goToPage(page + 1);

    return (
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Saved Builds</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          View and manage your saved arrow and bolt builds. Click "Load" to load a build into the calculator.
        </p>

        {builds.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No saved builds yet. Create and save some builds in the Calculator tab.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {pageItems.map((build) => {
                const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow';
                const isBolt = typeLabel === 'Bolt';
                const totalWeight = build.components.reduce((sum, c) => sum + (c.grains || 0), 0);

                return (
                  <div key={build._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold truncate">{build.name}</div>
                      <div className="flex items-center gap-3">
                        {build.animal && (
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full p-1">
                            <AnimalSilhouette animal={build.animal} className="w-6 h-6" />
                          </div>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            isBolt
                              ? 'bg-orange-500 dark:bg-orange-600/30 border border-orange-600 dark:border-orange-500 text-white dark:text-orange-200'
                              : 'bg-blaze dark:bg-blaze/70 border border-blaze dark:border-blaze-600 text-white dark:text-blaze-100'
                          }`}
                        >
                          {typeLabel}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(build.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="mb-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {build.components.map((c, idx) => (
                        <div key={idx}>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}: {c.grains} grains</div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 font-semibold">
                        Total: {totalWeight} grains • {build.arrowLength}" • GPI: {build.gpi || 'N/A'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadBuild(build)}
                        className="flex-1 bg-blaze hover:bg-blaze-600 active:bg-blaze-700 px-3 py-2 rounded text-sm text-white transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 transform relative overflow-hidden"
                      >
                        <span className="relative z-10">Load</span>
                        {theme === 'light' && (
                          <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                        )}
                        {theme === 'dark' && (
                          <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteBuild(build._id)}
                        className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-3 py-2 rounded text-sm text-white transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 transform relative overflow-hidden"
                      >
                        <span className="relative z-10">Delete</span>
                        {theme === 'light' && (
                          <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                        )}
                        {theme === 'dark' && (
                          <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {builds.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevPage}
                    disabled={page <= 1}
                    className={`px-3 py-1 rounded text-sm relative overflow-hidden ${
                      page <= 1
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="relative z-10">Prev</span>
                    {page > 1 && (
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page <strong>{page}</strong> / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={nextPage}
                    disabled={page >= totalPages}
                    className={`px-3 py-1 rounded text-sm relative overflow-hidden ${
                      page >= totalPages
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="relative z-10">Next</span>
                    {page < totalPages && (
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm"
                  >
                    {[4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Export Section
  const ExportSection = () => {
    const [selectedBuild, setSelectedBuild] = useState(null);

    const exportToText = (build) => {
      const lines = [
        `Arrow Build: ${build.name}`,
        `Type: ${(build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow'}`,
        `Created: ${new Date(build.createdAt).toLocaleString()}`,
        '',
        'Components:',
        ...build.components.map((c) => `  ${c.name.charAt(0).toUpperCase() + c.name.slice(1)}: ${c.grains} grains`),
        '',
        `GPI: ${build.gpi || 'N/A'}`,
        `Length: ${build.arrowLength}"`,
        `Total Weight: ${build.components.reduce((sum, c) => sum + (c.grains || 0), 0)} grains`,
        ''
      ];

      const text = lines.join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${build.name.replace(/[^a-z0-9]/gi, '_')}_build.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const exportAllToJSON = () => {
      const data = JSON.stringify(savedBuilds, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_builds.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    const printBuild = (build) => {
      const printWindow = window.open('', '_blank');
      const totalWeight = build.components.reduce((sum, c) => sum + (c.grains || 0), 0);

      printWindow.document.write(`
      <html>
        <head>
          <title>${build.name} - Arrow Build</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .info { margin: 20px 0; }
            .component { margin: 10px 0; padding: 10px; background: #f5f5f5; }
            .total { font-size: 1.2em; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${build.name}</h1>
          <div class="info">
            <p><strong>Type:</strong> ${(build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow'}</p>
            <p><strong>Date:</strong> ${new Date(build.createdAt).toLocaleString()}</p>
          </div>
          <h2>Components</h2>
          ${build.components
            .map(
              (c) => `
            <div class="component">
              <strong>${c.name.charAt(0).toUpperCase() + c.name.slice(1)}:</strong> ${c.grains} grains
            </div>
          `
            )
            .join('')}
          <div class="total">
            Total Weight: ${totalWeight} grains<br>
            Length: ${build.arrowLength}"<br>
            GPI: ${build.gpi || 'N/A'}
          </div>
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    };

    const builds = Array.isArray(savedBuilds) ? savedBuilds : [];

    return (
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Export & Print Builds</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Export your builds as text files, JSON, or print them for physical records.
        </p>

        <div className="mb-6 bg-blue-50 dark:bg-gray-800/40 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
          <button
            onClick={exportAllToJSON}
            disabled={builds.length === 0}
            className="px-4 py-2 bg-blaze hover:bg-blaze-600 active:bg-blaze-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded shadow transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 transform disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            Export All Builds (JSON)
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Export all {builds.length} saved builds as a JSON file for backup or import into other tools.
          </p>
        </div>

        <div className="space-y-4">
          {builds.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No builds to export. Create and save some builds first.</p>
          ) : (
            builds.map((build) => {
              const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow';
              const isBolt = typeLabel === 'Bolt';
              const totalWeight = build.components.reduce((sum, c) => sum + (c.grains || 0), 0);

              return (
                <div key={build._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{build.name}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {typeLabel} • {totalWeight} grains • {build.arrowLength}"
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        isBolt
                          ? 'bg-orange-500 dark:bg-orange-600/30 border border-orange-600 dark:border-orange-500 text-white dark:text-orange-200'
                          : 'bg-green-600 dark:bg-green-600/30 border border-green-600 dark:border-green-500 text-white dark:text-green-200'
                      }`}
                    >
                      {typeLabel}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportToText(build)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors relative overflow-hidden"
                    >
                      <span className="relative z-10">Export as Text</span>
                      {theme === 'light' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                      )}
                      {theme === 'dark' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                      )}
                    </button>
                    <button
                      onClick={() => printBuild(build)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors relative overflow-hidden"
                    >
                      <span className="relative z-10">Print</span>
                      {theme === 'light' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                      )}
                      {theme === 'dark' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'presets':
        return <PresetsTab onLoadPreset={onLoadPreset} />;
      case 'library':
        return <ComponentLibraryTab />;
      case 'saved':
        return <SavedBuildsSection />;
      case 'compare':
        return <CompareTab savedBuilds={savedBuilds} />;
      case 'export':
        return <ExportSection />;
      default:
        return <PresetsTab onLoadPreset={onLoadPreset} />;
    }
  };

  return (
    <div className="w-full">
      {/* Section Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 relative">
        <nav className="flex gap-2 overflow-x-auto pb-2 relative">
          {sections.map((section) => (
            <button
              key={section.id}
              ref={(el) => (buttonRefs.current[section.id] = el)}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 font-medium transition-all duration-300 ease-out whitespace-nowrap border-b-2 flex items-center gap-2 relative ${
                activeSection === section.id
                  ? 'text-blaze dark:text-blaze-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              style={{ borderColor: 'transparent' }}
            >
              <img 
                src={theme === 'dark' ? `/icons/${section.iconName}-White.svg` : `/icons/${section.iconName}-Black.svg`}
                alt={section.label}
                className="w-5 h-5 object-contain"
              />
              {section.label}
            </button>
          ))}
          {/* Animated underline */}
          <div
            className="absolute bottom-0 h-0.5 bg-blaze transition-all duration-300 ease-out"
            style={{
              width: `${underlineStyle.width}px`,
              left: `${underlineStyle.left}px`,
            }}
          />
        </nav>
      </div>

      {/* Section Content */}
      <div className="mt-6">
        {renderSection()}
      </div>
    </div>
  );
}
