import React from 'react';

export default function StatisticsTab({ savedBuilds }) {
  const builds = Array.isArray(savedBuilds) ? savedBuilds : [];

  const calculateStats = () => {
    if (builds.length === 0) return null;

    const totals = builds.map(build => {
      const total = build.components.reduce((sum, c) => sum + (c.grains || 0), 0);
      return { total, buildType: build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow') };
    });

    const arrowTotals = totals.filter(t => t.buildType === 'arrow').map(t => t.total);
    const boltTotals = totals.filter(t => t.buildType === 'bolt').map(t => t.total);

    const avgArrowWeight = arrowTotals.length > 0
      ? (arrowTotals.reduce((a, b) => a + b, 0) / arrowTotals.length).toFixed(0)
      : 0;
    const avgBoltWeight = boltTotals.length > 0
      ? (boltTotals.reduce((a, b) => a + b, 0) / boltTotals.length).toFixed(0)
      : 0;

    const minArrow = arrowTotals.length > 0 ? Math.min(...arrowTotals) : 0;
    const maxArrow = arrowTotals.length > 0 ? Math.max(...arrowTotals) : 0;
    const minBolt = boltTotals.length > 0 ? Math.min(...boltTotals) : 0;
    const maxBolt = boltTotals.length > 0 ? Math.max(...boltTotals) : 0;

    // Component usage
    const componentUsage = {};
    builds.forEach(build => {
      build.components.forEach(comp => {
        if (!componentUsage[comp.name]) {
          componentUsage[comp.name] = { total: 0, count: 0 };
        }
        componentUsage[comp.name].total += comp.grains || 0;
        componentUsage[comp.name].count += 1;
      });
    });

    const avgComponents = {};
    Object.keys(componentUsage).forEach(name => {
      avgComponents[name] = (componentUsage[name].total / componentUsage[name].count).toFixed(0);
    });

    return {
      totalBuilds: builds.length,
      arrowCount: arrowTotals.length,
      boltCount: boltTotals.length,
      avgArrowWeight,
      avgBoltWeight,
      minArrow,
      maxArrow,
      minBolt,
      maxBolt,
      avgComponents
    };
  };

  const stats = calculateStats();

  if (builds.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Build Statistics</h2>
        <p className="text-gray-600 dark:text-gray-400">No saved builds yet. Create and save some builds to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Build Statistics</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Overview of your saved builds and component usage patterns.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Builds</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBuilds}</div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arrow Builds</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.arrowCount}</div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bolt Builds</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.boltCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-bold mb-4">Arrow Weight Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.avgArrowWeight} gr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Minimum:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.minArrow} gr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Maximum:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.maxArrow} gr</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-bold mb-4">Bolt Weight Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.avgBoltWeight} gr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Minimum:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.minBolt} gr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Maximum:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.maxBolt} gr</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-bold mb-4">Average Component Weights</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.keys(stats.avgComponents).map((compName) => (
            <div key={compName} className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">{compName}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgComponents[compName]} gr</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

