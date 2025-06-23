import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [components, setComponents] = useState({
    shaft: '',
    insert: '',
    fletching: '',
    tip: ''
  });

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
      { name: 'shaft', grains: components.shaft },
      { name: 'insert', grains: components.insert },
      { name: 'fletching', grains: components.fletching },
      { name: 'tip', grains: components.tip }
    ];

    try {
      const response = await axios.post('http://localhost:5000/api/calculate', {
        components: formattedComponents
      });
      setTotalGrains(response.data.totalGrains);
    } catch (err) {
      console.error('Error calculating grains:', err);
      alert('There was an error calculating total grains.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Arrow Grain Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>Shaft (grains):</label><br />
        <input type="number" name="shaft" value={components.shaft} onChange={handleChange} /><br /><br />

        <label>Insert (grains):</label><br />
        <input type="number" name="insert" value={components.insert} onChange={handleChange} /><br /><br />

        <label>Fletching (grains):</label><br />
        <input type="number" name="fletching" value={components.fletching} onChange={handleChange} /><br /><br />

        <label>Tip (grains):</label><br />
        <input type="number" name="tip" value={components.tip} onChange={handleChange} /><br /><br />

        <button type="submit">Calculate</button>
      </form>

      {totalGrains !== null && (
        <h2 style={{ marginTop: '1.5rem' }}>Total Arrow Weight: {totalGrains} grains</h2>
      )}
    </div>
  );
}

export default App;
