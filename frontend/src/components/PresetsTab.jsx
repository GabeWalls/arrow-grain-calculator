import React, { useState } from 'react';

// Animal SVG silhouettes
const AnimalSilhouettes = {
  deer: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path d="M50,20 L45,35 L40,50 L35,65 L40,75 L50,80 L60,75 L65,65 L60,50 L55,35 L50,20 Z M50,80 L50,90 M45,35 L30,30 L20,40 L25,50 M55,35 L70,30 L80,40 L75,50" 
            fill="currentColor" stroke="none"/>
    </svg>
  ),
  elk: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path d="M50,15 L45,35 L40,55 L35,75 L40,85 L50,90 L60,85 L65,75 L60,55 L55,35 L50,15 Z M50,90 L50,100 M40,55 L25,50 L15,60 L20,70 M60,55 L75,50 L85,60 L80,70 M45,35 L35,25 L25,35 M55,35 L65,25 L75,35" 
            fill="currentColor" stroke="none"/>
    </svg>
  ),
  bear: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <circle cx="50" cy="40" r="25" fill="currentColor"/>
      <ellipse cx="50" cy="75" rx="30" ry="25" fill="currentColor"/>
      <circle cx="42" cy="35" r="5" fill="currentColor"/>
      <circle cx="58" cy="35" r="5" fill="currentColor"/>
      <ellipse cx="50" cy="45" rx="8" ry="5" fill="currentColor"/>
    </svg>
  ),
  moose: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path d="M50,10 L48,25 L45,45 L42,70 L45,85 L50,95 L55,85 L58,70 L55,45 L52,25 L50,10 Z M50,95 L50,100 M42,70 L25,65 L15,75 L18,85 M58,70 L75,65 L85,75 L82,85 M48,25 L35,15 L28,28 M52,25 L65,15 L72,28 M45,45 L38,40 L32,48 M55,45 L62,40 L68,48" 
            fill="currentColor" stroke="none"/>
    </svg>
  ),
  turkey: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <ellipse cx="50" cy="50" rx="20" ry="25" fill="currentColor"/>
      <circle cx="45" cy="45" r="3" fill="white"/>
      <circle cx="55" cy="45" r="3" fill="white"/>
      <path d="M50,55 L50,65 M45,60 L55,60" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M35,40 L25,35 L20,45 L22,50 M65,40 L75,35 L80,45 L78,50" fill="currentColor"/>
    </svg>
  ),
  hogs: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <ellipse cx="50" cy="50" rx="25" ry="20" fill="currentColor"/>
      <circle cx="42" cy="45" r="3" fill="currentColor"/>
      <circle cx="58" cy="45" r="3" fill="currentColor"/>
      <ellipse cx="50" cy="55" rx="10" ry="8" fill="currentColor"/>
      <path d="M30,50 L20,48 L18,52 L22,55 M70,50 L80,48 L82,52 L78,55" fill="currentColor"/>
    </svg>
  ),
  caribou: (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path d="M50,15 L48,30 L45,50 L42,70 L45,82 L50,88 L55,82 L58,70 L55,50 L52,30 L50,15 Z M50,88 L50,95 M42,70 L28,65 L20,72 L22,80 M58,70 L72,65 L80,72 L78,80 M48,30 L38,20 L30,28 M52,30 L62,20 L70,28" 
            fill="currentColor" stroke="none"/>
    </svg>
  )
};

