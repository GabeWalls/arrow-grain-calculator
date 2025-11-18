import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import CalculatorTab from './components/CalculatorTab';
import WorkspaceTab from './components/WorkspaceTab';
import StatisticsTab from './components/StatisticsTab';
import GuideTab from './components/GuideTab';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('calculator');
  const [savedBuilds, setSavedBuilds] = useState([]);

  // Fetch builds on mount
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/builds');
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        setSavedBuilds(items);
      } catch (err) {
        console.error('Error fetching builds:', err);
      }
    };
    fetchBuilds();
  }, []);

  // Handle preset loading - switches to calculator tab and loads preset
  const handlePresetLoad = (preset) => {
    setActiveTab('calculator');
    // Pass preset data through a ref or global state - for now, we'll handle this in CalculatorTab
    setTimeout(() => {
      // Trigger preset load in CalculatorTab via event or state
      window.dispatchEvent(new CustomEvent('loadPreset', { detail: preset }));
    }, 100);
  };

  // Handle build loading - switches to calculator tab and loads build
  useEffect(() => {
    const handleLoadBuild = (e) => {
      const build = e.detail;
      if (build) {
        setActiveTab('calculator');
        // Build will be loaded by CalculatorTab's event listener
      }
    };
    window.addEventListener('loadBuild', handleLoadBuild);
    return () => window.removeEventListener('loadBuild', handleLoadBuild);
  }, []);

  // Organized tabs by category
  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: '📐' },
    { id: 'workspace', label: 'Workspace', icon: '🛠️' },
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    { id: 'guide', label: 'Guide', icon: '📖' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'calculator':
        return <CalculatorTab savedBuilds={savedBuilds} setSavedBuilds={setSavedBuilds} />;
      case 'workspace':
        return <WorkspaceTab savedBuilds={savedBuilds} setSavedBuilds={setSavedBuilds} onLoadPreset={handlePresetLoad} />;
      case 'statistics':
        return <StatisticsTab savedBuilds={savedBuilds} />;
      case 'guide':
        return <GuideTab />;
      default:
        return <CalculatorTab savedBuilds={savedBuilds} setSavedBuilds={setSavedBuilds} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-pureblack dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white flex flex-col">
      {/* Header - Modern style inspired by mouse-sensitivity.com */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Arrow & Bolt Weight Calculator
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Same Build - Different Configurations</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Tab Navigation - Modern horizontal layout */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

export default App;
