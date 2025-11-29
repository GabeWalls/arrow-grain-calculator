import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../context/AuthContext';
import ArrowSVG from '../ArrowSVG';
import API_BASE_URL from '../config/api';

// Helper component to display animal silhouettes
const AnimalSilhouette = ({ animal, className = 'w-8 h-8' }) => {
  const { theme } = useTheme();
  if (!animal) return null;
  
  const isDark = theme === 'dark';
  // Map animal names to file names (available silhouettes: Bear, Boar, Caribou, Deer, Elk, Moose, Turkey)
  const animalNameMap = {
    'deer': 'Deer',
    'elk': 'Elk',
    'bear': 'Bear',
    'moose': 'Moose',
    'turkey': 'Turkey',
    'hogs': 'Boar', // Wild Hog - using Boar silhouette
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

// Advanced Calculators Component
function AdvancedCalculators() {
  const [velocity, setVelocity] = useState('');
  const [weight, setWeight] = useState('');
  const [kineticEnergy, setKineticEnergy] = useState(null);
  const [momentum, setMomentum] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateKineticEnergy = () => {
    const v = parseFloat(velocity);
    const w = parseFloat(weight);
    if (!isNaN(v) && !isNaN(w) && v > 0 && w > 0) {
      const massInSlugs = (w / 7000) * 0.00220462;
      const ke = 0.5 * massInSlugs * (v * v);
      setKineticEnergy(ke.toFixed(2));
    } else {
      setKineticEnergy(null);
    }
  };

  const calculateMomentum = () => {
    const v = parseFloat(velocity);
    const w = parseFloat(weight);
    if (!isNaN(v) && !isNaN(w) && v > 0 && w > 0) {
      const momentumValue = (w * v) / 225218;
      setMomentum(momentumValue.toFixed(2));
    } else {
      setMomentum(null);
    }
  };

  const handleVelocityChange = (e) => {
    setVelocity(e.target.value);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  useEffect(() => {
    calculateKineticEnergy();
    calculateMomentum();
  }, [velocity, weight]);

  return (
    <div className="mt-8 md:mt-12 w-full max-w-4xl border-t border-gray-200 dark:border-gray-700 pt-6 md:pt-8 px-4 md:px-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
      >
        <h3 className="text-lg md:text-xl font-bold">Advanced Calculators</h3>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-bold mb-4">Kinetic Energy Calculator</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Kinetic Energy measures the energy an arrow carries. Higher KE means more penetration power.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Velocity (fps)</label>
                <input
                  type="number"
                  value={velocity}
                  onChange={handleVelocityChange}
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded"
                  placeholder="e.g., 280"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Arrow Weight (grains)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={handleWeightChange}
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded"
                  placeholder="e.g., 450"
                />
              </div>
            </div>
            {kineticEnergy !== null && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Kinetic Energy</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{kineticEnergy} ft-lbs</div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-bold mb-4">Momentum Calculator</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Momentum indicates how well an arrow can penetrate through tough materials like bone.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Velocity (fps)</label>
                <input
                  type="number"
                  value={velocity}
                  onChange={handleVelocityChange}
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded"
                  placeholder="e.g., 280"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Arrow Weight (grains)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={handleWeightChange}
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded"
                  placeholder="e.g., 450"
                />
              </div>
            </div>
            {momentum !== null && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800/40 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">Momentum</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-gray-300">{momentum} slug-ft/s</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalculatorTab({ savedBuilds, setSavedBuilds, onOpenAuthModal }) {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [components, setComponents] = useState({
    knock: '',
    insert: '',
    fletching: '',
    tip: ''
  });

  const [buildType, setBuildType] = useState('arrow');
  const [animal, setAnimal] = useState('');
  const [gpi, setGpi] = useState('');
  const [arrowLength, setArrowLength] = useState('10.00');
  const [shaftGrains, setShaftGrains] = useState(0);
  const [totalGrains, setTotalGrains] = useState(null);
  const [fletchCount, setFletchCount] = useState('3');
  const [focPercent, setFocPercent] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [activePart, setActivePart] = useState(null);
  const [showSaved, setShowSaved] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const ANIMALS = [
    { value: '', label: 'None' },
    { value: 'deer', label: 'Deer' },
    { value: 'elk', label: 'Elk' },
    { value: 'bear', label: 'Bear' },
    { value: 'moose', label: 'Moose' },
    { value: 'turkey', label: 'Turkey' },
    { value: 'hogs', label: 'Wild Hog' },
    { value: 'caribou', label: 'Caribou' }
  ];

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((Array.isArray(savedBuilds) ? savedBuilds.length : 0) / pageSize));
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [savedBuilds, pageSize, page]);

  const handleLoadBuildInternal = (build) => {
    const compObj = {};
    build.components.forEach(c => { if (c.name !== 'shaft') compObj[c.name] = c.grains.toString(); });
    setComponents(compObj);
    const shaftComp = build.components.find(c => c.name === 'shaft');
    setShaftGrains(shaftComp ? shaftComp.grains.toString() : '0');
    setArrowLength(Number.isFinite(Number(build.arrowLength)) ? Number(build.arrowLength).toFixed(2) : '28.00');
    setGpi(build.gpi?.toString() || '');
    setBuildName(build.name);
    setEditingBuildId(build._id);
    setActivePart(null);
    setBuildType(build.buildType === 'bolt' ? 'bolt' : 'arrow');
    setAnimal(build.animal || '');
  };

  // Listen for preset load events
  useEffect(() => {
    const handlePresetLoad = (e) => {
      const preset = e.detail;
      if (preset) {
        setBuildType(preset.buildType || 'arrow');
        const compObj = {};
        preset.components.forEach(c => {
          if (c.name !== 'shaft') {
            compObj[c.name] = c.grains.toString();
          }
        });
        setComponents(compObj);
        setGpi(preset.gpi?.toString() || '');
        setArrowLength(preset.arrowLength?.toString() || '28.00');
        const shaftComp = preset.components.find(c => c.name === 'shaft');
        if (shaftComp) {
          setShaftGrains(shaftComp.grains.toString());
        }
        setBuildName(`${preset.name} (Preset)`);
        setAnimal(preset.animal || '');
        setBuildType(preset.buildType || 'arrow');
      }
    };

    const handleLoadBuild = (e) => {
      const build = e.detail;
      if (build) {
        handleLoadBuildInternal(build);
      }
    };

    window.addEventListener('loadPreset', handlePresetLoad);
    window.addEventListener('loadBuild', handleLoadBuild);
    return () => {
      window.removeEventListener('loadPreset', handlePresetLoad);
      window.removeEventListener('loadBuild', handleLoadBuild);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const gpiNum = parseFloat(gpi);
    const lengthNum = parseFloat(arrowLength);
    if (!isNaN(gpiNum) && !isNaN(lengthNum)) setShaftGrains((gpiNum * lengthNum).toFixed(2));
    else setShaftGrains(0);
  }, [gpi, arrowLength]);

  useEffect(() => {
    const shaft = parseFloat(shaftGrains);
    const knock = parseFloat(components.knock);
    const insert = parseFloat(components.insert);
    const fletching = parseFloat(components.fletching);
    const tip = parseFloat(components.tip);
    const length = parseFloat(arrowLength);

    const total = shaft + knock + insert + fletching + tip;
    setTotalGrains(!isNaN(total) ? total.toFixed(2) : null);

    const balancePoint =
      ((tip * length) +
        (insert * (length - 1)) +
        (shaft * (length / 2)) +
        (fletching * (length - 2)) +
        (knock * 0)) / total;

    const foc = ((balancePoint - (length / 2)) / length) * 100;
    setFocPercent(!isNaN(foc) ? foc.toFixed(2) : null);
  }, [components, shaftGrains, arrowLength]);

  const handleScrollToInput = (partName) => {
    setActivePart(partName);
    let selectorName = partName;
    if (partName === 'shaft') selectorName = 'gpi';
    const input = document.querySelector(`input[name="${selectorName}"]`);
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  const handleInputFocus = (e) => {
    const name = e.target.name;
    if (name === 'gpi' || name === 'arrowLength') setActivePart('shaft');
    else setActivePart(name);
  };

  const handleChange = (e) => {
    setComponents({ ...components, [e.target.name]: e.target.value });
  };

  const handleSaveBuild = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      if (onOpenAuthModal) {
        onOpenAuthModal('signup');
      } else {
        alert('Please log in or sign up to save builds.');
      }
      return;
    }

    if (!buildName.trim()) {
      alert('Please enter a name for your build.');
      return;
    }

    const formattedComponents = [
      { name: 'knock', grains: Number(components.knock) },
      { name: 'fletching', grains: Number(components.fletching) },
      { name: 'shaft', grains: Number(shaftGrains) },
      { name: 'insert', grains: Number(components.insert) },
      { name: 'tip', grains: Number(components.tip) }
    ];

    const payload = {
      name: buildName,
      components: formattedComponents,
      gpi: Number(gpi),
      arrowLength: Number(arrowLength),
      buildType,
      animal: animal || null
    };

    try {
      if (editingBuildId) {
        await axios.put(`${API_BASE_URL}/api/builds/${editingBuildId}`, payload);
        alert('Build updated!');
      } else {
        await axios.post(`${API_BASE_URL}/api/save`, payload);
        alert('Build saved!');
      }
      handleNewBuild();
      fetchBuilds();
    } catch (err) {
      console.error('Error saving build:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        if (onOpenAuthModal) {
          onOpenAuthModal('login');
        }
      } else {
        alert(err.response?.data?.error || 'There was an error saving the build.');
      }
    }
  };

  const handleNewBuild = () => {
    setComponents({ knock: '', insert: '', fletching: '', tip: '' });
    setGpi('');
    setArrowLength('10.00');
    setBuildName('');
    setEditingBuildId(null);
    setActivePart(null);
    setAnimal('');
  };

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

  // Fetch builds when authenticated
  useEffect(() => {
    fetchBuilds();
  }, [isAuthenticated]);

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
    handleLoadBuildInternal(build);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedComponents = [
      { name: 'knock', grains: Number(components.knock) },
      { name: 'fletching', grains: Number(components.fletching) },
      { name: 'shaft', grains: Number(shaftGrains) },
      { name: 'insert', grains: Number(components.insert) },
      { name: 'tip', grains: Number(components.tip) }
    ];

    try {
      const response = await axios.post(`${API_BASE_URL}/api/calculate`, {
        components: formattedComponents
      });
      setTotalGrains(response.data.totalGrains);
    } catch (err) {
      console.error('Error calculating grains:', err.response?.data || err.message);
      alert('There was an error calculating total grains.');
    }
  };

  const generateArrowLengthOptions = () => {
    const min = buildType === 'bolt' ? 14 : 20;
    const max = buildType === 'bolt' ? 24 : 34;
    const options = [];
    for (let i = min; i <= max; i += 0.25) options.push(i.toFixed(2));
    return options;
  };

  useEffect(() => {
    if (buildType === 'bolt') {
      const len = parseFloat(arrowLength);
      if (isFinite(len) && len > 24) setArrowLength('20.00');
    }
  }, [buildType]); // eslint-disable-line

  const getFocColor = (foc) => {
    const value = parseFloat(foc);
    return value >= 10 && value <= 20 ? 'text-green-400' : 'text-red-400';
  };

  const builds = Array.isArray(savedBuilds) ? savedBuilds : [];
  const totalPages = Math.max(1, Math.ceil(builds.length / pageSize));
  const startIdx = (page - 1) * pageSize;
  const pageItems = builds.slice(startIdx, startIdx + pageSize);
  const goToPage = (p) => setPage(Math.min(totalPages, Math.max(1, p)));
  const prevPage = () => goToPage(page - 1);
  const nextPage = () => goToPage(page + 1);

  const segClass = (isActive) =>
    `px-4 py-1 rounded-full border-2 transition ${
      isActive 
        ? 'bg-blaze dark:bg-blaze text-white dark:text-white border-blaze dark:border-blaze font-semibold' 
        : 'border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-700'
    }`;

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is on white space (not on SVG parts, inputs, buttons, labels, or forms)
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT';
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isLabel = target.tagName === 'LABEL';
      const isSVGInteractive = target.closest('svg') && (
        target.closest('rect') || 
        target.closest('path') || 
        target.closest('polygon') ||
        target.closest('g[pointerEvents="bounding-box"]')
      );
      
      // Only deselect if clicking on actual white space (not on any interactive element)
      if (!isInput && !isButton && !isLabel && !isSVGInteractive && activePart !== null) {
        // Additional check: make sure we're clicking on the background, not inside a container
        const isInContainer = target.closest('.flex.flex-col.items-center') || 
                             target.closest('form') || 
                             target.closest('[class*="mb-10"]');
        
        if (!isInContainer || target === isInContainer) {
          setActivePart(null);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activePart]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 md:mb-6 flex items-center gap-3 md:gap-4 w-full justify-center">
        <button
          type="button"
          className={`${segClass(buildType === 'arrow')} text-sm md:text-base px-4 md:px-6 py-2 md:py-2.5`}
          onClick={() => setBuildType('arrow')}
          aria-pressed={buildType === 'arrow'}
        >
          Arrow
        </button>
        <button
          type="button"
          className={`${segClass(buildType === 'bolt')} text-sm md:text-base px-4 md:px-6 py-2 md:py-2.5`}
          onClick={() => setBuildType('bolt')}
          aria-pressed={buildType === 'bolt'}
        >
          Bolt
        </button>
      </div>

      {/* Mobile: SVG left, fields right. Desktop: SVG above, fields below */}
      <div className="w-full flex flex-col md:flex-col items-center">
        <div className="w-full flex flex-row md:flex-col items-stretch md:items-center gap-4 md:gap-0 mb-4 md:mb-0">
          {/* Arrow/Bolt SVG - Left on mobile, centered between edge and fields, bigger size */}
          <div className="flex-shrink-0 w-[65%] md:w-full md:flex md:justify-center flex items-stretch justify-center md:self-auto self-stretch px-2 md:px-0 absolute md:relative left-0 md:left-auto z-10 md:z-auto">
            <div className="w-full h-full flex items-center justify-center py-4 md:py-0">
              <ArrowSVG onPartClick={handleScrollToInput} activePart={activePart} mode={buildType} onClearSelection={() => setActivePart(null)} />
            </div>
          </div>

          {/* Input Fields - Right on mobile, below on desktop */}
          <form onSubmit={handleSubmit} className="flex-1 md:w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 md:mt-6 flex flex-col relative md:relative z-20 md:z-auto ml-[60%] md:ml-0">
            {/* Mobile: Order matches vertical arrow (top to bottom: Knock, Vanes, Shaft, Insert, Tip) */}
            {/* Desktop: Left to right order */}
            <div className="flex flex-col items-start md:items-center order-1 md:order-1">
              <label className={`mb-1 transition-colors duration-200 text-sm md:text-base ${activePart === 'knock' ? 'text-blaze font-bold' : ''}`}>Knock</label>
              <input type="number" name="knock" value={components.knock} onChange={handleChange} onFocus={handleInputFocus}
                     className={`bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow w-full transition-all duration-200 ${
                       activePart === 'knock'
                         ? 'border-blaze border-2 text-gray-900 dark:text-white'
                         : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                     }`} />
            </div>

            <div className="flex flex-col items-start md:items-center order-2 md:order-2">
              <label className={`mb-1 transition-colors duration-200 text-sm md:text-base ${activePart === 'fletching' ? 'text-blaze font-bold' : ''}`}>Vanes</label>
              <input type="number" name="fletching" value={components.fletching} onChange={handleChange} onFocus={handleInputFocus}
                     className={`bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow w-full transition-all duration-200 ${
                       activePart === 'fletching'
                         ? 'border-blaze border-2 text-gray-900 dark:text-white'
                         : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                     }`} />
              <label className="mt-2 mb-1 text-[10px] md:text-sm">Number of Vanes</label>
              <select value={fletchCount} onChange={(e) => setFletchCount(e.target.value)}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow w-full text-xs md:text-base">
                {[3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </div>

            <div className="flex flex-col items-start md:items-center order-3 md:order-3">
              <label className={`mb-1 text-left md:text-center transition-colors duration-200 text-sm md:text-base ${activePart === 'shaft' ? 'text-blaze font-bold' : ''}`}>Shaft (Grains Per Inch)</label>
              <input type="number" name="gpi" value={gpi} onChange={(e) => setGpi(e.target.value)} onFocus={handleInputFocus}
                     className={`bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow w-full transition-all duration-200 ${
                       activePart === 'shaft'
                         ? 'border-blaze border-2 text-gray-900 dark:text-white'
                         : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                     }`} />
              <label className={`mt-2 mb-1 text-[10px] md:text-sm text-left md:text-center transition-colors duration-200 ${activePart === 'shaft' ? 'text-blaze font-bold' : ''}`}>
                {buildType === 'bolt' ? 'Bolt Length (inches)' : 'Arrow Length (inches)'}
              </label>
              <select name="arrowLength" value={arrowLength} onChange={(e) => setArrowLength(e.target.value)} onFocus={handleInputFocus}
                      className={`bg-white dark:bg-gray-800 border px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow w-full transition-all duration-200 text-xs md:text-base ${
                        activePart === 'shaft'
                          ? 'border-blaze border-2 text-gray-900 dark:text-white'
                          : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                      }`}>
                {generateArrowLengthOptions().map((len) => <option key={len} value={len}>{len}"</option>)}
              </select>
              <label className="mt-2 mb-1 text-[10px] md:text-sm text-left md:text-center">Shaft (Total Grains)</label>
              <input type="number" value={shaftGrains} readOnly
                     className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow w-full text-xs md:text-base" />
            </div>

            <div className="flex flex-col items-start md:items-center order-4 md:order-4">
              <label className={`mb-1 transition-colors duration-200 text-sm md:text-base ${activePart === 'insert' ? 'text-blaze font-bold' : ''}`}>Insert</label>
              <input type="number" name="insert" value={components.insert} onChange={handleChange} onFocus={handleInputFocus}
                     className={`bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow w-full transition-all duration-200 ${
                       activePart === 'insert'
                         ? 'border-blaze border-2 text-gray-900 dark:text-white'
                         : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                     }`} />
            </div>

            <div className="flex flex-col items-start md:items-center order-5 md:order-5">
              <label className={`mb-1 transition-colors duration-200 text-sm md:text-base ${activePart === 'tip' ? 'text-blaze font-bold' : ''}`}>Tip</label>
              <input type="number" name="tip" value={components.tip} onChange={handleChange} onFocus={handleInputFocus}
                     className={`bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow w-full transition-all duration-200 ${
                       activePart === 'tip'
                         ? 'border-blaze border-2 text-gray-900 dark:text-white'
                         : 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                     }`} />
            </div>

            <div className="col-span-1 md:col-span-5 flex justify-center mt-4 md:mt-6 order-6 md:order-none">
              <button type="submit" className="px-6 md:px-6 py-3 md:py-2 bg-blaze hover:bg-blaze-600 active:bg-blaze-700 rounded shadow text-white transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 transform relative overflow-hidden text-base md:text-base font-semibold">
                <span className="relative z-10">Calculate</span>
                {theme === 'light' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                )}
                {theme === 'dark' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {totalGrains !== null && <h2 className="mt-4 md:mt-6 text-lg md:text-xl font-semibold text-center px-4">Total {buildType === 'bolt' ? 'Bolt' : 'Arrow'} Weight: {totalGrains} grains</h2>}
      {focPercent !== null && <h2 className={`mt-2 text-lg md:text-xl font-semibold text-center px-4 ${getFocColor(focPercent)}`}>FOC: {focPercent}%</h2>}

      <div className="col-span-1 md:col-span-5 flex flex-col items-center mt-4 md:mt-6 w-full max-w-md mx-auto px-4">
        <input type="text" placeholder="Build Name" value={buildName} onChange={(e) => setBuildName(e.target.value)}
               className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-1 rounded shadow w-full mb-2" />
        <div className="w-full mb-2">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Target Animal</label>
          <select 
            value={animal} 
            onChange={(e) => setAnimal(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-1 rounded shadow w-full"
          >
            {ANIMALS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 md:gap-4 w-full">
          <button type="button" onClick={handleSaveBuild} className="flex-1 px-6 md:px-6 py-3 md:py-2 bg-blaze hover:bg-blaze-600 active:bg-blaze-700 rounded shadow text-white transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 transform relative overflow-hidden text-base md:text-base font-semibold">
            <span className="relative z-10">{editingBuildId ? 'Update Build' : 'Save Build'}</span>
            {theme === 'light' && (
              <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
            )}
            {theme === 'dark' && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
            )}
          </button>
          <button type="button" onClick={handleNewBuild} className="flex-1 px-6 md:px-6 py-3 md:py-2 bg-gray-500 dark:bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-600 active:bg-gray-700 dark:active:bg-gray-700 rounded shadow text-white transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 transform relative overflow-hidden text-base md:text-base font-semibold">
            <span className="relative z-10">New Build</span>
            {theme === 'light' && (
              <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
            )}
            {theme === 'dark' && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 md:mt-10 w-full max-w-4xl px-4 md:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-xl md:text-2xl font-bold">Saved Builds</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-sm text-gray-600 dark:text-gray-400">{builds.length} total</span>
            <button type="button" onClick={() => setShowSaved(!showSaved)}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white" aria-expanded={showSaved}>
              {showSaved ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {showSaved && (
          <>
            {builds.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">No saved builds yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {pageItems.map((build) => {
                  const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow';
                  const isBolt = typeLabel === 'Bolt';
                  return (
                    <div key={build._id} className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded shadow border border-gray-200 dark:border-gray-600">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <div className="font-semibold truncate w-full sm:w-auto">{build.name}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {build.animal && (
                            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-gray-100 dark:bg-gray-600 rounded-full p-1">
                              <AnimalSilhouette animal={build.animal} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              isBolt
                                ? 'bg-orange-500 dark:bg-orange-600/30 border border-orange-600 dark:border-orange-500 text-white dark:text-orange-200'
                                : 'bg-blaze dark:bg-blaze/70 border border-blaze dark:border-blaze-600 text-white dark:text-blaze-100'
                            }`}
                            title="Build Type"
                          >
                            {typeLabel}
                          </span>
                          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{new Date(build.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        {build.components.map((c, idx) => (
                          <div key={idx}>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}: {c.grains} grains</div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleLoadBuild(build)} className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 px-3 py-1.5 rounded text-sm text-white transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 transform relative overflow-hidden">
                          <span className="relative z-10">Load</span>
                          {theme === 'light' && (
                            <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent"></span>
                          )}
                          {theme === 'dark' && (
                            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></span>
                          )}
                        </button>
                        <button onClick={() => handleDeleteBuild(build._id)} className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 px-3 py-1.5 rounded text-sm text-white transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 transform relative overflow-hidden">
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
            )}

            {builds.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={prevPage} disabled={page <= 1}
                          className={`px-3 py-1 rounded text-sm relative overflow-hidden ${page <= 1 ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}>
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">Page <strong>{page}</strong> / {totalPages}</span>
                  <button type="button" onClick={nextPage} disabled={page >= totalPages}
                          className={`px-3 py-1 rounded text-sm relative overflow-hidden ${page >= totalPages ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}>
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
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm">
                    {[4, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AdvancedCalculators />
    </div>
  );
}

