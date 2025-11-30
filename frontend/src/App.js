import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { useAuth } from './context/AuthContext';
import CalculatorTab from './components/CalculatorTab';
import WorkspaceTab from './components/WorkspaceTab';
import StatisticsTab from './components/StatisticsTab';
import GuideTab from './components/GuideTab';
import AuthModal from './components/AuthModal';
import API_BASE_URL from './config/api';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('calculator');
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch builds when user is authenticated
  useEffect(() => {
    const fetchBuilds = async () => {
      if (!isAuthenticated) {
        setSavedBuilds([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/builds`);
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        setSavedBuilds(items);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid, logout will be handled by AuthContext
          console.error('Authentication error:', err);
        } else {
          console.error('Error fetching builds:', err);
        }
      }
    };
    fetchBuilds();
  }, [isAuthenticated]);

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
    { id: 'calculator', label: 'Calculator', iconName: 'Calculator' },
    { id: 'workspace', label: 'Workspace', iconName: 'Workshop' },
    { id: 'statistics', label: 'Statistics', iconName: 'Statistics' },
    { id: 'guide', label: 'Guide', iconName: 'Guide' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <CalculatorTab 
            savedBuilds={savedBuilds} 
            setSavedBuilds={setSavedBuilds}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode);
              setAuthModalOpen(true);
            }}
          />
        );
      case 'workspace':
        return (
          <WorkspaceTab 
            savedBuilds={savedBuilds} 
            setSavedBuilds={setSavedBuilds} 
            onLoadPreset={handlePresetLoad}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode);
              setAuthModalOpen(true);
            }}
          />
        );
      case 'statistics':
        return <StatisticsTab savedBuilds={savedBuilds} />;
      case 'guide':
        return <GuideTab />;
      default:
        return <CalculatorTab savedBuilds={savedBuilds} setSavedBuilds={setSavedBuilds} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-pureblack dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header - Modern style inspired by mouse-sensitivity.com */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-4">
          {/* Mobile: Top row with logo left, auth right. Second row with tabs */}
          {/* Desktop: Single row with logo, tabs, auth */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 relative">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden absolute left-0 top-0 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 flex-shrink-0 z-50"
              aria-label="Toggle menu"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Top Row on Mobile: Centered Logo */}
            <div className="w-full md:w-auto flex items-center justify-center md:justify-start gap-4 md:gap-0 relative pl-10 md:pl-0">
              {/* Logo - Banner style on mobile, centered */}
              <div className="flex items-center flex-shrink-0 md:flex-shrink-0">
                <img 
                  src={theme === 'dark' 
                    ? "/ArrowWeight-Logo-Banner-Size-Darkmode.svg" 
                    : "/ArrowWeight-Banner-Size.svg"}
                  alt="Arrow Weight Calculator" 
                  className="h-28 sm:h-32 md:hidden w-auto object-contain mx-auto"
                />
                <img 
                  src={theme === 'dark' 
                    ? "/ArrowWeight-Logo-Words-Darkmode.svg" 
                    : "/ArrowWeight-Logo-2.svg"}
                  alt="Arrow Weight Calculator" 
                  className="hidden md:block h-20 lg:h-24 xl:h-28 2xl:h-32 w-auto object-contain"
                />
              </div>
            </div>

            {/* Mobile Menu - Smooth slide animation when hamburger clicked, includes tabs, auth, and theme toggle */}
            <div className={`md:hidden flex-col absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-lg z-40 transition-all duration-300 ease-in-out overflow-hidden ${
              mobileMenuOpen 
                ? 'opacity-100 translate-y-0 pointer-events-auto max-h-[600px] py-4 px-4' 
                : 'opacity-0 -translate-y-4 pointer-events-none max-h-0 py-0 px-4'
            }`}>
              {/* Tab Navigation */}
              <nav className="flex flex-col gap-2 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-5 py-3.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-3 relative overflow-hidden transition-all duration-300 ease-out text-lg ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blaze to-blaze-700 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <img 
                        src={theme === 'dark' ? `/icons/${tab.iconName}-White.svg` : `/icons/${tab.iconName}-Black.svg`}
                        alt={tab.label}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{tab.label}</span>
                    </span>
                    {activeTab === tab.id && (
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
              </nav>

              {/* Auth Section */}
              <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <span className={`text-base px-4 py-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.name || user?.email}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-5 py-3.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md text-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="px-5 py-3.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md text-lg"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('signup');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="px-5 py-3.5 rounded-lg bg-blaze hover:bg-blaze-dark text-white font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md text-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
              
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="px-5 py-3.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-out shadow-sm hover:shadow-md flex items-center gap-3 text-lg"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <>
                    <svg className="w-6 h-6 transition-transform duration-300 hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Navigation - Desktop only (completely hidden on mobile) */}
            <nav className="hidden md:flex items-center gap-2 flex-1 min-w-0 w-auto overflow-x-auto md:overflow-x-visible pb-0 justify-start">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 relative overflow-hidden transition-all duration-300 ease-out flex-shrink-0 text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blaze to-blaze-700 text-white shadow-lg transform scale-105 hover:scale-110 hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:scale-102 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1 md:gap-2">
                    <img 
                      src={theme === 'dark' ? `/icons/${tab.iconName}-White.svg` : `/icons/${tab.iconName}-Black.svg`}
                      alt={tab.label}
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                  {activeTab === tab.id && (
                    <>
                      {/* Subtle dark gradient overlay in light mode */}
                      {theme === 'light' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                      )}
                      {/* Subtle white gradient overlay in dark mode */}
                      {theme === 'dark' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>
            
            {/* Auth Section - Desktop: Right side */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name || user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-blaze hover:bg-blaze-dark text-white font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 flex-shrink-0"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 md:p-6 lg:p-8">
          {renderTab()}
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;
