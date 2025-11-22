import React from 'react';

export default function GuideTab() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Arrow & Bolt Building Guide</h2>

      <div className="space-y-8">
        <section className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">What is FOC (Front of Center)?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FOC stands for Front of Center and measures how much weight is concentrated toward the front of your arrow. 
            It's calculated as the percentage of the arrow's length that the balance point is ahead of center.
          </p>
          <div className="bg-blue-50 dark:bg-gray-800/40 p-4 rounded">
            <p className="text-sm font-semibold mb-2">Optimal FOC Range: 10-20%</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li><strong>10-12%:</strong> Best for target shooting and 3D archery - excellent flight characteristics</li>
              <li><strong>12-15%:</strong> Good balance for hunting - good penetration and flight</li>
              <li><strong>15-20%:</strong> Excellent for large game hunting - maximum penetration power</li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">Component Selection Tips</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Shaft (GPI - Grains Per Inch)</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Choose shaft weight based on your draw weight and intended use. Higher GPI = heavier arrows = more penetration. 
                Target archers typically use 8-10 GPI, hunters use 10-13 GPI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips/Broadheads</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Weight affects FOC significantly. Heavier tips (125-200gr) increase FOC and penetration. 
                Lighter tips (100gr) improve speed and flat trajectory. Match tip weight to your game size.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Inserts</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Standard inserts (40gr) work for most applications. Heavy inserts (70-100gr) can increase FOC 
                without changing your broadhead weight, giving you more tuning flexibility.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Fletching</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                3-fletch is standard and offers good stability. 4-fletch provides more control but adds weight. 
                Choose based on your shooting style and bow setup.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">Building for Big Game</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Deer / Medium Game</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Target weight: 400-450 grains</li>
                <li>FOC: 12-15%</li>
                <li>Tip: 100-125gr broadhead</li>
                <li>Focus on balance between speed and penetration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Elk / Large Game</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Target weight: 500-600+ grains</li>
                <li>FOC: 15-20%</li>
                <li>Tip: 150-200gr broadhead</li>
                <li>Prioritize penetration over speed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Bear / Dangerous Game</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Target weight: 600+ grains</li>
                <li>FOC: 18-20%</li>
                <li>Tip: 175-200gr premium broadhead</li>
                <li>Maximum weight and FOC for deep penetration</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">How to Measure Component Weights</h3>
          <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
            <li><strong>Use a grain scale:</strong> A precision scale that measures in grains is essential (1 grain = 0.0648 grams)</li>
            <li><strong>Measure individually:</strong> Weigh each component separately - nock, fletching, shaft, insert, and tip</li>
            <li><strong>Shaft calculation:</strong> Multiply GPI (Grains Per Inch) by your arrow length to get total shaft weight</li>
            <li><strong>Double-check:</strong> Verify your total matches the sum of all components</li>
            <li><strong>Record everything:</strong> Save your builds in this calculator for future reference</li>
          </ol>
        </section>

        <section className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4">Common Mistakes to Avoid</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
            <li><strong>Too light:</strong> Arrows under 350 grains often lack penetration power for hunting</li>
            <li><strong>Too heavy:</strong> Extremely heavy arrows may reduce arrow speed too much, affecting trajectory</li>
            <li><strong>FOC too low:</strong> Below 8% can cause unstable flight and poor accuracy</li>
            <li><strong>FOC too high:</strong> Above 25% may cause excessive drop and difficult tuning</li>
            <li><strong>Not testing:</strong> Always test your builds at the range before hunting</li>
            <li><strong>Mismatched components:</strong> Ensure all components are compatible with your shaft diameter</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

