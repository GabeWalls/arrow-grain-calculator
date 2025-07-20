import React, { useState } from 'react';
import axios from 'axios';
import ArrowSVG from './ArrowSVG';

function App() {
  const [components, setComponents] = useState({
    knock: '',
    shaft: '',
    insert: '',
    fletching: '',
    tip: ''
  });

  const handleScrollToInput = (partName) => {
  const input = document.querySelector(`input[name="${partName}"]`);
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus();
  }
};

  const [totalGrains, setTotalGrains] = useState(null);

  const handleChange = (e) => {
    setComponents({
      ...components,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedComponents = [
      { name: 'knock', grains: Number(components.knock) },
      { name: 'fletching', grains: Number(components.fletching) },
      { name: 'shaft', grains: Number(components.shaft) },
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

return (
  <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Arrow Grain Calculator</h1>
    
    {/* Arrow silhouette placeholder */}
    <ArrowSVG onPartClick={handleScrollToInput} />

    <form onSubmit={handleSubmit} className="w-full max-w-4xl grid grid-cols-5 gap-4">
      {['knock', 'fletching', 'shaft', 'insert', 'tip'].map((component, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <label className="mb-1 capitalize">{component}</label>
          <input
            type="number"
            name={component}
            value={components[component]}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded shadow"
          />
        </div>
      ))}

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
  </div>
);
}

export default App;
