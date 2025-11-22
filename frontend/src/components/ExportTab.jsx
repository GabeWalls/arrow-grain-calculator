import React, { useState } from 'react';

export default function ExportTab({ savedBuilds }) {
  const [selectedBuild, setSelectedBuild] = useState(null);

  const exportToText = (build) => {
    const lines = [
      `Arrow Build: ${build.name}`,
      `Type: ${(build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow'}`,
      `Created: ${new Date(build.createdAt).toLocaleString()}`,
      '',
      'Components:',
      ...build.components.map(c => `  ${c.name.charAt(0).toUpperCase() + c.name.slice(1)}: ${c.grains} grains`),
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
          ${build.components.map(c => `
            <div class="component">
              <strong>${c.name.charAt(0).toUpperCase() + c.name.slice(1)}:</strong> ${c.grains} grains
            </div>
          `).join('')}
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
              <div
                key={build._id}
                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600"
              >
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
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    Export as Text
                  </button>
                  <button
                    onClick={() => printBuild(build)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                  >
                    Print
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

