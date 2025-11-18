import React, { useState } from 'react';

export default function CalculatorsTab() {
  const [velocity, setVelocity] = useState('');
  const [weight, setWeight] = useState('');
  const [kineticEnergy, setKineticEnergy] = useState(null);
  const [momentum, setMomentum] = useState(null);

  const calculateKineticEnergy = () => {
    const v = parseFloat(velocity);
    const w = parseFloat(weight);
    if (!isNaN(v) && !isNaN(w) && v > 0 && w > 0) {
      // KE = 0.5 * m * v^2 (weight in grains, velocity in fps)
      // Convert grains to slugs: 1 grain = 0.000142857 slugs
      const massInSlugs = (w / 7000) * 0.00220462; // Convert grains to slugs
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
      // Momentum = mass * velocity
      // Weight in grains, velocity in fps
      const momentumValue = (w * v) / 225218; // Convert to slug-ft/s
      setMomentum(momentumValue.toFixed(2));
    } else {
      setMomentum(null);
    }
  };

  const handleVelocityChange = (e) => {
    setVelocity(e.target.value);
    calculateKineticEnergy();
    calculateMomentum();
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    calculateKineticEnergy();
    calculateMomentum();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Advanced Calculators</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Calculate kinetic energy and momentum for your arrow builds.
      </p>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">Kinetic Energy Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Kinetic Energy measures the energy an arrow carries. Higher KE means more penetration power.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
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
          <h3 className="text-xl font-bold mb-4">Momentum Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Momentum indicates how well an arrow can penetrate through tough materials like bone.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
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
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">Momentum</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{momentum} slug-ft/s</div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold mb-2">Calculator Tips</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>For hunting, aim for at least 25-30 ft-lbs of kinetic energy for small game, 40+ ft-lbs for deer, and 65+ ft-lbs for elk/moose.</li>
            <li>Heavier arrows with lower velocity can have similar KE but better momentum for penetration.</li>
            <li>Balance speed and weight based on your bow's capabilities and intended target.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

