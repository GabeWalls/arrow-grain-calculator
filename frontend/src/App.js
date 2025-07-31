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

  //Recalculate total grain weight and DOC whenever inputs change
  useEffect(() => {
    const shaft = parseFloat(shaftGrains);
    const knock = parseFloat(components.knock);
    const insert = parseFloat(components.insert);
    const fletching = parseFloat(components.fletching);
    const tip = parseFloat(components.tip);
    const length = parseFloat(arrowLength);

    const total = shaft + knock + insert + fletching + tip;
    setTotalGrains(!isNaN(total) ? total.toFixed(2) : null);

    // FOC formula to determine fron-of-center balance point
    const balancePoint =
      ((tip * length) +
        (insert * (length - 1)) +
        (shaft * (length / 2)) +
        (fletching * (length - 2)) +
        (knock * 0)) / total;

    const foc = ((balancePoint - (length / 2)) / length) * 100;
    setFocPercent(!isNaN(foc) ? foc.toFixed(2) : null);
  }, [components, shaftGrains, arrowLength]);

  // Move/scroll to corresponding field when arrow part is clicked in SVG
  const handleScrollToInput = (partName) => {
    let selectorName = partName;
    if (partName === 'shaft') selectorName = 'gpi';
    const input = document.querySelector(`input[name="${selectorName}"]`);
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  // Handle changes in individual component inputs
  const handleChange = (e) => {
    setComponents({
      ...components,
      [e.target.name]: e.target.value
    });
  };

  // Send data to backend to calculate grains (alternative to local calc)
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

  // Generate arrow length dropdown options (10" to 40" in 0.25" increments) 
  const generateArrowLengthOptions = () => {
    const options = [];
    for (let i = 10; i <= 40; i += 0.25) {
      options.push(i.toFixed(2));
    }
    return options;
  };

  // Color code FOC % based on optimal range (10-20%)
  const getFocColor = (foc) => {
    const value = parseFloat(foc);
    return value >= 10 && value <= 20 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Arrow Grain Calculator</h1>

      <ArrowSVG onPartClick={handleScrollToInput} />

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

        {/* Shaft GPI + Length */}
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

        <div className="col-span-5 flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded shadow"
          >
            Calculate
          </button>
        </div>
      </form>

      {totalGrains !== null && (
        <h2 className="mt-6 text-xl font-semibold">
          Total Arrow Weight: {totalGrains} grains
        </h2>
      )}

      {focPercent !== null && (
        <h2 className={`mt-2 text-xl font-semibold ${getFocColor(focPercent)}`}>
          FOC: {focPercent}%
        </h2>
      )}
    </div>
  );
}

export default App;
