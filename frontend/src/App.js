import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowSVG from './ArrowSVG';

function App() {
  // Component grain weights
  const [components, setComponents] = useState({
    knock: '',
    insert: '',
    fletching: '',
    tip: ''
  });

  // Build type toggle: 'arrow' | 'bolt'
  const [buildType, setBuildType] = useState('arrow');

  // Other config
  const [gpi, setGpi] = useState('');
  const [arrowLength, setArrowLength] = useState('10.00');
  const [shaftGrains, setShaftGrains] = useState(0);
  const [totalGrains, setTotalGrains] = useState(null);
  const [fletchCount, setFletchCount] = useState('3');
  const [focPercent, setFocPercent] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [activePart, setActivePart] = useState(null);

  // Saved builds panel
  const [showSaved, setShowSaved] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Initial fetch
  useEffect(() => { fetchBuilds(); }, []);

  // Keep pagination sane
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((Array.isArray(savedBuilds) ? savedBuilds.length : 0) / pageSize));
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [savedBuilds, pageSize, page]);

  // Compute shaft grains from GPI * length
  useEffect(() => {
    const gpiNum = parseFloat(gpi);
    const lengthNum = parseFloat(arrowLength);
    if (!isNaN(gpiNum) && !isNaN(lengthNum)) setShaftGrains((gpiNum * lengthNum).toFixed(2));
    else setShaftGrains(0);
  }, [gpi, arrowLength]);

  // Compute total grains + FOC
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

  // Click SVG → focus related input
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
      buildType
    };

    try {
      if (editingBuildId) {
        await axios.put(`http://localhost:5000/api/builds/${editingBuildId}`, payload);
        alert('Build updated!');
      } else {
        await axios.post('http://localhost:5000/api/save', payload);
        alert('Build saved!');
      }
      handleNewBuild();
      fetchBuilds();
    } catch (err) {
      console.error('Error saving build:', err.response?.data || err.message);
      alert('There was an error saving the build.');
    }
  };

  const handleNewBuild = () => {
    setComponents({ knock: '', insert: '', fletching: '', tip: '' });
    setGpi('');
    setArrowLength('10.00');
    setBuildName('');
    setEditingBuildId(null);
    setActivePart(null);
  };

  const fetchBuilds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/builds');
      const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
      setSavedBuilds(items);
    } catch (err) {
      console.error('Error fetching builds:', err);
    }
  };

  const handleDeleteBuild = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/builds/${id}`);
      fetchBuilds();
    } catch (err) {
      console.error('Error deleting build:', err);
    }
  };

  const handleLoadBuild = (build) => {
    const compObj = {};
    build.components.forEach(c => { if (c.name !== 'shaft') compObj[c.name] = c.grains; });
    setComponents(compObj);
    setShaftGrains(build.components.find(c => c.name === 'shaft')?.grains || 0);
    setArrowLength(Number.isFinite(Number(build.arrowLength)) ? Number(build.arrowLength).toFixed(2) : '10.00');
    setGpi(build.gpi?.toString() || '');
    setBuildName(build.name);
    setEditingBuildId(build._id);
    setActivePart(null);
    // NEW: reflect saved type in the toggle (fallback to arrow)
    setBuildType(build.buildType === 'bolt' ? 'bolt' : 'arrow');
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
      const response = await axios.post('http://localhost:5000/api/calculate', {
        components: formattedComponents
      });
      setTotalGrains(response.data.totalGrains);
    } catch (err) {
      console.error('Error calculating grains:', err.response?.data || err.message);
      alert('There was an error calculating total grains.');
    }
  };

  // Arrow length dropdown adapts by build type
  const generateArrowLengthOptions = () => {
    const min = buildType === 'bolt' ? 14 : 20;
    const max = buildType === 'bolt' ? 24 : 34;
    const options = [];
    for (let i = min; i <= max; i += 0.25) options.push(i.toFixed(2));
    return options;
  };

  // Ensure reasonable value on type switch
  useEffect(() => {
    if (buildType === 'bolt') {
      const len = parseFloat(arrowLength);
      if (isFinite(len) && len > 24) setArrowLength('20.00');
    }
  }, [buildType]); // eslint-disable-line

  // FOC color feedback
  const getFocColor = (foc) => {
    const value = parseFloat(foc);
    return value >= 10 && value <= 20 ? 'text-green-400' : 'text-red-400';
  };

  // Pagination helpers
  const builds = Array.isArray(savedBuilds) ? savedBuilds : [];
  const totalPages = Math.max(1, Math.ceil(builds.length / pageSize));
  const startIdx = (page - 1) * pageSize;
  const pageItems = builds.slice(startIdx, startIdx + pageSize);
  const goToPage = (p) => setPage(Math.min(totalPages, Math.max(1, p)));
  const prevPage = () => goToPage(page - 1);
  const nextPage = () => goToPage(page + 1);

  // Segmented-control styles
  const segClass = (isActive) =>
    `px-4 py-1 rounded-full border transition ${
      isActive ? 'bg-white text-black border-white' : 'border-gray-500 text-gray-300 hover:bg-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-pureblack text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-3">Arrow & Bolt Weight Calculator</h1>

      {/* Build-type segmented control (no "|"—just space) */}
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          className={segClass(buildType === 'arrow')}
          onClick={() => setBuildType('arrow')}
          aria-pressed={buildType === 'arrow'}
        >
          Arrow
        </button>
        <button
          type="button"
          className={segClass(buildType === 'bolt')}
          onClick={() => setBuildType('bolt')}
          aria-pressed={buildType === 'bolt'}
        >
          Bolt
        </button>
      </div>

      {/* SVG visualization */}
      <ArrowSVG onPartClick={handleScrollToInput} activePart={activePart} mode={buildType} />

      {/* Inputs */}
      <form onSubmit={handleSubmit} className="w-full max-w-5xl grid grid-cols-5 gap-4 mt-6">
        {/* Knock */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Knock</label>
          <input type="number" name="knock" value={components.knock} onChange={handleChange} onFocus={handleInputFocus}
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full" />
        </div>

        {/* Fletching */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Fletching</label>
          <input type="number" name="fletching" value={components.fletching} onChange={handleChange} onFocus={handleInputFocus}
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full" />
          <label className="mt-2 mb-1 text-sm">Number of Fletches</label>
          <select value={fletchCount} onChange={(e) => setFletchCount(e.target.value)}
                  className="text-black border border-gray-600 px-2 py-1 rounded shadow w-full">
            {[3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
          </select>
        </div>

        {/* Shaft */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-center">Shaft (Grains Per Inch)</label>
          <input type="number" name="gpi" value={gpi} onChange={(e) => setGpi(e.target.value)} onFocus={handleInputFocus}
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full" />
          <label className="mt-2 mb-1 text-sm text-center">
            {buildType === 'bolt' ? 'Bolt Length (inches)' : 'Arrow Length (inches)'}
          </label>
          <select name="arrowLength" value={arrowLength} onChange={(e) => setArrowLength(e.target.value)}
                  className="text-black border border-gray-600 px-2 py-1 rounded shadow w-full">
            {generateArrowLengthOptions().map((len) => <option key={len} value={len}>{len}"</option>)}
          </select>
          <label className="mt-2 mb-1 text-sm text-center">Shaft (Total Grains)</label>
          <input type="number" value={shaftGrains} readOnly
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full bg-gray-800 border border-gray-700" />
        </div>

        {/* Insert */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Insert</label>
          <input type="number" name="insert" value={components.insert} onChange={handleChange} onFocus={handleInputFocus}
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full" />
        </div>

        {/* Tip */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Tip</label>
          <input type="number" name="tip" value={components.tip} onChange={handleChange} onFocus={handleInputFocus}
                 className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full" />
        </div>

        {/* Calculate */}
        <div className="col-span-5 flex justify-center mt-6">
          <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-gray-700 rounded shadow">Calculate</button>
        </div>
      </form>

      {/* Totals */}
      {totalGrains !== null && <h2 className="mt-6 text-xl font-semibold">Total Arrow Weight: {totalGrains} grains</h2>}
      {focPercent !== null && <h2 className={`mt-2 text-xl font-semibold ${getFocColor(focPercent)}`}>FOC: {focPercent}%</h2>}

      {/* Save / New */}
      <div className="col-span-5 flex flex-col items-center mt-6">
        <input type="text" placeholder="Build Name" value={buildName} onChange={(e) => setBuildName(e.target.value)}
               className="text-white border border-gray-600 px-2 py-1 rounded shadow w-full max-w-md mb-2" />
        <div className="flex gap-4">
          <button type="button" onClick={handleSaveBuild} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow">
            {editingBuildId ? 'Update Build' : 'Save Build'}
          </button>
          <button type="button" onClick={handleNewBuild} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded shadow">
            New Build
          </button>
        </div>
      </div>

      {/* Saved builds */}
      <div className="mt-10 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">Saved Builds</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{builds.length} total</span>
            <button type="button" onClick={() => setShowSaved(!showSaved)}
                    className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm" aria-expanded={showSaved}>
              {showSaved ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {showSaved && (
          <>
            {builds.length === 0 ? (
              <div className="text-gray-400 text-sm py-6">No saved builds yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageItems.map((build) => {
                  const typeLabel = (build.buildType ?? (build.arrowLength <= 24 ? 'bolt' : 'arrow')) === 'bolt' ? 'Bolt' : 'Arrow';
                  const isBolt = typeLabel === 'Bolt';
                  return (
                    <div key={build._id} className="bg-gray-700 p-4 rounded shadow">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold truncate">{build.name}</div>
                        <div className="flex items-center gap-3">
                          {/* === UPDATED: Bolt -> orange badge; Arrow -> green badge === */}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isBolt
                                ? 'bg-orange-600/30 border border-orange-500 text-orange-200'
                                : 'bg-green-600/30  border border-green-500  text-green-200'
                            }`}
                            title="Build Type"
                          >
                            {typeLabel}
                          </span>
                          <div className="text-sm text-gray-400">{new Date(build.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        {build.components.map((c, idx) => (
                          <div key={idx}>{c.name}: {c.grains} grains</div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleLoadBuild(build)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Load</button>
                        <button onClick={() => handleDeleteBuild(build._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {builds.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={prevPage} disabled={page <= 1}
                          className={`px-3 py-1 rounded text-sm ${page <= 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Prev
                  </button>
                  <span className="text-sm">Page <strong>{page}</strong> / {totalPages}</span>
                  <button type="button" onClick={nextPage} disabled={page >= totalPages}
                          className={`px-3 py-1 rounded text-sm ${page >= totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Per page:</span>
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                          className="bg-gray-800 text-white border border-gray-600 px-2 py-1 rounded text-sm">
                    {[4, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
