import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowSVG from './ArrowSVG';

function App() {
  // State for each arrow component's grain weight
  const [components, setComponents] = useState({
    knock: '',
    insert: '',
    fletching: '',
    tip: ''
  });

  // Additional arrow configuration state
  const [gpi, setGpi] = useState('');
  const [arrowLength, setArrowLength] = useState('10.00');
  const [shaftGrains, setShaftGrains] = useState(0);
  const [totalGrains, setTotalGrains] = useState(null);
  const [fletchCount, setFletchCount] = useState('3');
  const [focPercent, setFocPercent] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [editingBuildId, setEditingBuildId] = useState(null);

  // Fetch saved builds on initial load
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Recalculate shaft grain weight when GPI or arrow length changes
  useEffect(() => {
    const gpiNum = parseFloat(gpi);
    const lengthNum = parseFloat(arrowLength);
    if (!isNaN(gpiNum) && !isNaN(lengthNum)) {
      setShaftGrains((gpiNum * lengthNum).toFixed(2));
    } else {
      setShaftGrains(0);
    }
  }, [gpi, arrowLength]);

  // Recalculate total grain weight and FOC whenever inputs change
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

  // Scroll to input field on arrow part click
  const handleScrollToInput = (partName) => {
    let selectorName = partName;
    if (partName === 'shaft') selectorName = 'gpi';
    const input = document.querySelector(`input[name="${selectorName}"]`);
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  // Update component inputs
  const handleChange = (e) => {
    setComponents({
      ...components,
      [e.target.name]: e.target.value
    });
  };

  // Save or update build
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
      arrowLength: Number(arrowLength)
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

  // Start a new blank build
  const handleNewBuild = () => {
    setComponents({ knock: '', insert: '', fletching: '', tip: '' });
    setGpi('');
    setArrowLength('10.00');
    setBuildName('');
    setEditingBuildId(null);
  };

  // Fetch all builds
  const fetchBuilds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/builds');
      setSavedBuilds(res.data);
    } catch (err) {
      console.error('Error fetching builds:', err);
    }
  };

  // Delete build
  const handleDeleteBuild = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/builds/${id}`);
      fetchBuilds();
    } catch (err) {
      console.error('Error deleting build:', err);
    }
  };

  // Load build into UI for viewing or editing
  const handleLoadBuild = (build) => {
    const compObj = {};
    build.components.forEach(c => {
      if (c.name !== 'shaft') {
        compObj[c.name] = c.grains;
      }
    });
    setComponents(compObj);
    setShaftGrains(build.components.find(c => c.name === 'shaft')?.grains || 0);
    setArrowLength(build.arrowLength?.toFixed(2) || '10.00');
    setGpi(build.gpi?.toString() || '');
    setBuildName(build.name);
    setEditingBuildId(build._id);
  };

  // Optional backend grain calculation support
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

  // Generate dropdown from 10 to 40 in 0.25" steps
  const generateArrowLengthOptions = () => {
    const options = [];
    for (let i = 10; i <= 40; i += 0.25) {
      options.push(i.toFixed(2));
    }
    return options;
  };

  // Style FOC color feedback
  const getFocColor = (foc) => {
    const value = parseFloat(foc);
    return value >= 10 && value <= 20 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Arrow Grain Calculator</h1>

      {/* Interactive SVG */}
      <ArrowSVG onPartClick={handleScrollToInput} />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-5xl grid grid-cols-5 gap-4 mt-6">
        {/* Knock */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Knock</label>
          <input
            type="number"
            name="knock"
            value={components.knock}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded shadow w-full"
          />
        </div>

        {/* Fletching */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Fletching</label>
          <input
            type="number"
            name="fletching"
            value={components.fletching}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded shadow w-full"
          />
          <label className="mt-2 mb-1 text-sm">Number of Fletches</label>
          <select
            value={fletchCount}
            onChange={(e) => setFletchCount(e.target.value)}
            className="text-black px-2 py-1 rounded shadow w-full"
          >
            {[3, 4].map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        {/* Shaft Section */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-center">Shaft (Grains Per Inch)</label>
          <input
            type="number"
            name="gpi"
            value={gpi}
            onChange={(e) => setGpi(e.target.value)}
            className="text-black px-2 py-1 rounded shadow w-full"
          />
          <label className="mt-2 mb-1 text-sm text-center">Arrow Length (inches)</label>
          <select
            value={arrowLength}
            onChange={(e) => setArrowLength(e.target.value)}
            className="text-black px-2 py-1 rounded shadow w-full"
          >
            {generateArrowLengthOptions().map((len) => (
              <option key={len} value={len}>{len}"</option>
            ))}
          </select>
          <label className="mt-2 mb-1 text-sm text-center">Shaft (Total Grains)</label>
          <input
            type="number"
            value={shaftGrains}
            readOnly
            className="text-black px-2 py-1 rounded shadow w-full bg-gray-200"
          />
        </div>

        {/* Insert */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Insert</label>
          <input
            type="number"
            name="insert"
            value={components.insert}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded shadow w-full"
          />
        </div>

        {/* Tip */}
        <div className="flex flex-col items-center">
          <label className="mb-1">Tip</label>
          <input
            type="number"
            name="tip"
            value={components.tip}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded shadow w-full"
          />
        </div>

        {/* Calculate Button */}
        <div className="col-span-5 flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded shadow"
          >
            Calculate
          </button>
        </div>
      </form>

      {/* Arrow Output Info */}
      {totalGrains !== null && (
        <h2 className="mt-6 text-xl font-semibold">Total Arrow Weight: {totalGrains} grains</h2>
      )}
      {focPercent !== null && (
        <h2 className={`mt-2 text-xl font-semibold ${getFocColor(focPercent)}`}>FOC: {focPercent}%</h2>
      )}

      {/* Save + New Build */}
      <div className="col-span-5 flex flex-col items-center mt-6">
        <input
          type="text"
          placeholder="Build Name"
          value={buildName}
          onChange={(e) => setBuildName(e.target.value)}
          className="text-black px-2 py-1 rounded shadow w-full max-w-md mb-2"
        />
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSaveBuild}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow"
          >
            {editingBuildId ? 'Update Build' : 'Save Build'}
          </button>
          <button
            type="button"
            onClick={handleNewBuild}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded shadow"
          >
            New Build
          </button>
        </div>
      </div>

      {/* Saved Builds */}
      <div className="mt-10 w-full max-w-4xl">
        <h3 className="text-2xl font-bold mb-4">Saved Builds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedBuilds.map((build) => (
            <div key={build._id} className="bg-gray-700 p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div className="font-semibold">{build.name}</div>
                <div className="text-sm text-gray-400">{new Date(build.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm">
                {build.components.map((c, idx) => (
                  <div key={idx}>{c.name}: {c.grains} grains</div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleLoadBuild(build)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDeleteBuild(build._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
