const axios = require('axios');
const BASE = process.env.API_URL || 'http://localhost:5000/api';

async function time(name, fn) {
  const t0 = Date.now();
  const result = await fn();
  const ms = Date.now() - t0;
  console.log(`${name}: ${ms} ms`);
  return ms;
}

(async () => {
  try {
    // warm up
    await axios.get(`${BASE}/builds`);
    let total = 0;
    const runs = 10;
    for (let i = 0; i < runs; i++) {
      total += await time(`GET /builds run=${i+1}`, () => axios.get(`${BASE}/builds`));
    }
    console.log(`Avg over ${runs}: ${(total / runs).toFixed(1)} ms`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();