// Expanded presets with 3 variants per species (Light, Medium, Heavy)
const BIG_GAME_PRESETS = {
  deer: {
    light: {
      name: 'Deer - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 12 },
        { name: 'fletching', grains: 22 },
        { name: 'shaft', grains: 320 },
        { name: 'insert', grains: 40 },
        { name: 'tip', grains: 100 }
      ],
      gpi: 9.5,
      arrowLength: 27.00,
      description: 'Lightweight build for close-range deer hunting. Faster trajectory, good for 20-30 yard shots.',
      keTarget: '40+ ft-lbs',
      foc: '10-12%'
    },
    medium: {
      name: 'Deer - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 15 },
        { name: 'fletching', grains: 25 },
        { name: 'shaft', grains: 350 },
        { name: 'insert', grains: 50 },
        { name: 'tip', grains: 125 }
      ],
      gpi: 10.0,
      arrowLength: 28.00,
      description: 'Balanced build for whitetail deer. Good penetration and accuracy for most hunting situations.',
      keTarget: '45-50 ft-lbs',
      foc: '12-15%'
    },
    heavy: {
      name: 'Deer - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 18 },
        { name: 'fletching', grains: 28 },
        { name: 'shaft', grains: 380 },
        { name: 'insert', grains: 65 },
        { name: 'tip', grains: 150 }
      ],
      gpi: 10.5,
      arrowLength: 29.00,
      description: 'Heavy build for maximum penetration. Excellent for quartering shots and larger whitetails.',
      keTarget: '50-55 ft-lbs',
      foc: '15-18%'
    }
  },
  elk: {
    light: {
      name: 'Elk - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 16 },
        { name: 'fletching', grains: 28 },
        { name: 'shaft', grains: 420 },
        { name: 'insert', grains: 65 },
        { name: 'tip', grains: 150 }
      ],
      gpi: 11.0,
      arrowLength: 29.00,
      description: 'Lighter elk build for open terrain. Good speed with adequate penetration for broadside shots.',
      keTarget: '55-60 ft-lbs',
      foc: '13-15%'
    },
    medium: {
      name: 'Elk - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 18 },
        { name: 'fletching', grains: 30 },
        { name: 'shaft', grains: 450 },
        { name: 'insert', grains: 75 },
        { name: 'tip', grains: 175 }
      ],
      gpi: 11.5,
      arrowLength: 30.00,
      description: 'Standard elk build. Excellent balance of penetration and trajectory for most elk hunting scenarios.',
      keTarget: '60-65 ft-lbs',
      foc: '15-17%'
    },
    heavy: {
      name: 'Elk - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 20 },
        { name: 'fletching', grains: 35 },
        { name: 'shaft', grains: 500 },
        { name: 'insert', grains: 90 },
        { name: 'tip', grains: 200 }
      ],
      gpi: 12.5,
      arrowLength: 30.00,
      description: 'Heavy-duty elk build. Maximum penetration for tough shots through bone and heavy muscle.',
      keTarget: '65-70+ ft-lbs',
      foc: '17-20%'
    }
  },
  bear: {
    light: {
      name: 'Bear - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 18 },
        { name: 'fletching', grains: 32 },
        { name: 'shaft', grains: 480 },
        { name: 'insert', grains: 85 },
        { name: 'tip', grains: 175 }
      ],
      gpi: 12.0,
      arrowLength: 30.00,
      description: 'Lighter bear build for black bear. Still heavy enough for penetration but faster trajectory.',
      keTarget: '60-65 ft-lbs',
      foc: '15-17%'
    },
    medium: {
      name: 'Bear - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 20 },
        { name: 'fletching', grains: 35 },
        { name: 'shaft', grains: 520 },
        { name: 'insert', grains: 100 },
        { name: 'tip', grains: 200 }
      ],
      gpi: 12.5,
      arrowLength: 30.00,
      description: 'Standard bear build. Heavy weight for deep penetration through thick hide and muscle.',
      keTarget: '65-70 ft-lbs',
      foc: '17-19%'
    },
    heavy: {
      name: 'Bear - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 22 },
        { name: 'fletching', grains: 38 },
        { name: 'shaft', grains: 580 },
        { name: 'insert', grains: 110 },
        { name: 'tip', grains: 225 }
      ],
      gpi: 13.5,
      arrowLength: 30.00,
      description: 'Maximum weight bear build. For grizzly and brown bear. Deep penetration through heavy bone.',
      keTarget: '70-75+ ft-lbs',
      foc: '18-20%'
    }
  },
  moose: {
    light: {
      name: 'Moose - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 18 },
        { name: 'fletching', grains: 30 },
        { name: 'shaft', grains: 460 },
        { name: 'insert', grains: 80 },
        { name: 'tip', grains: 170 }
      ],
      gpi: 11.5,
      arrowLength: 30.00,
      description: 'Lighter moose build. Good for open terrain where longer shots may be required.',
      keTarget: '60-65 ft-lbs',
      foc: '14-16%'
    },
    medium: {
      name: 'Moose - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 20 },
        { name: 'fletching', grains: 35 },
        { name: 'shaft', grains: 500 },
        { name: 'insert', grains: 90 },
        { name: 'tip', grains: 190 }
      ],
      gpi: 12.0,
      arrowLength: 30.00,
      description: 'Standard moose build. Heavy enough for deep penetration through thick hide and bone.',
      keTarget: '65-70 ft-lbs',
      foc: '16-18%'
    },
    heavy: {
      name: 'Moose - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 22 },
        { name: 'fletching', grains: 38 },
        { name: 'shaft', grains: 560 },
        { name: 'insert', grains: 105 },
        { name: 'tip', grains: 210 }
      ],
      gpi: 13.0,
      arrowLength: 30.00,
      description: 'Maximum weight moose build. For large bulls and tough shot angles. Deep penetration power.',
      keTarget: '70-75+ ft-lbs',
      foc: '18-20%'
    }
  },
  turkey: {
    light: {
      name: 'Turkey - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 10 },
        { name: 'fletching', grains: 18 },
        { name: 'shaft', grains: 260 },
        { name: 'insert', grains: 35 },
        { name: 'tip', grains: 85 }
      ],
      gpi: 8.5,
      arrowLength: 26.00,
      description: 'Ultra-light build for turkey. Fast and flat trajectory. Focus on broadhead cutting diameter.',
      keTarget: '35-40 ft-lbs',
      foc: '8-10%'
    },
    medium: {
      name: 'Turkey - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 12 },
        { name: 'fletching', grains: 20 },
        { name: 'shaft', grains: 280 },
        { name: 'insert', grains: 40 },
        { name: 'tip', grains: 100 }
      ],
      gpi: 9.0,
      arrowLength: 26.00,
      description: 'Balanced turkey build. Good speed with adequate weight for reliable broadhead function.',
      keTarget: '40-45 ft-lbs',
      foc: '10-12%'
    },
    heavy: {
      name: 'Turkey - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 14 },
        { name: 'fletching', grains: 22 },
        { name: 'shaft', grains: 300 },
        { name: 'insert', grains: 45 },
        { name: 'tip', grains: 115 }
      ],
      gpi: 9.5,
      arrowLength: 27.00,
      description: 'Heavier turkey build. More weight helps with penetration through wing feathers and bone.',
      keTarget: '45-50 ft-lbs',
      foc: '12-14%'
    }
  },
  hogs: {
    light: {
      name: 'Wild Hog - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 14 },
        { name: 'fletching', grains: 25 },
        { name: 'shaft', grains: 370 },
        { name: 'insert', grains: 55 },
        { name: 'tip', grains: 125 }
      ],
      gpi: 10.0,
      arrowLength: 28.00,
      description: 'Lighter hog build. Faster for quick follow-up shots. Still penetrates thick hide.',
      keTarget: '45-50 ft-lbs',
      foc: '12-14%'
    },
    medium: {
      name: 'Wild Hog - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 16 },
        { name: 'fletching', grains: 28 },
        { name: 'shaft', grains: 400 },
        { name: 'insert', grains: 65 },
        { name: 'tip', grains: 150 }
      ],
      gpi: 10.5,
      arrowLength: 29.00,
      description: 'Standard hog build. Heavy enough to penetrate thick hide and shoulder plate.',
      keTarget: '50-55 ft-lbs',
      foc: '14-16%'
    },
    heavy: {
      name: 'Wild Hog - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 18 },
        { name: 'fletching', grains: 32 },
        { name: 'shaft', grains: 450 },
        { name: 'insert', grains: 80 },
        { name: 'tip', grains: 175 }
      ],
      gpi: 11.5,
      arrowLength: 29.00,
      description: 'Heavy hog build. Maximum penetration for tough shots through shoulder and heavy bone.',
      keTarget: '55-60+ ft-lbs',
      foc: '16-18%'
    }
  },
  caribou: {
    light: {
      name: 'Caribou - Light',
      variant: 'Light',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 15 },
        { name: 'fletching', grains: 27 },
        { name: 'shaft', grains: 390 },
        { name: 'insert', grains: 60 },
        { name: 'tip', grains: 140 }
      ],
      gpi: 10.5,
      arrowLength: 29.00,
      description: 'Lighter caribou build. Faster trajectory for longer shots on open tundra.',
      keTarget: '50-55 ft-lbs',
      foc: '13-15%'
    },
    medium: {
      name: 'Caribou - Medium',
      variant: 'Medium',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 17 },
        { name: 'fletching', grains: 30 },
        { name: 'shaft', grains: 420 },
        { name: 'insert', grains: 70 },
        { name: 'tip', grains: 160 }
      ],
      gpi: 11.0,
      arrowLength: 29.00,
      description: 'Balanced caribou build. Good penetration and trajectory for various hunting conditions.',
      keTarget: '55-60 ft-lbs',
      foc: '15-17%'
    },
    heavy: {
      name: 'Caribou - Heavy',
      variant: 'Heavy',
      buildType: 'arrow',
      components: [
        { name: 'knock', grains: 19 },
        { name: 'fletching', grains: 33 },
        { name: 'shaft', grains: 460 },
        { name: 'insert', grains: 80 },
        { name: 'tip', grains: 180 }
      ],
      gpi: 11.5,
      arrowLength: 29.00,
      description: 'Heavy caribou build. Maximum weight for tough shots and deep penetration.',
      keTarget: '60-65+ ft-lbs',
      foc: '17-19%'
    }
  }
};

export default function PresetsTab({ onLoadPreset }) {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const handleLoadPreset = (preset) => {
    if (onLoadPreset) {
      onLoadPreset({
        name: preset.name,
        buildType: preset.buildType,
        components: preset.components,
        gpi: preset.gpi,
        arrowLength: preset.arrowLength
      });
    }
  };

  const calculateTotal = (components) => {
    return components.reduce((sum, c) => sum + (c.grains || 0), 0).toFixed(0);
  };

  const calculateFOC = (preset) => {
    const { components, arrowLength } = preset;
    const length = parseFloat(arrowLength);
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
    return foc.toFixed(1);
  };

  const speciesList = Object.keys(BIG_GAME_PRESETS);
  const selectedVariants = selectedSpecies ? Object.values(BIG_GAME_PRESETS[selectedSpecies]) : [];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Big Game Build Presets</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Research-backed presets with 3 variants (Light/Medium/Heavy) for each game species. Click "Load Preset" to apply the configuration.
      </p>

      {/* Species selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {speciesList.map((species) => {
            const firstPreset = Object.values(BIG_GAME_PRESETS[species])[0];
            const speciesName = firstPreset.name.split(' - ')[0];
            return (
              <button
                key={species}
                onClick={() => setSelectedSpecies(selectedSpecies === species ? null : species)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                  selectedSpecies === species
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {AnimalSilhouettes[species]}
                </span>
                <span className="font-semibold">{speciesName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display variants for selected species */}
      {selectedSpecies && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {selectedVariants.map((preset) => {
            const totalGrains = calculateTotal(preset.components);
            const foc = calculateFOC(preset);
            const variantColors = {
              Light: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
              Medium: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
              Heavy: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
            };

            return (
              <div
                key={preset.name}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow"
              >
                {/* Animal silhouette header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-600 dark:text-gray-400">
                      {AnimalSilhouettes[selectedSpecies]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{preset.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${variantColors[preset.variant]}`}>
                        {preset.variant}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white font-semibold">Arrow</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{preset.description}</p>

                <div className="space-y-2 mb-4">
                  {preset.components.map((comp, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{comp.name.charAt(0).toUpperCase() + comp.name.slice(1)}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{comp.grains} gr</span>
                  </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Total Weight:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{totalGrains} grains</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Length:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{preset.arrowLength}"</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">FOC:</span>
                    <span className={`font-semibold ${parseFloat(foc) >= 10 && parseFloat(foc) <= 20 ? 'text-green-500' : 'text-red-500'}`}>
                      {foc}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Target KE:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{preset.keTarget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Target FOC:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{preset.foc}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLoadPreset(preset)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors font-semibold"
                >
                  Load Preset
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Show all presets if none selected */}
      {!selectedSpecies && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">Select a game species above to view preset variants</p>
          <p className="text-sm">Each species has Light, Medium, and Heavy build options</p>
        </div>
      )}
    </div>
  );
}
